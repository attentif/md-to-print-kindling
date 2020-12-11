const printMarkdown = require('../lib/printMarkdown'),
      options = require('../lib/options'),
      test = require('tape-async'),
      fs = require('fs').promises,
      path = require('path'),
      tmp = require('tmp-promise'),
      pdf = require("pdf-extraction");

tmp.setGracefulCleanup()

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