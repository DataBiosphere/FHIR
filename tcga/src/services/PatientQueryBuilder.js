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
  PATIENT_IDENTIFIER,
  CASE_IDENTIFIER
} = require('../utils/constants');

class PatientQueryBuilder extends QueryBuilder {
  constructor({
    fieldResolver = undefined,
    valueResolver = undefined
  } = {}) {
    super({
      fieldResolver,
      valueResolver
    });

    this.query = new BigQuery({
      table: GDC_TABLE,
      primaryKey: CASE_IDENTIFIER,
    });
  };

  idWhere(id) {
    return { where: { [PATIENT_IDENTIFIER]: id } };
  }

  async getById(id) {
    return this.query.get(this.idWhere(id));
  }

  async get({
    _id = '',
    _page = 1,
    _count = 20,
    _offset = 0,
    _sort = 0,
    _search = {},
  }) {
    return this.query.get({
      page: _page,
      pageSize: _count,
      orderBy: this.orderBy(_sort),
      offset: _offset,
      where: _id ? this.idWhere(_id) : {},
      searchFunc: this.where(_search)
    });
  };
}

module.exports = PatientQueryBuilder
