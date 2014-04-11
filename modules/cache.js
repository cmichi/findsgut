var https = require('https');
var db;
var entries = 0;

var refreshEntries = function(cb) {
	db.view('db/entries', {reduce: false}, function (err, res_entries) {
		if (err) {
			layout.error(500, err, null, null, layout.get_vars('entries_all'));
			return;
		}

		entries = res_entries;
		console.log("loaded " + res_entries.length + " entries into cache");
	});
}

/* execute get request for those uris in order to make sure
the cache gets initialized */
exports.pingCache = function() {
	var prefix = "https://findsgut.de";
	var uris = [
		'/', 
		'/eintraege/neu', 
		'/eintraege/alle', 
		'/feedback', 
		'/idee',
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
	if (cb) 
		cb(entries);
	else
		return entries;
}

exports.init = function(_db) {
	console.log("initializing cache...").
	db = _db;
	this.refresh();

	if (process.env.NODE_ENV == 'production') {
		setTimeout(function() {
			console.log("about to ping cache");
			this.pingCache();
		}, 5000);
		setTimeout(function() {
			console.log("about to ping cache");
			this.pingCache();
		}, 25000);
	}
}
