import * as mysql from 'mysql';
import { IAdapter, IOptions } from './adapter';
export declare class MysqlAdapter implements IAdapter {
    private connection;
    private tableName;
    private debug;
    constructor(tableName: string, connection: mysql.Connection, debug: boolean);
    private escape;
    private maybeDebug;
    init(): Promise<Boolean>;
    get(key: string): Promise<string | null>;
    put(key: string, value: string, options?: IOptions): Promise<Boolean>;
}
