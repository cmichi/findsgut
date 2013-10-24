var layout_vars = {
	navi: {}
	, count_entries: 0
};

var db;

exports.get_vars = function(navi_key, additional_vars) {
	var vars = layout_vars;
	vars.navi = get_navi(navi_key);

	for (var i in additional_vars) {
		vars[i] = additional_vars[i];
	}

	return vars;
}

exports.init = function(d) {
	db = d;

	db.view('couchapp/entries', {reduce: false}, function (err, res) {
		if (err) {
			console.dir(err);
			return;
		}

		layout_vars.count_entries = res.length;
	});
}

function get_navi(k, req) {
	var navi = {
		  home: ""
		, entries: ""
		, feedback: ""
	};

	if (k === "entries")
		navi.entries = "active";
	else if (k === "feedback")
		navi.feedback = "active";
	else
		navi.home = "active";

	return navi;
}

