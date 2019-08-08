import * as mysql from "mysql";
import * as redis from "redis";
export declare type Connection = mysql.Connection | redis.RedisClient | null;
export interface IOptions {
    expiration?: number;
}
export interface IAdapter {
    init: () => Promise<boolean>;
    close: () => Promise<boolean>;
    refresh: (connection: Connection) => Promise<boolean>;
    get(key: string): Promise<string | null>;
    put(key: string, value: string, options?: IOptions): Promise<boolean>;
    del(key: string): Promise<boolean | null>;
}
