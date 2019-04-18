"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Client {
    constructor() {
        this.tableName = 'kvstore_keyvalues';
    }
    /**
     * Initiates the package, after run this function you will be able to run the other functions
     *
     * @param  {IClient} params
     * @returns Promise
     */
    init(params) {
        return __awaiter(this, void 0, void 0, function* () {
            this.client = params.client;
            this.type = params.type;
            switch (this.type) {
                case 'mysql':
                    return this.initMysql();
            }
        });
    }
    /**
     * Inserts or updates a value with a key
     *
     * @param  {string} key
     * @param  {string} value
     * @param  {IOptions} options?
     * @returns Promise
     */
    put(key, value, options) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this.type) {
                case 'mysql': {
                    if (options && options.expiration) {
                        this.expireMysql(key, options.expiration);
                    }
                    return this.putMysql(key, value);
                }
            }
        });
    }
    /**
     * Inserts or updates a Json value with a key
     *
     * @param  {string} key
     * @param  {string} value
     * @param  {IOptions} options?
     * @returns Promise
     */
    putJson(key, value, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const valueJson = JSON.stringify(value);
            return this.put(key, valueJson, options);
        });
    }
    /**
     * Gets value based on the key provided (or it can returns null if nothing has been found)
     *
     * @param  {string} key
     * @returns Promise
     */
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this.type) {
                case 'mysql':
                    return this.getMysql(key);
            }
        });
    }
    /**
     * Gets value on JSON format based on the key provided (or it can returns null if nothing has been found)
     *
     * @param  {string} key
     * @returns Promise
     */
    getJson(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.get(key);
            if (result) {
                return JSON.parse(result);
            }
            return null;
        });
    }
    initMysql() {
        return __awaiter(this, void 0, void 0, function* () {
            const createTableQuery = `
            CREATE TABLE IF NOT EXISTS \`${this.tableName}\` (
                \`key\` VARCHAR(255) NOT NULL,
                \`value\` TEXT NULL,
                PRIMARY KEY (\`key\`)
            );
        `;
            return new Promise((resolve, reject) => {
                this.client.query(createTableQuery, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(true);
                });
            });
        });
    }
    getMysql(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const keyEscaped = key.replace("'", "\\'");
            return new Promise((resolve, reject) => {
                const selectQuery = `SELECT \`${this.tableName}\`.value FROM \`${this.tableName}\` WHERE \`${this.tableName}\`.key = '${keyEscaped}';`;
                this.client.query(selectQuery, (error, results) => {
                    if (error) {
                        return reject(error);
                    }
                    if (Array.isArray(results) && results.length > 0) {
                        return resolve(results[0].value);
                    }
                    return resolve(null);
                });
            });
        });
    }
    putMysql(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const keyEscaped = key.replace("'", "\\'");
            const valueEscaped = value.replace("'", "\\'");
            return new Promise((resolve, reject) => {
                const insertQuery = `INSERT INTO \`${this.tableName}\`(\`key\`, \`value\`) VALUES ('${keyEscaped}', '${valueEscaped}') ON DUPLICATE KEY UPDATE \`${this.tableName}\`.value = '${valueEscaped}';`;
                this.client.query(insertQuery, (error) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(true);
                });
            });
        });
    }
    expireMysql(key, expiration) {
        return __awaiter(this, void 0, void 0, function* () {
            const keyEscaped = key.replace("'", "\\'");
            return new Promise((resolve, reject) => {
                const eventName = `${this.tableName}_${keyEscaped}`;
                const deleteEventQuery = `DROP EVENT IF EXISTS \`${eventName}\`;`;
                const createEventQuery = `
                CREATE EVENT \`${eventName}\`
                ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL ${expiration} SECOND
                ON COMPLETION NOT PRESERVE
                DO
                    DELETE FROM \`${this.tableName}\` WHERE \`${this.tableName}\`.key = '${keyEscaped}';
            `;
                this.client.query(deleteEventQuery, (error, results) => {
                    if (error) {
                        return reject(error);
                    }
                    this.client.query(createEventQuery, (error, results) => {
                        if (error) {
                            return reject(error);
                        }
                        return resolve(null);
                    });
                });
            });
        });
    }
}
const client = new Client();
module.exports = client;
