/**
 * Created by amirabbas on 12/29/16.
 */

let request = require("superagent");
let Promise = require("bluebird");
let bot_token = require("./token.json").token;


function Connection(_adr, token) {
    if (_adr)
        this.address = _adr;
    else
        this.address = `https://api.telegram.org/` + bot_token;
	this.offset  = undefined;
	this.callback = undefined;
	this.token = token;
}

Connection.prototype.setCallback = function (_callback) {
	this.callback = _callback;
};

Connection.prototype._POST = Promise.promisify(function (address,input,callback) {

	let header = {};

	if (this.token)
		header = {Authorization:`Bearer ${this.token}}`};


	request
		.post(this.address + address)
		.set('Accept','application/json')
		.set(header)
		.send(input)
		.end(callback);

});

Connection.prototype.post = function (address , input) {
	return this._POST(address,input)
		.then (res => {
			return res.body;
		});
};

Connection.prototype._GET = Promise.promisify(function (address,input,callback) {

	let header = {};

	if (this.token)
		header = {Authorization:`Bearer ${this.token}}`};


	request
		.get(this.address + address)
		.query(input)
		.set(header)
		.end(callback);

});

Connection.prototype.get = function (address, input) {
	return this._GET(address, input)
		.then(res => {
			return res.body;
		})
};


Connection.prototype.getText = function (address, input) {
	return this._GET(address, input)
		.then(res => {
			return res.text;
		})
};

Connection.prototype.longPolling = function () {
	return this.post("/getUpdates", {
		offset : this.offset,
		timeout : 5
	}).then ((body)=>{

		if (body.result.length !== 0) {
			this.offset = body.result[body.result.length - 1].update_id + 1;
			this.longPolling();
			return this.callback(body);
		}
		else {
			this.offset = 0;
			this.longPolling();
            return Promise.resolve();
        }
	});
};
Connection.prototype.run = function () {
	this.longPolling();
};

module.exports = Connection;

module.exports.fixUrl = (text) => {
	if (typeof text === "string")
		return text;

	if (typeof text === "object" && text.text)
		return text.text;
	return false;
};
