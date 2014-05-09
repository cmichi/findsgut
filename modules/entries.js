var util = require('util')
var nominatim = require('nominatim');
var badwords = require('./badwords.js')
var app, db, layout, cache, email, model, umkreissuche; 

exports.init = function(_app, _db, _layout, _cache, _email, _model, _umkreissuche) {
	app = _app;
	db = _db;
	cache = _cache;
	layout = _layout;
	email = _email;
	model = _model;
	umkreissuche = _umkreissuche;

	badwords.init(app, db, layout, cache, email);

	return;
}

exports.all = function(req, res) {
	cache.getEntries(function (res_entries) {
		var entries = res_entries;
		//var coords = 'var coords = {';
		var coords = [];

		for (var e in entries) {
			entries[e].value = layout.prepareDoc(entries[e].value);
			var doc = entries[e].value;

			doc.categories = parse(model.categories, doc.categories);
			doc.subcategories = parseSub(doc.subcategories);
			doc.classifications = parse(model.classifications, doc.classifications);

			entries[e].value = doc;

			if (doc.coords)
				coords.push({id: doc._id, coords: doc.coords});
				//coords += '"' + doc._id + '": [' + doc.coords + '],';
		}
		//coords += "}";
		//console.log(coords);

		entries = orderBy("created_at", entries);

		var params = {
			list: entries
			, entries_count: entries.length /* immediate update */
			, coords: coords

			/* default: show all */
			/* changing search semantic to semantic1, commenting this out
			, online: true
			, local: true
			, fair: true
			, bio: true
			, used: true
			, regional: true
			*/
		};

		res.render('entries/all', layout.get_vars('entries_all', params));
	});
}

exports.rummage = function(req, res) {
	res.render('entries/rummage', layout.get_vars('rummage', {
		  categories: model.categories
		, subcategories: model.subcategories
		, values: get_global_values()
		, count_categories: cache.getCountCategories()
		, count_subcategories: cache.getCountSubCategories()
	 }));
}

exports.get_new = function(req, res) {
	res.render('entries/new', layout.get_vars('entries_new', {
		  error_fields: get_error_fields()
		, errors: []
		, categories: model.categories
		, subcategories: model.subcategories
		, values: get_global_values()
	 }));
}

exports.post_new = function(req, res) {
	var validation_results = validate(req.body);
	var validator = validation_results.validator;
	var errors = validator.getErrors();

	if (errors != undefined && errors.length > 0) {
		console.log(errors);
		
		//console.log("\nvalues:");
		//console.log(JSON.stringify(validation_results.values));

		validation_results.values = layout.prepareDoc(validation_results.values);

		// render site again, show error note, show previously entered input
		var additional_params = {
			  errors: errors
			, previous_input: req.body
			, error_fields: validation_results.error_fields
			, categories: model.categories
			, subcategories: model.subcategories
			, values: validation_results.values
		};

		res.render('entries/new', layout.get_vars('entries_new', additional_params));

		return;
	} else {
		newEntry(res, req.body, validation_results)
	}
}

exports.edit = function(req, res) {
	//console.log(req.params.id);
	db.get(req.params.id, function (err, doc) {
		if (err || doc == undefined) {
			res.render('404', layout.get_vars('', { status: 404, missingurl: req.url }));
			return;
		}

		//console.log(JSON.stringify(doc, null, "\t"));

		for (var c in doc.categories) {
			doc["category_" + doc.categories[c]] = true;
		}
		for (var c in doc.subcategories) {
			doc["subcategory_" + doc.subcategories[c]] = true;
		}
		for (var c in doc.classifications) {
			doc[doc.classifications[c]] = true;
		}

		doc = layout.prepareDoc(doc);

		var additional_params = {
			  categories: model.categories
			, error_fields: []
			, subcategories: model.subcategories
			, values: doc
			, modifyExisting: true
		};

		res.render('entries/new', layout.get_vars('entries_new', additional_params));
	});
}

exports.saveEdit = function(req, res) {
	var validation_results = validate(req.body);
	var validator = validation_results.validator;
	var errors = validator.getErrors();

	//console.log( req.param('_id') );
	//res.render('404', layout.get_vars('', { status: 404, missingurl: req.url }));
	//return;

	if (errors != undefined && errors.length > 0) {
		console.log(errors);
		
		//console.log("\nvalues:");
		//console.log(JSON.stringify(validation_results.values));

		validation_results.values._id = req.param('_id');
		validation_results.values._rev = req.param('_rev');

		validation_results.values = layout.prepareDoc(validation_results.values);

		// render site again, show error note, show previously entered input
		var additional_params = {
			  errors: errors
			, previous_input: req.body
			, error_fields: validation_results.error_fields
			, categories: model.categories
			, subcategories: model.subcategories
			, values: validation_results.values
			, modifyExisting: true
		};

		res.render('entries/new', layout.get_vars('entries_new', additional_params));

		return;
	} else {
		db.get(req.param('_id'), req.param('_rev'), function(err, doc) {
			if (err) {
				layout.error(500, err, req, res, layout.get_vars('entries_all'));
				return;
			}

			saveEntry(req.param('_id'), req.param('_rev'), res, req.body, validation_results, doc);
		});
	}
}

function saveEntry(_id, _rev, res, body, validation_results, doc) {
	body = validation_results.values;

	// does the uri start with 'http://' or something similar?
	var patt = new RegExp(/^[A-Za-z]+:\/\//);
	if (!patt.test(body.uri))
		body.uri = 'http://' + body.uri;

	// save the "before-save" doc into the revisions array
	var revs;
	if (doc.revisions == undefined) revs = [];
	else revs = doc.revisions;

	delete doc.revisions;
	revs.push(doc);

	var merge_obj = {
		  type: "entry"
		, name: body.name
		, description: body.description
		, uri: body.uri
		, local: body.local
		, online: body.online
		, categories: validation_results.cats_chosen
		, subcategories: validation_results.subcats_chosen
		, classifications: validation_results.classifications_chosen
		, last_modified: (new Date().getTime())
		, revisions: revs
	};

	if (body.local) {
		merge_obj.city = body.city;
		merge_obj.street = body.street;
		merge_obj.zipcode = body.zipcode;
		merge_obj.country = "Germany";
	}

	//console.log(JSON.stringify(merge_obj, null, "\t"));
	db.merge(_id, merge_obj, function(err, res_updated) {
		if (err) {
			// show error note, render site with previous input
			// maybe it would be better to show the 500.jade? but it
			// would also be nasty for users to loose all their input
			// just because the db went offline for some secs
			validation_results.values._id = _id;
			validation_results.values._rev = _rev;

			validation_results.values = layout.prepareDoc(validation_results.values);

			var additional_params = {
				  "errors": ["Es gab einen Fehler beim Speichern des Eintrags."
					  + "Bitte versuche es in K&uuml;rze noch einmal."]
				, previous_input: body
				, error_fields: validation_results.error_fields
				, categories: model.categories
				, subcategories: model.subcategories
				, values: validation_results.values
				, modifyExisting: true
			};

			res.render('entries/new', layout.get_vars('entries_new', additional_params));
			//console.log(JSON.stringify(err));
		}

		cache.refresh();

		badwords.check(merge_obj, res_updated.id, "edited");

		res.redirect('/eintraege/' + res_updated.id + "?success=edit");
		return;
	});
}

exports.get = function(req, res) {
	var id = req.params.id;

	var success_creation = false;
	if (req.param("success") === "creation") 
		success_creation = true;

	var success_edit = false;
	if (req.param("success") === "edit") 
		success_edit = true;

	db.get(id, function (err, doc) {
		if (err || doc == undefined || doc.type !== "entry") {
			res.render('404', layout.get_vars('', { status: 404, missingurl: req.url }));
			return;
		}

		doc = layout.prepareDoc(doc);
		doc.description = doc.description.split("\r\n");

		doc.categories = parse(model.categories, doc.categories);
		doc.subcategories = parseSub(doc.subcategories);
		doc.classifications = parse(model.classifications, doc.classifications);
		//console.log(JSON.stringify(doc, null, "\t"));

		var additional_params = {
			  "doc": doc
			, "success_edit": success_edit
			, "success_creation": success_creation
		};

		var ps = layout.get_vars('entries_all', additional_params)

		// db will not yet be updated, but already show an
		// incremented counter 
		if (success_creation) 
			ps.count_entries = ps.count_entries + 1;

		res.render('entries/detail', ps);
	});
}

exports.getCategoryEntries = function(id, req, res, cb) {
	db.view("db/categories", {reduce: false, key: id}, function (err, docs) {
		if (err || docs == undefined) {
			res.render('404', layout.get_vars('', { status: 404, missingurl: req.url }));
			return;
		}
		
		cb(docs);
	});
}

exports.get_category = function(req, res) {
	this.getCategoryEntries(req.params.id, req, res, function(docs) {
		//console.log(JSON.stringify(docs, null, "\t"));
		for (var d in docs) {
			//console.log(docs[d].name);
			docs[d].value = layout.prepareDoc(docs[d].value);
			//doc.description = doc.description.split("\r\n");

			//doc.categories = parse(categories, doc.categories);
			//doc.subcategories = parseSub(doc.subcategories);
			//doc.classifications = parse(classifications, doc.classifications);
			//console.log(JSON.stringify(docs, null, "\t"));
			//console.log(JSON.stringify(docs[d], null, "\t"));
		}

		var title = model.getCategoryTitle(req.params.id);
		//if (model.categories[req.params.id])
			//title = model.categories[req.params.id];

		//else if (model.subcategories[req.params.id])
			//title = model.subcategories[req.params.id];

		var additional_params = {
			    "list": docs
			  , category: title
			  , searching: true
		};

		res.render('entries/search', layout.get_vars('rummage', additional_params));
	});
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
						arr.push(obj2);
				}
			}
		}
	}

	return arr;
}

function parse(all_categories, categories_arr) {
	/*
	var all_categories = [
	{
		key: "service"
		, value: "Dienstleistung"
	}, ... ];

	var categories_arr = [ 'service', ... ];
	*/

	var arr = [];
	for (var c0 in categories_arr) {
		for (var c1 in all_categories) {
			var obj = all_categories[c1];
			if (obj.key === categories_arr[c0])
				arr.push(obj);
		}
	}

	return arr;
}

function classified(entry, v) {
	for (var i in entry.classifications) {
		if (entry.classifications[i] === v)
			return true;
	}

	return false;
}

/* the search semantic should be: everything is shown, nothing is clicked.
everything that is clicked is a constraint on the search and means the
results should only contain products with this feature */
exports.search = function(req, res) {
	var ajax = false;
	if (req.param("ajax") === "true") ajax = true;
	
	var online = false;
	if (req.param("online") === "on") online = true;

	var local = false;
	if (req.param("local") === "on") local = true;

	var bio = false;
	if (req.param("bio") === "on") bio = true;

	var fair = false;
	if (req.param("fair") === "on") fair = true;

	var used = false;
	if (req.param("used") === "on") bio = used;

	var regional = false;
	if (req.param("regional") === "on") regional = true;

	var searching = false;
	if (req.param("searching") === "true") searching = true;

	var umkreissuche_active = false;
	var distance = 50;
	var umkreis = "";
	if (req.param("umkreis") && req.param("umkreis").length > 0) {
		//console.log("umkreis active 1");
		umkreissuche_active = true;
		umkreis = req.param("umkreis");

		if (req.param("distance"))
			distance = req.param("distance");
	}

	//var me_coords = ["48.4004841", "9.9885268"];

	var term = db.prepare(req.param("term"))
	var term_original = term; /* for the view */
	term = term.toLowerCase();

	var additional_params = {
		  term: term_original
		, online: online
		, local: local
		, fair: fair
		, used: used
		, bio: bio
		, regional: regional
		, ajax: ajax
		, umkreis: umkreis
		, distance: distance
		, umkreissuche_active: umkreissuche_active
		, searching: searching
	};

	if (term.length === 0 && !online && !local && !bio && !fair && !used && !regional && !umkreissuche_active) {
		additional_params.list = cache.getEntries();
		if (additional_params.list.length === 1)
			additional_params.show_last = true;

		var coords = [];
		for (var l in additional_params.list) {
			var doc = additional_params.list[l].value;

			doc.categories = parse(model.categories, doc.categories);
			doc.subcategories = parseSub(doc.subcategories);
			doc.classifications = parse(model.classifications, doc.classifications);

			additional_params.list[l].value = doc;

			if (doc.coords)
				coords.push({id: doc._id, coords: doc.coords});
		}
		additional_params.coords = coords;

		if (ajax === true) {
			if (req.param("jumbotron") === "true")
				res.render('entries/ajax-search-jumbotron', layout.get_vars('entries_all', additional_params));
			else
				res.render('entries/ajax-list', layout.get_vars('entries_all', additional_params));
		} else {
			res.render('entries/search', layout.get_vars('entries_all', additional_params));
		}
		return;
	}

	var opts = {
		  startkey: term
		, endkey: term + '\u9999'
		, reduce: false
	};

	if (umkreissuche_active && umkreis.length > 2) {
		console.log("executing umkreissuche");
		(function(addr, 
			  opts, online, local, bio, used, fair, regional, umkreissuche_active, 
			  distance, req, res, additional_params, ajax) {

			nominatim.search({ q: addr }, function(err, _opts, results) {
				//console.log("searched for " + addr);
				//console.log(JSON.stringify(results[0], null, "\t"));

				me_coords = [ results[0].lat, results[0].lon ];
				//console.log(JSON.stringify(me_coords, null, "\t"));

				executeSearch(opts, online, local, bio, used, fair, regional, umkreissuche_active, 
					me_coords, distance, req, res, additional_params, ajax);
			});
		})(umkreis, opts, online, local, bio, used, fair, regional, umkreissuche_active, 
		   distance, req, res, additional_params, ajax);
	} else {
		executeSearch(opts, online, local, bio, used, fair, regional, umkreissuche_active, 
			[], distance, req, res, additional_params, ajax);
	}
}

function executeSearch(opts, online, local, bio, used, fair, regional, umkreissuche_active, 
		me_coords, distance, req, res, additional_params, ajax) {


	//db.view('db/search', opts, function (err, res_search) {
(function (opts, online, local, bio, used, fair, regional, umkreissuche_active, 
		me_coords, distance, req, res, additional_params, ajax) {

		//console.log(umkreissuche_active + " 1");
	cache.searchTerm('db/search', opts, function (err, res_search) {
		if (err) {
			layout.error(500, err, req, res, layout.get_vars('entries_all'));
			return;
		}
		//console.log(res_search.length);

		//var searchresults = {};
		var searchresults = [];
		//console.log(JSON.stringify(additional_params));
		//console.log(JSON.stringify(res_search));

		if (res_search && res_search.length > 0) {
			for (var i in res_search) {
				var r = res_search[i].value;
				var show = true;

				// search semantic 1
				if (online === true && r.online === false)
					show = false;

				if (local === true && r.local === false)
					show = false;

				if (bio === true && classified(r, "bio") === false)
					show = false;

				if (used === true && classified(r, "used") === false)
					show = false;

				if (fair === true && classified(r, "fair") === false)
					show = false;

				if (regional === true && classified(r, "regional") === false)
					show = false;

				if (umkreissuche_active) {
					//console.log("umkreissuche_active");
					if (r.coords) {
						if (!umkreissuche.isWithinDistance(me_coords, distance, r.coords))
							show = false;
					} else {
						show = false;
					}
				}

				if (show === true) {
					/* definitely has to be optimized */
					var exists = false;
					for (var j in searchresults) {
						if (searchresults[j].value._id === res_search[i].value._id) {
							exists = true;
							break;
						}
					}
					if (exists === false) {
						res_search[i].value = layout.prepareDoc(res_search[i].value);
						searchresults.push(res_search[i]);
					}
				}

				searchresults = orderBy("created_at", searchresults);

				//console.log(searchresults.length + "!!");
				//console.log(JSON.stringify(res_search, null, "\t"))
				//searchresults[res_search[i].value._id] = res_search[i].value;

			}
			additional_params.list = searchresults;
			if (searchresults.length === 1)
				additional_params.show_last = true;

			var coords = [];
			//console.log(searchresults.length + "!");
			for (var i in searchresults) {
				var doc = searchresults[i].value;

				doc.categories = parse(model.categories, doc.categories);
				doc.subcategories = parseSub(doc.subcategories);
				doc.classifications = parse(model.classifications, doc.classifications);

				searchresults[i].value = doc;

				if (doc.coords)
					coords.push({id: doc._id, coords: doc.coords});
			}
			additional_params.coords = coords;
		} else {
			additional_params.list = undefined;
		}


		//console.log("searchres: \n" + JSON.stringify(additional_params.list));
		//console.log("")
		//console.log(ajax)
		if (ajax === true) {
			if (req.param("jumbotron") === "true")
				res.render('entries/ajax-search-jumbotron', layout.get_vars('entries_all', additional_params));
			else
				res.render('entries/ajax-list', layout.get_vars('entries_all', additional_params));
			return;
		} else {
			res.render('entries/search', layout.get_vars('entries_all', additional_params));
			return;
		}
	})
	})(opts, online, local, bio, used, fair, regional, umkreissuche_active, 
	   me_coords, distance, req, res, additional_params, ajax);
}

function orderBy(key, arr) {
	function compare(a,b) {
		if (a.value[key] < b.value[key])
			return 1;
		if (a.value[key] > b.value[key])
			return -1;
		return 0;
	}
	return arr.sort(compare);
}

function newEntry(res, body, validation_results) {
	body = validation_results.values;

	// does the uri start with 'http://' or something similar?
	var patt = new RegExp(/^[A-Za-z]+:\/\//);
	if (!patt.test(body.uri))
		body.uri = 'http://' + body.uri;

	var new_obj = {
		  type: "entry"
		, name: body.name
		, description: body.description
		, uri: body.uri
		, local: body.local
		, online: body.online
		, categories: validation_results.cats_chosen
		, subcategories: validation_results.subcats_chosen
		, classifications: validation_results.classifications_chosen
		, created_at: (new Date().getTime())
	};

	if (body.local) {
		new_obj.city = body.city;
		new_obj.zipcode = body.zipcode;
		new_obj.street = body.street;
		new_obj.country = "Germany";
	}

	//console.log(JSON.stringify(new_obj));
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
				, categories: model.categories
				, subcategories: model.subcategories
				, values: validation_results.values
			};

			res.render('entries/new', layout.get_vars('entries_new', additional_params));
			console.log(JSON.stringify(err));
		}

		//console.log(JSON.stringify(res_created));

		badwords.check(new_obj, res_created.id, "created");

		cache.refresh();

		res.redirect('/eintraege/' + res_created.id + "?success=creation");
		return;
	});
}

/* the validation is a bit tricky. see the `doc/new_entry.pdf` for
further documentation. */
function validate(body) {
	//console.log(JSON.stringify(body));
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
	values.name = name.substr(0, 100);


	var description = db.prepare(body.description);
	/* description is optional from now on. 
	chk_cnt = chk._errors.length;
	var chk = validator.check(description, "Bitte gib eine Beschreibung an.").notEmpty();
	if (chk._errors.length > chk_cnt)
		error_fields.description = "has-error";
	*/
	values.description = description.substr(0, 500);

	chk_cnt = chk._errors.length;

	var address_given = (body.city != null && body.city.length > 0) && 
		(body.zipcode != null && body.zipcode.length > 0) &&
		(body.street != null && body.street.length > 0);
	if (body.local === "on" || address_given) {
		var city = db.prepare(body.city)
		var zipcode = db.prepare(body.zipcode)
		var street = db.prepare(body.street)

		var chk_city = validator.check(city, "Bei lokalen Angeboten ist die Angabe einer Adresse verpflichtend.").notEmpty();
		var chk_street = validator.check(street, "Bei lokalen Angeboten ist die Angabe einer Adresse verpflichtend.").notEmpty();
		var chk_zipcode = validator.check(zipcode, "Bei lokalen Angeboten ist die Angabe einer Adresse verpflichtend.").notEmpty();

		if (chk_city._errors.length > chk_cnt)
			error_fields.city = "has-error";
		if (chk_street._errors.length > chk_cnt)
			error_fields.street = "has-error";
		if (chk_zipcode._errors.length > chk_cnt)
			error_fields.zipcode = "has-error";

		values.street = street;
		values.city = city;
		values.zipcode = zipcode;
		//console.log(JSON.stringify(values));

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
		values.uri = uri.substr(0, 300);
	}
	/* if this is only an "online" entry, we don't save a "real" address.
	the interface should strip the inputs then (using JavaScript). But 
	to be sure we strip it here as well */
	if (body.online === "on" && body.local !== "on") {
		delete values.street;
		delete values.zipcode;
		delete values.city;
	}

	chk_cnt = chk._errors.length;

	if (body.online !== "on" && body.local !== "on") {
		validator.error("Bitte gib an, ob das Angebot online oder lokal ist.");
		error_fields.online_local = "has-error";
	}
	if (body.online === "on") values.online = true;
	else values.online = false;

	if (body.local === "on") values.local = true;
	else values.local = false;

	chk_cnt = chk._errors.length;

	var chk = validator.check(body.agb, "Bitte akzeptiere die AGB.").equals("on");
	if (chk._errors.length > chk_cnt)
		error_fields.agb = "has-error";
	else
		values.agb = true;

	chk_cnt = chk._errors.length;

	/* categories */
	var cats_chosen = [];
	for (var c in model.categories) {
		if (body["category_" + model.categories[c].key] === "on")
			cats_chosen.push(model.categories[c].key)
	}
	if (cats_chosen.length === 0) {
		validator.error("Bitte wähle eine Kategorie.");
		error_fields.categories = "has-error";
	} else {
		for (var c in cats_chosen) 
			values["category_" + cats_chosen[c]] = true;
	}

	/* subcategories */
	var subcats_chosen = [];
	for (var sc in model.subcategories.products) {
		for (var scs in model.subcategories.products[sc].list) {
			var subc = model.subcategories.products[sc].list[scs];
			if (body["subcategory_" + subc.key] === "on")
				subcats_chosen.push(subc.key)
		}
	}
	for (var sc in model.subcategories.services) {
		for (var scs in model.subcategories.services[sc].list) {
			var subc = model.subcategories.services[sc].list[scs];
			if (body["subcategory_" + subc.key] === "on")
				subcats_chosen.push(subc.key)
		}
	}
	//console.log("subcats chosen");
	//console.log(JSON.stringify(subcats_chosen));
	//console.log("\n");

	// Sonderfall: Wenn nur Hauptkategorie 'Sonstiges' ausgewaehlt
	// wurde muss keine Unterkategorie gewaehlt werden.
	if (subcats_chosen.length === 0 && cats_chosen[0] !== "service") {
		validator.error("Bitte wähle eine Unterkategorie.");
		error_fields.subcategories = "has-error";
	} else {
		for (var sc in subcats_chosen) 
			values["subcategory_" + subcats_chosen[sc]] = true;
	}

	var classifications_chosen = [];
	var classifications = ["fair", "bio", "regional", "used"];
	for (var c in model.classifications) {
		if (body[model.classifications[c].key] === "on")
			classifications_chosen.push(model.classifications[c].key);
	}

	console.log(JSON.stringify(body, null, "\t"));
	console.log(JSON.stringify(classifications_chosen, null, "\t"));

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
		, subcats_chosen: subcats_chosen
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
		, street: ""
		, city: ""
		, zipcode: ""
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
		, street: ""
		, city: ""
		, zipcode: ""
		, description: ""
		, agb: false
		, bio: false
		, used: false
		, regional: false
		, fair: false
	};
}

