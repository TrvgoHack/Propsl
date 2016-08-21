'use strict';

const rp = require('request-promise');
const Q = require('q');
const config = require('../config');

console.log(config);

const  location = '51.240595,6.7738589';
const city = "cologne";

const CITY_URL= 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=:location&name=:city&key=' + config.GOOGLE_API;
const PICTURE_URL = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=999&photoreference=:reference&key=' + config.GOOGLE_API;
const SUMMARY_URL = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&explaintext=&titles=:city";

module.exports = function(location, city) {
	let deferred = Q.defer();

	Q.spawn(function *() {
		
		let photoRef;
		
		try {

			let res = yield rp({
				url: CITY_URL.replace(/:location/, location).replace(/:city/, city),
				json: true
			});

			if (res.results && res.results.length > 0 && res.results[0].photos &&
				res.results[0].photos.length > 0 && res.results[0].photos[0].photo_reference)
				photoRef = res.results[0].photos[0].photo_reference;
		}
		catch(err) {
			console.log(err);
			deferred.reject(err);
		}

		let imageUrl;
		if(photoRef) {
			imageUrl = PICTURE_URL.replace(/:reference/, photoRef);
		} 
		
		try {
			let summary = yield rp({url: SUMMARY_URL.replace(/:city/, city), json: true});
			let id = Object.keys(summary.query.pages)[0];
			
			deferred.resolve({
				summary: summary.query.pages[id].extract || null,
				image: imageUrl || null
			});
			
		} catch(err) {
			console.log(err);
			deferred.reject(err);
		}
	});
	
	return deferred.promise;
}
