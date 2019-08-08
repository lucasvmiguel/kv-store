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
class LocalAdapter {
    constructor(tableName, connection, debug) {
        this.tableName = tableName;
        this.debug = debug;
        this.data = {};
    }
    maybeDebug(operation, query) {
        if (this.debug) {
            console.log('KV-STORE DEBUG', operation, query);
        }
    }
    connect() {
        return Promise.resolve(true);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.maybeDebug('init', '');
            return Promise.resolve(true);
        });
    }
    refresh(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            this.maybeDebug('refresh', '');
            return Promise.resolve(true);
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const valueFound = this.data[`${this.tableName}:${key}`];
            if (!valueFound || (valueFound.expiration && valueFound.expiration < new Date())) {
                return Promise.resolve(null);
            }
            return Promise.resolve(valueFound.value);
        });
    }
    put(key, value, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options && options.expiration) {
                const expiration = new Date();
                expiration.setSeconds(expiration.getSeconds() + options.expiration);
                this.data[`${this.tableName}:${key}`] = { value, expiration };
            }
            else {
                this.data[`${this.tableName}:${key}`] = { value };
            }
            return Promise.resolve(true);
        });
    }
    del(key) {
        return __awaiter(this, void 0, void 0, function* () {
            this.data[`${this.tableName}:${key}`] = undefined;
            return Promise.resolve(true);
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(true);
        });
    }
}
exports.LocalAdapter = LocalAdapter;
