export interface IAdapter {
  init: () => Promise<Boolean>;
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<Boolean>;
  expire(key: string, expiration: number): Promise<string | null>;
}