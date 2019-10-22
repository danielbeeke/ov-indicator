const gulp = require('gulp');
const nodeMon = require('nodemon');

gulp.task('nodemon', function (cb) {
  let called = false;
  return nodeMon({
    script: 'functions/server.js',
    ignore: [
      'gulpfile.js',
      'node_modules/'
    ]
  })
  .on('start', function () {
    if (!called) {
      called = true;
      cb();
    }
  })
  .on('restart', function () {
    setTimeout(function () {
      reload({stream: false});
    }, 100);
  });
});
