'use strict';

const crypto = require('crypto');
const config = require('./config');
const request = require('request');
const rp = require('request-promise');
const Q = require('q');

var fixDate = function(date) {
	return (date).toISOString().split('.')[0] + 'Z'; 
}

let protocol = 'https://';
let endpoint = 'api.trivago.com';
let path = '/webservice/tas/hotels';



(function doReq () {
	let  hmac = crypto.createHmac('sha256', config.SECRET_KEY);
	let endDate = new Date();
	endDate.setDate(endDate.getDate() + 7);
	
	let query = {
		access_id: config.ACCESS_ID,
		// query: 'berlin',
		// end_date: fixDate(endDate),
		// start_date: fixDate(new Date()),
		path: '8515',
		timestamp: fixDate(new Date())
	};
	
	query = Object.keys(query).sort().map((key) => key + '=' + encodeURIComponent(query[key])).join('&');
	var unhashed_signature = ['GET', endpoint, path, query].join('\n');
	query += '&signature=' + hmac.update(unhashed_signature).digest('base64');
	let url = protocol + endpoint + path + '?' + query;
	
	Q.spawn(function *() {
		try {
			let res = yield rp({
				uri: url,
				headers: {
					'Accept' :'application/vnd.trivago.affiliate.hal+json;version=1',
					'Accept-Language': 'en-GB'
				},
				resolveWithFullResponse: true    
			});

			if (res.statusCode === 202)
				doReq();
			else if (res.statusCode === 200)
				console.log(res.body);
		} catch(err) {
			yield wait(300);
			doReq();
		}
	});
})();

function wait(time_s) {
	return Q.promise((resolve, reject) => {
		console.log('waiting for ', time_s);
		setInterval(_ => resolve(), time_s);
	});
}
