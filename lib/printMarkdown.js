module.exports = printMarkdown;

const nunjucks = require('nunjucks');
const MarkdownIt = require('markdown-it');
const tmp = require('tmp-promise');
const fs = require('fs');
const Prince = require('prince');

tmp.setGracefulCleanup();

// TODO: see about using Buffers instead of strings

/**
 * Prints the designated Markdown (or HTML) source file(s) into the designated PDF target file.
 *
 * @param {string|Array} sourcePaths The path(s) of the source Markdown or HTML file(s)
 * @param {string} targetPath The path of the target PDF file
 * @param {options} options Printing options (e.g. metadata, markdown)
 */
async function printMarkdown (sourcePaths, targetPath, options) {
  if (!Array.isArray(sourcePaths)) {
    sourcePaths = [sourcePaths];
  }

  // 1. Render Nunjucks templating if any

  let buffers = sourcePaths.map((filePath) => {
    return nunjucks.render(filePath, options.metadata);
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

  return Prince()
    .inputs(htmlPaths)
    .output(targetPath)
    // .option(name, value) // to set CSS & possibly more
    // .license(licencePath)
    .execute();
}
