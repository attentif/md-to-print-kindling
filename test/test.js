const printMarkdown = require('../lib/printMarkdown');
const options = require('../lib/options');
const test = require('tape-async');
const fs = require('fs').promises;
const path = require('path');
const tmp = require('tmp-promise');
const pdf = require('pdf-extraction');

tmp.setGracefulCleanup();

test('Should generate a PDF from a Markdown file', async (t) => {
  const sourcePath = path.join(__dirname, '/fixtures/basic.md');
  const targetPath = await tmp.tmpName({ postfix: '.pdf' });

  await printMarkdown(sourcePath, targetPath, options.getDefault());

  const pdfBuffer = await fs.readFile(targetPath);
  t.assert(pdfBuffer.length > 0, 'The generated file must not be empty');

  const pdfData = await pdf(pdfBuffer);
  t.assert(/Level 1.+Level 2.+Paragraph text.+some code.+Item 1.+Item 2/gs
    .test(pdfData.text), 'Generated PDF contents must match source Markdown contents');
});
