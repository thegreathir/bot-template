let Promise = require("bluebird")
let request = require("superagent");

let Connection  = require('./connection');
let handler = require("./handler");

let connection =
	new Connection ();

connection.setCallback(body => {
	let promises = body.result.map(handler);
	return Promise.all(promises);
});

connection.run();
