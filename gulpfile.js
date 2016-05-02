const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");

gulp.task('default', () => {
  return gulp.src('./src/*.js')
    .pipe(uglify())
    .pipe(rename((path) => {
      path.extname = '.min.js'
    }))
    .pipe(gulp.dest('.'));
});
