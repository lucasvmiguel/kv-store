"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const mysql_1 = require("./adapters/mysql");
const redis_1 = require("./adapters/redis");
const local_1 = require("./adapters/local");
class Client {
    constructor() {
        this.tableName = 'kvstore_keyvalues';
        this.debug = false;
    }
    /**
     * Initiates the package, after run this function you will be able to run the other functions
     *
     * @param  {IClient} params
     * @returns Promise
     */
    init(params) {
        return __awaiter(this, void 0, void 0, function* () {
            this.debug = !!params.debug;
            if (params.tableName) {
                this.tableName = params.tableName;
            }
            switch (params.type) {
                case 'mysql':
                    this.adapter = new mysql_1.MysqlAdapter(this.tableName, params.client, this.debug);
                    break;
                case 'redis':
                    this.adapter = new redis_1.RedisAdapter(this.tableName, params.client, this.debug);
                    break;
                case 'local':
                    this.adapter = new local_1.LocalAdapter(this.tableName, params.client, this.debug);
                    break;
            }
            return this.adapter.init();
        });
    }
    /**
     * Refresh the connection, this can be useful when the connection is no longer available
     *
     * @param  {Connection} connection
     * @returns Promise
     */
    refresh(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.adapter.refresh(connection);
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
            return this.adapter.put(key, value, options);
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
            return this.adapter.get(key);
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
                const resultEscaped = result.replace('\r', '\\r').replace('\n', '\\n');
                return JSON.parse(resultEscaped);
            }
            return null;
        });
    }
    /**
     * Delete key
     *
     * @param  {string} key
     * @returns Promise
     */
    del(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.adapter.del(key);
        });
    }
    /**
     * Close the connection
     *
     * @returns Promise
     */
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.adapter.close();
        });
    }
}
const client = new Client();
module.exports = client;
