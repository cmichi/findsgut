var https = require('https');
var db, model;

var entries = 0;
var entries_coords = [];

var count_categories = { /* key: 0 */ };
var count_subcategories = { /* key: 0 */ };

exports.search = function(foo, opts, cb) {
	var term = opts.startkey;
	var results = [];

	for (var e in entries) {
		var entry = entries[e].value;
		//console.log(JSON.stringify(entry, null, "\t"));
		var searchTxt = assembleSearchTxt(entry);
		//console.log(searchTxt);
		//console.log("!" + term + "!");

		var re = new RegExp(term, "gi");
		console.log(re);
		if (searchTxt.match(re)) {
			results.push(entries[e]);
		}
	}

	console.log(results.length);
	cb(null, results);
}

var assembleSearchTxt = function(entry) {
	return entry.name + entry.description;
}

var refreshAllEntriesCoords = function() {
	db.view('db/coords', {reduce: false}, function (err, res_entries) {
		if (err) {
			console.dir(err);
			return;
		}

		entries_coords = res_entries;
		console.log("loaded " + entries_coords.length + " coord entries into cache")
	});
}

var refreshEntries = function(cb) {
	db.view('db/entries', {reduce: false}, function (err, res_entries) {
		if (err) {
			console.dir(err);
			return;
		}

		entries = res_entries;
		console.log("loaded " + res_entries.length + " entries into cache");

		for (var c in model.categories) 
			count_categories[model.categories[c].key] = 0;

		for (var sc in model.subcategories.products) {
			for (var sc_l in model.subcategories.products[sc].list) {
				count_subcategories[model.subcategories.products[sc].list[sc_l].key] = 0;
			}
		}

		for (var sc in model.subcategories.services) {
			for (var sc_l in model.subcategories.services[sc].list) {
				count_subcategories[model.subcategories.services[sc].list[sc_l].key] = 0;
			}
		}

		//console.log(JSON.stringify(model.subcategories, null, "\t"))

		for (var e in entries) {
			var entry = entries[e].value;
			//console.log(JSON.stringify(entry, null, "\t"))

			for (var c in entry.categories) 
				count_categories[entry.categories[c]]++;

			for (var c in entry.subcategories) 
				count_subcategories[entry.subcategories[c]]++;
		}
	});


}

/* execute get request for those uris in order to make sure
the cache gets initialized */
var pingCache = function() {
	var prefix = "https://findsgut.de";
	var uris = [
		'/', 
		'/eintraege/neu', 
		'/eintraege/alle', 
		'/feedback', 
		'/idee',
		'/stoebern',
		'/impressum'
	];

	for (var u in uris) {
		var uri =  prefix + uris[u];
		(function(uri) {
			console.log("https.get for " + uri);

			https.get(uri, function(res) {
				console.log("Got response: " + res.statusCode 
					+ " for " + uri);
			}).on('error', function(e) {
				console.log("Got error: " + e.message 
					+ " for " + uri);
			});
		})(uri);
	}
}

exports.refresh = function() {
	refreshEntries();
	refreshAllEntriesCoords();
}

exports.getEntries = function(cb) {
	if (cb) cb(entries);
	else return entries;
}

exports.getAllEntriesCoords = function(cb) {
	if (cb) cb(entries_coords);
	else return entries_coords;
}

exports.getCountCategories = function(cb) {
	if (cb) cb(count_categories);
	else return count_categories;
}

exports.getCountSubCategories = function(cb) {
	if (cb) cb(count_subcategories);
	else return count_subcategories;
}

exports.init = function(_db, _model) {
	db = _db;
	model = _model;
	this.refresh();

	if (process.env.NODE_ENV == 'production') {
		setTimeout(function() {
			console.log("about to ping cache");
			pingCache();
		}, 6000);
		setTimeout(function() {
			console.log("about to ping cache");
			pingCache();
		}, 45000);
		setTimeout(function() {
			console.log("about to ping cache");
			pingCache();
		}, 65000);
		setTimeout(function() {
			console.log("about to ping cache");
			pingCache();
		}, 85000);
	}
}
