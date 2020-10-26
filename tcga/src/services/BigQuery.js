const knex = require('knex')({ client: 'mysql' });
const { BigQuery: BigQueryAPI } = require('@google-cloud/bigquery');

const logger = require('../logger');

const { GOOGLE_APPLICATION_CREDENTIALS, PROJECT_ID } = process.env;

const bigQueryConfig = {
  keyFilename: GOOGLE_APPLICATION_CREDENTIALS,
  projectId: PROJECT_ID,
};

class BigQuery {
  constructor(table) {
    this.api = new BigQueryAPI(bigQueryConfig);
    this.table = table;
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
    const offset = page <= 0 ? 0 : (+page - 1) * pageSize;
    const limit = pageSize;
    return [offset, limit];
  }

  /**
   *
   * @param {string} selection
   * @param {number} page
   * @param {number} pageSize
   * @param {string} where
   */
  async get({ selection = '*', page = 0, pageSize = 20, where = {} } = {}) {
    const [offset, limit] = this.paginate(page, pageSize);
    const query = knex
      .select(selection)
      .from(this.table)
      .offset(offset)
      .limit(limit)
      .where(where)
      .toString();
    logger.info(`BigQuery >>> ${query}`);
    const [rows] = await this.sendQuery(query);
    console.log(rows);
    return rows;
  }
}

module.exports = BigQuery;
