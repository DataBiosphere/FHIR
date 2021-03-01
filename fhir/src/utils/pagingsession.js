const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const crypto = require('crypto');

class PagingSession {
    constructor() {
        this.databaseConnection = '../paging.db';
    }

    async initDb(db) {
        await db.exec(`CREATE TABLE IF NOT EXISTS paging_table(hash TEXT PRIMARY KEY, expiry NUMBER NOT NULL, json TEXT NOT NULL, previous TEXT NOT NULL)`);
    }

    async wrapper(callback) {
        const db = await open({
            filename: this.databaseConnection,
            driver: sqlite3.Database
          });

        try {
            await this.initDb(db);
            return await callback(db);
        } finally {
            db.close();
        }
    }

    async get(hash) {
        return this.wrapper(async (db) => {
            return db.get(`SELECT * FROM paging_table where hash = ?`, hash);
        });
    }

    async insert({ positions = {}, previous = '' }) {
        return this.wrapper(async (db) => {
            const newHash = this.buildHash(JSON.stringify(positions))
            await db.run('INSERT INTO paging_table (hash, expiry, json, previous) VALUES ($hash, $expiry, $json, $previous)', {
                    $hash: newHash,
                    $expiry: Date.now(),
                    $json: JSON.stringify(positions),
                    $previous: previous
                });
            return newHash;
        });
    }

    buildHash(text) {
        const timestamp = Date.now();
        const hashString = `${text}${timestamp}`;

        return crypto.createHash('md5').update(hashString).digest('hex');
    }
}

module.exports = PagingSession;