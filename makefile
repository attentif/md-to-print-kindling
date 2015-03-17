
build: node_modules
	node build.js

build-verbose: node_modules
	DEBUG=* node build.js

watch: node_modules
	node build.js watch

clean:
	rm -rf build/*

node_modules: package.json
	npm install

.PHONY: build
