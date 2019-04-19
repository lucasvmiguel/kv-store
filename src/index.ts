import * as mysql from 'mysql';
import { IAdapter } from './adapters/adapter';
import { MysqlAdapter } from './adapters/mysql';

type ClientTypes = 'mysql';

interface IClient {
    type: ClientTypes;
    client: mysql.Connection;
    tableName?: string;
    debug?: boolean;
}

interface IOptions {
    expiration?: number;
}

class Client {
    private adapter: IAdapter;
    private tableName: string = 'kvstore_keyvalues';
    private debug: boolean = false;

    /**
     * Initiates the package, after run this function you will be able to run the other functions
     *
     * @param  {IClient} params
     * @returns Promise
     */
    public async init(params: IClient): Promise<Boolean> {
        this.debug = !!params.debug;
        
        if (params.tableName) {
            this.tableName = params.tableName;
        }

        switch (params.type) {
            case 'mysql': 
                this.adapter = new MysqlAdapter(this.tableName, params.client, this.debug);
                break;
        }

        return this.adapter.init();
    }

    /**
     * Inserts or updates a value with a key
     *
     * @param  {string} key
     * @param  {string} value
     * @param  {IOptions} options?
     * @returns Promise
     */
    public async put(key: string, value: string, options?: IOptions): Promise<Boolean> {
        if (options && options.expiration) {
            this.adapter.expire(key, options.expiration);
        }

        return this.adapter.put(key, value);
    }

    /**
     * Inserts or updates a Json value with a key
     *
     * @param  {string} key
     * @param  {string} value
     * @param  {IOptions} options?
     * @returns Promise
     */
    public async putJson(key: string, value: object, options?: IOptions): Promise<Boolean> {
        const valueJson = JSON.stringify(value);

        return this.put(key, valueJson, options);
    }

    /**
     * Gets value based on the key provided (or it can returns null if nothing has been found)
     *
     * @param  {string} key
     * @returns Promise
     */
    public async get(key: string): Promise<string | null> {
        return this.adapter.get(key);
    }

    /**
     * Gets value on JSON format based on the key provided (or it can returns null if nothing has been found)
     *
     * @param  {string} key
     * @returns Promise
     */
    public async getJson(key: string): Promise<any | null> {
        const result = await this.get(key);

        if (result) {
            const resultEscaped = result.replace('\r', '\\r').replace('\n', '\\n');   
            return JSON.parse(resultEscaped);
        }

        return null;
    }
}

const client = new Client();
export = client;
