# Readme

findsgut ist ein gemeinschaftlich gepflegtes Verzeichnis 
für verantwortungsvolle Produkte und Dienstleistungen. Ziel der
Internetseite ist es, die Suche nach fair, ökologisch und regional
hergestellten Produkten sowie an Nachhaltigkeit ausgerichteten Marken 
und Dienstleistungen zu erleichtern. 

Geboren aus einer Idee entwickelt eine bunte Gruppe von 5-10 Leuten u.a.
aus den Bereichen Informatik, Design und Umweltschutz seit Mai 2013 in
ihrer Freizeit an der Projektverwirklichung. 

Die Internetseite ist als Gemeinschaftsprojekt (vergleiche Wikipedia) 
ausgelegt. Jede und jeder ist daher eingeladen mit Einträgen in das 
Verzeichnis zum Gelingen dieses Projektes beizutragen.

**Project Status:** Online! [findsgut.de](https://www.findsgut.de).

![Screenshot 1](https://github.com/cmichi/findsgut/raw/master/screenshots/home.jpg | width=800)

![Screenshot 2](https://github.com/cmichi/findsgut/raw/master/screenshots/stoebern.jpg | width=800)


## Aufsetzen einer Instanz

Make sure you have node.js, npm, CouchDB and couchapp installed.
The frontend within `views/` is written using the [Jade Templating
Engine](http://jade-lang.com/reference/).

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
	cd ../

	# to change the database/port which is used set environment
	# variables: 
	# $ export PORT=5001
	# $ export DBNAME="findsgut"
	# $ export DBPORT=5984

	# if used in production don't forget to set NODE_ENV,
	# otherwise no caching will take place.
	# $ export NODE_ENV="production"

	node findsgut.js 

	# you're done! open http://localhost:5001/ within your browser.


## Cronjob

Die Produktiv-Instanz generiert woechentlich einen Report:

	45 23 * * 0 (curl http://localhost:5001/report > /dev/null)


## Used libraries

 * The `./lib/badwords/*` list is taken from [shutterstock/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words](https://github.com/shutterstock/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words)

## Code-License

The code is licensed under the MIT license:

	Copyright (c) 2013-2014

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


## Datenbank

### Lizenzierung

	Die findsgut Datenbank steht unter einer CC0 1.0 Universal (CC0 1.0) 
	Lizenz. Weiterverwendung, Vervielfältigung und Weiterverbreitung 
	unterliegen somit keinerlei Bedingungen. 

	http://creativecommons.org/publicdomain/zero/1.0/

### Zugriff

Die findsgut Datensammlung ist in der NoSQL-Datenbank CouchDB abgelegt.
Der Zugriff ist über die URI 
[http://findsgut.de:5984/_utils/index.html](http://findsgut.de:5984/_utils/index.html)
möglich. Der Zugriff ist auf Lesezugriff beschränkt. Falls du Interesse
hast auf unseren Daten aufbauend eine Anwendung zu entwickeln oder eine
andere Idee zu verwirklichen, macht es vermutlich am meisten Sinn wenn
du CouchDB bei dir installierst und unsere Datenbank replizierst.
Ist das einmal gemacht, hast du die komplette Datenbank bei dir lokal
und kannst sie jederzeit wieder auf den neuesten findsgut-Stand bringen.
Wie so eine Replikation genau funktioniert wird im 
[CouchDB-Guide](http://guide.couchdb.org/editions/1/de/tour.html#replication) 
anschaulich erläutert.

Am Liebsten wäre es uns wenn du dich entscheidest mit Erweiterungen oder 
neuen Datensätzen zu unserer Plattform beizutragen, wir wollen weitere 
mögliche Verwendungen aber nicht ausschließen und haben uns deswegen 
entschlossen die Datenbank und den Quelltext frei zur Verfügung zu
stellen.
