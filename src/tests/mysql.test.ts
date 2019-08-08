import { expect } from 'chai';

import * as mysql from 'mysql';

import * as kvStore from '../index';

const key = 'key';
const value = 'value';

const jsonKey = 'jsonKey';
const jsonValue = { a: 1, b: [1, 2, 3], c: { a: 1, b: [1, 2, 3] } };

const sleep = seconds => new Promise(resolve => setTimeout(resolve, seconds * 1000));
const expiration = 2;

describe('mysql', () => {
  before(done => {
    const client = mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      port: 3307,
      database: 'test',
    });

    kvStore.init({
      type: 'mysql',
      client: client
    }).then(() => done()).catch(e => console.error(e));
  });

  afterEach(done => {
    kvStore.del(key).then(() => done());
  })

  it('put', done => {
    kvStore.put(key, value).then(result => {
      expect(result).equal(true);
      done();
    });
  });


  it('get', done => {
    kvStore.put(key, value).then(() => {
      kvStore.get(key).then(result => {
        expect(result).equal(value);
        done();
      });
    }).catch(err => console.error(err))
  });

  it('putJson', done => {
    kvStore.putJson(jsonKey, jsonValue).then(result => {
      expect(result).equal(true);
      done();
    });
  });

  it('getJson', done => {
    kvStore.putJson(jsonKey, jsonValue).then(() => {
      kvStore.getJson(jsonKey).then(result => {
        expect(result).to.be.deep.equal(jsonValue);
        done();
      });
    })
  });

  it('getJson expired', done => {
    kvStore.putJson(jsonKey, jsonValue, { expiration })
      .then(() => sleep(expiration + 1))
      .then(() => {
        kvStore.getJson(jsonKey).then(result => {
          expect(result).equal(null);
          done();
        });
      })
  }).timeout(5000);

  it('getJson not expired', done => {
    kvStore.putJson(jsonKey, jsonValue, { expiration })
      .then(() => sleep(expiration - 1))
      .then(() => {
        kvStore.getJson(jsonKey).then(result => {
          expect(result).to.be.deep.equal(jsonValue);
          done();
        });
      })
  }).timeout(5000);
});