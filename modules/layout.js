var db;
var count_entries = 0;
var underscore = require('underscore');

exports.set_var = function(k, v) {
	if (k === "count_entries")
		count_entries = v;
}

exports.get_vars = function(navi_key, additional_vars) {
	var vars = {
		count_entries: count_entries
	};

	vars.navi = get_navi(navi_key);

	for (var i in additional_vars) {
		vars[i] = additional_vars[i];
	}

	//console.log(JSON.stringify(vars));
	//console.log(JSON.stringify(vars));

	return vars;
}

exports.init = function(d) {
	db = d;
	this.updateCounter();
}

exports.updateCounter = function() {
	db.view('db/entries', {reduce: false}, function (err, res) {
		if (err) {
			console.dir(err);
			return;
		}

		count_entries = res.length;
		//layout_vars.entries = res;
	});
}

function get_navi(k, req) {
	var navi = {
		  home: ""
		, entries_new: ""
		, entries_all: ""
		, feedback: ""
		, idee: ""
	};

	if (k === "entries_new")
		navi.entries_new = "active";
	else if (k === "entries_all")
		navi.entries_all = "active";
	else if (k === "feedback")
		navi.feedback = "active";
	else
		navi.home = "active";

	return navi;
}

/* prepare for frontend output */
exports.prepareDoc = function(doc) {
	//console.log(JSON.stringify(doc, null, "\t"));

	//doc.name = doc.name.replace("&amp;", "&");
	doc.name = underscore.unescape(doc.name);
	doc.uri = underscore.unescape(doc.uri);

	/* set the 'local' fields to "". otherwise the input fields
	in the edit/new entry mask will output 'undefined' */
	if (doc.street === undefined) doc.street = "";
	if (doc.zipcode === undefined) doc.zipcode = "";
	if (doc.city === undefined) doc.city = "";

	if (doc.description.length > 0)
		doc.description = underscore.unescape(doc.description);

	doc.name = doc.name.replace(" - ", " – ");
	doc.description = doc.description.replace(" - ", " – ");

	return doc;
}
