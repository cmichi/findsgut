module.exports.mail = {
	host: 'smtp.foo.bar',
	user: 'foo',
	password: "bar", 
	tls: true,

	sender: "Website Feedback <orga@lists.findsgut.de>",
	feedback_to: "orga@lists.findsgut.de",
	admin_mail: "orga@findsgut.de"
};

// substitute this secret for security reasons with another one
module.exports.session_secret = '5acfbfe3d02942ecbef51a5d26e08a325c6f0930';

module.exports.dbauth = {
	auth: { username: 'admin', password: '' }
};
