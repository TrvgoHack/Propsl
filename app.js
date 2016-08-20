'use strict';

const crypto = require('crypto');
const config = require('./config');

const hmac = crypto.createHmac('sha256', config.SECRET_KEY);

var fixDate = function(date) {
	return (date).toISOString().split('.')[0] + 'Z'; // copied 
}

let protocol = 'https://';
let endpoint = 'api.trivago.com';
let path = '/webservice/tas/hotels';

let endDate = new Date();
endDate.setDate(endDate.getDate() + 7);
let query = {
	access_id: config.ACCESS_ID,
	end_date: endDate,
	start_date: new Date().toISOString(),
	timestamp: fixDate(new Date())
};

query = Object.keys(query).sort().map((key) => key + '=' + encodeURIComponent(query[key])).join('&');

var unhashed_signature = ['GET', endpoint, path, query].join('\r');
query += '&signature=' + hmac.update(unhashed_signature).digest('base64');
console.log(protocol + endpoint + path + '?' + query);
