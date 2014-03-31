var util = require('util')
var underscore = require('underscore');
var app, db, layout; 

var classifications = [
	{
		key: "bio"
		, value: "Bio"
	},
	{
		key: "fair"
		, value: "Fair"
	},
	{
		key: "regional"
		, value: "Regional"
	},
	{
		key: "used"
		, value: "Gebraucht"
	}
];
var categories = [
	{
		key: "product"
		, value: "Produkt"
	}
	, {
		key: "service"
		, value: "Dienstleistung"
	}
];
var subcategories = {
	products: [
		{
			title: "Büro & Schreibwaren"
			, list: [
				{
					key: "schreibwaren"
					, value: "Schreibwaren"
				}
				, {
					key: "bastelbedarf"
					, value: "Bastelbedarf"
				}
			]
		}
		, {
			title: "Haus & Garten"
			, list: [
				{
					key: "moebel"
					, value: "Möbel"
				}
				, {
					key: "kueche_bad"
					, value: "Küche & Bad"
				}
				, {
					key: "werkzeug_zubehoer"
					, value: "Werkzeug & Zubehoer"
				}
				, {
					key: "baumaterialien_farbe"
					, value: "Baumaterialien & Farbe"
				}
				, {
					key: "pflanzen"
					, value: "Pflanzen"
				}
				, {
					key: "tierbedarf"
					, value: "Tierbedarf"
				}
				, {
					key: "dekoration"
					, value: "Dekoration"
				}
			]
		}
		
		, {
			title: "Elektronik"
			, list: [
				{
					key: "computer"
					, value: "Computer"
				}
				, {
					key: "foto_video_audio_tv"
					, value: "Foto, Video, Audio, TV"
				}
				, {
					key: "handy_kommunikation"
					, value: "Handy & Kommunikation"
				}
			]
		}
		, {
			title: "Drogerie"
			, list: [
				{
					key: "schoenheit"
					, value: "Schönheit"
				}
				, {
					key: "wellness_gesundheit"
					, value: "Wellnes & Gesundheit"
				}
				, {
					key: "hygiene"
					, value: "Hygiene"
				}
				, {
					key: "waschen_reinigen"
					, value: "Waschen & Reinigen"
				}
				, {
					key: "haushalt"
					, value: "Haushalt"
				}
			]
		}
		, {
			title: "Mode"
			, list: [
				{
					key: "damenmode"
					, value: "Damenmode"
				}
				, {
					key: "herrenmode"
					, value: "Herrenmode"
				}
				, {
					key: "kindermode"
					, value: "Kindermode"
				}
				, {
					key: "accessoires"
					, value: "Accessoires"
				}
				, {
					key: "schmuck"
					, value: "Schmuck"
				}
				, {
					key: "schuhe"
					, value: "Schuhe"
				}
			]
		}
		, {
			title: "Lebensmittel"
			, list: [
				{
					key: "brot_backwaren"
					, value: "Brot & Backwaren"
				}
				, {
					key: "milchprodukte"
					, value: "Milchprodukte"
				}
				, {
					key: "obst"
					, value: "Obst"
				}
				, {
					key: "gemuese"
					, value: "Gemüse"
				}
				, {
					key: "getraenke"
					, value: "Getränke"
				}
				, {
					key: "gewuerze"
					, value: "Gewürze"
				}
				, {
					key: "brotaufstriche"
					, value: "Brotaufstriche"
				}
				, {
					key: "suesses_salziges"
					, value: "Süßes & Salziges"
				}
				, {
					key: "fleischersatz_tofu"
					, value: "Fleischersatz & Tofu"
				}
				, {
					key: "eier"
					, value: "Eier"
				}
				, {
					key: "oele_fette"
					, value: "Öle & Fette"
				}
				, {
					key: "suppen_soszen"
					, value: "Suppen & Soßen"
				}
				, {
					key: "nahrungsergaenzungsmittel"
					, value: "Nahrungsergänzungsmittel"
				}
				, {
					key: "reis_huelsenfruechte"
					, value: "Reis & Hülsenfrüchte"
				}
				, {
					key: "wurst_fleisch_fisch"
					, value: "Wurst & Fleisch & Fisch"
				}
				, {
					key: "getreideprodukte"
					, value: "Getreideprodukte"
				}
				, {
					key: "backen_dessert"
					, value: "Backen & Dessert"
				}
				, {
					key: "fertigprodukte_konserven"
					, value: "Fertigprodukte & Konserven"
				}
			]
		}
		, {
			title: "Baby & Kind"
			, list: [
				{
					key: "kleidung"
					, value: "Kleidung"
				}
				, {
					key: "zubehoer"
					, value: "Zubehör"
				}
				, {
					key: "hygiene"
					, value: "Hygiene"
				}
				, {
					key: "spielzeug"
					, value: "Spielzeug"
				}
				, {
					key: "nahrung"
					, value: "Nahrung"
				}
			]
		}
		, {
			title: "Sonstiges"
			, list: [
				{
					key: "sonstige"
					, value: "Sonstiges"
				}
			]
		}
	]
	, services: [
		{
			title: ""
			, list: [
				{
					key: "gastronomie"
					, value: "Gastronomie"
				}
				, {
					key: "sonstiges"
					, value: "Sonstiges"
				}
			]
		}
	]
};

exports.init = function(_app, _db, _layout) {
	app = _app;
	db = _db;
	layout = _layout;

	return;
}

exports.all = function(req, res) {
	this.search(req, res);
	return;

	db.view('db/entries', {reduce: false}, function (err, res_entries) {
		if (err) {
			console.dir(err);
			res.render('500', layout.get_vars('entries_all'));

			return;
		}

		var entries = res_entries;

		for (var e in entries) 
			entries[e].value = prepareDoc(entries[e].value);

		entries = orderBy("created_at", entries);

		var params = {
			list: entries
			, entries_count: entries.length /* immediate update */

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

		layout.set_var("count_entries", entries.length);

		res.render('entries/all', layout.get_vars('entries_all', params));
	});
}

exports.get_new = function(req, res) {
	res.render('entries/new', layout.get_vars('entries_new', {
		  error_fields: get_error_fields()
		, errors: []
		, categories: categories
		, subcategories: subcategories
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

		validation_results.values = prepareDoc(validation_results.values);

		// render site again, show error note, show previously entered input
		var additional_params = {
			  errors: errors
			, previous_input: req.body
			, error_fields: validation_results.error_fields
			, categories: categories
			, subcategories: subcategories
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

		doc = prepareDoc(doc);
		doc.description = doc.description.split("\r\n");

		var additional_params = {
			  categories: categories
			, error_fields: []
			, subcategories: subcategories
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

		validation_results.values = prepareDoc(validation_results.values);

		// render site again, show error note, show previously entered input
		var additional_params = {
			  errors: errors
			, previous_input: req.body
			, error_fields: validation_results.error_fields
			, categories: categories
			, subcategories: subcategories
			, values: validation_results.values
			, modifyExisting: true
		};

		res.render('entries/new', layout.get_vars('entries_new', additional_params));

		return;
	} else {
		saveEntry(req.param('_id'), req.param('_rev'), res, req.body, validation_results)
	}
}

function saveEntry(_id, _rev, res, body, validation_results) {
	body = validation_results.values;

	// does the uri start with 'http://' or something similar?
	var patt = new RegExp(/^[A-Za-z]+:\/\//);
	if (!patt.test(body.uri))
		body.uri = 'http://' + body.uri;

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

			validation_results.values = prepareDoc(validation_results.values);

			var additional_params = {
				  "errors": ["Es gab einen Fehler beim Speichern des Eintrags."
					  + "Bitte versuche es in K&uuml;rze noch einmal."]
				, previous_input: body
				, error_fields: validation_results.error_fields
				, categories: categories
				, subcategories: subcategories
				, values: validation_results.values
				, modifyExisting: true
			};

			res.render('entries/new', layout.get_vars('entries_new', additional_params));
			//console.log(JSON.stringify(err));
		}

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
		if (err || doc == undefined) {
			res.render('404', layout.get_vars('', { status: 404, missingurl: req.url }));
			return;
		}

		//console.log(doc);
		doc = prepareDoc(doc);
		doc.description = doc.description.split("\r\n");

		doc.categories = parse(categories, doc.categories);
		doc.classifications = parse(classifications, doc.classifications);

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

/* prepare for frontend output */
function prepareDoc(doc) {
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

	var term = db.prepare(req.param("term"))
	var term_original = term; /* for the view */
	term = term.toLowerCase();

	//console.log(term + "!!");

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
			, fair: fair
			, used: used
			, bio: bio
			, regional: regional
			, ajax: ajax
		};
		//console.log(JSON.stringify(additional_params));

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


/*
				//if (online === true && r.online === false || online === false && r.online === true)
				if (online === false && r.online === true)
					show = false;

				//if (local === true && r.local === false || local === false && r.local === true)
				if (local === false && r.local === true)
					show = false;

				//if (bio === true && classified(r, "bio") === false || bio === false && classified(r, "bio") === true)
				if (bio === false && classified(r, "bio") === true)
					show = false;

				if (used === false && classified(r, "used") === true)
					show = false;

				//if (fair === true && classified(r, "fair") === false || fair === false && classified(r, "fair") === true)
				if (fair === false && classified(r, "fair") === true)
					show = false;

				//if (regional === true && classified(r, "regional") === false || regional === false && classified(r, "regional") === true)
				if (regional === false && classified(r, "regional") === true)
					show = false;
				*/

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
						res_search[i].value = prepareDoc(res_search[i].value);
						searchresults.push(res_search[i]);
					}
				}

				searchresults = orderBy("created_at", searchresults);
				//console.log(JSON.stringify(res_search, null, "\t"))

				//searchresults[res_search[i].value._id] = res_search[i].value;

			}
			additional_params.list = searchresults;
			if (searchresults.length === 1)
				additional_params.show_last = true;
		} else {
			additional_params.list = undefined;
		}

		//console.log("searchres: \n" + JSON.stringify(additional_params.list));
		//console.log("")
		if (ajax === true) {
			if (req.param("jumbotron") === "true")
				res.render('entries/ajax-search-jumbotron', layout.get_vars('entries_all', additional_params));
			else
				res.render('entries/ajax-list', layout.get_vars('entries_all', additional_params));
		} else {
			res.render('entries/search', layout.get_vars('entries_all', additional_params));
		}
	});
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
				, categories: categories
				, subcategories: subcategories
				, values: validation_results.values
			};

			res.render('entries/new', layout.get_vars('entries_new', additional_params));
			console.log(JSON.stringify(err));
		}

		//console.log(JSON.stringify(res_created));

		layout.updateCounter();

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
	values.description = description.substr(0, 100);

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
	for (var c in categories) {
		if (body["category_" + categories[c].key] === "on")
			cats_chosen.push(categories[c].key)
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
	for (var sc in subcategories.products) {
		for (var scs in subcategories.products[sc].list) {
			var subc = subcategories.products[sc].list[scs];
			if (body["subcategory_" + subc.key] === "on")
				subcats_chosen.push(subc.key)
		}
	}
	for (var sc in subcategories.services) {
		for (var scs in subcategories.services[sc].list) {
			var subc = subcategories.services[sc].list[scs];
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
	for (var c in classifications) {
		if (body[classifications[c]] === "on")
			classifications_chosen.push(classifications[c]);
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

