var https = require('https');
var db, model;
var entries = 0;

var count_categories = { /* key: 0 */ };
var count_subcategories = { /* key: 0 */ };

var refreshEntries = function(cb) {
	db.view('db/entries', {reduce: false}, function (err, res_entries) {
		if (err) {
			layout.error(500, err, null, null, layout.get_vars('entries_all'));
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
}

exports.getEntries = function(cb) {
	if (cb) cb(entries);
	else return entries;
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
