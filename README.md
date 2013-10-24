# Readme

findsgut wird ein gemeinschaftlich gepflegtes Verzeichnis im Internet
für verantwortungsvolle Produkte und Dienstleistungen. Ziel der
Internetseite ist es, die Suche nach fair, ökologisch und regional
hergestellten Produkten sowie an Nachhaltigkeit ausgerichteten Marken und
Dienstleistungen zu erleichtern. 

Die Internetseite ist als
Gemeinschaftsprojekt (vergleiche Wikipedia) ausgelegt. Jede und jeder ist
daher eingeladen mit Einträgen in das Verzeichnis zum Gelingen dieses
Projektes beizutragen.

## Hintergrund

Mit Konsum die Welt verändern. Wir Menschen brauchen Lebensmittel,
Kleidung, Alltagsgegenstände wie Papier und Bleistift. Aber auch auf
Dienstleistungen wie ein Bankkonto oder Versicherungen sind wir angewiesen.

Die Auswahl ist riesengroß. Mit der Wahl des Produktes oder der
Dienstleistung entscheiden wir uns für eine bestimmte
Entstehungsgeschichte. Wo kommen die Produkte her? Werden die
Arbeiter*Innen gerecht bezahlt? Wird auf umweltfreundliche Standards
geachtet? Mit allem, was wir konsumieren, entscheiden wir uns für oder
gegen Umweltschutz, für oder gegen soziale Gerechtigkeit. Für oder gegen
ein verantwortungsvolles Miteinander.


## Unser Ziel

Immer mehr Menschen, wollen bewusst verantwortungsvoll konsumieren.
Umweltschutz, soziale Gerechtigkeit und Qualität aus der Region sind ihnen
beim Einkauf wichtig. Zwar wächst das Angebot verantwortungsvoller Produkte
und Dienstleistungen kontinuierlich, allerdings ist es immer noch sehr
klein. Die Suche nach diesen Wenigen gestaltet sich oft als anstrengend.

Mit findsgut soll ein Beitrag geleistet werden, diese Suche zu vereinfachen
und damit den Zugang zu verantwortungsvollen Produkten und Dienstleistungen
zu erleichtern.


# Aufsetzen einer Instanz

Make sure you have node.js, npm, CouchDB and couchapp installed.


	git clone ...
	cd findsgut/

	# this will install dependencies
	npm install

	# create a config file. adapt the config_local.js later.
	cp config.js config_local.js

	cd db/

	# this will create a database `findsgut` within 
	make initdb

	# this will create views, etc..
	make push

	# you're done! open http://localhost:5001/ within your browser.



# License

The code is licensed under the MIT license:

	Copyright (c) 2013

		Michael Mueller <http://micha.elmueller.net/>

	Permission is hereby granted, free of charge, to any person obtaining
	a copy of this software and associated documentation files (the
	"Software"), to deal in the Software without restriction, including
	without limitation the rights to use, copy, modify, merge, publish,
	distribute, sublicense, and/or sell copies of the Software, and to
	permit persons to whom the Software is furnished to do so, subject to
	the following conditions:

	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
	LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
	OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
