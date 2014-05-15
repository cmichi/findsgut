var db;
var cache;
var email;
var config;
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

exports.init = function(d, e, c, _c) {
	db = d;
	email = e;
	cache = c;
	config = _c;
}

function get_navi(k, req) {
	var navi = {
		  home: ""
		, entries_new: ""
		, entries_all: ""
		, feedback: ""
		, rummage: ""
		, idee: ""
	};

	if (k === "entries_new")
		navi.entries_new = "active";
	else if (k === "entries_all")
		navi.entries_all = "active";
	else if (k === "feedback")
		navi.feedback = "active";
	else if (k === "rummage")
		navi.rummage = "active";
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
	if (doc.uri === "http://") doc.uri = "";

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

		console.trace("trace:");

		if (err) {
			console.log("stack:");
			console.log(err.stack);
		}

		email.error(code, err, req, res);
		if (res) res.render('500', params);
	}
}

exports.messageboard = function(req, res) {
	var name = db.prepare(req.param('inputName'));
	var mail = db.prepare(req.param('inputEmail'));
	var msg = db.prepare(req.param('inputMsg'));

	if (name.length === 0 || msg.length === 0) {
		res.redirect("/feedback#anregungen");
		return;
	}

	name = name.replace(" - ", " – ");
	msg = msg.replace(" - ", " – ");

	var new_obj = {
		type: "messageboard"
		, name: name
		, msg: msg
		, mail: mail
		, ts: (new Date()).getTime()
	};

	email.send({
		to           : config.mail.feedback_to,
		subject      : '[findsgut] Anregungsformular',
		from         : config.mail.feedback_to,
		text         : "" + JSON.stringify(new_obj, null, "\t")
	}, function(err, m){
		console.log(err || m);
		return;
	});

	db.save(new_obj, function(err, res_created) {
		if (err) {
			layout.error(500, err, req, res, layout.get_vars('entries_all'));
			return;
		}

		(function(res) {
			cache.refreshMsgs(function() {
				res.redirect("/feedback?success=true#anregungen");
				return;

			});
		})(res);

		//console.log(JSON.stringify(res_created));
	});

}
