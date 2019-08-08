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
const mysql = require("mysql");
class MysqlAdapter {
    constructor(tableName, connection, debug) {
        this.escape = (text) => {
            return mysql.escape(text.replace("'", "\'"));
        };
        this.tableName = mysql.escape(tableName).replace(/\'/g, "");
        this.connection = connection;
        this.debug = debug;
    }
    maybeDebug(operation, query) {
        if (this.debug) {
            console.log('KV-STORE DEBUG', operation, query);
        }
    }
    createTableQuery() {
        return `
            CREATE TABLE IF NOT EXISTS \`${this.tableName}\` (
                \`key\` VARCHAR(255) NOT NULL,
                \`value\` TEXT NULL,
                \`expires_at\` DATETIME NULL,
                PRIMARY KEY (\`key\`)
            );
        `;
    }
    connect() {
        return new Promise((resolve, reject) => {
            this.connection.query(this.createTableQuery(), (err) => {
                if (err) {
                    return reject(err);
                }
                return resolve(true);
            });
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.maybeDebug('init', this.createTableQuery());
            return this.connect();
        });
    }
    refresh(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            this.maybeDebug('refresh', this.createTableQuery());
            this.connection = connection;
            return this.connect();
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const keyEscaped = this.escape(key);
                const selectQuery = `
                SELECT \`${this.tableName}\`.value FROM \`${this.tableName}\` 
                WHERE \`${this.tableName}\`.key = ${keyEscaped} AND (\`${this.tableName}\`.expires_at > CURRENT_TIME OR \`${this.tableName}\`.expires_at IS NULL);`;
                this.maybeDebug('get', selectQuery);
                this.connection.query(selectQuery, (error, results) => {
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
    put(key, value, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const keyEscaped = this.escape(key);
                const valueEscaped = this.escape(value);
                const expiresEscaped = options && options.expiration ? this.escape(`${options.expiration}`) : 'NULL';
                const insertQuery = `
                INSERT INTO \`${this.tableName}\`(\`key\`, \`value\`, \`expires_at\`) 
                VALUES (${keyEscaped}, ${valueEscaped}, CURRENT_TIMESTAMP + INTERVAL ${expiresEscaped} SECOND) 
                ON DUPLICATE KEY UPDATE 
                    \`${this.tableName}\`.value = ${valueEscaped}, \`${this.tableName}\`.expires_at = CURRENT_TIMESTAMP + INTERVAL ${expiresEscaped} SECOND;`;
                this.maybeDebug('put', insertQuery);
                this.connection.query(insertQuery, (error) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(true);
                });
            });
        });
    }
    del(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const keyEscaped = this.escape(key);
                const deleteQuery = `DELETE FROM \`${this.tableName}\` WHERE \`${this.tableName}\`.key = ${keyEscaped};`;
                this.connection.query(deleteQuery, (error) => {
                    if (error) {
                        return reject(error);
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
                this.connection.end((err) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(true);
                });
            });
        });
    }
}
exports.MysqlAdapter = MysqlAdapter;
