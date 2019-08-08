import * as mysql from "mysql";

// add new connection types for new adapters
export type Connection = mysql.Connection;

export interface IOptions {
  expiration?: number;
}

export interface IAdapter {
  init: () => Promise<boolean>;
  refresh: (connection: Connection) => Promise<boolean>;
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: IOptions): Promise<boolean>;
}