'use strict';

const gulp = require('gulp');
const requireDir = require('require-dir');
requireDir('./gulp', { recurse: false });
gulp.task('default', gulp.series('serve'));