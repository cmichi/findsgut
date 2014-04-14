var util = require('util')
var Barrier = require('../lib/barrierpoints.js').Barrier;
var app, db, layout; 
var PiwikClient = require('piwik-client');
var piwik = new PiwikClient('https://findsgut.de/statistik/index.php', '1725be0b0b088839cb258b1ef6e025a4')

exports.init = function(_app, _db, _layout) {
	app = _app;
	db = _db;
	layout = _layout;

	return;
}

exports.get = function(req, res) {
	collectStatistic(req, res, function(obj) {
		var params = {statistic: obj};
		//console.log(JSON.stringify(params, null, "\t"));

		res.render('info', layout.get_vars('index', params));
	});
}

function collectStatistic(req, res, cb) {
	var obj = {
		week: {
			  changes: 0
			, count_changes: 0
			, entries: 0
			, visits: 0
			, keywords: []
			, referrer: []
		}
		, alltime: {
			  count_changes: 0
			, entries: 0
		}
		, year: {
			visits: 0
		}
	};
	var barrier = new Barrier(9, function() {
		//console.log(JSON.stringify(obj, null, "\t"));

		obj.week.count_changes -= obj.week.entries;
		obj.alltime.count_changes -= obj.alltime.entries;
		cb(obj);
	}, function() {} );

	getCountChanges(res, 0, function(cntAllChgs) {
		obj.alltime.count_changes = cntAllChgs;
		barrier.submit();
	});

	getViews(res, 'week', function(piwikobj) {
		obj.week.visits = piwikobj.value;
		barrier.submit();
	});

	getViews(res, 'year', function(piwikobj) {
		obj.year.visits = piwikobj.value;
		barrier.submit();
	});

	getKeywords(res, 'week', function(piwikobj) {
		obj.week.keywords = piwikobj;
		barrier.submit();
	});

	getReferrer(res, 'week', function(piwikobj) {
		obj.week.referrer = piwikobj;
		barrier.submit();
	});

	getCountEntries('alltime', function(cntEntries) {
		obj.alltime.entries = cntEntries;
		barrier.submit();
	});

	getCountEntries('week', function(cntEntries) {
		obj.week.entries = cntEntries;
		barrier.submit();
	});

	getLowestSeq(res, "week", function(lowestSeqThisWeek) {
		//console.log("lowest seq nr this week " + lowestSeqThisWeek);
		getCountChanges(res, lowestSeqThisWeek, function(count_chgs_week) {
				obj.week.count_changes = count_chgs_week;
		});
		barrier.submit();
	});

	getDiffChanges(res, 20, function(chgs) {
		obj.week.changes = prepareDiff(chgs);
		barrier.submit();
	});
}

exports.test = function(req, res) {
	var obj = {
		week: {
			  changes: 0
			, count_changes: 0
			, entries: 0
			, visits: 0
			, keywords: []
			, referrer: []
		}
		, alltime: {
			changes: 0
			, entries: 0
		}
		, year: {
			visits: 0
		}
	};
	getDiffChanges(res, 20, function(chgs) {
		//chgs.reverse();
		obj.week.changes = prepareDiff(chgs);

		var params = {statistic: obj};
		res.render('info', layout.get_vars('index', params));
	});
}


function prepareDiff(chgs) {
	var diff = [];

	for (var c in chgs) {
		var doc = chgs[c].value;
		//if (!chgs[c].doc) continue;

		//console.log("doc:")
		//console.log(JSON.stringify(chgs[c], null, "\t"));

		//chgs[c].diff = [];

		delete doc[0].revisions;
		//console.log(JSON.stringify(doc[1], null, "\t"));
		//console.log(JSON.stringify(doc[0], null, "\t"));
		chgs[c].diff = findDifferences(doc[1], doc[0]);
	}
	return chgs;
}
/*
function prepareDiff(chgs) {
	for (var c in chgs) {
		if (!chgs[c].doc) continue;

		//console.log("doc:")
		//console.log(JSON.stringify(chgs[c], null, "\t"));

		chgs[c].diff = [];
		if (chgs[c].doc.revisions && chgs[c].doc.revisions.length > 0) {
			var was = chgs[c].doc.revisions[ chgs[c].doc.revisions.length-1 ];
			delete chgs[c].doc.revisions;

			chgs[c].diff = findDifferences(was, chgs[c].doc);
		}
	}
	return chgs;
}
*/

/*
var diffs = [];
function getDiffForChanges(chgs, cb) {
	var barrier = new Barrier(chgs.length, function() {
		cb(diffs);
	}, function() {
		console.log("aborted");
	});

	diffs = [];
	for (var c in chgs) {
		getDiffForChange(chgs[c], function(diff_obj) {
			diffs.push( diff_obj );
			barrier.submit();
		});
	}
}

function getDiffForChange(chg, cb) {
	//console.log(JSON.stringify(chg, null, "\t"));
	//console.log(JSON.stringify(chg.changes[0].rev, null, "\t"));
	db.get(chg.id, chg.changes[0].rev, {revs_info: true}, function(data) {
		//console.log(JSON.stringify(data, null, "\t"));
		chg.revisions = data.revisions;
	});
}
*/

getCountEntries = function(period, cb) {
	var view = "db/entries";
	var opts = {reduce: false};

	if (period === "week") {
		view = "db/entries_by_weeknumber";
		opts.startkey = opts.endkey = (new Date()).getFullYear() 
			+ "" + (new Date()).getWeekNumber();
	}

	db.view(view, opts, function (err, entries) {
		//console.log(JSON.stringify(entries));
		if (err) {
			layout.error(500, err, null, null, layout.get_vars('index'));
			return;
		}

		cb(entries.length);
	});
}

getLowestSeq = function(res, period, cb) {
	// only works for entries_by_weeknumber view
	if (period !== "week") return null;

	var view = "db/entries_by_weeknumber";
	var opts = {reduce: false};
	opts.startkey = opts.endkey = (new Date()).getFullYear() 
		+ "" + (new Date()).getWeekNumber();

	db.view(view, opts, function (err, entries) {
		if (err) {
			layout.error(500, err, null, res, layout.get_vars('index'));
			return;
		}

		if (entries.length === 0) {
			cb(0);
			return;
		}

		getChanges(res, 0, function(chgs) {
			//console.log("foo");
			//console.log(JSON.stringify(entries, null, '\t'))
				//console.log(JSON.stringify(chgs, null, '\t'))
				//cb(0);

			var lowestSeq;
			for (var e in entries) {
				var entry = entries[e].value;

				//console.log("entry:")
				//console.log(JSON.stringify(entry, null, '\t'))

				for (var c in chgs) {
					//console.log("\nchgs[c]:")
					//console.log(JSON.stringify(chgs[c], null, '\t'))
					//cb(0);
					//return;

					if (entry._id === chgs[c].id) {
						if (!lowestSeq)
							lowestSeq = chgs[c].seq;
						else if (chgs[c].seq < lowestSeq) 
							lowestSeq = chgs[c].seq;
						//console.log(entry._id + " === " + chgs[c].id) 
					}
				}
			}
			cb(lowestSeq);
			return;
		});
	});
}

function getViews(res, period, cb) {
	piwik.api({
		method:   'VisitsSummary.getVisits',
		idSite:   1,
		period:   period,
		date:     'today'
	}, function(err, obj) {
		if (err) {
			layout.error(500, err, null, res, layout.get_vars('index'));
			return;
		}

		cb(obj);
	});
}

function getKeywords(res, period, cb) {
	piwik.api({
		method:   'Referrers.getKeywords',
		idSite:   1,
		period:   period,
		date:     'today',
		filter_limit: 3
	}, function(err, obj) {
		if (err) {
			layout.error(500, err, null, res, layout.get_vars('index'));
			return;
		}
		//console.log(JSON.stringify(obj, null, "\t"));

		cb(obj);
	});
}

function getReferrer(res, period, cb) {
	piwik.api({
		method:   'Referrers.getAll',
		idSite:   1,
		period:   period,
		date:     'today',
		filter_limit: 3
	}, function(err, obj) {
		if (err) {
			layout.error(500, err, null, res, layout.get_vars('index'));
			return;
		}
		//console.log(JSON.stringify(obj, null, "\t"));

		cb(obj);
	});
}

function getCountChanges(res, since, cb) {
	getChanges(res, since, function(chgs) {
		//cb(chgs.length);
		//console.log(chgs[chgs.length-1].seq + " - " + since);
		cb(chgs[chgs.length-1].seq - since);
	});
}

function getChanges(res, since, cb) {
	db.changes({"since": since, "include_docs": true}, function (err, chgs) {
		if (err) {
			layout.error(500, err, null, res, layout.get_vars('index'));
			return;
		}
		//console.log(JSON.stringify(chgs, null, "\t"));

		cb(chgs);

		//res.render('info', layout.get_vars('entries_all'));
	});
}

function getDiffChanges(res, limit, cb) {
	db.view("db/changes", {reduce: false, descending: true, "limit": limit}, function (err, chgs) {
		if (err) {
			layout.error(500, err, null, res, layout.get_vars('index'));
			return;
		}
		//console.log(JSON.stringify(chgs, null, "\t"));

		cb(chgs);

		//res.render('info', layout.get_vars('entries_all'));
	});
}


function findDifferences(objectA, objectB) {
   var propertyChanges = [];
   var objectGraphPath = ["this"];
   (function(a, b) {
      if(a.constructor == Array) {
         // BIG assumptions here: That both arrays are same length, that
         // the members of those arrays are _essentially_ the same, and 
         // that those array members are in the same order...
         for(var i = 0; i < a.length; i++) {
            objectGraphPath.push("[" + i.toString() + "]");
            arguments.callee(a[i], b[i]);
            objectGraphPath.pop();
         }
      } else if(a.constructor == Object || (a.constructor != Number && 
                a.constructor != String && a.constructor != Date && 
                a.constructor != RegExp && a.constructor != Function &&
                a.constructor != Boolean)) {
         // we can safely assume that the objects have the 
         // same property lists, else why compare them?
         for(var property in a) {
            objectGraphPath.push(("." + property));
            if(a[property].constructor != Function) {
               arguments.callee(a[property], b[property]);
            }
            objectGraphPath.pop();
         }
      } else if(a.constructor != Function) { // filter out functions
         if(a != b) {
            propertyChanges.push({ "Property": objectGraphPath.join(""), "ObjectA": a, "ObjectB": b });
         }
      }
   })(objectA, objectB);
   return propertyChanges;
}

exports.report = function(req, res, email) {
	collectStatistic(req, res, function(obj) {

var cmon = "";
if (obj.week.entries === 0) {
cmon = ":( :( :( :( :( :( :( :( :( :( :( :( :( :( :( :( :( :( :( :( :( :(\n\
Bevor diese Woche der Bericht losgeht wird es Zeit fuer\n\
ein ernstes Woertchen! Es gab diese Woche KEINE neuen Eintraege!\n\
Das wird naechste Woche hoffentlich wieder anders sein!\n\
:( :( :( :( :( :( :( :( :( :( :( :( :( :( :( :( :( :( :( :( :( :(\n\n";
}

var txt =
"Hallo zusammen!\n\n\
Dies ist ein automatisch generierter Bericht fuer findsgut.\n\
\n" + cmon + 
"In dieser Woche hat sich folgendes getan:\n\
\n\
Neue Eintraege: " + obj.week.entries + "\n\
Aenderungen an Eintraegen: " + obj.week.changes.length + "\n\
Besucher diese Woche: " + obj.week.visits + "\n\
\n\
Insgesamt stehen wir damit so da:\n\
\n\
Eintraege Gesamt: " + obj.alltime.entries + "\n\
Aenderungen Gesamt: " + obj.alltime.count_changes + "\n\
Besucher dieses Jahr: " + obj.year.visits + "\n\
\n\
Diesen Bericht koennt ihr auch jederzeit online abrufen, dann\n\
sogar ausfuehrlicher, in Farbe und mit aktuellsten Zahlen:\n\
http://findsgut.de/info\n\
\n\
Bis naechste Woche!\n\
\n\
-- \n\
Der findsgut Reporter";

		//console.log(txt);
		email.report(req, res, layout, db, txt);
	});
}


