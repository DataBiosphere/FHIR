const logger = require('../logger');
const MongoClient = require('mongodb').MongoClient;

const { MONGO_CONNECTION_STRING } = process.env;

class AnvilMongo {
  constructor({ collectionName }) {
    this.url = MONGO_CONNECTION_STRING;
    this.databaseName = 'anvil';
    this.collectionName = collectionName;
  }

  async queryWrapper(callback) {
    const client = await MongoClient.connect(this.url, { useUnifiedTopology: true }).catch(
      (err) => {
        logger.error(err);
      }
    );

    if (!client) {
      return;
    }

    try {
      const db = client.db(this.databaseName);
      return await callback(db);
    } catch (e) {
      throw e;
    } finally {
      client.close();
    }
  }

  async find({ page = 1, size = 25, query = {}, projection = {}, sort = {}, offset = 0 }) {
    return await this.queryWrapper(async (db) => {
      const collection = db.collection(this.collectionName);
      const queryResult = await collection
        .find(query)
        .sort(sort)
        .project(projection)
        .skip(parseInt(offset) > 0 ? parseInt(offset) : (parseInt(page) - 1) * parseInt(size))
        .limit(parseInt(size));
      const count = await queryResult.count();

      return [await queryResult.toArray(), count];
    });
  }

  // .find().limit(1) is faster than .findOne()
  async findOne({ query = {}, projection = {} }) {
    return await this.queryWrapper(async (db) => {
      const collection = db.collection(this.collectionName);
      const queryResult = await collection.find(query).project(projection).limit(1);
      const result = await queryResult.toArray();

      return result[0];
    });
  }
}

module.exports = AnvilMongo;
