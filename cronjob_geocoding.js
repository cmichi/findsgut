/*
This file looks up all entries without coordinates and tries to
find a coordinate for the address. If found the coordinate is saved 
into the entry.
*/
var nominatim = require('nominatim');

var cradle = require('cradle');
var dbname = process.env.DBNAME || 'findsgut';
var db = new(cradle.Connection)('127.0.0.1', 5984).database(dbname);

var searchAndGeocode = function() {
	db.view("db/entries_without_coords", {reduce: false}, function (err, docs) {
		if (err || docs == undefined) {
			console.dir(err);
			return;
		}

		for (var d in docs) {
			var doc = docs[d].value;

			if (!doc.street || !doc.city || !doc.zipcode) continue;

			if (doc.country === "Germany") doc.country = "Deutschland";

			var address = doc.street + ', ' + doc.zipcode + ', ' + doc.city + ', ' + doc.country;

			(function(addr, id) {
				nominatim.search({ q: addr }, function(err, opts, results) {
					console.log("searched for " + addr + " (id: " + id + ")");

					if (results.length > 0) {
						console.log(JSON.stringify(results, null, "\t"));
						console.log("about to save for " + id);
						var obj = {
							  coords: [results[0].lat, results[0].lon]
							, coords_resolvement_ts: (new Date()).getTime()
						}
						db.merge(id, obj, function(err, res) {
							if (err || docs == undefined) {
								console.dir(err);
								return;
							}
							console.log("saved for " + res._id);
						});

					} else 
						console.log("no results");

					console.log("");
				});
			})(address, doc._id);
		}
	});
}

searchAndGeocode();

setTimeout(1000 * 60 * 15, function() {
	// each 15 minutes
	searchAndGeocode();
}));
