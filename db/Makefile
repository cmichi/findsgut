all: push

cleardb:
	curl -vX DELETE http://localhost:5984/findsgut/

initdb:
	curl -vX PUT http://localhost:5984/findsgut/
	make push

push:
	couchapp push findsgut_dev

productive:
	couchapp push productive

productive_dev:
	couchapp push productive_dev
