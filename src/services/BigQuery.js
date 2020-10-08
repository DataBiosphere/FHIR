const { BigQuery: BigQueryAPI } = require('@google-cloud/bigquery');

class BigQuery {
  constructor(options) {
    this.api = new BigQueryAPI(options);
  }

  async sendQuery(query, params) {
    const options = {
      query,
      params,
      location: 'US',
    };
    return this.api.query(options);
  }
}

module.exports = BigQuery;
