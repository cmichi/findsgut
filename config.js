module.exports.mail = {
	host: 'smtp.foo.bar',
	user: 'foo',
	password: "bar", 
	tls: true,

	sender: "info@findsgut.de",
	feedback_to: "info@findsgut.de",
	admin_mail: "info@findsgut.de"
};

// substitute this secret for security reasons with another one
module.exports.session_secret = '5acfbfe3d02942ecbef51a5d26e08a325c6f0930';
