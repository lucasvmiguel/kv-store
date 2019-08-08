import * as redis from 'redis';

import { IAdapter, IOptions, Connection } from './adapter';
import { isDate } from 'util';


export class LocalAdapter implements IAdapter {
    private connection: redis.RedisClient;
    private tableName: string;
    private debug: boolean;
    private data: { [key: string]: { value: string, expiration?: Date } };

    public constructor(tableName: string, connection: Connection, debug: boolean) {
        this.tableName = tableName;
        this.debug = debug;
        this.data = {};
    }

    private maybeDebug(operation: string, query: string) {
        if (this.debug) {
            console.log('KV-STORE DEBUG', operation, query);
        }
    }

    private connect(): Promise<boolean> {
        return Promise.resolve(true)
    }

    public async init(): Promise<boolean> {
        this.maybeDebug('init', '');

        return Promise.resolve(true);
    }

    public async refresh(connection: Connection): Promise<boolean> {
        this.maybeDebug('refresh', '');

        return Promise.resolve(true);
    }


    public async get(key: string): Promise<string | null> {
        const valueFound = this.data[`${this.tableName}:${key}`];

        if (!valueFound || (valueFound.expiration && valueFound.expiration < new Date())) {
            return Promise.resolve(null)
        }

        return Promise.resolve(valueFound.value);
    }

    public async put(key: string, value: string, options?: IOptions): Promise<boolean> {
        if (options && options.expiration) {
            const expiration = new Date();
            expiration.setSeconds(expiration.getSeconds() + options.expiration);

            this.data[`${this.tableName}:${key}`] = { value, expiration };
        } else {
            this.data[`${this.tableName}:${key}`] = { value };
        }

        return Promise.resolve(true);
    }

    public async close(): Promise<boolean> {
        return Promise.resolve(true);
    }
}
