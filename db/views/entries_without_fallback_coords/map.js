function(doc) {
	if (doc.type === "entry" && doc.local && !doc.fallback_coords)
		emit(doc._id, doc);
}
