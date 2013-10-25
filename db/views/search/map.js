function(doc) {
	if (doc.type != "entry") return;

	var txt = doc.name + doc.description + doc.address.join(" ");
	var words = txt.replace(/[!.,;?]+/g," ").toLowerCase().split(" ");
	for (var word in words) {
		if (words[word].replace(/\s/g, "").length > 0) 
		emit(words[word], doc);
	}
}
