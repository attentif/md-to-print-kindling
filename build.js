var debug = require('debug')('build'),
    metalsmith = require('metalsmith')(__dirname),
    inPlace = require('metalsmith-in-place'),
    path = require('path'),
    Remarkable = require('remarkable'),
    watch = process.argv[2] === 'watch' ? require('metalsmith-watch') : null;

metalsmith
    .source('./src')
    .destination('./build')
    .clean(false) // to keep .git, CNAME etc.
    .use(inPlace({
      engine: 'handlebars'
    }))
    .use(markdown());

function markdown() {
  var md = new Remarkable('full', {
    breaks: true,
    typographer: true,
    quotes: '«»‘’'
  });

  return function (files, metalsmith, done) {
    Object.keys(files).forEach(function (file) {
      debug('checking file: %s', file);
      if (! isMarkdown(file)) {
        return;
      }

      var data = files[file],
          dirName = path.dirname(file),
          htmlName = path.basename(file, path.extname(file)) + '.html';
      if (dirName !== '.') {
        htmlName = dirName + '/' + htmlName;
      }

      debug('converting file: %s', file);
      var str = md.render(data.contents.toString());
      data.contents = new Buffer(str);

      delete files[file];
      files[htmlName] = data;
    });
    done();
  };
}

function isMarkdown(file){
  return /\.md|\.markdown/.test(path.extname(file));
}

if (watch) {
  metalsmith.use(watch());
}

metalsmith.build(function (err) {
  if (err) { return console.error(err); }
  console.log('OK');
});
