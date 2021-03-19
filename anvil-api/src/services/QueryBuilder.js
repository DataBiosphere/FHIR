const { AnvilMongo } = require('.');
const {
  prefixModifiers,
  stringModifiers,
  tokenModifiers,
  uriModifiers
} = require('../utils/searching');

class QueryBuilder {
  constructor({
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
        query: (meta) => {
          switch (meta.modifier) {
            case 'text':
              break;
            case 'not':
              return { [`${meta.field}`]: { $ne: meta.value } } ;
              break;
            default:
              return { [`${meta.field}`]: meta.value };
              break;
          }
        }
      },
      string: {
        parser: (value) => {
          return { value: value };
        },
        query: (meta) => {
          switch (meta.modifier) {
            case 'contains':
              return { [`${meta.field}`]: { $regex: meta.value } };
              break;
            case 'exact':
              return { [`${meta.field}`]: meta.value };
              break;
            default:
              return { [`${meta.field}`]: { $regex: `^${meta.value}` } };
              break;
          }
        }
      },
      date: {
        parser: (value) => {
          return {};
        },
        query: (meta) => {

        }
      },
      uri: {
        parser: (value) => {
          return {};
        },
        query: (meta) => {

        }
      },
      number: {
        parser: (value) => {
          return {};
        },
        query: (meta) => {

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
        query: (meta) => {
          return { [`${meta.field}`]: meta.value };
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

  sortObject(_sort) {
    // edge case
    if (!_sort) {
      return {};
    }

    let sortObj = {};

    _sort
      .split(',')
      .filter((str) => str)
      .forEach((str) => {
        str = str.trim();

        const field = str[0] === '-' ? str.substring(1) : str;
        const fieldMeta = this.fieldResolver(field);
        fieldMeta.fields.forEach((f) => {
          sortObj[f.field] = str[0] === '-' ? -1 : 1;
        });
      });

    return sortObj;
  }

  query(_search) {
    const searchFields = this.initSearch(_search);

    if (!searchFields || Object.keys(searchFields).length === 0){
      return undefined;
    }

    const fields = searchFields;

    let myQuery = {};
    const and = fields.length > 1;
    if (and) {
      myQuery.$and = [];
    }

    fields.forEach((k) => {
      const innerAnd = k.fields.length > 1;
      let innerQuery = innerAnd ? { $and: [] } : { };
      k.fields.forEach((f) => {
        const q = this.typeFunctions[k.type].query({ field: f.field, value: f.value, modifier: k.modifier });

        if (innerAnd) {
          innerQuery.$and.push(q);
        } else {
          innerQuery = q;
        }
      });

      if (and) {
        if (innerQuery.$and && innerQuery.$and.length > 0) {
          myQuery.$and.push(...innerQuery.$and);
        } else {
          myQuery.$and.push(innerQuery);
        }
      } else {
        myQuery = innerQuery;
      }
    });

    return myQuery;
  }
}

module.exports = QueryBuilder
