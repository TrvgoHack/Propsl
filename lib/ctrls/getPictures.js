'use strict';

const rp = require('request-promise');
const Q = require('q');
const config = require('../config');

console.log(config);

const  location = '51.240595,6.7738589';
const city = "cologne";

const CITY_URL= 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=:location&name=:city&key=' + config.GOOGLE_API;
const PICTURE_URL = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=:reference&key=' + config.GOOGLE_API;
const SUMMARY_URL = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=:city";

Q.spawn(function *() {
	let res = yield rp({
		url: CITY_URL.replace(/:location/, location).replace(/:city/, city),
		json: true
	});

	let photoRef;
	try {
		photoRef = res.results[0].photos[0].photo_reference;
	}
	catch(err) {
		console.log(err);
		return;
	}

	try {
		let imageUrl = PICTURE_URL.replace(/:reference/, photoRef);
		console.log(imageUrl);
	} catch(err) {
		
	}

	try {
		let summary = yield rp({url: SUMMARY_URL.replace(/:city/, city), json: true});
		let id = Object.keys(summary.query.pages)[0];
		console.log(summary.query.pages[id].extract);
	} catch(err) {

	}
	 
});
