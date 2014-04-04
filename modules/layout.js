var db;
var cache;
var email;
var underscore = require('underscore');

exports.get_vars = function(navi_key, additional_vars) {
	var vars = {
		count_entries: cache.getEntries().length
	};

	vars.navi = get_navi(navi_key);

	for (var i in additional_vars) {
		vars[i] = additional_vars[i];
	}

	//console.log(JSON.stringify(vars));
	//console.log(JSON.stringify(vars));

	return vars;
}

exports.init = function(d, e, c) {
	db = d;
	email = e;
	cache = c;
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

	if (doc.description && doc.description.length > 0) {
		doc.description = underscore.unescape(doc.description);
		doc.description = doc.description.replace(" - ", " – ");
	}

	doc.name = doc.name.replace(" - ", " – ");

	return doc;
}


exports.error = function(code, err, req, res, params) {
	if (code === 500) {
		console.dir(err);
		email.error(code, err, req, res);
		if (res) res.render('500', params);
	}
}


