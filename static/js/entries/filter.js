var updateList = function() { 
	console.log("update");
	var local = $("form[id=filter] input[name=lokal]").prop("checked");
	var online = $("form[id=filter] input[name=online]").prop("checked");

	if (local === true) local = "on";
	if (online === true) online = "on";

	var term = $("form[id=filter] input[name=term]").val();

	var uri = "/suche/?ajax=true&local=" + local + "&online=" + online + "&term=" + term;

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
