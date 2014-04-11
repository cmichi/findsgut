function(doc) {
	if (doc.type === "entry") {
		if (doc.revisions && doc.revisions.length > 0) {
			//if (doc.revisions.length === 1) {
				//emit(doc.last_modified, [doc, doc.revisions[0]]);
			//} else {
				var revs = doc.revisions;
				var revs_l = revs.length;

				var cnt = 0;
				for (var r in doc.revisions) {
					var rev = doc.revisions[r];
					if (cnt === 0) {
						cnt++
						continue;
					}


					emit(rev.last_modified, [doc.revisions[r], doc.revisions[r-1] ]);
					cnt++;
				}

				//emit(doc.last_modified, [doc, revs_l]);

				emit(doc.last_modified, [doc, doc.revisions[ doc.revisions.length-1 ]]);
			//}
		}
	}
}
