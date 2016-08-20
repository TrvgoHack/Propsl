'use strict';

const crypto = require('crypto');
const config = require('./config');
const request = require('request');

const hmac = crypto.createHmac('sha256', config.SECRET_KEY);

var fixDate = function(date) {
	return (date).toISOString().split('.')[0] + 'Z'; // copied 
}

let protocol = 'https://';
let endpoint = 'api.trivago.com';
let path = '/webservice/tas/locations';

// let endDate = new Date();
// endDate.setDate(endDate.getDate() + 7);
console.log(config.ACCESS_ID);
let query = {
	access_id: config.ACCESS_ID,
	// end_date: endDate,
	// start_date: new Date().toISOString(),
	query: 'berlin',
	timestamp: fixDate(new Date())
};

query = Object.keys(query).sort().map((key) => key + '=' + encodeURIComponent(query[key])).join('&');
console.log(query);

var unhashed_signature = ['GET', endpoint, path, query].join('\n');
query += '&signature=' + hmac.update(unhashed_signature).digest('base64');
let url = protocol + endpoint + path + '?' + query;

request(url, {
	headers: {
		'Accept' :'application/vnd.trivago.affiliate.hal+json;version=1',
		'Accept-Language': 'en-GB'
	}
}, function(err, resp) {
	console.log(err, resp.body);

});
