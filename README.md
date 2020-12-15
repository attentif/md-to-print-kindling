# mdprint

[![Build Status](https://travis-ci.com/attentif/mdprint.svg?branch=master)](https://travis-ci.com/attentif/mdprint)
[![Coverage Status](https://coveralls.io/repos/github/attentif/mdprint/badge.svg?branch=master)](https://coveralls.io/github/attentif/mdprint?branch=master)

Generates a PDF from one or more Markdown files via [markdown-it](https://github.com/markdown-it/markdown-it) and [Prince](https://www.princexml.com/). Also supports Nunjucks templating (e.g. for injecting data into documents) and default settings.

## Usage

(Prerequisite: Node.js)

`mdprint --help`

## Contributing

Run the tests with `make test`;<br>
Check code style ([semistandard](https://github.com/standard/semistandard)) with `make .code_style`;<br>
See `makefile` and `package.json` for more.

## Licence

MIT
