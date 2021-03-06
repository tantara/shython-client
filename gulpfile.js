var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var ngAnnotate = require('gulp-ng-annotate');
var browserify = require('gulp-browserify');
var templateCache = require('gulp-angular-templatecache');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass', 'scripts']);

gulp.task('js', function () {
  gulp.src(['./www/js/*.js'])
  .pipe(concat('app.js'))
  .pipe(gulp.dest('./www/dist/'))
})

gulp.task('templates', function () {
  return gulp.src('./www/templates/**/*.html')
  .pipe(templateCache({
    module: 'starter.templates',
    moduleSystem: 'Browserify',
    standalone: true,
  }))
  .pipe(concat('templates.js'))
  .pipe(gulp.dest('./www/js/'))
});

gulp.task('annotate', function () {
  gulp.src(['./www/dist/app.js'])
  .pipe(ngAnnotate())
  .pipe(rename({ extname: '.min.js' }))
  .pipe(gulp.dest('./www/dist/'))
})

gulp.task('scripts', function() {
  gulp.src(['./www/js/app.js'])
    .pipe(browserify())
    .pipe(gulp.dest('./www/dist/'))
});

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch('./www/templates/**/*.html', ['templates']);
  gulp.watch('./www/js/**/*.js', ['scripts']);
  gulp.watch('./www/dist/app.js', ['annotate']);
  //gulp.watch('./www/js/**/*.js', ['js']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
