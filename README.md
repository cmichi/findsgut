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


## Shortterm-ToDos

 * URI-Id to Slug (`/eintraege/:id` to `/eintraege/:slug`).
 * Improve search (also search in `var categories` and `var subategories`).
 * Add filters for (sub-)categories to search page.
 * Rewrite `modules/info.js` to work with barrier points lib.
 * There is a bug in the reporter, count of new entries in this week does 
   not give the correct number?


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

	# you're done! open http://localhost:5001/ within your browser.
	# to change the database/port which is used set environment
	# variables: 
	# $ export PORT=5001
	# $ export DBNAME="findsgut"

	# if used in production don't forget to set NODE_ENV,
	# otherwise no caching will take place.
	# $ export NODE_ENV="production"

## Cronjob

Die Produktiv-Instanz generiert woechentlich einen Report:

	45 23 * * 0 (curl https://findsgut.de/report > /dev/null)


# License

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
