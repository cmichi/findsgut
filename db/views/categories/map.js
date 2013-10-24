function(doc) {
	if (doc.type === "category")
		emit(doc._id, doc);
		//[doc.title_de, doc.desc_de], null);
}
