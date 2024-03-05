const gulp = require('gulp');
const lunrIndex = require('gulp-lunr-index');

gulp.task('index', () => {
  return gulp.src('docs/**/*.adoc')
    .pipe(lunrIndex({
      indexPath: 'ui/search-index.json',
      pluginOptions: {
        ref: 'path',
        fields: {
          contents: 1,
          title: 10
        }
      }
    }))
    .pipe(gulp.dest('.'));
});
