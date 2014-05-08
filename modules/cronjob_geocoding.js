/*
This file looks up all entries without coordinates and tries to
find a coordinate for the address. If found the coordinate is saved 
into the entry.
*/
var nominatim = require('nominatim');
var db, model, cache;

var update_cache = false;

function searchAndGeocode() {
	db.view("db/entries_without_coords", {reduce: false}, function (err, docs) {
		if (err || docs == undefined) {
			console.dir(err);
			return;
		}

		for (var d in docs) {
			var doc = docs[d].value;

			if (!doc.street || !doc.city || !doc.zipcode) continue;

			/* only check entries which haven't been tried in the last week */
			if (doc.last_time_geocoding_failed) {
				var one_week_ago = (new Date()).getTime() - (7 * 60 * 60 * 24 * 1000);
				if (doc.last_time_geocoding_failed > one_week_ago)
					continue;
			}

			if (doc.country === "Germany") doc.country = "Deutschland";

			var address = doc.street + ', ' + doc.zipcode + ' ' + doc.city + ', ' + doc.country;

			console.log("nominatim search for " + address + "(id: " + doc._id + ")");

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
							update_cache = true;
						});

					} else {
						console.log("no results");
						var obj = {last_time_geocoding_failed: (new Date()).getTime()};
						db.merge(id, obj, function(err, res) {
							if (err || docs == undefined) {
								console.dir(err);
								return;
							}
							console.log("last_time_geocoding_failed saved for " + res._id);
						});
					}

					console.log("");
				});
			})(address, doc._id);
		}

	});
}

function searchAndGeocodeFallback() {
	// remove limit!
	db.view("db/entries_without_fallback_coords", {reduce: false}, function (err, docs) {
		if (err || docs == undefined) {
			console.dir(err);
			return;
		}

		for (var d in docs) {
			var doc = docs[d].value;

			if (!doc.street || !doc.city || !doc.zipcode) continue;

			/* only check entries which haven't been tried in the last week */
			if (doc.last_time_fallback_geocoding_failed) {
				var one_week_ago = (new Date()).getTime() - (7 * 60 * 60 * 24 * 1000);
				if (doc.last_time_fallback_geocoding_failed > one_week_ago)
					continue;
			}

			if (doc.country === "Germany") doc.country = "Deutschland";

			var address = doc.zipcode + ' ' + doc.city + ', ' + doc.country;

			console.log("fallback search for " + address + "(id: " + doc._id + ")");

			(function(addr, id) {
				nominatim.search({ q: addr }, function(err, opts, results) {
					console.log("searched for " + addr + " (id: " + id + ")");

					if (results.length > 0) {
						console.log(JSON.stringify(results, null, "\t"));
						console.log("about to save for " + id);
						var obj = {
							  fallback_coords: [results[0].lat, results[0].lon]
							, fallback_coords_resolvement_ts: (new Date()).getTime()
						}
						db.merge(id, obj, function(err, res) {
							if (err || docs == undefined) {
								console.dir(err);
								return;
							}
							console.log("saved for " + res._id);
							update_cache = true;
						});

					} else {
						console.log("no results");
						var obj = {last_time_fallback_geocoding_failed: (new Date()).getTime()};
						db.merge(id, obj, function(err, res) {
							if (err || docs == undefined) {
								console.dir(err);
								return;
							}
							console.log("last_time_fallback_geocoding_failed saved for " + res._id);
						});
					}

					console.log("");
				});
			})(address, doc._id);
		}

	});
}


exports.init = function(_db, _model, _cache) {
	db = _db;
	model = _model;
	cache = _cache;

	searchAndGeocode();
	searchAndGeocodeFallback();

	setInterval(function() {
		// each 15 minutes

		if (update_cache) {
			cache.refresh();
			update_cache = false;
		}

		console.log((new Date()).getTime() + ": executing searchAndGeocode()");
		searchAndGeocode();
		console.log((new Date()).getTime() + ": executing searchAndGeocodeFallback()");
		searchAndGeocodeFallback();
	}, 1000 * 60 * 5);
	//}, 1000 * 60 * 15);
};
