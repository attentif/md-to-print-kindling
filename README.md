# mdprint

[![Build Status](https://travis-ci.com/attentif/mdprint.svg?branch=master)](https://travis-ci.com/attentif/mdprint)
[![Coverage Status](https://coveralls.io/repos/github/attentif/mdprint/badge.svg?branch=master)](https://coveralls.io/github/attentif/mdprint?branch=master)

Generates a PDF from one or more Markdown files; handles Nunjucks templating, optional CSS and more.

## The reason for yet another Markdown-to-PDF tool

It's the usual: none of the existing tools I saw had what I wanted. In particular, handling template code (e.g. for injecting data into documents) or nice rendering via [Prince](https://www.princexml.com/).

## Usage

(Prerequisite: Node.js)

`mdprint --help`

## Contributing

Run the tests with `make test`, check code style ([semistandard](https://github.com/standard/semistandard) with `make .code_style`. See `makefile` and `package.json` for more.

## Licence

MIT
