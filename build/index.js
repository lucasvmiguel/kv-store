"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class Client {
    constructor() {
        this.tableName = 'kvstore-keyvalues';
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
     * Inserts or updates a value with a key
     *
     * @param  {string} key
     * @param  {string} value
     * @returns Promise
     */
    put(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this.type) {
                case 'mysql':
                    return this.putMysql(key, value);
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
            return new Promise((resolve, reject) => {
                const selectQuery = `SELECT \`${this.tableName}\`.value FROM \`${this.tableName}\` WHERE \`${this.tableName}\`.key = '${key}';`;
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
            return new Promise((resolve, reject) => {
                const insertQuery = `INSERT INTO \`${this.tableName}\`(\`key\`, \`value\`) VALUES ('${key}','${value}') ON DUPLICATE KEY UPDATE \`${this.tableName}\`.value = '${value}';`;
                this.client.query(insertQuery, (error) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(true);
                });
            });
        });
    }
}
exports.default = new Client();
