#!/usr/bin/env node

const yargs = require('yargs/yargs');
const options = require('../lib/options');
const printMarkdown = require('../lib/printMarkdown');
const process = require('process');

const argv = yargs(process.argv.slice(2))
  .usage('Usage: $0 <Markdown file(s)> [options]')
  .example('$0 doc.md', 'Single Markdown file; PDF will be generated in "doc.pdf"')
  .example('$0 ch1.md ch2.md ch3.md --output=book.pdf', 'Multiple Markdown files; output PDF name specified')
  .example('$0 doc-with-template.md --metadata.key="value"', 'Passing metadata for rendering template code')
  .demandCommand(1, 'Please specify at least one Markdown file')
  .option('o', {
    alias: 'output',
    describe: 'Name of the PDF file to generate',
    nargs: 1,
    defaultDescription: '<input>.pdf'
  })
  .option('d', {
    alias: 'metadata',
    describe: 'Key-value pairs to use when rendering template code',
    nargs: 1
  })
  .option('s', {
    alias: 'save-html',
    describe: 'Save the intermediate HTML file(s) (to <input>.html)',
    type: 'boolean'
  })
  .help('h')
  .alias('h', 'help')
  .alias('v', 'version')
  .argv;

const opts = options.parse({
  metadata: argv.metadata,
  saveHTML: argv['save-html']
});

printMarkdown(argv._, argv.output, opts)
  .then(() => {
    console.log('OK');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });
