var config = require('./config');
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

	//app.use(express.static(__dirname + '/static'));
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

var _navi = {};


app.get('/', function(req, res) {
	res.render('index', { });
});

app.get('/impressum', function(req, res) {
	res.render('impressum', { });
});

app.get('/kontakt', function(req, res) {
	res.render('kontakt', { });
});

app.get('/neu', function(req, res) {
	res.render('neu', { });
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

		res.render('kontakt', { success: true });
		return;
	});
});

function navi(k, req) {
	var navi = {
		  home: ""
		, entries: ""
		, feedback: ""
	};

	if (req.session.user != null)
		navi.login = 1;

	if (k === "entries")
		navi.entries = "active";
	else if (k === "feedback")
		navi.feedback = "active";
	else
		navi.home = "active";

	return navi;
}

app.use(function(req,res){
	res.render('404', { status: 404, missingurl: req.url });
});
