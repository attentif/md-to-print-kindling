module.exports = {
  getDefault: getDefault,
  parse: parse
};

/**
 * @typedef {Object} options
 * @property {Object} metadata Contextual data to possibly use in rendering the Markdown/HTML
 * @property {Object} markdown Markdown options, passed to Markdown-it
 */

/**
 * @returns {options}
 */
function getDefault () {
  return {
    metadata: {},
    markdown: {
      html: true,
      linkify: true,
      typographer: true
    }
  };
}

/**
  * Parses options from command-line options, local and global config, and defaults (first takes precedence over last)
  *
  * @returns {options}
  */
function parse () {
  return getDefault();
}
