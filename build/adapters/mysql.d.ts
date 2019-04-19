import * as mysql from 'mysql';
import { IAdapter } from './adapter';
export declare class MysqlAdapter implements IAdapter {
    private connection;
    private tableName;
    private debug;
    constructor(tableName: string, connection: mysql.Connection, debug: boolean);
    private maybeDebug;
    init(): Promise<Boolean>;
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<Boolean>;
    expire(key: string, expiration: number): Promise<string | null>;
}
