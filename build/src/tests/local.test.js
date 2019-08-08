"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const kvStore = require("../index");
const key = 'key';
const value = 'value';
const jsonKey = 'jsonKey';
const jsonValue = { a: 1, b: [1, 2, 3], c: { a: 1, b: [1, 2, 3] } };
const sleep = seconds => new Promise(resolve => setTimeout(resolve, seconds * 1000));
const expiration = 2;
describe('local', () => {
    before(done => {
        kvStore.init({
            type: 'local',
            client: null,
        }).then(() => done());
    });
    afterEach(done => {
        kvStore.del(key).then(() => done());
    });
    it('put', done => {
        kvStore.put(key, value).then(result => {
            chai_1.expect(result).equal(true);
            done();
        });
    });
    it('get', done => {
        kvStore.put(key, value).then(() => {
            kvStore.get(key).then(result => {
                chai_1.expect(result).equal(value);
                done();
            });
        });
    });
    it('putJson', done => {
        kvStore.putJson(jsonKey, jsonValue).then(result => {
            chai_1.expect(result).equal(true);
            done();
        });
    });
    it('getJson', done => {
        kvStore.putJson(jsonKey, jsonValue).then(() => {
            kvStore.getJson(jsonKey).then(result => {
                chai_1.expect(result).to.be.deep.equal(jsonValue);
                done();
            });
        });
    });
    it('getJson expired', done => {
        kvStore.putJson(jsonKey, jsonValue, { expiration })
            .then(() => sleep(expiration + 1))
            .then(() => {
            kvStore.getJson(jsonKey).then(result => {
                chai_1.expect(result).equal(null);
                done();
            });
        });
    }).timeout(5000);
    it('getJson not expired', done => {
        kvStore.putJson(jsonKey, jsonValue, { expiration })
            .then(() => sleep(expiration - 1))
            .then(() => {
            kvStore.getJson(jsonKey).then(result => {
                chai_1.expect(result).to.be.deep.equal(jsonValue);
                done();
            });
        });
    }).timeout(5000);
});
