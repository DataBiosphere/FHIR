const {
  prefixModifiers,
  stringModifiers,
  tokenModifiers,
  uriModifiers
} = require('../utils/searching');
const QueryBuilder = require('./QueryBuilder');

const { AnvilMongo } = require('.');

class ObservationQueryBuilder extends QueryBuilder {
  constructor({
    fieldResolver = undefined,
    valueResolver = undefined
  } = {}) {
    super({
      fieldResolver,
      valueResolver
    });

    this.mongoService = new AnvilMongo({ collectionName: 'subject' });
  };

  idWhere(id) {
    return {
      $and: [
        { id: id },
        { diseases: { $ne: null } },
        { $where: 'this.diseases.length > 0 && this.diseases[0] != null' },
      ],
    };
  }

  async findById(id) {
    return this.mongoService.findOne({ query: this.idWhere(id) });
  }

  async find({
    _id = '',
    _page = 1,
    _count = 20,
    _offset = 0,
    _sort = '',
    _search = {},
  }) {
    const myQuery = {
        $and: [
          { diseases: { $ne: null } },
          { $where: 'this.diseases.length > 0 && this.diseases[0] != null' },
        ],
      };

    if (_id) {
      myQuery.$and.push({ id: _id });
    }

    const searchQuery = this.query(_search);
    if (searchQuery && Object.keys(searchQuery).length > 0) {
      myQuery.$and.push(searchQuery);
    }

    return this.mongoService.find({
      page: _page,
      size: _count,
      query: myQuery,
      projection: {},
      offset: _offset,
      sort: this.sortObject(_sort),
    });
  };
}

module.exports = ObservationQueryBuilder
