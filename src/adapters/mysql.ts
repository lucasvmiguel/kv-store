import * as mysql from 'mysql';
import { IAdapter } from './adapter';

export class MysqlAdapter implements IAdapter {
    private connection: mysql.Connection;
    private tableName: string;

    public constructor(tableName: string, connection: mysql.Connection) {
        this.tableName = tableName;
        this.connection = connection;
    }

    public async init(): Promise<Boolean> {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS \`${this.tableName}\` (
                \`key\` VARCHAR(255) NOT NULL,
                \`value\` TEXT NULL,
                PRIMARY KEY (\`key\`)
            );
        `;

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
        const keyEscaped = key.replace("'", "\\'");

        return new Promise<string | null>((resolve, reject) => {
            const selectQuery = `SELECT \`${this.tableName}\`.value FROM \`${this.tableName}\` WHERE \`${this.tableName}\`.key = '${keyEscaped}';`;

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

    public async put(key: string, value: string): Promise<Boolean> {
        const keyEscaped = key.replace("'", "\\'");
        const valueEscaped = value.replace("'", "\\'");

        return new Promise<Boolean>((resolve, reject) => {
            const insertQuery = `INSERT INTO \`${this.tableName}\`(\`key\`, \`value\`) VALUES ('${keyEscaped}', '${valueEscaped}') ON DUPLICATE KEY UPDATE \`${this.tableName}\`.value = '${valueEscaped}';`;

            this.connection.query(insertQuery, (error) => {
                if (error) {
                    return reject(error);
                }

                return resolve(true);
            });
        });
    }

    public async expire(key: string, expiration: number): Promise<string | null> {
        const keyEscaped = key.replace("'", "\\'");

        return new Promise<string | null>((resolve, reject) => {
            const eventName = `${this.tableName}_${keyEscaped}`;
            const deleteEventQuery = `DROP EVENT IF EXISTS \`${eventName}\`;`;
            const createEventQuery = `
                CREATE EVENT \`${eventName}\`
                ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL ${expiration} SECOND
                ON COMPLETION NOT PRESERVE
                DO
                    DELETE FROM \`${this.tableName}\` WHERE \`${this.tableName}\`.key = '${keyEscaped}';
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
    }
}
