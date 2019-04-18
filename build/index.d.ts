import * as mysql from 'mysql';
declare type ClientTypes = 'mysql';
interface IClient {
    type: ClientTypes;
    client: mysql.Connection;
}
/**
 * Initiates the package, after run this function you will be able to run the other functions
 *
 * @param  {IClient} params
 * @returns Promise
 */
export declare const init: (params: IClient) => Promise<Boolean>;
/**
 * Inserts or updates a value with a key
 *
 * @param  {string} key
 * @param  {string} value
 * @returns Promise
 */
export declare const put: (key: string, value: string) => Promise<Boolean>;
/**
 * Gets value on JSON format based on the key provided (or it can returns null if nothing has been found)
 *
 * @param  {string} key
 * @returns Promise
 */
export declare const getJson: (key: string) => Promise<any>;
/**
 * Gets value based on the key provided (or it can returns null if nothing has been found)
 *
 * @param  {string} key
 * @returns Promise
 */
export declare const get: (key: string) => Promise<string>;
export {};
