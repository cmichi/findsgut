var updateList = function() { 
	//console.log("update");
	$("#list").html("Deine Suche wird ausgef&uuml;hrt&hellip;");
	$(".jumbotron").html("<div class='container'><h1>Deine Suche wird ausgef&uuml;hrt&hellip;</h1></div>");

	var local = $("form[id=filter] input[name=lokal]").prop("checked");
	if (local === true) local = "on";
	else local = "";

	var online = $("form[id=filter] input[name=online]").prop("checked");
	if (online === true) online = "on";
	else online = "";

	var bio = $("form[id=filter] input[name=bio]").prop("checked");
	if (bio === true) bio = "on";
	else bio = "";

	var regional = $("form[id=filter] input[name=regional]").prop("checked");
	if (regional === true) regional = "on";
	else regional = "";

	var fair = $("form[id=filter] input[name=fair]").prop("checked");
	if (fair === true) fair = "on";
	else fair = "";

	var term = $("form[id=filter] input[name=term]").val();

	var distance = $("form[id=filter] input[name=distance]").val();
	var umkreis = $("form[id=filter] input[name=umkreis]").val();
	//console.log("umkreis " + umkreis)

	var uri = "/suche/?ajax=true" 
		+ "&local=" + local 
		+ "&online=" + online 
		+ "&bio=" + bio 
		+ "&fair=" + fair 
		+ "&regional=" + regional 
		+ "&term=" + term

		+ "&umkreis=" + umkreis
		+ "&distance=" + distance
		+ "&searching=true"

	$.ajax({
		url: uri
		, context: document.body
	}).success(function(data, status) {
		var separator = "--separator--";
		var pos = data.indexOf(separator);
		var jumbotron = data.substr(0, pos);
		var list = data.substr(pos + separator.length, data.length);

		//console.log(jumbotron)
		//console.log(list)

		$("#list").html(list);
		$(".jumbotron").html(jumbotron);

		$('.btn-mehr').each(function() {
			//console.log("each " + this.innerHTML);
			//$(this).attr("href", "#");
			//console.log("each " + this.href);

			$(this).click(function(event) {
				event.preventDefault();
				loadContent(this.id);
			});
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
		$("#" + id).html("&raquo; Weniger");
		$("#content_large_" + id).show();
		visibility[id] = "large";
	} else {
		$("#panel_" + id).css("height", "150px");

		$("#content_small_" + id).show();
		$("#" + id).html("&raquo; Mehr");
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

var lastChg;
var to;
function chg() {
	// wait 500ms until search starts (in order to prevent a search whilst typing)
	window.clearTimeout(to);
	to = window.setTimeout("updateList()", 500);
}

$("form[id=filter]").change(chg);
$("form[id=filter] input[name=term]").keyup(chg);
$("form[id=filter] input[name=distance]").keyup(chg);
$("form[id=filter] input[name=umkreis]").keyup(chg);

// this is necessary because: a user may click various filters and then 
// reload the page. the browser will then keep the checkboxes
// checked/unchecked. this is a problem because the search will show
// all results and not the ones of the clicked filters. so to prevent this
// we will update the results page once the page is loaded.
$(function() {
	updateList();
})
