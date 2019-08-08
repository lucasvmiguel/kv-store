import * as redis from 'redis';

import { IAdapter, IOptions, Connection } from './adapter';


export class RedisAdapter implements IAdapter {
    private connection: redis.RedisClient;
    private tableName: string;
    private debug: boolean;

    public constructor(tableName: string, connection: Connection, debug: boolean) {
        this.tableName = tableName;
        this.connection = connection as redis.RedisClient;
        this.debug = debug;
    }

    private maybeDebug(operation: string, query: string) {
        if (this.debug) {
            console.log('KV-STORE DEBUG', operation, query);
        }
    }

    private connect(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.connection.on('connect', () => resolve(true));
            this.connection.on('error', err => reject(err));
        });
    }

    public async init(): Promise<boolean> {
        this.maybeDebug('init', '');

        return this.connect();
    }

    public async refresh(connection: Connection): Promise<boolean> {
        this.maybeDebug('refresh', '');

        this.connection = connection as redis.RedisClient;

        return this.connect();
    }


    public async get(key: string): Promise<string | null> {
        return new Promise<string>((resolve, reject) => {
            this.maybeDebug('get', `${this.tableName}:${key}`);

            this.connection.get(`${this.tableName}:${key}`, (err: Error | null, value: string) => {
                if (err) {
                    return reject(err);
                }

                return resolve(value);
            });
        });
    }

    public async put(key: string, value: string, options?: IOptions): Promise<boolean> {
        const tableWithKey = `${this.tableName}:${key}`;

        return new Promise<boolean>((resolve, reject) => {
            this.maybeDebug('put', `${tableWithKey} -> ${value}`);

            this.connection.set(tableWithKey, value, (err: Error | null, value: any) => {
                if (err) {
                    return reject(err);
                }

                if (!options || !options.expiration) {
                    return resolve(true);
                }

                this.connection.expire(tableWithKey, options.expiration, (err: Error | null) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(true);
                });
            });
        });
    }

    public async del(key: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.maybeDebug('get', `${this.tableName}:${key}`);

            this.connection.del(`${this.tableName}:${key}`, err => {
                if (err) {
                    return reject(err);
                }

                return resolve(true);
            });
        });
    }

    public async close(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.maybeDebug('close', '');

            this.connection.quit((err: Error | null) => {
                if (err) {
                    return reject(err);
                }

                return resolve(true);
            });
        });
    }
}
