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
const basicMD = path.join(__dirname, '/fixtures/basic.md');

test('Should generate a PDF from a Markdown file', async (t) => {
  const pdfName = await tmpPDFName();

  await cli()
    .run(`${bin} "${basicMD}" --output "${pdfName}"`)
    .stdout(/OK/)
    .go();

  const pdfBuffer = await fs.readFile(pdfName);
  t.assert(pdfBuffer.length > 0, 'The generated file must not be empty');

  const pdfData = await pdf(pdfBuffer);
  t.assert(/Level 1.+Level 2.+Paragraph text.+some code.+Item 1.+Item 2/gs
    .test(pdfData.text), 'Generated PDF contents must match source Markdown contents');
});

test('Should name the PDF after the input file if no output name is specified', async (t) => {
  const expectedPDFName = path.join(__dirname, '/fixtures/basic.pdf');

  // make sure no PDF is there beforehand
  if (fsSync.existsSync(expectedPDFName)) {
    await fs.unlink(expectedPDFName);
  }

  await cli()
    .run(`${bin} "${basicMD}"`)
    .stdout(/OK/)
    .go();

  t.assert(fsSync.existsSync(expectedPDFName), 'The generated PDF should exist');
  await fs.unlink(expectedPDFName);
});

test('Should respond with an error if the input file does not exist', async (t) => {
  const mdName = path.join(__dirname, '/no-file-here.md');
  const pdfName = await tmpPDFName();

  await cli()
    .run(`${bin} "${mdName}" --output "${pdfName}"`)
    .stderr(/could not find file/i)
    .go();

  t.assert(!fsSync.existsSync(pdfName), 'No PDF should be generated');
});

async function tmpPDFName () {
  return await tmp.tmpName({ postfix: '.pdf' });
}

/**
 * nixt wrapper: cwd() is setup and go() returns a promisified end().
 */
function cli () {
  const n = nixt();
  n.go = util.promisify(n.end);
  return n.cwd(path.join(__dirname, '/..'));
}
