module.exports = printMarkdown;

const nunjucks = require('nunjucks');
const MarkdownIt = require('markdown-it');
const tmp = require('tmp-promise');
const fs = require('fs');
const path = require('path');
const Prince = require('prince');

tmp.setGracefulCleanup();

// TODO: see about using Buffers instead of strings

/**
 * Prints the designated Markdown (or HTML) source file(s) into the designated PDF target file.
 *
 * @param {string|Array} mdNames The path(s) of the source Markdown (or HTML) file(s)
 * @param {string} pdfName The path of the target PDF file
 * @param {options} options Printing options (e.g. metadata, markdown)
 */
async function printMarkdown (mdNames, pdfName, options) {
  if (!Array.isArray(mdNames)) {
    mdNames = [mdNames];
  }

  // 1. Render Nunjucks templating if any

  let buffers = mdNames.map((mdName) => {
    try {
      return nunjucks.render(mdName, options.metadata);
    } catch (err) {
      if (/not found/.test(err.message)) {
        const notFoundErr = new Error(`Could not find file "${mdName}"`);
        notFoundErr.stack = notFoundErr.stack.split('\n').slice(0, 2).join('\n') + '\n' + err.stack;
        throw notFoundErr;
      } else {
        throw err;
      }
    }
  });

  // 2. Render Markdown to HTML

  const md = new MarkdownIt(options.markdown);
  buffers = buffers.map((s) => {
    return md.render(s);
  });

  // 3. Render HTML to PDF

  const htmlPaths = buffers.map((s) => {
    const file = tmp.fileSync({ postfix: '.html' });
    fs.appendFileSync(file.fd, s);
    return file.name;
  });

  if (!pdfName) {
    pdfName = getDefaultPDFName(mdNames);
  }

  return Prince()
    .inputs(htmlPaths)
    .output(pdfName)
    // .option(name, value) // to set CSS & possibly more
    // .license(licencePath)
    .execute();
}

function getDefaultPDFName (mdNames) {
  const name = mdNames[0];
  return path.join(path.dirname(name), path.basename(name, path.extname(name)) + '.pdf');
}
