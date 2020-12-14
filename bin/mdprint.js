#!/usr/bin/env node

const yargs = require('yargs/yargs');
const options = require('../lib/options');
const printMarkdown = require('../lib/printMarkdown');
const process = require('process');

const argv = yargs(process.argv.slice(2))
  .usage('Usage: $0 <Markdown file(s)> [options] --output <PDF file>')
  .example('$0 doc.md -o doc.pdf', 'Single Markdown file')
  .example('$0 ch1.md ch2.md ch3.md -o book.pdf', 'Multiple Markdown files (to be concatenated)')
  .demandCommand(1, 'Please specify at least one Markdown file')
  .option('o', {
    alias: 'output',
    describe: 'Name of the PDF file to generate',
    nargs: 1,
    defaultDescription: '<input>.pdf'
  })
  .help('h')
  .alias('h', 'help')
  .alias('v', 'version')
  .argv;

const opts = options.parse();

printMarkdown(argv._, argv.output, opts)
  .then(() => {
    console.log('OK');
    process.exit(0);
  })
  .catch((err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });
