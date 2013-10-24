var config = require('./config_local.js');
var layout = require('./layout.js');
var express = require('express');
var http = require('http');
var sanitize = require('validator').sanitize

var cradle = require('cradle');
var db = new(cradle.Connection)('127.0.0.1', 5984).database('findsgut');

var EM = require('./modules/email-dispatcher');

var app = express();
app.configure(function () {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.locals.pretty = true;

	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({ secret: config.session_secret }));
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/static'));
});

var server = require('http').createServer(app);
server.listen(process.env.PORT || 5001, function() {
	console.log('Listening on port ' + server.address().port);
});

app.get('/', function(req, res) {
	res.render('index', layout.get_vars('index'));
});

app.get('/entries/all', function(req, res) {
	res.render('entries/all', layout.get_vars('entries_all'));
});

app.get('/impressum', function(req, res) {
	res.render('impressum', layout.get_vars('index'));
});

app.get('/kontakt', function(req, res) {
	res.render('kontakt', layout.get_vars('feedback'));
});

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
}
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
var categories = [];

app.get('/entries/new', function(req, res) {
	res.render('entries/new', layout.get_vars('entries_new',
		{"error_fields": get_error_fields()
		, errors: []
		, categories: categories
		, values: get_global_values()
	 }));
});

app.post('/entries/new', function(req, res) {
	//console.log(JSON.stringify(req.body));
	//console.log("\n");

	var validation_results = validate(req.body);
	var validator = validation_results.validator;
	var errors = validator.getErrors();

	if (errors != undefined && errors.length > 0) {
		// console.log(errors);
		//console.log(validation_results.values)
		// render site again, show errors, show previously entered input
		var additional_params = {
			  "errors": errors
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
});
app.get('/entries/:id', function(req, res) {
	var id = req.params.id;

	db.get(id, function (err, doc) {
		console.log(doc);
		var additional_params = {"doc": doc};
		res.render('entries/detail', layout.get_vars('entries_all', additional_params));
	});
});

function newEntry(res, body, validation_results) {
	var new_obj = {
		  type: "entry"
		, name: body.name
		, description: body.description
		, address: body.address
		, uri: body.uri
		, online_local: body.online_local
		, categories: validation_results.cats_chosen
		, classifications: validation_results.classifications_chosen
		, created_at: (new Date().getTime())
	};

	console.log(JSON.stringify(new_obj));
	db.save(new_obj, function(err, res_created) {
		if (err) {
			// show error note, render site with previous input
			var additional_params = {
				  "errors": ["Es gab einen Fehler beim Speichern des Eintrags."
					  + "Bitte versuchen Sie es in Kuerze erneut."]
				, previous_input: body
				, error_fields: validation_results.error_fields
				, categories: categories
				, values: validation_results.values
			};

			res.render('entries/new', layout.get_vars('entries_new', additional_params));
			console.log(JSON.stringify(err));
		}

		console.log(JSON.stringify(res_created));

		res.redirect('/entries/' + res_created.id);
		return;
	});
}

function prepare(foo) {
	var bar = sanitize(foo).xss();
	bar = sanitize(bar).escape();
	bar = sanitize(bar).trim();

	return bar;
}

function validate(body) {
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
	
	var name = prepare(body.name)
	var chk_cnt = 0;
	var chk = validator.check(name, "Bitte geben Sie einen Namen an.").notEmpty();
	if (chk._errors.length > chk_cnt)
		error_fields.name = "has-error";
	values.name = name;

	chk_cnt = chk._errors.length;

	var description = prepare(body.description)
	var chk = validator.check(description, "Bitte geben Sie eine Beschreibung an.").notEmpty();
	if (chk._errors.length > chk_cnt)
		error_fields.description = "has-error";

	values.description = description;

	chk_cnt = chk._errors.length;

	if (body.online_local === "local" || (body.address != null && body.address.length > 0)) {
		var address = prepare(body.address)
		var chk = validator.check(address, "Bitte geben Sie eine Adresse an.").notEmpty();
		if (chk._errors.length > chk_cnt)
			error_fields.address = "has-error";

		values.address = address;
		console.log(JSON.stringify(values));

		chk_cnt = chk._errors.length;
	}

	var uri = prepare(body.uri);
	if (body.online_local === "online" && uri === "") {
		validator.error("Bei Online-Angeboten ist die Angabe einer Internet-Adresse verpflichtend.");
	}
	if (uri != "") {
		var chk = validator.check(body.uri, "Bitte überprüfen Sie die Internetadresse").isUrl();
		if (chk._errors.length > chk_cnt)
			error_fields.uri = "has-error";
		values.uri = uri;
	}

	chk_cnt = chk._errors.length;

	var chk = validator
		.check(body.online_local, "Bitte geben Sie an, ob das Angebot online oder lokal ist.")
		.isIn(["online", "local"]);
	if (chk._errors.length > chk_cnt)
		error_fields.online_local = "has-error";
	else 
		values.online_local = body.online_local;

	chk_cnt = chk._errors.length;

	var chk = validator.check(body.agb, "Bitte akzeptieren Sie die AGB.").equals("on");
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
		validator.error("Bitte wählen Sie eine Kategorie.");
		error_fields.categories = "has-error";
	} else {
		for (var c in cats_chosen) 
			values["category_" + cats_chosen[c]] = true;
	}
	//console.log( JSON.stringify(cats_chosen));

	var classifications_chosen = [];
	var classifications = ["fair", "bio", "regional"];
	for (var c in classifications) {
		if (body[classifications[c]] === "on")
			classifications_chosen.push(classifications[c])
	}
	if (classifications_chosen.length === 0) {
		validator.error("Bitte ordnen Sie das Angebot ein.");
		error_fields.classifications = "has-error";
	} else {
		for (var c in classifications_chosen) 
			values[classifications_chosen[c]] = true;
	}
	//console.log("chosen " +  JSON.stringify(classifications_chosen));
	//console.log("errorfields " +  (error_fields));

	return {
		"validator": validator
		, "error_fields": error_fields
		, cats_chosen: cats_chosen
		, classifications_chosen: cats_chosen
		, "values": values
	};
} 

app.post('/kontakt', function(req, res) {
	var content = "Name:\t" + req.param('inputName') + "\n";
	content += "E-Mail:\t" + req.param('inputEmail') + "\n\n";
	content += "Nachricht:\n" + req.param('inputMsg') + "\n";
	console.log(content);

	EM.send({
		to           : 'mich@elmueller.net',
		subject      : 'www.findsgut.de Kontaktformular',
		text         : content
	}, function(e, m){
		console.log(e || m);

		res.render('kontakt', layout.get_vars('feedback', { success: true }) );
		return;
	});
});

app.use(function(req,res){
	res.render('404', layout.get_vars('', { status: 404, missingurl: req.url }));
});

(function initApp() {
	layout.init(db);

	db.view('db/categories', {reduce: false}, function (err, res) {
		if (err) {
			console.dir(err);
			return;
		}

		if (res.length > 0)
			categories = res
	});
})();
