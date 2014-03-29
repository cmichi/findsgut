var config = require('./config_local.js');
var layout = require('./modules/layout.js');
var entries = require('./modules/entries.js');
var express = require('express');
var http = require('http');

var cradle = require('cradle');
//var db = new(cradle.Connection)('127.0.0.1', 5984).database('findsgut');
var db = new(cradle.Connection)('127.0.0.1', 5984).database('findsgut_dev');

var email = require('./modules/email');

var sanitize = require('validator').sanitize
db.prepare = function(foo) {
	var bar = sanitize(foo).xss();
	bar = sanitize(bar).escape();
	bar = sanitize(bar).trim();

	return bar;
}

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

app.get('/eintraege/alle', function(req, res) {
	entries.all(req, res);
});

app.get('/eintraege/neu', function(req, res) {
	entries.get_new(req, res);
});

app.post('/eintraege/neu', function(req, res) {
	entries.post_new(req, res);
});

app.get('/suche', function(req, res) {
	entries.search(req, res);
});

app.get('/eintraege/:id', function(req, res) {
	entries.get(req, res);
});

app.get('/eintraege/bearbeiten/:id', function(req, res) {
	entries.edit(req, res);
});

app.post('/eintraege/bearbeiten/:id', function(req, res) {
	entries.saveEdit(req, res);
});

app.get('/impressum', function(req, res) {
	res.render('impressum', layout.get_vars('index'));
});

app.get('/agb', function(req, res) {
	res.render('agb', layout.get_vars('index'));
});

app.get('/feedback', function(req, res) {
	res.render('feedback', layout.get_vars('feedback'));
});

app.post('/feedback', function(req, res) {
	email.feedback(req, res, layout, db);
});

app.use(function(req,res){
	res.render('404', layout.get_vars('', { status: 404, missingurl: req.url }));
});

(function initApp() {
	layout.init(db);
	entries.init(app, db, layout);
})();
