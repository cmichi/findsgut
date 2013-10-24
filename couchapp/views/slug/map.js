function(doc) {
	if (doc.type === "topic" && doc.slug)
		emit(doc.slug, doc);
}
