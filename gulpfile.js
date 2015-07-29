'use strict';

var gulp = require('gulp');

gulp.task('default', function() {
  gulp.src(['*', '*/*', '!node_modules/*', '!test/*', '!gulpfile.js', '!deploy.sh'])
    .pipe(gulp.dest('deployment'));
});
