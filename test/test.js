const nixt = require('nixt');
const test = require('tape-async');
const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const tmp = require('tmp-promise');
const util = require('util');
const pdf = require('pdf-extraction');

tmp.setGracefulCleanup();

const bin = './bin/mdprint.js';

test('Should generate a PDF from a Markdown file', async (t) => {
  const pdfName = await tmpPDFName();

  await cli()
    .run(`${bin} "${fixture('basic.md')}" --output="${pdfName}"`)
    .stdout(/OK/)
    .go();

  const pdfBuffer = await fs.readFile(pdfName);
  t.assert(pdfBuffer.length > 0, 'The generated file must not be empty');

  const pdfData = await pdf(pdfBuffer);
  t.match(pdfData.text, /Level 2.+Level 3.+Paragraph text.+some code.+Item 1.+Item 2/gs,
    'The generated PDF must match the source Markdown');
});

test('Should name the PDF after the input file if no output name is specified', async (t) => {
  const expectedPDFName = replaceExtension(fixture('basic.md'), '.pdf');

  // make sure no PDF is there beforehand
  if (fsSync.existsSync(expectedPDFName)) {
    await fs.unlink(expectedPDFName);
  }

  await cli()
    .run(`${bin} "${fixture('basic.md')}"`)
    .stdout(/OK/)
    .go();

  t.assert(fsSync.existsSync(expectedPDFName), 'The generated PDF should exist');
  await fs.unlink(expectedPDFName);
});

test('Should generate a PDF from multiple Markdown files', async (t) => {
  const pdfName = await tmpPDFName();

  await cli()
    .run(`${bin} "${fixture('basic.md')}" "${fixture('features.md')}" --output="${pdfName}"`)
    .stdout(/OK/)
    .go();

  const pdfBuffer = await fs.readFile(pdfName);
  t.assert(pdfBuffer.length > 0, 'The generated PDF must not be empty');

  const pdfData = await pdf(pdfBuffer);
  t.match(pdfData.text, /Basic.+Features/gs,
    'The generated PDF must include contents from all input files');
});

test('Should render Nunjucks templating using metadata', async (t) => {
  const pdfName = await tmpPDFName();
  const testValue = 'Value from command line';

  await cli()
    .run(`${bin} "${fixture('features.md')}" --metadata.testKey="${testValue}" --output="${pdfName}"`)
    .stdout(/OK/)
    .go();

  const pdfData = await pdf(await fs.readFile(pdfName));
  t.match(pdfData.text, new RegExp(`Metadata test: ${testValue}`, 'g'),
    'The generated PDF must contain the passed metadata value');
});

test('Should save the intermediate HTML file(s) if asked to', async (t) => {
  const pdfName = await tmpPDFName();

  await cli()
    .run(`${bin} "${fixture('basic.md')}" "${fixture('features.md')}" --save-html --output="${pdfName}"`)
    .stdout(/OK/)
    .go();

  await checkHTMLAndCleanup(replaceExtension(fixture('basic.md'), '.html'), /<h1>Basic<\/h1>/g);
  await checkHTMLAndCleanup(replaceExtension(fixture('features.md'), '.html'), /<h1>Features<\/h1>/g);

  async function checkHTMLAndCleanup (fileName, expectedContentRegex) {
    const html = (await fs.readFile(fileName)).toString();
    t.match(html, expectedContentRegex, 'The generated HTML must match source Markdown contents');
    await fs.unlink(fileName);
  }
});

test('Should handle useful Markdown extensions', async (t) => {
  const pdfName = await tmpPDFName();

  await cli()
    .run(`${bin} "${fixture('features.md')}" --save-html --output="${pdfName}"`)
    .stdout(/OK/)
    .go();

  const htmlName = replaceExtension(fixture('features.md'), '.html');
  const html = (await fs.readFile(htmlName)).toString();

  t.match(html, /<table>/g, 'Table support');
  t.match(html, /<sup>superscript/g, 'Superscript support');
  t.match(html, /<sub>subscript/g, 'Subscript support');
  t.match(html, /<sup class="footnote-ref">.+<li id="fn1" class="footnote-item"><p>footnote/gs, 'Footnote support');
  t.match(html, /<ins>insertion/g, 'Insertion support');
  t.match(html, /<s>deletion/g, 'Strikethrough (deletion) support');
  t.match(html, /<mark>highlight/g, 'Mark (highlight) support');

  await fs.unlink(htmlName);
});

test('Should handle custom CSS file', async (t) => {
  const pdfName = await tmpPDFName();

  await cli()
    .run(`${bin} "${fixture('features.md')}" --style="${fixture('style.css')}" --output="${pdfName}"`)
    .stdout(/OK/)
    .go();

  const pdfData = await pdf(await fs.readFile(pdfName));
  t.match(pdfData.text, /Features.+after H1/gs, 'Specified styles must be applied');
});

test('Should respond with an error if the input file does not exist', async (t) => {
  const mdName = path.join(__dirname, '/no-file-here.md');
  const pdfName = await tmpPDFName();

  await cli()
    .run(`${bin} "${mdName}" --output="${pdfName}"`)
    .stderr(/could not find file/i)
    .go();

  t.assert(!fsSync.existsSync(pdfName), 'No PDF should be generated');
});

/**
 * nixt wrapper: cwd() is setup and go() returns a promisified end().
 */
function cli () {
  const n = nixt();
  n.go = util.promisify(n.end);
  return n.cwd(path.join(__dirname, '/..'));
}

/**
 * Returns the full fixture filename.
 */
function fixture (name) {
  return path.join(__dirname, '../test/fixtures', name);
}

async function tmpPDFName () {
  return await tmp.tmpName({ postfix: '.pdf' });
}

function replaceExtension (fileName, newExt) {
  return path.join(path.dirname(fileName), path.basename(fileName, path.extname(fileName)) + newExt);
}
