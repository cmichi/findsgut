var ES = require('../config_local').mail;
var EM = {};
module.exports = EM;

EM.server = require("emailjs/email").server.connect({
	host : ES.host,
	user : ES.user,
	password : ES.password,
	tls : ES.tls
});

EM.send = function(msg, callback) {
	EM.server.send({
		from         : ES.sender,
		to           : msg.to,
		subject      : msg.subject,
		text         : msg.text
	}, callback);
}

EM.dispatchResetPasswordLink = function(account, callback) {
	EM.server.send({
		from         : ES.sender,
		to           : account.email,
		subject      : 'Password Reset',
		text         : EM.composeEmail(account)
	}, callback);
}

EM.composeEmail = function(o) {
	var link = 'http://localhost:4000/reset-password?e='+o.email+'&p='+o.pass;

	var txt = "Hi " + o.name + ",\n";
	//txt += "Your username is: " + o.user + ".\n\n";
	//txt += "Please click here to reset your password:\n" + link;
	txt += "Ihr Benutzername ist: " + o.user + ".\n\n";
	txt += "Bitte klicken Sie hier um Ihr Passwort zurückzusetzen:\n" + link;
	console.log(txt);
	return txt;

	//return  [{data:txt, alternative:true}];
}
