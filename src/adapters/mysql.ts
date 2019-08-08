import * as mysql from 'mysql';

import { IAdapter, IOptions, Connection } from './adapter';


export class MysqlAdapter implements IAdapter {
    private connection: mysql.Connection;
    private tableName: string;
    private debug: boolean;

    public constructor(tableName: string, connection: Connection, debug: boolean) {
        this.tableName = mysql.escape(tableName).replace(/\'/g, "");
        this.connection = connection as mysql.Connection;
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

    private createTableQuery(): string {
        return `
            CREATE TABLE IF NOT EXISTS \`${this.tableName}\` (
                \`key\` VARCHAR(255) NOT NULL,
                \`value\` TEXT NULL,
                \`expires_at\` DATETIME NULL,
                PRIMARY KEY (\`key\`)
            );
        `;
    }

    private connect(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.connection.query(this.createTableQuery(), (err) => {
                if (err) {
                    return reject(err);
                }
                return resolve(true);
            });
        });
    }

    public async init(): Promise<boolean> {
        this.maybeDebug('init', this.createTableQuery());

        return this.connect();
    }

    public async refresh(connection: Connection): Promise<boolean> {
        this.maybeDebug('refresh', this.createTableQuery());

        this.connection = connection as mysql.Connection;

        return this.connect();
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

    public async put(key: string, value: string, options?: IOptions): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
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

    public async close(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.maybeDebug('close', '');

            this.connection.end((err: Error | null) => {
                if (err) {
                    return reject(err);
                }

                return resolve(true);
            });
        });
    }
}
