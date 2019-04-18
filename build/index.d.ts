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
    /**
     * Initiates the package, after run this function you will be able to run the other functions
     *
     * @param  {IClient} params
     * @returns Promise
     */
    init(params: IClient): Promise<Boolean>;
    /**
     * Inserts or updates a value with a key
     *
     * @param  {string} key
     * @param  {string} value
     * @returns Promise
     */
    put(key: string, value: string): Promise<Boolean>;
    /**
     * Gets value based on the key provided (or it can returns null if nothing has been found)
     *
     * @param  {string} key
     * @returns Promise
     */
    get(key: string): Promise<string | null>;
    /**
     * Gets value on JSON format based on the key provided (or it can returns null if nothing has been found)
     *
     * @param  {string} key
     * @returns Promise
     */
    getJson(key: string): Promise<any | null>;
    private initMysql;
    private getMysql;
    private putMysql;
}
declare const client: Client;
export = client;
