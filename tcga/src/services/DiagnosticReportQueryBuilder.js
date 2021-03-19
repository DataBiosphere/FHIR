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
  CASE_IDENTIFIER,
  BIOSPECIMEN_TABLE
} = require('../utils/constants');

class DiagnosticReportQueryBuilder extends QueryBuilder {
  constructor({
    fieldResolver = undefined,
    valueResolver = undefined
  } = {}) {
    super({
      fieldResolver,
      valueResolver
    });

    this.clinicalGDCRawService = new BigQuery({
      table: GDC_TABLE,
      primaryKey: CASE_IDENTIFIER,
    });

    this.clinicalGDCService = new BigQuery({
      table: GDC_TABLE,
      primaryKey: CASE_IDENTIFIER,
      joins: [
        {
          table: DIAGNOSIS_TABLE,
          on: [CASE_IDENTIFIER, CASE_IDENTIFIER],
        },
        {
          table: BIOSPECIMEN_TABLE,
          on: [CASE_IDENTIFIER, 'case_gdc_id'],
        },
      ],
    });
  };

  idWhere(id) {
    return { where: { case_id: id } };
  }

  async getById(id) {
    return this.clinicalGDCService.get(this.idWhere(id));
  }

  async get({
    _id = '',
    _page = 1,
    _count = 20,
    _offset = 0,
    _sort = 0,
    _search = {},
  }) {
    const [caseIds] = await this.clinicalGDCRawService.get({
      selection: [CASE_IDENTIFIER],
      page: _page,
      pageSize: _count,
      orderBy: this.orderBy(_sort),
      offset: _offset,
      where: _id ? this.idWhere(_id) : {},
      searchFunc: this.where(_search)
    });

    return this.clinicalGDCService.get({
      whereIn: [CASE_IDENTIFIER, caseIds.map((row) => row.case_id)],
      orderBy: this.orderBy(_sort),
    });
  };
}

module.exports = DiagnosticReportQueryBuilder
