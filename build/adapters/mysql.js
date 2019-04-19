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
    constructor(tableName, connection) {
        this.tableName = tableName;
        this.connection = connection;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const createTableQuery = `
            CREATE TABLE IF NOT EXISTS \`${this.tableName}\` (
                \`key\` VARCHAR(255) NOT NULL,
                \`value\` TEXT NULL,
                PRIMARY KEY (\`key\`)
            );
        `;
            return new Promise((resolve, reject) => {
                this.connection.query(createTableQuery, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(true);
                });
            });
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const keyEscaped = mysql.escape(key.replace("'", "\\'"));
                const selectQuery = `SELECT \`${this.tableName}\`.value FROM \`${this.tableName}\` WHERE \`${this.tableName}\`.key = ${keyEscaped};`;
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
    put(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const keyEscaped = mysql.escape(key.replace("'", "\\'"));
                const valueEscaped = mysql.escape(value.replace("'", "\\'"));
                const insertQuery = `INSERT INTO \`${this.tableName}\`(\`key\`, \`value\`) VALUES (${keyEscaped}, ${valueEscaped}) ON DUPLICATE KEY UPDATE \`${this.tableName}\`.value = ${valueEscaped};`;
                this.connection.query(insertQuery, (error) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(true);
                });
            });
        });
    }
    expire(key, expiration) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const cleanKey = key.replace("'", "\\'");
                const keyEscaped = mysql.escape(cleanKey);
                const eventNameEscaped = mysql.escape(`${this.tableName}_${cleanKey}`);
                const expirationEscaped = mysql.escape(expiration);
                const deleteEventQuery = `DROP EVENT IF EXISTS \`${eventNameEscaped}\`;`;
                const createEventQuery = `
                CREATE EVENT \`${eventNameEscaped}\`
                ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL ${expirationEscaped} SECOND
                ON COMPLETION NOT PRESERVE
                DO
                    DELETE FROM \`${this.tableName}\` WHERE \`${this.tableName}\`.key = ${keyEscaped};
            `;
                this.connection.query(deleteEventQuery, (error, results) => {
                    if (error) {
                        return reject(error);
                    }
                    this.connection.query(createEventQuery, (error, results) => {
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
exports.MysqlAdapter = MysqlAdapter;
