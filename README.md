# Readme

findsgut wird ein gemeinschaftlich gepflegtes Verzeichnis im Internet
für verantwortungsvolle Produkte und Dienstleistungen. Ziel der
Internetseite ist es, die Suche nach fair, ökologisch und regional
hergestellten Produkten sowie an Nachhaltigkeit ausgerichteten Marken 
und Dienstleistungen zu erleichtern. 

Die Internetseite ist als Gemeinschaftsprojekt (vergleiche Wikipedia) 
ausgelegt. Jede und jeder ist daher eingeladen mit Einträgen in das 
Verzeichnis zum Gelingen dieses Projektes beizutragen.

Im [Wiki](http://wiki.findsgut.de) finden sind weitere Infos zu dem 
Konzept, beteiligten Personen und der Mailingliste.

**Project Status:** Very early stage. Heavy WIP.


# Aufsetzen einer Instanz

Make sure you have node.js, npm, CouchDB and couchapp installed.

	git clone https://github.com/cmichi/findsgut.git
	cd findsgut/

	# this will install dependencies
	npm install

	# create a config file. adapt the config_local.js later.
	cp config.js config_local.js

	cd db/

	# this will create a database `findsgut` and fill it with some
	# basic entries
	make initdb

	# this will create views, etc..
	make push

	# you're done! open http://localhost:5001/ within your browser.


# ToDo

* output proper 500 error page on db etc. errors


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
