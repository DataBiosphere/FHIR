const knex = require('knex')({ client: 'mysql' });
const {
  prefixModifiers,
  stringModifiers,
  tokenModifiers,
  uriModifiers
} = require('../utils/searching');
const QUERY_COMMANDS = {
  LIKE: 'like'
};

class QueryBuilder {
  constructor({
    page = 1,
    count = 20,
    offset = 0,
    sort = 0,
    search = {},
    fieldResolver = undefined,
    valueResolver = undefined
  } = {}) {
    this.fieldResolver = fieldResolver;
    this.valueResolver = valueResolver;
    this.fieldModifiers = [...stringModifiers, ...tokenModifiers, ...uriModifiers];

    this.typeFunctions = {
      token: {
        parser: (value) => {
          if (!value.includes('|')) {
            return { value: value };
          }

          const split = value.split('|');
          return { system: split[0], value: split[1] };
        },
        where: (builder, meta) => {
          switch (meta.modifier) {
            case 'text':
              break;
            case 'not':
              builder.whereNot({ [`${meta.field}`]: meta.value });
              break;
            default:
              builder.where({ [`${meta.field}`]: meta.value });
              break;
          }
        }
      },
      string: {
        parser: (value) => {
          return { value: value };
        },
        where: (builder, meta) => {
          switch (meta.modifier) {
            case 'contains':
              builder.where(meta.field, QUERY_COMMANDS.LIKE, `%${meta.value}%`);
              break;
            case 'exact':
              builder.where({ [`${meta.field}`]: meta.value });
              break;
            default:
              builder.where(meta.field, QUERY_COMMANDS.LIKE, `${meta.value}%`);
              break;
          }
        }
      },
      date: {
        parser: (value) => {
          return {};
        },
        where: (builder, meta) => {

        }
      },
      uri: {
        parser: (value) => {
          return {};
        },
        where: (builder, meta) => {

        }
      },
      number: {
        parser: (value) => {
          return {};
        },
        where: (builder, meta) => {

        }
      },
      reference: {
        parser: (value) => {
          if (!value.includes('/')) {
            return { value: value };
          }

          const split = value.split('/');
          const val = split.pop();
          return { url: split.join('/'), value: val };
        },
        where: (builder, meta) => {
          builder.where({ [`${meta.field}`]: meta.value });
        }
      }
    }
  }

  initSearch(search) {
    const searchFields = [];

    if (search && Object.keys(search).length > 0) {
      Object.entries(search).forEach((entry) => {
        const [k, v] = entry;
        const splitField = k.split(':');
        let modifier = '';
        let fieldName = '';

        if (splitField.length > 1) {
          const last = splitField[splitField.length - 1];
          if (this.fieldModifiers.includes(last)) {
            modifier = splitField.pop();
          }

          if (splitField[0].includes('.')) {
            const dotSplit = splitField[0].split('.');
            fieldName = dotSplit.pop();
          } else {
            fieldName = splitField.pop();
          }
        } else {
          const dotSplit = splitField[0].split('.');
          fieldName = dotSplit.pop();
        }

        const translated = this.resolve(fieldName, v);
        translated.modifier = modifier;
        searchFields.push(translated);
      });
    }

    return searchFields;
  }

  getValueFromType(type, value) {
    const returnValue = this.typeFunctions[type].parser(value);
    return returnValue;
  }

  resolve(field, value) {
    const resolvedFields = this.fieldResolver(field);
    const resolvedValues = this.valueResolver(field, this.getValueFromType(resolvedFields.type, value).value);

    resolvedFields.fields.forEach((rf) => {
      const resVal = resolvedValues.filter((rv) => rv.field === rf.field);
      if (resVal && resVal.length === 1) {
        rf.value = resVal[0].value;
      }
    });

    return resolvedFields;
  }

  orderBy(_sort) {
    if (!_sort)
      return null;

    let order = [];

    _sort.split(',')
        .filter((str) => str)
        .forEach((str) => {
          str = str.trim();

          const descending = str[0] === '-';
          const realStr = descending ? str.substring(1) : str;
          const fields = this.fieldResolver(realStr);

          order = order.concat(...fields.fields.map((f) => {
            return {
              column: f.field,
              tableAlias: f.tableAlias,
              order: descending ? 'desc' : 'asc',
            };
          }));
        });

    return order;
  }

  where(_search) {
    const searchFields = this.initSearch(_search);

    if (!searchFields || Object.keys(searchFields).length === 0){
      return undefined;
    }

    const fields = searchFields;

    return (knexBuilder) => {
      fields.forEach((k) => {
        k.fields.filter((f) => f.value).forEach((f) => {
          this.typeFunctions[k.type].where(knexBuilder, { field: f.field, value: f.value, modifier: k.modifier });
        });
      });
    }
  }
}

module.exports = QueryBuilder
