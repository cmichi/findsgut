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
		subject      : 'www.findsgut.de Kontaktformular',
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

