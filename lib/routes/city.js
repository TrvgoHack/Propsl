'use strict';

const getSummary = require('../ctrls/getPictures');
const Q = require('q');

function error(userMessage, developerMessage) {
	return {
		userMessage: userMessage,
		developerMessage: developerMessage
	};
}

function removeUmlaut(name) {
	var translate = {
		'ä': 'ae', 'ö': 'oe', 'ü': 'ue',
		'Ä': 'Ae', 'Ö': 'Oe', 'Ü': 'Ue' 
	};
	var umlautRegEx = /[öäüÖÄÜ]/g;
	return name.replace(umlautRegEx, (match) => translate[match]);
};

module.exports = (app) => {
	app.get('/city', (req, res) => {
		

		let cityName  = removeUmlaut(req.query.name), location = req.query.location;

		if(!cityName) {
			res.status(400).json(error('Something wen\'t wrong!', 'name is not provided.'));
			return;
		}
		
		if(!location) {
			res.status(400).json(error('Something wen\'t wrong!', 'location is not provided.'));
			return;
		};

		Q.fcall(getSummary, location, cityName).then(d => {
			res.json(d);
		}).fail(err => {
			res.status(500).json(error('Something wen\'t wrong!', 'There is a problem with wikipedia and picture graber for the city')); 
		});
		
	});
}

