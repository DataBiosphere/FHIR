const knex = require('knex')({ client: 'mysql' });
const BigQuery = require('./BigQuery');

const { GOOGLE_APPLICATION_CREDENTIALS, PROJECT_ID, BIGQUERY_TABLE_NAME } = process.env;

const bigQueryConfig = {
  keyFilename: GOOGLE_APPLICATION_CREDENTIALS,
  projectId: PROJECT_ID,
};

class MolecularSequenceService {
  constructor() {
    this.api = new BigQuery(bigQueryConfig);
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
   */
  async getAll(selection = '*', page = 0, pageSize = 20) {
    const [offset, limit] = this.paginate(page, pageSize);
    const query = knex
      .select(selection)
      .from(BIGQUERY_TABLE_NAME)
      .offset(offset)
      .limit(limit)
      .toString();
    return this.api.sendQuery(query);
  }
}

module.exports = MolecularSequenceService;
