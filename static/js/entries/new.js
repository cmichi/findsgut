var updateForm = function() { 
	console.log("update");
	/* possible bug here: when form is saved with local=false, but 
	returns with an error: is the address field still hidden? */
	var local = $("form[id=new] input[name=local]").prop("checked");

	if (local === false)
		$("form[id=new] .address").hide();
	else
		$("form[id=new] .address").show();

	var product = $("form[id=new] input[name=category_product]").prop("checked");
	if (product === false)
		$("form[id=new] #productsubs").hide();
	else
		$("form[id=new] #productsubs").show();

	var service = $("form[id=new] input[name=category_service]").prop("checked");
	if (service === false)
		$("form[id=new] #servicesubs").hide();
	else
		$("form[id=new] #servicesubs").show();
}

$("form[id=new]").change(updateForm);

$(function() {
	updateForm();
});
