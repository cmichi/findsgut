var updateForm = function() { 
	console.log("update");
	var local = $("form[id=new] input[name=local]").prop("checked");

	if (local === false)
		$("form[id=new] #address").hide();
	else
		$("form[id=new] #address").show();
}

$("form[id=new]").change(updateForm);
