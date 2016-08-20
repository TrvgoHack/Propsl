'use strict';

const crypto = require('crypto');

const ACCESS_ID =  '80839c3ba9734af6b95fcf405f8eca35';
const SECRET_KEY    = '0c622e482411452b14a6654c9eac55b1a1b6888c48840fea0e2cf35ef9d97705';

const hmac = crypto.createHmac('sha256', SECRET_KEY);

var fixDate = function(date) {
	return (date).toISOString().split('.')[0] + 'Z'; // copied ;;
}

let protocol = 'https://';
let endpoint = 'api.trivago.com';
let path = '/webservice/tas/hotels';

let endDate = new Date();
endDate.setDate(endDate.getDate() + 7);
let query = {
	access_id: ACCESS_ID,
	end_date: endDate,
	start_date: new Date().toISOString(),
	timestamp: fixDate(new Date())
};
// 'access_id='+ ACCESS_ID + '&end_date=2016-08-06T08%3A27%3A50Z&path=555&start_date=2016-08-05T08%3A27%3A50Z&timestamp=2016-08-04T08:27:50%2B00:00';

let sorted_query_parameters = {};

query = Object.keys(query).sort().map((key) => key + '=' + encodeURIComponent(query[key])).join('&');

// Object.keys(sorted_query_parameters).map((key) => {
//     query_string.push(encodeURIComponent(key) + '=' + encodeURIComponent(sorted_query_parameters[key])); // copied
// });
// query = query_string.join('&');

var unhashed_signature = ['GET', endpoint, path, query].join('\n');
query += '&signature=' + hmac.update(unhashed_signature).digest('base64');
console.log(protocol + endpoint + path + '?' + query);
