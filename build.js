var handlebars = require('handlebars'),
    hbmd = require('metalsmith-hbt-md'),
    markdown = require('metalsmith-markdown-remarkable'),
    markdownClassy = require('remarkable-classy'),
    metalsmith = require('metalsmith')(__dirname),
    watch = process.argv[2] === 'watch' ? require('metalsmith-watch') : null;

metalsmith
    .source('./src')
    .destination('./build')
    .clean(false) // to keep .git, CNAME etc.
    .use(hbmd(handlebars, {
      pattern: '**/*.md'
    }))
    .use(markdown('full', {
      breaks: true,
      typographer: true,
      quotes: '«»‘’'
    }).use(markdownClassy));

if (watch) {
  metalsmith.use(watch());
}

metalsmith.build(function (err) {
  if (err) { return console.error(err); }
  console.log('OK');
});
