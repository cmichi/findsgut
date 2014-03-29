var updateList = function() { 
	console.log("update");

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

	var uri = "/suche/?ajax=true" 
		+ "&local=" + local 
		+ "&online=" + online 
		+ "&bio=" + bio 
		+ "&fair=" + fair 
		+ "&regional=" + regional 
		+ "&term=" + term;

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
	});
}

$("form[id=filter]").change(updateList);
$("form[id=filter] input[name=term]").keyup(updateList);

// this is necessary because: a user may click various filters and then 
// reload the page. the browser will then keep the checkboxes
// checked/unchecked. this is a problem because the search will show
// all results and not the ones of the clicked filters. so to prevent this
// we will update the results page once the page is loaded.
$(function() {
	updateList();
})
