var https = require('https');
var db, model;

var entries = 0;
var entries_coords = [];

var count_categories = { /* key: 0 */ };
var count_subcategories = { /* key: 0 */ };

exports.searchTerm = function(foo, opts, cb) {
	var term = opts.startkey;
	var search_words = term.replace(/[!.,;?\r\n\t]+/g," ").toLowerCase().split(" ");
	var results = [];

	//console.log(search_words);
	if (search_words.length === 0 || term.replace(/\s*/g, "").length === 0) {
		cb(null, entries);
		return;
	}

	for (var e in entries) {
		var entry = entries[e].value;
		var searchTxt = assembleSearchTxt(entry);
		var matched = false;

		for (var w in search_words) {
			var word = search_words[w];

			// > 2 because we need "bio" included, so > 3 is not possible
			if (word.replace(/\s*/g, "").length > 2)  {
				var re = new RegExp(word, "gi");
				if (searchTxt.match(re)) {
					matched = true;
				} else {
					matched = false;
					break;
				}
			}
		}

		if (matched) 
			results.push(entries[e]);
	}

	cb(null, results);
}

var assembleSearchTxt = function(doc) {
	var address = "";
	if (doc.street) address += doc.street + " ";
	if (doc.city) address += doc.city + " ";
	if (doc.zipcode) address += doc.zipcode + " ";

	var txt = doc.name + " " + doc.description + " " + address;

	if (doc.classifications) {
		for (var c in model.classifications) {
			for (var doc_c in doc.classifications) {
				if (model.classifications[c].key == doc.classifications[doc_c])
					txt += " " + model.classifications[c].value + " ";
			}	
		}
	}

	if (doc.categories) {
		for (var c in model.categories) {
			for (var doc_c in doc.categories) {
				if (model.categories[c].key == doc.categories[doc_c])
					txt += " " + model.categories[c].value + " ";
			}	
		}
	}

	txt += parseSub(doc.subcategories).join(" ");
	txt = txt.replace(/\&[A-Za-z]+\;/gi, ' ');
	txt = txt.replace(/\-/gi, '');
	txt = txt.replace(/\(/gi, '');
	txt = txt.replace(/\)/gi, '');
	txt = txt.replace(/\+/gi, '');
	txt = txt.replace(/\~/gi, '');
	txt = txt.replace(/\-/gi, '');
	txt = txt.replace(/\%/gi, '');

	return txt;
}

/* return subcategories objects which are correct for subcategories_arr */
function parseSub(subcategories_arr) {
	var arr = [];

	for (var c0 in subcategories_arr) {
		for (var c1 in model.subcategories) {
			for (var c2 in model.subcategories[c1]) {
				var obj = model.subcategories[c1][c2];
				for (var c3 in obj.list) {
					var obj2 = obj.list[c3];
					if (obj2.key === subcategories_arr[c0])
						arr.push(obj2.value);
				}
			}
		}
	}

	return arr;
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
