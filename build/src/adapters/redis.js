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
class RedisAdapter {
    constructor(tableName, connection, debug) {
        this.tableName = tableName;
        this.connection = connection;
        this.debug = debug;
    }
    maybeDebug(operation, query) {
        if (this.debug) {
            console.log('KV-STORE DEBUG', operation, query);
        }
    }
    connect() {
        return new Promise((resolve, reject) => {
            this.connection.on('connect', () => resolve(true));
            this.connection.on('error', err => reject(err));
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.maybeDebug('init', '');
            return this.connect();
        });
    }
    refresh(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            this.maybeDebug('refresh', '');
            this.connection = connection;
            return this.connect();
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.maybeDebug('get', `${this.tableName}:${key}`);
                this.connection.get(`${this.tableName}:${key}`, (err, value) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(value);
                });
            });
        });
    }
    put(key, value, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const tableWithKey = `${this.tableName}:${key}`;
            return new Promise((resolve, reject) => {
                this.maybeDebug('put', `${tableWithKey} -> ${value}`);
                this.connection.set(tableWithKey, value, (err, value) => {
                    if (err) {
                        return reject(err);
                    }
                    if (!options || !options.expiration) {
                        return resolve(true);
                    }
                    this.connection.expire(tableWithKey, options.expiration, (err) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve(true);
                    });
                });
            });
        });
    }
    del(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.maybeDebug('get', `${this.tableName}:${key}`);
                this.connection.del(`${this.tableName}:${key}`, err => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(true);
                });
            });
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.maybeDebug('close', '');
                this.connection.quit((err) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(true);
                });
            });
        });
    }
}
exports.RedisAdapter = RedisAdapter;
