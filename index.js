let Promise = require("bluebird")
let request = require("superagent");

let Connection  = require('./connection');
let url = `https://api.telegram.org/bot467433115:AAGvxkqZvwoHnzaCOoZa728_JMA4lYKagOM`;
let handler = require("./handler");

let connection =
	new Connection (url);

connection.setCallback(body => {
	let promises = body.result.map(handler);
	return Promise.all(promises);
});

connection.run();
