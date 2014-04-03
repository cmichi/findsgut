var config = require('../config_local').mail;

exports.feedback = function(req, res, layout, db) {
	var name = db.prepare(req.param('inputName'));
	var mail = db.prepare(req.param('inputEmail'));
	var msg = db.prepare(req.param('inputMsg'));

	var content = "Name:\t" + name + "\n" 
		+ "E-Mail:\t" + mail + "\n\n"
		+ "Nachricht:\n" + msg + "\n";

	console.log(content);

	this.send({
		to           : config.feedback_to,
		subject      : '[findsgut] Kontaktformular',
		from         : mail,
		text         : content
	}, function(err, m){
		console.log(err || m);
		if (err) {
			res.render('500', layout.get_vars('feedback') );
			return;
		}

		res.render('feedback', layout.get_vars('feedback', { success: true }) );
		return;
	});
};

exports.report = function(req, res, layout, db, content) {
	this.send({
		//to           : config.feedback_to,
		to           : config.admin_mail,
		subject      : '[findsgut] Weekly Report',
		from         : "reporter@findsgut.de",
		text         : content
	}, function(err, m){
		console.log(err || m);
		if (err) {
			res.render('500', layout.get_vars('feedback') );
			return;
		}

		res.redirect('/');
		return;
	});
};

exports.error = function(code, err, req, res) {
	var content = JSON.stringify(err, null, "\t");
	content += "\n\n";
	content += JSON.stringify(req, null, "\t");

	this.send({
		//to           : config.feedback_to,
		to           : config.admin_mail,
		subject      : '[findsgut] ERROR 500!',
		from         : "reporter@findsgut.de",
		text         : content
	}, function(err, m){
		console.log(err || m);
		if (err) {
			res.render('500', layout.get_vars('feedback') );
			return;
		}

		return;
	});
};

exports.server = require("emailjs/email").server.connect({
	host : config.host,
	user : config.user,
	password : config.password,
	tls : config.tls
});

exports.send = function(msg, callback) {
	this.server.send({
		from         : msg.from || config.sender,
		to           : msg.to,
		subject      : msg.subject,
		text         : msg.text
	}, callback);
};

