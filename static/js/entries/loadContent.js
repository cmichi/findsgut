function initMehrButtons() {
	$('.btn-mehr').each(function() {
		//console.log("each " + this.innerHTML);
		//$(this).attr("href", "#");
		//console.log("each " + this.href);

		$(this).click(function(event) {
			event.preventDefault();
			loadContent(this.id);
		});
	});
}
var visibility = {};
var map_initialized = {};
function loadContent(id) {
	//console.log( id );
	if (!visibility[id] || visibility[id] === "small") {
		$("#panel_" + id).css("height", "auto");

		$("#content_small_" + id).hide();
		$("#" + id).html("&raquo; Weniger anzeigen");
		$("#content_large_" + id).show();
		visibility[id] = "large";
	} else {
		$("#panel_" + id).css("height", "150px");

		$("#content_small_" + id).show();
		$("#" + id).html("&raquo; Mehr anzeigen");
		$("#content_large_" + id).hide();
		visibility[id] = "small";
	}

	var mapel = $('#map_' + id);

	if (!map_initialized[id] && $(mapel).attr("data-lat")) {
		var coords = [ $(mapel).attr("data-lat"), $(mapel).attr("data-lon") ]


		console.log(coords);
		coords[0] = parseFloat(coords[0]);
		coords[1] = parseFloat(coords[1]);
		console.log(coords);

		// create a map in the "map" div, set the view to a given place and zoom
		$(mapel).css('height', '200px');
		$(mapel).css('width', '100%');

		var map = L.map('map_' + id).setView([coords[0], coords[1]], 13);
		//console.log( coords );

		// add an OpenStreetMap tile layer
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);
		L.marker([coords[0], coords[1]]).addTo(map);
		//map.setView(new L.LatLng(coords[0], coords[1]), 13);

		// add a marker in the given location, attach some popup content to it and open the popup
		//var txt = "#{doc.street}<br />#{doc.zipcode} #{doc.city}";
		//.bindPopup(txt) .openPopup();

		map_initialized[id] = true;
	}


/*
	$.ajax({
		url: "/eintraege/" + id + "?ajax=true"
		//, context: document.body
	}).success(function(data, status) {
		console.log(data);
		$("#content_" + id).hide();
	});
	*/
}

$(function() {
	initMehrButtons();
});
