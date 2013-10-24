var config = require('./config_local.js');
var layout = require('./layout.js');
var entries = require('./entries.js');
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

app.get('/entries/new', function(req, res) {
	entries.get_new(req, res);
});

app.get('/entries/:id', function(req, res) {
	entries.get(req, res);
});

app.post('/entries/new', function(req, res) {
	entries.post_new(req, res);
});
app.get('/impressum', function(req, res) {
	res.render('impressum', layout.get_vars('index'));
});

app.get('/kontakt', function(req, res) {
	res.render('kontakt', layout.get_vars('feedback'));
});


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

	entries.init(app, db, layout);
})();
