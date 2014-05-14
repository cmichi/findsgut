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
