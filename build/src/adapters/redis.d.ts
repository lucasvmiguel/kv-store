import { IAdapter, IOptions, Connection } from './adapter';
export declare class RedisAdapter implements IAdapter {
    private connection;
    private tableName;
    private debug;
    constructor(tableName: string, connection: Connection, debug: boolean);
    private maybeDebug;
    private connect;
    init(): Promise<boolean>;
    refresh(connection: Connection): Promise<boolean>;
    get(key: string): Promise<string | null>;
    put(key: string, value: string, options?: IOptions): Promise<boolean>;
    del(key: string): Promise<boolean>;
    close(): Promise<boolean>;
}
