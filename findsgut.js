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

var error_fields = {
	  name: ""
	, uri: ""
	, categories: ""
	, classification: ""
	, online_local: ""
	, address: ""
	, description: ""
	, agb: ""
}
app.get('/entries/new', function(req, res) {
	res.render('entries/new', layout.get_vars('entries_new',
	{"error_fields": error_fields}));
});

app.post('/entries/new', function(req, res) {
	console.log(JSON.stringify(req.body));
	console.log("\n");

	var validation_results = validate(req.body, error_fields);
	var validator = validation_results.validator;
	var errors = validator.getErrors();

	if (errors != undefined && errors.length > 0) {
		//console.log(errors);
		// render site again, show errors, show previously entered input
		var additional_params = {
			  "errors": errors
			, previous_input: req.body
			, error_fields: validation_results.error_fields
		};

		res.render('entries/new', layout.get_vars('entries_new', additional_params));
		return;
	} else {
		newEntry(res, req.body)
	}
});

function newEntry(res, body) {
	var new_obj = {
		  type: "entry"
		, beschreibung: body.inputDescription + "bar"
		, created_at: (new Date().getTime())
	};

	db.save(new_obj, function(err, res_created) {
		if (err) {
			// show error note 
			// render site with previous input
			console.log(JSON.stringify(err));
		}

		//console.log(JSON.stringify(res_created));
		
		//getSlug(obj.topic, function(slug) {
			//res.redirect('/de/entry/' + slug + "?opinion_added");
		//});
	});
}

function prepare(foo) {
	var bar = sanitize(foo).xss();
	bar = sanitize(bar).escape();
	bar = sanitize(bar).trim();

	return bar;
}

function validate(body, error_fields) {
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
	
	var name = prepare(body.name)
	var chk = validator.check(name, "Bitte geben Sie einen Namen an.").notEmpty();
	if (chk.msg != "") 
		error_fields.name = "has-error";
		
	var description = prepare(body.description)
	var chk = validator.check(description, "Bitte geben Sie eine Beschreibung an.").notEmpty();
	if (chk.msg != "") 
		error_fields.description = "has-error";

	var uri = prepare(body.uri);
	if (body.local_online && uri === "") {
		validator.error("Bei Online-Angeboten ist die Angabe einer Internet-Adresse verpflichtend.");
	}
	if (uri != "") {
		var chk = validator.check(body.uri, "Bitte überprüfen Sie die Internetadresse").isUrl();
		if (chk.msg != "") 
			error_fields.uri = "has-error";
	}

	var chk = validator.check(body.online_local, "Bitte geben Sie an, ob das Angebot online oder lokal ist.").notEmpty();
	if (chk.msg != "") 
		error_fields.online_local = "has-error";



	var chk = validator.check(body.agb, "Bitte akzeptieren Sie die AGB.").equals("on");
	if (chk.msg != "") 
		error_fields.agb = "has-error";

	return {
		"validator": validator
		, "error_fields": error_fields
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
})();
