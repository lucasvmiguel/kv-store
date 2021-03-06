import { IAdapter, Connection } from './adapters/adapter';
import { MysqlAdapter } from './adapters/mysql';
import { RedisAdapter } from './adapters/redis';
import { LocalAdapter } from './adapters/local';

type ClientTypes = 'mysql' | 'redis' | 'local';

interface IClient {
    type: ClientTypes;
    client: Connection;
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

            case 'redis':
                this.adapter = new RedisAdapter(this.tableName, params.client, this.debug);
                break;

            case 'local':
                this.adapter = new LocalAdapter(this.tableName, params.client, this.debug);
                break;
        }

        return this.adapter.init();
    }
    /**
     * Refresh the connection, this can be useful when the connection is no longer available
     * 
     * @param  {Connection} connection
     * @returns Promise
     */
    public async refresh(connection: Connection): Promise<Boolean> {
        return this.adapter.refresh(connection)
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
        return this.adapter.put(key, value, options);
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

    /**
     * Delete key
     * 
     * @param  {string} key
     * @returns Promise
     */
    public async del(key: string): Promise<Boolean> {
        return this.adapter.del(key);
    }

    /**
     * Close the connection
     * 
     * @returns Promise
     */
    public async close(): Promise<Boolean> {
        return this.adapter.close();
    }

}

const client = new Client();
export = client;
