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
    },
    https: true,
    ghostMode: true,
  });

  gulp.watch(['public/javascript/**/*']).on('change', reload);
  gulp.watch('scss/**/*', { usePolling: true }, gulp.series('css'));
});

gulp.task('serve', gulp.series('css', 'browsersync'));