import * as mysql from 'mysql';
import { IAdapter } from './adapter';
export declare class MysqlAdapter implements IAdapter {
    private connection;
    private tableName;
    constructor(tableName: string, connection: mysql.Connection);
    init(): Promise<Boolean>;
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<Boolean>;
    expire(key: string, expiration: number): Promise<string | null>;
}
