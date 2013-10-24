var layout_vars = {
	navi: {}
	, count_entries: 0
	, categories: []
};

var db;

exports.get_vars = function(navi_key, additional_vars) {
	var vars = layout_vars;
	vars.navi = get_navi(navi_key);

	for (var i in additional_vars) {
		vars[i] = additional_vars[i];
	}

	console.log(JSON.stringify(vars));

	return vars;
}

exports.init = function(d) {
	db = d;

	db.view('db/entries', {reduce: false}, function (err, res) {
		if (err) {
			console.dir(err);
			return;
		}

		layout_vars.count_entries = res.length;
		layout_vars.entries = res;
	});

	db.view('db/categories', {reduce: false}, function (err, res) {
		if (err) {
			console.dir(err);
			return;
		}

		if (res.length > 0)
			layout_vars.categories = res
			//layout_vars.categories = res[0].value;

		console.log(JSON.stringify(layout_vars.categories))
	});
}

function get_navi(k, req) {
	var navi = {
		  home: ""
		, entries_new: ""
		, entries_all: ""
		, feedback: ""
	};

	if (k === "entries_new")
		navi.entries_new = "active";
	else if (k === "entries_all")
		navi.entries_all = "active";
	else if (k === "feedback")
		navi.feedback = "active";
	else
		navi.home = "active";

	return navi;
}

