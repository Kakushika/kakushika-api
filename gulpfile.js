'use strict';

var gulp = require('gulp');

gulp.task('default', function() {
  gulp.src(['*', '*/*', '!node_modules/*', '!gulpfile.js', '!deploy.sh'])
    .pipe(gulp.dest('deployment'));
});

gulp.task('test', function() {
  // place code for your default task here
});
