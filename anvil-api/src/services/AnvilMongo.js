const MongoClient = require('mongodb').MongoClient;

const { MONGO_CONNECTION_STRING } = process.env;

class AnvilMongo {
    constructor({ collectionName }) {
        this.url = MONGO_CONNECTION_STRING;
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

    async find({page = 1, pageSize = 25, query = {}, projection = {}}) {
        return await this.queryWrapper(async (db) => {
            const collection = db.collection(this.collectionName);
            const queryResult = await collection.find(query).project(projection)
                .skip((parseInt(page) - 1) * parseInt(pageSize))
                .limit(parseInt(pageSize));
            const count = await queryResult.count();

            return [await queryResult.toArray(), count];
        });
    }
}

module.exports = AnvilMongo;