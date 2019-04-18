<p align="center"><img src="logo/horizontal.png" alt="kv-store" height="80px"></p>

[![Build Status](https://travis-ci.org/lucasvmiguel/kv-store.svg?branch=master)](https://travis-ci.org/lucasvmiguel/kv-store)

## Description
Key value store library that uses your current database (for you that don't want to spend even more money)

## Installation

```bash
npm install --save @lucasvmiguel/kv-store
```

## How to use
```js
import * as kvStore from '@lucasvmiguel/kv-store';

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

await kvStore.put('USER:123', 'abc');
const abc = await kvStore.get('USER:123');

// Expiration in seconds
await kvStore.put('USER:456', `{"foo": "bar"}`, { expiration: 60 });
const fooBar = await kvStore.getJson('USER:456');
```

## RoadMap
* Include more databases

## License

[MIT](LICENSE)
