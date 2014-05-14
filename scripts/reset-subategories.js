var config = require('../config_local.js');
var cradle = require('cradle');
var dbname = process.env.DBNAME || 'findsgut';
var dbport = process.env.DBPORT || 5984;
var obj = {
      auth: { username: 'admin', password: 'wirel' }
};
if (dbport == 5984) obj = {};

var db = new(cradle.Connection)('127.0.0.1', dbport, obj).database(dbname);

console.log(dbname + " on " + dbport);
console.log("auth obj: " + JSON.stringify(obj));

db.view('db/entries', {reduce: false}, function (err, res) {
	if (err) {
		console.dir("error " + err);
		return;
	}
	console.log( JSON.stringify(res.length) );

	for (var r in res) {
		var entry = res[r].value;	
		console.log( JSON.stringify(entry) );

		var merge_obj = {
			revisions: []
			, subcategories: []
		};
		//db.merge(entry._id, entry._rev, merge_obj, function (err, res_merge) {
		db.merge(entry._id, merge_obj, function (err, res_merge) {
			if (err) {
				console.dir("error on merge: " + JSON.stringify(err));
				return;
			}
			console.log( JSON.stringify(res_merge) );
	      	});
		break;
	}
});
