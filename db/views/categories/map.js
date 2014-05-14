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
			title: "Schreibwaren & Bastelbedarf & Bücher"
			, list: [{
				key: "schreibwaren_bastelbedarf_buecher"
				, value: "Schreibwaren & Bastelbedarf & Bücher"
			}]
		}
		, {
			  title: "Haus & Garten"
			, list: [{
				  key: "haus_garten"
				  , value: "Haus & Garten"
			}]
		}
		, {
			  title: "Klein-Elektronik"
			, list: [{
				  key: "klein_elektronik"
				  , value: "Klein-Elektronik"
			}]
		}
		, {
			title: "Drogerie & Kosmetik"
			, list: [{
				  key: "drogerie_kosmetik"
				  , value: "Drogerie & Kosmetik"
			}]
		}
		, {
			title: "Spielzeug & Musikinstrumente"
			, list: [{
				  key: "spielzeug_musikinstrumente"
				  , value: "Spielzeug & Musikinstrumente"
			}]
		}
		, {
			  title: "Mode & Textilien"
			, list: [
				{
					key: "damenmode"
					, value: "Damen"
				}
				, {
					key: "herrenmode"
					, value: "Herren"
				}
				, {
					key: "kindermode"
					, value: "Baby & Kinder"
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
				, {
					key: "stoffe"
					, value: "Stoffe"
				}
				, {
					key: "mode_textilien_sonstige"
					, value: "Sonstige"
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
					, value: "Milchprodukte & Eier"
				}
				, {
					key: "obst"
					, value: "Obst & Gemüse"
				}
				, {
					key: "getraenke"
					, value: "Kaffee & Tee & Getränke"
				}
				, {
					key: "suesses_salziges"
					, value: "Süßes & Salziges"
				}
				, {
					key: "wurst_fleisch_fisch"
					, value: "Wurst & Fleisch & Fisch"
				}
				, {
					key: "weitere_lebensmittel"
					, value: "Weitere Lebensmittel"
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
					key: "dienstleistung_sonstiges"
					, value: "Sonstiges"
				}
			]
		}
	]
};

/* return subcategories objects which are correct for subcategories_arr */
function parseSubKey(subcategories_arr) {
	var arr = [];

	for (var c0 in subcategories_arr) {
		for (var c1 in subcategories) {
			for (var c2 in subcategories[c1]) {
				var obj = subcategories[c1][c2];
				for (var c3 in obj.list) {
					var obj2 = obj.list[c3];
					if (obj2.key === subcategories_arr[c0])
						arr.push(obj2.key);
				}
			}
		}
	}

	return arr;
}

function(doc) {
	if (doc.type != "entry") return;

	if (doc.classifications) {
		for (var c in classifications) {
			for (var doc_c in doc.classifications) {
				if (classifications[c].key == doc.classifications[doc_c])
					emit(classifications[c].key, doc);
			}	
		}
	}

	if (doc.categories) {
		for (var c in categories) {
			for (var doc_c in doc.categories) {
				if (categories[c].key == doc.categories[doc_c])
					emit(categories[c].key, doc);
			}	
		}
	}

	var sub_keys = parseSubKey(doc.subcategories);
	if (sub_keys.length > 0) {
		for (var k in sub_keys) {
			emit(sub_keys[k], doc);
		}
	}
}
