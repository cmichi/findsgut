// when updating this var do not forget to also update `db/views/search/map.js`
// and `db/views/categories/map.js`!
exports.classifications = [
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

// when updating this var do not forget to also update `db/views/search/map.js`
// and `db/views/categories/map.js`!
exports.categories = [
	{
		key: "product"
		, value: "Produkt"
	}
	, {
		key: "service"
		, value: "Dienstleistung"
	}
];

// when updating this var do not forget to also update `db/views/search/map.js`
// and `db/views/categories/map.js`!
exports.subcategories = {
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

exports.getCategoryTitle = function(key) {
	for (var c in this.categories) {
		var obj = this.categories[c];
		if (obj.key === key) return obj.value;
	}

	for (var sc in this.subcategories.products) {
		var obj = this.subcategories[sc];
		for (var sc_l in this.subcategories.products[sc].list) {
			var obj_l = this.subcategories.products[sc].list[sc_l];
			if (obj_l.key === key) return obj_l.value; 
		} 
	}
	for (var sc in this.subcategories.services) {
		var obj = this.subcategories[sc];
		for (var sc_l in this.subcategories.services[sc].list) {
			var obj_l = this.subcategories.services[sc].list[sc_l];
			if (obj_l.key === key) return obj_l.value; 
		} 
	}
}
