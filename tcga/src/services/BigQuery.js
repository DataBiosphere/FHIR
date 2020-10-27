const knex = require('knex')({ client: 'mysql' });
const { BigQuery: BigQueryAPI } = require('@google-cloud/bigquery');

const logger = require('../logger');

const { GOOGLE_APPLICATION_CREDENTIALS, PROJECT_ID } = process.env;

const bigQueryConfig = {
  keyFilename: GOOGLE_APPLICATION_CREDENTIALS,
  projectId: PROJECT_ID,
};

class BigQuery {
  constructor({ table, joins }) {
    this.api = new BigQueryAPI(bigQueryConfig);
    this.table = table;
    this.joins = joins;
  }

  async sendQuery(query, params) {
    const options = {
      query,
      params,
      location: 'US',
    };
    return this.api.query(options);
  }

  /**
   *
   * @param {number} page
   * @param {number} pageSize
   */
  paginate(page, pageSize) {
    const offset = Number(page) <= 0 ? 0 : (+Number(page) - 1) * Number(pageSize);
    const limit = pageSize;
    return [offset, limit];
  }

  /**
   * Open ended query
   *
   * @param {string} selection
   * @param {number} page
   * @param {number} pageSize
   * @param {string} where
   */
  async get({ selection = '*', page = 0, pageSize = 20, where = {} } = {}) {
    const [offset, limit] = this.paginate(page, pageSize);
    let counter = 0;
    const tableAlias = `table_${counter}`;
    let query = knex.select(selection).from(`${this.table} AS table_${counter}`);

    if (this.joins) {
      this.joins.forEach(({ table, on }) => {
        counter += 1;
        const joinTableAlias = `table_${counter}`;
        const [leftOn, rightOn] = on;
        query.leftJoin(
          `${table} as ${joinTableAlias}`,
          `${tableAlias}.${leftOn}`,
          `${joinTableAlias}.${rightOn}`
        );
      });
    }

    const whereClause = Object.keys(where)
      .map((column) => ({
        [`${tableAlias}.${column}`]: where[column],
      }))
      .reduce((accum, val) => {
        Object.assign(accum, val);
        return accum;
      }, {});

    query = query.offset(offset).limit(limit).where(whereClause).toString();
    logger.info(`BigQuery get >>> ${query}`);
    const [rows] = await this.sendQuery(query);
    return rows;
  }
}

module.exports = BigQuery;
