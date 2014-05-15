function(doc) {
	if (doc.type != "messageboard") return;
	emit(doc.ts, doc);
}
