function(doc) {
	if (doc.type === "entry" && doc.local && !doc.coords)
		emit(doc._id, doc);
}
