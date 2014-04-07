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
		from         : config.feedback_to,
		//from         : mail,
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

Date.prototype.getWeekNumber = function(){
	var d = new Date(+this);
	d.setHours(0,0,0);
	d.setDate(d.getDate()+4-(d.getDay()||7));
	return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
};

exports.report = function(req, res, layout, db, content) {
	var now = new Date();
	var subj = '[findsgut] Weekly Report, KW ' + 
		now.getWeekNumber() + " " + now.getFullYear();

	this.send({
		to           : config.feedback_to,
		//to           : config.admin_mail, //use for testing purposes
		subject      : subj,
		from         : config.feedback_to,
		text         : content
	}, function(err, m){
		console.log(err || m);
		if (err) {
			res.render('500', layout.get_vars('feedback') );
			return;
		}

		if (res) res.redirect('/');
		return;
	});
};

exports.error = function(code, err, req, res) {
	var content = JSON.stringify(err, null, "\t");
	content += "\n\n";
	content += JSON.stringify(req, null, "\t");

	if (err) 
		content += "\n\nstack:\n" + err.stack + "\n\n";

	this.send({
		//to           : config.feedback_to,
		to           : config.admin_mail,
		subject      : '[findsgut] ERROR 500!',
		from         : config.feedback_to,
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

