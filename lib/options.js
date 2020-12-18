module.exports = {
  getDefault: getDefault,
  parse: parse
};

/**
 * @typedef {Object} options
 * @property {Object} metadata Key-value pairs to pass template code when rendering Markdown
 * @property {Object} markdown Markdown rendering options (passed to markdown-it)
 * @property {boolean} saveHTML Whether to save the intermediate HTML file(s)
 * @property {string} style CSS style sheet to use for PDF rendering
 */

/**
 * @returns {options}
 */
function getDefault () {
  return {
    metadata: {},
    markdown: {
      html: true,
      linkify: false,
      typographer: true
    },
    saveHTML: false,
    style: ''
  };
}

/**
  * Parses options from command-line options, local and global config, and defaults (first takes precedence over last)
  *
  * @param {options} cmdLineOpts Option values passed as command line arguments, if any
  * @returns {options}
  */
function parse (cmdLineOpts) {
  if (!cmdLineOpts) {
    cmdLineOpts = {};
  }
  return Object.assign(getDefault(), cmdLineOpts);
}
