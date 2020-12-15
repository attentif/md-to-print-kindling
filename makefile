PATH := node_modules/.bin:$(PATH)

source_files = $(wildcard bin/* lib/*)
test_files = $(wildcard test/* test/fixtures/*)

.DEFAULT_TARGET: all

all: node_modules .code_style test

node_modules: package.json
	npm install
	@touch $@

.code_style: $(source_files) $(test_files)
	semistandard
	@touch $@

test: node_modules $(source_files) $(test_files)
	nyc node test/*.js
	@touch $@

.coverage: test
	nyc report --reporter=text-lcov | coveralls
	@touch $@
