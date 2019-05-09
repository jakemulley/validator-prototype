const csvtojson = require('csvtojson');
const AJV = require('ajv');
const ajv = new AJV({
	allErrors: true,
	verbose: true
});
const validate = ajv.compile(require('./../schema.json'));
const fs = require('fs');

const controller = {
	index(req, res) {
		return res.render('index');
	},
	validate(req, res) {
		csvtojson().fromFile(req.file.path).then(function(jsonObj) {
			const results = jsonObj.filter(function(item) {
				return Object.values(item).some(function(result) {
					return result.length;
				});
			}).map(function(item) {
				item.GeoX = isNaN(item.GeoX) ? item.GeoX : +item.GeoX;
				item.GeoY = isNaN(item.GeoY) ? item.GeoY : +item.GeoY;
				item.Hectares = isNaN(item.Hectares) ? item.Hectares : +item.Hectares;
				item.MinNetDwellings = isNaN(item.MinNetDwellings) ? item.MinNetDwellings : +item.MinNetDwellings;
				item.NetDwellingsRangeFrom = isNaN(item.NetDwellingsRangeFrom) ? item.NetDwellingsRangeFrom : +item.NetDwellingsRangeFrom;
				item.NetDwellingsRangeTo = isNaN(item.NetDwellingsRangeTo) ? item.NetDwellingsRangeTo : +item.NetDwellingsRangeTo;

				let valid = validate(item);
				item.errors = [];

				if(!valid) {
					item.errors = validate.errors;
				}

				return item;
			});

			return res.render('validate', { results: results });
		});
	}
}

module.exports = controller;
