var metalsmith = require('metalsmith')(__dirname),
    inPlace = require('metalsmith-in-place'),
    markdown = require('metalsmith-markdown'),
    watch = process.argv[2] === 'watch' ? require('metalsmith-watch') : null;

metalsmith
    .source('./src')
    .destination('./build')
    .clean(false) // to keep .git, CNAME etc.
    .use(inPlace({
      engine: 'handlebars'
    }))
    .use(markdown());

if (watch) {
  metalsmith.use(watch());
}

metalsmith.build(function (err) {
  if (err) { return console.error(err); }
  console.log('OK');
});
