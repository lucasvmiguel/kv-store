import * as mysql from 'mysql';
declare type ClientTypes = 'mysql';
interface IClient {
    type: ClientTypes;
    client: mysql.Connection;
}
declare class Client {
    private type;
    private client;
    private tableName;
    init(params: IClient): Promise<Boolean>;
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<Boolean>;
    getJson(key: string): Promise<any | null>;
    private initMysql;
    private getMysql;
    private putMysql;
}
declare const _default: Client;
export default _default;
