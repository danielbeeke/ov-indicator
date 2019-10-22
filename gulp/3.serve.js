'use strict';

const proxy = require('proxy-middleware');
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
global.reload = browserSync.reload;
global.stream = browserSync.stream;
const url = require('url');
const fs = require('fs');

process.setMaxListeners(0);

gulp.task('browsersync', () => {

  browserSync.init({
    port: 4000,
    server: {
      baseDir: 'public',
      middleware: [function(req, res, next) {
        let fileName = url.parse(req.url).pathname;
        let fileExists = fs.existsSync('public/' + fileName);
        if (!fileExists && fileName.indexOf("browser-sync-client") < 0 || fileName === '/') {
          req.url = '/404.html';
        }
        return next();
      }]
    },
    https: true,
    ghostMode: true,
  });

  gulp.watch(['public/javascript/**/*']).on('change', reload);
  gulp.watch('scss/**/*', { usePolling: true }, gulp.series('css'));
});

gulp.task('serve', gulp.series('css', 'browsersync'));