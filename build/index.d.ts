import { Connection } from './adapters/adapter';
declare type ClientTypes = 'mysql';
interface IClient {
    type: ClientTypes;
    client: Connection;
    tableName?: string;
    debug?: boolean;
}
interface IOptions {
    expiration?: number;
}
declare class Client {
    private adapter;
    private tableName;
    private debug;
    /**
     * Initiates the package, after run this function you will be able to run the other functions
     *
     * @param  {IClient} params
     * @returns Promise
     */
    init(params: IClient): Promise<Boolean>;
    /**
     * Refresh the connection, this can be useful when the connection is no longer available
     *
     * @param  {Connection} connection
     * @returns Promise
     */
    refresh(connection: Connection): Promise<Boolean>;
    /**
     * Inserts or updates a value with a key
     *
     * @param  {string} key
     * @param  {string} value
     * @param  {IOptions} options?
     * @returns Promise
     */
    put(key: string, value: string, options?: IOptions): Promise<Boolean>;
    /**
     * Inserts or updates a Json value with a key
     *
     * @param  {string} key
     * @param  {string} value
     * @param  {IOptions} options?
     * @returns Promise
     */
    putJson(key: string, value: object, options?: IOptions): Promise<Boolean>;
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
}
declare const client: Client;
export = client;
