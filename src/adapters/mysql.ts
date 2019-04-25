import * as mysql from 'mysql';

import { IAdapter, IOptions } from './adapter';

export class MysqlAdapter implements IAdapter {
    private connection: mysql.Connection;
    private tableName: string;
    private debug: boolean;

    public constructor(tableName: string, connection: mysql.Connection, debug: boolean) {
        this.tableName = mysql.escape(tableName).replace(/\'/g, "");
        this.connection = connection;
        this.debug = debug;
    }

    private escape = (text: string): string => {
        return mysql.escape(text.replace("'", "\'"));
    }

    private maybeDebug(operation: string, query: string) {
        if (this.debug) {
            console.log('KV-STORE DEBUG', operation, query);
        }
    }

    public async init(): Promise<Boolean> {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS \`${this.tableName}\` (
                \`key\` VARCHAR(255) NOT NULL,
                \`value\` TEXT NULL,
                \`expires_at\` DATETIME NULL,
                PRIMARY KEY (\`key\`)
            );
        `;

        this.maybeDebug('init', createTableQuery);

        return new Promise<Boolean>((resolve, reject) => {
            this.connection.query(createTableQuery, (err) => {
                if (err) {
                    return reject(err);
                }
                return resolve(true);
            });
        });
    }

    public async get(key: string): Promise<string | null> {
        return new Promise<string | null>((resolve, reject) => {
            const keyEscaped = this.escape(key);

            const selectQuery = `
                SELECT \`${this.tableName}\`.value FROM \`${this.tableName}\` 
                WHERE \`${this.tableName}\`.key = ${keyEscaped} AND expires_at > CURRENT_TIME;`;

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
    }

    public async put(key: string, value: string, options?: IOptions): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
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
    }
}
