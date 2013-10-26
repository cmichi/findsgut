function(doc) {
	if (doc.type === "category")
		emit([doc.order, doc._id], doc);
		//[doc.title_de, doc.desc_de], null);
}
