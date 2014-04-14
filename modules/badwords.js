var fs = require('fs');
var app, db, layout, cache, email; 

var files = ['da','de','en','es','fr','it','ja','nl','pt','zh']; // ,'ru'
var badwords = {};

exports.init = function(_app, _db, _layout, _cache, _email) {
	app = _app;
	db = _db;
	cache = _cache;
	layout = _layout;
	email = _email;

	var loaded_badwords = 0;

	for (var f in files) {
		var data = fs.readFileSync('./lib/badwords/' + files[f], 'utf8');
		data = data.split('\n');
		badwords[ files[f] ] = data;
		//badwords = badwords.concat(data);

		loaded_badwords += data.length;
	}
	console.log("loaded " + loaded_badwords + " badwords");

	//console.log( this.containsBadWord("this is so ass, i say") );

	return;
}

exports.containsBadWord = function(txt) {
	for (var f in files) {
		for (var b in badwords[ files[f] ]) {
			var res = this.containsWord(txt, 
				badwords[ files[f] ][b], files[f]);
			if (res.match === true)
				return res;
		}
	}
	return {match: false};
}

exports.containsWord = function(txt, word, file) {
	word = word.replace(/\s*/, '');
	if (word.length === 0)
		return {match: false};

	txt = txt.toLowerCase();
	word = word.toLowerCase();

	if (txt.match(word)) {
		console.log("match for " + word);
		return {match: true, for: word, where: file};
	}

	return {match: false};
}

exports.check = function(obj, id, action) {
	var matches = 0;
	var test = ['name', 'description', 'uri'];

	var log = "# Eintrag\nLink: https://findsgut.de/eintraege/" + id + "\n\n\n";
	log += "# Bericht\n"

	console.log(JSON.stringify(obj, null, "\t"))

	for (var t in test) {
		console.log( test[t] );
		console.log( obj[test[t]] );

		var chkResult = this.containsBadWord(obj[ test[t] ]);
		if (chkResult.match === true) {
			matches++;
			log += "* Treffer bei '" + test[t] + "' fuer das Wort '" + chkResult.for;
			log += "' (Woerterliste: ./lib/badwords/" + chkResult.where + ")\n";
		}
	}

	if (matches > 0) {
		log += "\n\n# Daten-Objekt:\n";
		log += JSON.stringify(obj, null, "\t");

		console.log(log);
		email.badword(log, action);
	}
}
