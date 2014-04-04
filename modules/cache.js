var db;
var entries = 0;

refreshEntries = function(cb) {
	db.view('db/entries', {reduce: false}, function (err, res_entries) {
		if (err) {
			layout.error(500, err, null, null, layout.get_vars('entries_all'));
			return;
		}

		entries = res_entries;
		console.log("loaded " + res_entries.length + " entries into cache");
	});
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
	db = _db;
	this.refresh();
}
