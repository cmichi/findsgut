function(doc) {
	if (doc.type === "entry" && doc.local)
		if (doc.coords)
			emit(doc.coords, doc);
		else if (doc.fallback_coords)
			emit(doc.fallback_coords, doc);
}
