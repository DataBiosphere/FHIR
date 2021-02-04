const MongoClient = require('mongodb').MongoClient;

class AnvilMongo {
    constructor({ collectionName }) {
        this.url = 'mongodb://anvil-mongo:27017';
        this.databaseName = 'anvil';
        this.collectionName = collectionName;
    }

    async queryWrapper(callback) {
        const client = await MongoClient.connect(this.url)
            .catch(err => { console.log(err); });

        if (!client){
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

    async find({page, pageSize, query } = { page: 1, pageSize: 25, query: {}}) {
        return await this.queryWrapper(async (db) => {
            const collection = db.collection(this.collectionName);
            const queryResult = await collection.find(query);
            let count = await queryResult.count();

            return [await queryResult.toArray(), count];
        });
    }
}

module.exports = AnvilMongo;