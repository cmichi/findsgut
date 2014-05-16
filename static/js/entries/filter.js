var updateList = function() { 
	//console.log("update");
	var local = $("form[id=filter] input[name=local]").prop("checked");
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

	// do not search when default stuff is entered
	if (local === "" && online === "" && regional === "" && bio === "" 
		&& fair === "" && distance === "50" && umkreis === "" && term === ""
		&& $('form#filter :checked').length === 0)
		return;

	$("#list").html("Deine Suche wird ausgef&uuml;hrt&hellip;");
	$(".jumbotron").html("<div class='container'><h1>Deine Suche wird ausgef&uuml;hrt&hellip;</h1></div>");

	var subcategories = "";
	$('input[name^="product_subcategory"]').each(function() {
		if ($(this).attr("checked") === "checked")
			subcategories += "&" + $(this).attr("name") + "=on";
	});
	$('input[name^="service_subcategory"]').each(function() {
		if ($(this).attr("checked") == "checked")
			subcategories += "&" + $(this).attr("name") + "=on";
	});
	//console.log(subcategories + "!")

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
		+ subcategories

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

		initMehrButtons();
	});
}


var lastChg;
var to;
function chg() {
	// wait 500ms until search starts (in order to prevent a search whilst typing)
	window.clearTimeout(to);
	to = window.setTimeout("updateList()", 500);
}

//$("form[id=filter]").change(chg);
$("form[id=filter] input[name=term]").keyup(chg);
$("form[id=filter] input[name=distance]").keyup(chg);
$("form[id=filter] input[name=umkreis]").keyup(chg);
$("form[id=filter] input[type=checkbox]").change(chg);
//$("form[id=filter] input[type=checkbox]").click(chg);

// this is necessary because: a user may click various filters and then 
// reload the page. the browser will then keep the checkboxes
// checked/unchecked. this is a problem because the search will show
// all results and not the ones of the clicked filters. so to prevent this
// we will update the results page once the page is loaded.
$(function() {
	//updateList();
})
