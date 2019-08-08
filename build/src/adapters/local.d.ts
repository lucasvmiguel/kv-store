import { IAdapter, IOptions, Connection } from './adapter';
export declare class LocalAdapter implements IAdapter {
    private tableName;
    private debug;
    private data;
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
