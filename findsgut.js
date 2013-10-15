var config = require('./config');
var express = require('express');
var http = require('http');
var sanitize = require('validator').sanitize
var langs = require('./modules/language-list');

var cradle = require('cradle');
var db = new(cradle.Connection)('127.0.0.1', 5984).database('findsgut');

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

function navi(k, req) {
	var navi = {
		login: 0
		, home: ""
		, new: ""
		, user: ""
	};

	if (req.session.user != null)
		navi.login = 1;

	if (k === "index") 
		navi.home = "active";
	else if (k === "new")
		navi.new = "active";
	else 
		navi.user = "active";

	return navi;
}

