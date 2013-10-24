all: push

cleardb:
	curl -vX DELETE http://localhost:5984/findsgut/

initdb:
	curl -vX PUT http://localhost:5984/findsgut/
	curl -vX POST http://localhost:5984/findsgut/ \
		-H 'Content-Type: application/json' \
		-d '{"type":"category","key":"foo","value":"bar"}'

	make push

push:
	couchapp push findsgut

productive:
	couchapp push productive
