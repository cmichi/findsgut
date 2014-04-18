var db, model, cache;

exports.init = function(_db, _model, _cache) {
	db = _db;
	model = _model;
	cache = _cache;

	this.getNearMe(["48.4004841", "9.9885268"]);

}

var distance = function(from, to) {
	var lat1 = from[0];
	var lon1 = from[1];

	var lat2 = to[0];
	var lon2 = to[1];

	var radlat1 = Math.PI * lat1/180;
	var radlat2 = Math.PI * lat2/180;
	var radlon1 = Math.PI * lon1/180;
	var radlon2 = Math.PI * lon2/180;
	var theta = lon1-lon2;
	var radtheta = Math.PI * theta/180;
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

	dist = Math.acos(dist);
	dist = dist * 180/Math.PI;
	dist = dist * 60 * 1.1515;

	dist = dist * 1.609344; // kilometers

	return dist
}                                                                           

exports.getNearMe = function(me_coords) {
	(function (me) {
		db.view("db/coords", {reduce: false}, function (err, docs) {
			if (err || docs == undefined) {
				console.dir(err);
				return;
			}

			for (var d in docs) {
				var entry = docs[d].value;
				//console.log(docs[d])

				var dist = distance(me, entry.coords);

				console.log(dist + " km");
			}
		});
	})(me_coords);
}
