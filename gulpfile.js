const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require("gulp-concat");

gulp.task('default', () => {
  return gulp.src('./src/*.js')
    .pipe(uglify())
    .pipe(concat('ak-js.min.js'))
    .pipe(gulp.dest('./build/'));
});
