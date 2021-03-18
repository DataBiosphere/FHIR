const knex = require('knex')({ client: 'mysql' });
const { BigQuery: BigQueryAPI } = require('@google-cloud/bigquery');

const logger = require('../logger');

const { GOOGLE_APPLICATION_CREDENTIALS, PROJECT_ID } = process.env;

const bigQueryConfig = {
  keyFilename: GOOGLE_APPLICATION_CREDENTIALS,
  projectId: PROJECT_ID,
};

class BigQuery {
  constructor({ table, joins, primaryKey }) {
    this.api = new BigQueryAPI(bigQueryConfig);
    this.table = table;
    this.joins = joins;
    this.primaryKey = primaryKey || 'id';
  }

  async sendQuery(query, params) {
    logger.info(`BigQuery >>> ${query}`);
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
  paginate(page = 1, pageSize = 10) {
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
  async get({
    selection = ['*'],
    page,
    pageSize,
    where = {},
    whereIn = [],
    distinct,
    orderBy = [],
    offset = 0,
    searchFunc,
  } = {}) {
    let counter = 0;
    const tableAlias = `table_${counter}`;
    let dataQuery = knex.from(`${this.table} AS table_${counter}`);

    if (this.joins) {
      this.joins.forEach(({ table, on }) => {
        counter += 1;
        const joinTableAlias = `table_${counter}`;
        const [leftOn, rightOn] = on;
        dataQuery.leftJoin(
          `${table} as ${joinTableAlias}`,
          `${tableAlias}.${leftOn}`,
          `${joinTableAlias}.${rightOn}`
        );
      });
    }

    const whereClause = Object.keys(where)
      .map((column) => {
        return {
          [`${tableAlias}.${column}`]: where[column],
        };
      })
      .reduce((accum, val) => {
        Object.assign(accum, val);
        return accum;
      }, {});

    dataQuery = dataQuery.where(whereClause);

    if (searchFunc) {
      dataQuery = dataQuery.where((builder) => searchFunc(builder));
    }

    // Only now do we clone the count query before adding possible limits and offsets
    let countQuery;
    if (distinct) {
      countQuery = dataQuery
        // Cleverness below!
        .clone()
        .select(knex.raw(`count(distinct concat(${selection.join(', ')})) as count`))
        .toString();
    } else {
      countQuery = dataQuery
        .clone()
        .countDistinct(`${tableAlias}.${this.primaryKey} as count`)
        .toString();
    }

    if (whereIn.length) {
      const [columnName, values] = whereIn;
      dataQuery = dataQuery.whereIn(`${tableAlias}.${columnName}`, values);
    }

    if (page || pageSize || offset > 0) {
      const [offsetp, limit] = this.paginate(page, pageSize);
      dataQuery = dataQuery.offset(offset > 0 ? offset : offsetp).limit(limit);
    }

    if (orderBy && orderBy.length > 0) {
      const ordering = [];

      // probably a prettier way of doing this
      orderBy.forEach((entry) => {
        console.log(JSON.stringify(entry));
        ordering.push(`${(entry.tableAlias ? `\`${entry.tableAlias}\`.` : `\`table_0\`.`)}\`${entry.column}\` ${entry.order} nulls last`);
      });

      dataQuery = dataQuery.orderByRaw(ordering.join(', '));
    }

    if (distinct) {
      dataQuery = dataQuery.distinct(...selection).toString();
    } else {
      dataQuery = dataQuery.select(...selection).toString();
    }

    const [results] = await this.sendQuery(dataQuery);
    const [countRows] = await this.sendQuery(countQuery);

    const { count } = countRows[0];

    return [results, count];
  }
}

module.exports = BigQuery;
