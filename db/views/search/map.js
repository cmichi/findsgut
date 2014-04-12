var classifications = [
	{
		key: "bio"
		, value: "Bio"
	},
	{
		key: "fair"
		, value: "Fair"
	},
	{
		key: "regional"
		, value: "Regional"
	},
	{
		key: "used"
		, value: "Gebraucht"
	}
];
var categories = [
	{
		key: "product"
		, value: "Produkt"
	}
	, {
		key: "service"
		, value: "Dienstleistung"
	}
];
var subcategories = {
	products: [
		{
			title: "Büro & Schreibwaren"
			, list: [
				{
					key: "schreibwaren"
					, value: "Schreibwaren"
				}
				, {
					key: "bastelbedarf"
					, value: "Bastelbedarf"
				}
			]
		}
		, {
			title: "Haus & Garten"
			, list: [
				{
					key: "moebel"
					, value: "Möbel"
				}
				, {
					key: "kueche_bad"
					, value: "Küche & Bad"
				}
				, {
					key: "werkzeug_zubehoer"
					, value: "Werkzeug & Zubehör"
				}
				, {
					key: "baumaterialien_farbe"
					, value: "Baumaterialien & Farbe"
				}
				, {
					key: "pflanzen"
					, value: "Pflanzen"
				}
				, {
					key: "tierbedarf"
					, value: "Tierbedarf"
				}
				, {
					key: "dekoration"
					, value: "Dekoration"
				}
			]
		}
		
		, {
			title: "Elektronik"
			, list: [
				{
					key: "computer"
					, value: "Computer"
				}
				, {
					key: "foto_video_audio_tv"
					, value: "Foto, Video, Audio, TV"
				}
				, {
					key: "handy_kommunikation"
					, value: "Handy & Kommunikation"
				}
			]
		}
		, {
			title: "Drogerie"
			, list: [
				{
					key: "schoenheit"
					, value: "Schönheit"
				}
				, {
					key: "wellness_gesundheit"
					, value: "Wellnes & Gesundheit"
				}
				, {
					key: "hygiene"
					, value: "Hygiene"
				}
				, {
					key: "waschen_reinigen"
					, value: "Waschen & Reinigen"
				}
				, {
					key: "haushalt"
					, value: "Haushalt"
				}
			]
		}
		, {
			title: "Mode"
			, list: [
				{
					key: "damenmode"
					, value: "Damenmode"
				}
				, {
					key: "herrenmode"
					, value: "Herrenmode"
				}
				, {
					key: "kindermode"
					, value: "Kindermode"
				}
				, {
					key: "accessoires"
					, value: "Accessoires"
				}
				, {
					key: "schmuck"
					, value: "Schmuck"
				}
				, {
					key: "schuhe"
					, value: "Schuhe"
				}
			]
		}
		, {
			title: "Lebensmittel"
			, list: [
				{
					key: "brot_backwaren"
					, value: "Brot & Backwaren"
				}
				, {
					key: "milchprodukte"
					, value: "Milchprodukte"
				}
				, {
					key: "obst"
					, value: "Obst"
				}
				, {
					key: "gemuese"
					, value: "Gemüse"
				}
				, {
					key: "getraenke"
					, value: "Getränke"
				}
				, {
					key: "gewuerze"
					, value: "Gewürze"
				}
				, {
					key: "brotaufstriche"
					, value: "Brotaufstriche"
				}
				, {
					key: "suesses_salziges"
					, value: "Süßes & Salziges"
				}
				, {
					key: "fleischersatz_tofu"
					, value: "Fleischersatz & Tofu"
				}
				, {
					key: "eier"
					, value: "Eier"
				}
				, {
					key: "oele_fette"
					, value: "Öle & Fette"
				}
				, {
					key: "suppen_soszen"
					, value: "Suppen & Soßen"
				}
				, {
					key: "nahrungsergaenzungsmittel"
					, value: "Nahrungsergänzungsmittel"
				}
				, {
					key: "reis_huelsenfruechte"
					, value: "Reis & Hülsenfrüchte"
				}
				, {
					key: "wurst_fleisch_fisch"
					, value: "Wurst & Fleisch & Fisch"
				}
				, {
					key: "getreideprodukte"
					, value: "Getreideprodukte"
				}
				, {
					key: "backen_dessert"
					, value: "Backen & Dessert"
				}
				, {
					key: "fertigprodukte_konserven"
					, value: "Fertigprodukte & Konserven"
				}
			]
		}
		, {
			title: "Baby & Kind"
			, list: [
				{
					key: "kleidung"
					, value: "Kleidung"
				}
				, {
					key: "zubehoer"
					, value: "Zubehör"
				}
				, {
					key: "hygiene"
					, value: "Hygiene"
				}
				, {
					key: "spielzeug"
					, value: "Spielzeug"
				}
				, {
					key: "nahrung"
					, value: "Nahrung"
				}
			]
		}
		, {
			title: "Sonstiges"
			, list: [
				{
					key: "sonstige"
					, value: "Sonstiges"
				}
			]
		}
	]
	, services: [
		{
			title: ""
			, list: [
				{
					key: "gastronomie"
					, value: "Gastronomie"
				}
				, {
					key: "sonstiges"
					, value: "Sonstiges"
				}
			]
		}
	]
};

/* return subcategories objects which are correct for subcategories_arr */
function parseSub(subcategories_arr) {
	var arr = [];

	for (var c0 in subcategories_arr) {
		for (var c1 in subcategories) {
			for (var c2 in subcategories[c1]) {
				var obj = subcategories[c1][c2];
				for (var c3 in obj.list) {
					var obj2 = obj.list[c3];
					if (obj2.key === subcategories_arr[c0])
						arr.push(obj2.value);
				}
			}
		}
	}

	return arr;
}

function(doc) {
	if (doc.type != "entry") return;

	var txt = doc.name + " " + doc.description + " " + doc.address;

	if (doc.type == "entry" && doc.classifications) {
		for (var c in classifications) {
			for (var doc_c in doc.classifications) {
				if (classifications[c].key == doc.classifications[doc_c])
					txt += " " + classifications[c].value + " ";
			}	
		}
	}

	if (doc.type == "entry" && doc.categories) {
		for (var c in categories) {
			for (var doc_c in doc.categories) {
				if (categories[c].key == doc.categories[doc_c])
					txt += " " + categories[c].value + " ";
			}	
		}
	}

	txt += parseSub(doc.subcategories).join(" ");

	// TODO merge lines
	txt = txt.replace(/\&[A-Za-z]+\;/gi, ' ');
	txt = txt.replace(/\-/gi, '');
	txt = txt.replace(/\(/gi, '');
	txt = txt.replace(/\)/gi, '');
	txt = txt.replace(/\+/gi, '');
	txt = txt.replace(/\~/gi, '');
	txt = txt.replace(/\-/gi, '');
	txt = txt.replace(/\%/gi, '');


	var words = txt.replace(/[!.,;?\r\n\t]+/g," ").toLowerCase().split(" ");

	for (var word in words) {
		// > 2 because we need "bio" included, so > 3 is not possible
		if (words[word].replace(/\s*/g, "").length > 2) 
			emit(words[word], doc);
	}
}
