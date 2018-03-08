let https = require('https');
let fs = require('fs');

let Promise = require("bluebird");
let Connection = require('./connection');

let connection =
	new Connection();

module.exports = Promise.coroutine(function*(update) {
    console.log(JSON.stringify(update, null, 4));
});
