import * as mysql from 'mysql';

type ClientTypes = 'mysql';


interface IClient {
    type: ClientTypes;
    client: mysql.Connection;
}

class Client {
    private type: ClientTypes;
    private client: mysql.Connection;
    private tableName: string = 'kvstore-keyvalues';

    /**
     * Initiates the package, after run this function you will be able to run the other functions
     * 
     * @param  {IClient} params
     * @returns Promise
     */
    public async init(params: IClient): Promise<Boolean> {
        this.client = params.client;
        this.type = params.type;

        switch (this.type) {
        case 'mysql':
            return this.initMysql();
        }
    }
    /**
     * Gets value based on the key provided (or it can returns null if nothing has been found)
     * 
     * @param  {string} key
     * @returns Promise
     */
    public async get(key: string): Promise<string | null> {
        switch (this.type) {
        case 'mysql':
            return this.getMysql(key);
        }
    }

    /**
     * Inserts or updates a value with a key
     * 
     * @param  {string} key
     * @param  {string} value
     * @returns Promise
     */
    public async put(key: string, value: string): Promise<Boolean> {
        switch (this.type) {
        case 'mysql':
            return this.putMysql(key, value);
        }
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
            return JSON.parse(result);
        }

        return null;
    }

    private async initMysql(): Promise<Boolean> {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS \`${this.tableName}\` (
                \`key\` VARCHAR(255) NOT NULL,
                \`value\` TEXT NULL,
                PRIMARY KEY (\`key\`)
            );
        `;

        return new Promise<Boolean>((resolve, reject) => {
            this.client.query(createTableQuery, (err) => {
                if (err) {
                    return reject(err);
                }
                return resolve(true);
            });
        });
    }

    private async getMysql(key: string): Promise<string | null> {
        return new Promise<string | null>((resolve, reject) => {
            const selectQuery = `SELECT \`${this.tableName}\`.value FROM \`${this.tableName}\` WHERE \`${this.tableName}\`.key = '${key}';`;
            
            this.client.query(selectQuery, (error, results) => {
                if (error) {
                    return reject(error);
                }

                if (Array.isArray(results) && results.length > 0) {
                    return resolve(results[0].value);
                }

                return resolve(null);
            });
        });
    }

    private async putMysql(key: string, value: string): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            const insertQuery = `INSERT INTO \`${this.tableName}\`(\`key\`, \`value\`) VALUES ('${key}','${value}') ON DUPLICATE KEY UPDATE \`${this.tableName}\`.value = '${value}';`;

            this.client.query(insertQuery, (error) => {
                if (error) {
                    return reject(error);
                }

                return resolve(true);
            });
        });
    }

}

export default new Client();
