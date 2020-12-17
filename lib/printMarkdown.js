module.exports = printMarkdown;

const nunjucks = require('nunjucks');
const MarkdownIt = require('markdown-it');
const markdownItSup = require('markdown-it-sup');
const markdownItSub = require('markdown-it-sub');
const markdownItFootnote = require('markdown-it-footnote');
const markdownItIns = require('markdown-it-ins');
const markdownItMark = require('markdown-it-mark');
const markdownItAttrs = require('markdown-it-attrs');
const markdownItSpans = require('markdown-it-bracketed-spans');
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
 * @param {options} options Printing options (metadata, markdown, style, etc.)
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

  const md = new MarkdownIt(options.markdown)
    .use(markdownItSup)
    .use(markdownItSub)
    .use(markdownItFootnote)
    .use(markdownItIns)
    .use(markdownItMark)
    .use(markdownItAttrs)
    .use(markdownItSpans);
  buffers = buffers.map((s) => {
    return md.render(s);
  });

  // 3. Render HTML to PDF

  const htmlNames = [];
  let htmlName;
  for (const [i, s] of buffers.entries()) {
    htmlName = options.saveHTML ? replaceExtension(mdNames[i], '.html') : tmp.fileSync({ postfix: '.html' }).name;
    fs.writeFileSync(htmlName, s);
    htmlNames[i] = htmlName;
  }

  if (!pdfName) {
    pdfName = getDefaultPDFName(mdNames);
  }

  return Prince()
    .inputs(htmlNames)
    .output(pdfName)
    .option('style', options.style)
    // .license(licencePath)
    .execute();
}

function getDefaultPDFName (mdNames) {
  return replaceExtension(mdNames[0], '.pdf');
}

function replaceExtension (fileName, newExt) {
  return path.join(path.dirname(fileName), path.basename(fileName, path.extname(fileName)) + newExt);
}
