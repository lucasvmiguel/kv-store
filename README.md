# KV Store
[![Build Status](https://travis-ci.org/lucasvmiguel/kv-store.svg?branch=master)](https://travis-ci.org/lucasvmiguel/kv-store)

## Description
Key value store library that uses your current database (for you that don't want to even spend more money)

## Installation

```bash
npm install --save kv-store
```

## How to use
```js
import kvStore from 'kv-store';

const connection = mysql.createConnection({
    host: '...',
    user: '...',
    password: '...',
    port: '...',
    database: '...',
});

await kvStore.init({
  type: 'mysql',
  client: connection,
});

await kvStore.put('USER_METRIC_HISTORY:8218', 'abc');
await kvStore.get('USER_METRIC_HISTORY:8218');

await kvStore.put('USER_METRIC_HISTORY:9999', `{"foo": "bar"}`);
await kvStore.getJson('USER_METRIC_HISTORY:8218');
```

## RoadMap
* Include more databases

## License

[MIT](LICENSE)
