/*  Tasks:
 *    lint
 *    bundle:js
 *      (Requires completion of: lint.)
 *    bundle
 *      (Requires completion of: lint.)
 *    build
 *      (Requires completion of: bundle.)
 *    default
 *      (Requires completion of: bundle:js.)
 */

/* File globs. */
var gulpJS = 'gulpfile.js';
var clientJS = 'src/client/**/*.js';
var serverJS = 'src/server/**/*.js';
var minifiedJS = 'src/**/*.min.js';
var bundledJS = 'src/client/app.min.js';
var clientHTML = 'src/client/**/*.html';
var clientCSS = 'src/client/**/*.css';
var clientImgs = 'src/client/**/img/**/*';
var lintFiles = [gulpJS, clientJS, serverJS, '!' + minifiedJS];
var bundleJSFiles = [clientJS, '!' + minifiedJS];
var buildFiles = [clientHTML, clientCSS, clientImgs, bundledJS];

/* Gulp and plugins. */
var gulp = require('gulp');
var concat = require('gulp-concat');
var gls = require('gulp-live-server');
var jshint = require('gulp-jshint');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var del = require('del');

/*  gulp lint
 *    Lints .js files.
 */
gulp.task('lint', function() {
  return gulp.src(lintFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

/*  gulp bundle:js
 *    Concatenates and minifies client .js files, and outputs the resulting
 *    app.min.js file to the src/client directory.
 */
gulp.task('bundle:js', ['lint'], function() {
  return gulp.src(bundleJSFiles)
    // Remove sourcemaps in production build.
    .pipe(sourcemaps.init())
      .pipe(concat('app.min.js'))
      .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('src/client'));
});

/*  gulp bundle
 *    Same as bundle:js but without sourcemaps.
 */
 gulp.task('bundle', ['lint'], function() {
   return gulp.src(bundleJSFiles)
     .pipe(concat('app.min.js'))
     .pipe(uglify())
     .pipe(gulp.dest('src/client'));
 });

/*  gulp build
 *    Populates the dist folder.
 */
gulp.task('build', ['bundle'], function() {
  // Delete existing files.
  del(['dist/**/*'])
    .then(function() {
      // Copy the build files to the dist/ directory.
      return gulp.src(buildFiles, {base: 'src/client'})
        .pipe(gulp.dest('dist'));
    });
});

/*  gulp
 *    Starts the livereloading server and watches for file changes.
 */
gulp.task('default', ['bundle:js'], function() {
  // Start server.js on its port (3000) and start the livereload server on port 35729.
  var server = gls('src/server/server.js', undefined, 35729);
  // Note: The server must log some output in order for control to be passed back to gulp.
  server.start();

  // Live reload .html, .css, and bundled .js file changes.
  gulp.watch([
    clientCSS,
    clientHTML,
    bundledJS
  ], function (file) {
    server.notify.apply(server, [file]);
  });

  // Rebundle .js file changes.
  gulp.watch(bundleJSFiles, ['bundle:js']);

  // Lint non-client .js file changes.
  gulp.watch(lintFiles.filter(function(ele) {
    return bundleJSFiles.indexOf(ele) === -1;
  }));

  // Restart server when server .js files changes.
  gulp.watch([serverJS], function() {
    server.start.bind(server)();
  });
});
