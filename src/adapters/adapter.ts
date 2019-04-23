export interface IOptions {
  expiration?: number;
}

export interface IAdapter {
  init: () => Promise<Boolean>;
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: IOptions): Promise<Boolean>;
}