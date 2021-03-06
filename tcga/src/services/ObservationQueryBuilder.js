const knex = require('knex')({ client: 'mysql' });
const {
  prefixModifiers,
  stringModifiers,
  tokenModifiers,
  uriModifiers
} = require('../utils/searching');
const QueryBuilder = require('./QueryBuilder');
const BigQuery = require('./BigQuery');

const {
  GDC_TABLE,
  DIAGNOSIS_TABLE,
  DIAGNOSIS_IDENTIFIER,
  CASE_IDENTIFIER
} = require('../utils/constants');

class ObservationQueryBuilder extends QueryBuilder {
  constructor({
    fieldResolver = undefined,
    valueResolver = undefined
  } = {}) {
    super({
      fieldResolver,
      valueResolver
    });

    this.query = new BigQuery({
      table: DIAGNOSIS_TABLE,
      primaryKey: DIAGNOSIS_IDENTIFIER,
      joins: [
        {
          table: GDC_TABLE,
          on: [CASE_IDENTIFIER, CASE_IDENTIFIER],
        },
      ],
    });
  };

  idWhere(id) {
    return { where: { diag__treat__treatment_id: id } };
  }

  async getById(id) {
    return this.query.get(this.idWhere(id));
  }

  async get({
    _id = '',
    _page = 1,
    _count = 20,
    _offset = 0,
    _sort = '',
    _search = {},
  }) {
    return this.query.get({
      page: _page,
      count: _count,
      orderBy: this.orderBy(_sort),
      offset: _offset,
      where: _id ? this.idWhere(_id) : {},
      searchFunc: this.where(_search)
    });
  };
}

module.exports = ObservationQueryBuilder
