<p align="center"><img src="logo/horizontal.png" alt="kv-store" height="80px"></p>

[![Version](https://img.shields.io/npm/v/@lucasvmiguel/kv-store.svg)](https://www.npmjs.org/package/@lucasvmiguel/kv-store)
[![Build Status](https://travis-ci.org/lucasvmiguel/kv-store.svg?branch=master)](https://travis-ci.org/lucasvmiguel/kv-store)
[![Downloads](https://img.shields.io/npm/dm/@lucasvmiguel/kv-store.svg)](https://www.npmjs.org/package/@lucasvmiguel/kv-store)

## Description
Key value store library that uses your current database. It might be the case that you don't want to spend money in a new instance or in another service.

PS: if you have money to spend, maybe it's better to use a better database solution for this particular problem, as suggested here: https://www.reddit.com/r/javascript/comments/beyjef/key_value_storage_in_your_own_database_if_you/el9s32b?utm_source=share&utm_medium=web2x

Databases available:
* Mysql
* Postgres (roadmap)
* MongoDB (roadmap)

## Installation

```bash
npm install --save @lucasvmiguel/kv-store
```

## How to use

#### MYSQL
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
  tableName: 'kvstore_keyvalues', // OPTIONAL
  debug: false, // OPTIONAL
});

await kvStore.put('USER:123', 'abc');
const abc = await kvStore.get('USER:123');

// Expiration in seconds
await kvStore.putJson('USER:456', {foo: "bar"}, { expiration: 60 });
const fooBar = await kvStore.getJson('USER:456');
```

#### Redis
```js
import * as kvStore from '@lucasvmiguel/kv-store';

const connection = redis.createClient(6379, '127.0.0.1')

await kvStore.init({
  type: 'redis',
  client: connection,
  tableName: 'kvstore_keyvalues', // OPTIONAL
  debug: false, // OPTIONAL
});

await kvStore.put('USER:123', 'abc');
const abc = await kvStore.get('USER:123');

// Expiration in seconds
await kvStore.putJson('USER:456', {foo: "bar"}, { expiration: 60 });
const fooBar = await kvStore.getJson('USER:456');
```

#### Local
```js
import * as kvStore from '@lucasvmiguel/kv-store';

await kvStore.init({
  type: 'local',
  client: null,
  tableName: 'kvstore_keyvalues', // OPTIONAL
  debug: false, // OPTIONAL
});

await kvStore.put('USER:123', 'abc');
const abc = await kvStore.get('USER:123');

// Expiration in seconds
await kvStore.putJson('USER:456', {foo: "bar"}, { expiration: 60 });
const fooBar = await kvStore.getJson('USER:456');
```

## License

[MIT](LICENSE)
