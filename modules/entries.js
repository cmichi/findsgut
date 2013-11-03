var app, db, layout, categories = [];
var util = require('util')

exports.init = function(_app, _db, _layout) {
	app = _app;
	db = _db;
	layout = _layout;

	db.view('db/categories', {reduce: false}, function (err, res) {
		if (err) {
			console.dir(err);
			return;
		}

		if (res.length > 0)
			categories = res
	});
	return;
}

exports.all = function(req, res) {
	db.view('db/entries', {reduce: false}, function (err, res_entries) {
		if (err) {
			console.dir(err);
			res.render('500', layout.get_vars('entries_all'));

			return;
		}

		var entries = res_entries;
		var params = {
			list: entries
			, entries_count: entries.length /* immediate update */
			, online: true
			, local: true
		};

		console.log( JSON.stringify(entries) );
		layout.set_var("count_entries", entries.length);

		res.render('entries/all', layout.get_vars('entries_all', params));
	});
}

exports.get_new = function(req, res) {
	res.render('entries/new', layout.get_vars('entries_new', {
		  error_fields: get_error_fields()
		, errors: []
		, categories: categories
		, values: get_global_values()
	 }));
}

exports.post_new = function(req, res) {
	var validation_results = validate(req.body);
	var validator = validation_results.validator;
	var errors = validator.getErrors();

	if (errors != undefined && errors.length > 0) {
		console.log(errors);

		// render site again, show error note, show previously entered input
		var additional_params = {
			  errors: errors
			, previous_input: req.body
			, error_fields: validation_results.error_fields
			, categories: categories
			, values: validation_results.values
		};

		res.render('entries/new', layout.get_vars('entries_new', additional_params));

		return;
	} else {
		newEntry(res, req.body, validation_results)
	}
}

exports.get = function(req, res) {
	var id = req.params.id;

	db.get(id, function (err, doc) {
		if (err || doc == undefined) {
			res.render('404', layout.get_vars('', { status: 404, missingurl: req.url }));
			return;
		}

		console.log(doc);
		var additional_params = {"doc": doc};
		res.render('entries/detail', layout.get_vars('entries_all', additional_params));
	});
}

exports.search = function(req, res) {
	var ajax = false;
	if (req.param("ajax") === "true") ajax = true;
	console.log(ajax + "..ajax");

	var online = false;
	if (req.param("online") === "on") online = true;

	var local = false;
	if (req.param("lokal") === "on") local = true;

	var term = db.prepare(req.param("term"))
	var term_original = term; /* for the view */
	term = term.toLowerCase();

	console.log(term + "!!");

	/*
	if (term.length === 0) {
		//res.redirect('/eintraege/alle');
		res.render('entries/search', layout.get_vars('entries_all', {term: "", searchresults: undefined}));
		return;
	}
	*/

	var opts = {
		startkey: term
		, endkey: term + '\u9999'
		, reduce: false
	};

	db.view('db/search', opts, function (err, res_search) {
		if (err) {
			res.render('500', layout.get_vars('entries_all'));
			console.log("err");
			console.log(JSON.stringify(err));
			return
		  }

		//var searchresults = {};
		var searchresults = [];
		var additional_params = {
			term: term_original
			, online: online
			, local: local
			, ajax: ajax
		};
		console.log(JSON.stringify(additional_params));

		//console.log(res_search);
		if (res_search && res_search.length > 0) {
			/* definitiely has to be optimized */
			for (var i in res_search) {
				if (res_search[i].value.online === online || res_search[i].value.local === local) {
					var exists = false;
					for (var j in searchresults) {
						if (searchresults[j].value._id === res_search[i].value._id) {
							exists = true;
							break;
						}
					}
					if (exists === false)
						searchresults.push(res_search[i])
				}
				//searchresults[res_search[i].value._id] = res_search[i].value;
			}
			additional_params.list = searchresults;
		} else {
			additional_params.list = undefined;
		}

		//console.log("searchres: \n" + JSON.stringify(searchresults));
		//console.log("")
		if (ajax === true)
			res.render('entries/ajax-list', layout.get_vars('entries_all', additional_params));
		else
			res.render('entries/search', layout.get_vars('entries_all', additional_params));
	});
}

function newEntry(res, body, validation_results) {
	body = validation_results.values;
	var new_obj = {
		  type: "entry"
		, name: body.name
		, description: body.description
		, address: body.address
		, uri: body.uri
		, local: body.local
		, online: body.online
		, categories: validation_results.cats_chosen
		, classifications: validation_results.classifications_chosen
		, created_at: (new Date().getTime())
	};

	console.log(JSON.stringify(new_obj));
	db.save(new_obj, function(err, res_created) {
		if (err) {
			// show error note, render site with previous input
			// maybe it would be better to show the 500.jade? but it
			// would also be nasty for users to loose all their input
			// just because the db went offline for some secs
			var additional_params = {
				  "errors": ["Es gab einen Fehler beim Speichern des Eintrags."
					  + "Bitte versuche es in K&uuml;rze noch einmal."]
				, previous_input: body
				, error_fields: validation_results.error_fields
				, categories: categories
				, values: validation_results.values
			};

			res.render('entries/new', layout.get_vars('entries_new', additional_params));
			console.log(JSON.stringify(err));
		}

		console.log(JSON.stringify(res_created));

		res.redirect('/eintraege/' + res_created.id);
		return;
	});
}

/* the validation is a bit tricky. see the `doc/new_entry.pdf` for
further documentation. */
function validate(body) {
	console.log(JSON.stringify(body));
	var Validator = require('validator').Validator;

	Validator.prototype.error = function (msg) {
		this._errors.push(msg);
		return this;
	}

	Validator.prototype.getErrors = function () {
		return this._errors;
	}

	var validator = new Validator();
	var check = validator.check;
	var values = get_global_values();
	var error_fields = get_error_fields();
	
	var name = db.prepare(body.name)
	var chk_cnt = 0;
	var chk = validator.check(name, "Bitte gib einen Namen an.").notEmpty();
	if (chk._errors.length > chk_cnt)
		error_fields.name = "has-error";
	values.name = name;

	chk_cnt = chk._errors.length;

	var description = db.prepare(body.description)
	var chk = validator.check(description, "Bitte gib eine Beschreibung an.").notEmpty();
	if (chk._errors.length > chk_cnt)
		error_fields.description = "has-error";

	values.description = description;

	chk_cnt = chk._errors.length;

	if (body.local === "on" || (body.address != null && body.address.length > 0)) {
		var address = db.prepare(body.address)
		var chk = validator.check(address, "Bei lokalen Angeboten ist die Angabe einer Adresse verpflichtend.").notEmpty();
		if (chk._errors.length > chk_cnt)
			error_fields.address = "has-error";

		values.address = address;
		console.log(JSON.stringify(values));

		chk_cnt = chk._errors.length;
	}

	var uri = db.prepare(body.uri);
	if (body.online === "on" && uri === "") {
		validator.error("Bei Online-Angeboten ist die Angabe einer Internet-Adresse verpflichtend.");
	}
	if (uri != "") {
		var chk = validator.check(body.uri, "Bitte checke die Internetadresse.").isUrl();
		if (chk._errors.length > chk_cnt)
			error_fields.uri = "has-error";
		values.uri = uri;
	}
	/* if this is only an "online" entry, we don't save a "real" address.
	the interface should strip the inputs then (using JavaScript). But 
	to be sure we strip it here as well */
	if (body.online === "on" && body.local !== "on") delete values.address;

	chk_cnt = chk._errors.length;

	if (body.online !== "on" && body.local !== "on") {
		validator.error("Bitte gib an, ob das Angebot online oder lokal ist.");
		error_fields.online_local = "has-error";
	}
	if (body.online === "on") values.online = true;
	if (body.local === "on") values.local = true;

	chk_cnt = chk._errors.length;

	var chk = validator.check(body.agb, "Bitte akzeptiere die AGB.").equals("on");
	if (chk._errors.length > chk_cnt)
		error_fields.agb = "has-error";
	else
		values.agb = true;

	chk_cnt = chk._errors.length;

	var cats_chosen = [];
	for (var c in categories) {
		if (body["category_" + categories[c].value.key] === "on")
			cats_chosen.push(categories[c].value.key)
	}
	if (cats_chosen.length === 0) {
		validator.error("Bitte wählen eine Kategorie.");
		error_fields.categories = "has-error";
	} else {
		for (var c in cats_chosen) 
			values["category_" + cats_chosen[c]] = true;
	}

	var classifications_chosen = [];
	var classifications = ["fair", "bio", "regional"];
	for (var c in classifications) {
		if (body[classifications[c]] === "on")
			classifications_chosen.push(classifications[c])
	}
	if (classifications_chosen.length === 0) {
		validator.error("Bitte ordne das Angebot ein.");
		error_fields.classifications = "has-error";
	} else {
		for (var c in classifications_chosen) 
			values[classifications_chosen[c]] = true;
	}

	return {
		validator: validator
		, error_fields: error_fields
		, cats_chosen: cats_chosen
		, classifications_chosen: classifications_chosen
		, values: values
	};
} 

function get_error_fields() {
	return {
		  name: ""
		, uri: ""
		, categories: ""
		, classifications: ""
		, online_local: ""
		, address: ""
		, description: ""
		, agb: ""
	};
}

function get_global_values() {
	return  {
		  name: ""
		, uri: ""
		, classifications: ""
		, online_local: ""
		, address: ""
		, description: ""
		, agb: false
		, bio: false
		, regional: false
		, fair: false
	};
}
