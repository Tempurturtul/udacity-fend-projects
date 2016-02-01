// TODO: Optimize images with responsiveness.
// TODO: Optimize audio and video.
// TODO: Inline critical css.

/*  gulpfile.js
 *
 *  This is Tempurturtul's gulpfile. It makes a few assumptions about folder
 *  structure and requires some markup on html files. Currently handles
 *  automation of front-end tasks only.
 *
 *  Requirements:
 *    Folder Structure:
 *      - Client-side files placed in directory defined by SRC.
 *      - Images placed in arbitrarily deep subdirectory named 'image'.
 *      - Audio placed in arbitrarily deep subdirectory named 'audio'.
 *      - Videos placed in arbitrarily deep subdirectory named 'video'.
 *      - NOTE: Folders defined by DIST and TMP will be automatically created
 *        and subject to automated deletion.
 *    HTML Markup:
 *      - Insert gulp-useref build blocks around external .js and .css resources
 *        that need to be included in the production files. (See gulp-useref for
 *        details.)
 *        - NOTE: Use absolute paths when using build:js or build:css in html
 *          not in the top level of the SRC folder.
 *        - Included custom gulp-useref build blocks:
 *          - build:jschanged, build:csschanged
 *            - Updates html with the new name/location of the file(s). Does not
 *              (re)process the file(s).
 *            - Example:
 *              - <!-- Another html file contains a reference to these same
 *              - files. They are concatenated and renamed there, there is no
 *              - need to repeat the process here. -->
 *              - <!-- build:jschanged combined.js -->
 *              - <script src="foo.js"></script>
 *              - <script src="bar.js"></script>
 *              - <!-- endbuild -->
 */

/*  Tasks:
 *    lint:js           (Lint JavaScript.)
 *    lint:json         (Lint JSON.)
 *    lint              (Run all lint tasks, then watch for files to re-lint.)
 *    clean:tmp         (Delete TMP folder.)
 *    clean:dist        (Delete DIST folder.)
 *    clean             (Run all clean tasks.)
 *    build:prep        (Clean, then output useref-modified and unmodified SRC files to TMP.)
 *    build:minify      (Minify TMP files.)
 *    build:output      (Copy TMP files and bower_components to DIST.)
 *    build             (Run all build tasks, then clean TMP.)
 *    serve             (Serve SRC files, then watch for files to reload.)
 *    serve:dist        (Serve DIST files, then watch for files to reload.)
 *    serve:tunnelled   (Serve DIST files tunnelled to a random public url.)
 *    psi:desktop       (Test desktop performance and report results.)
 *    psi:mobile        (Test mobile performance and report results.)
 *    psi               (Run all psi tasks.)
 *    deploy:gh-pages   (Deploy DIST files to gh-pages.)
 *    default           (Lint and serve.)
 */


 /* Plugins. */
 var gulp = require('gulp');
 var browserSync = require('browser-sync').create();
 // var critical = require('critical').stream;
 var cssnano = require('gulp-cssnano');
 var del = require('del');
 var ghPages = require('gulp-gh-pages');
 var gulpif = require('gulp-if');
 var htmlmin = require('gulp-htmlmin');
 var imagemin = require('gulp-imagemin');
 var jshint = require('gulp-jshint');
 var jsonlint = require('gulp-jsonlint');
 var merge = require('merge-stream');
 var plumber = require('gulp-plumber');
 var pngquant = require('imagemin-pngquant');
 var psi = require('psi');
 // var responsive = require('gulp-responsive');
 var runSequence = require('run-sequence');
 var uglify = require('gulp-uglify');
 var useref = require('gulp-useref');


/* Directories. */
var SRC = 'src/';
var TMP = '.tmp/';
var DIST = 'dist/';


/* File globs. */
var htmlFiles = '**/*.html';
var cssFiles = '**/*.css';
var jsFiles = '**/*.js';
var imageFiles = '**/image/**';
var audioFiles = '**/audio/**';
var videoFiles = '**/video/**';
var bowerFiles = 'bower_components/**';
var lintableJS = [
  'gulpfile.js',
  SRC + jsFiles,
  '!**/vendor/**'
];
var lintableJSON = [
  'package.json',
  'bower.json',
  SRC + '**/*.json'
];


/* Custom useref blocks. */
function csschanged(content, target, options, alternateSearchPath) {
  // TODO: Handle alternateSearchPath.
  if (options) {
    return '<link rel="stylesheet" href="' + target + '" ' + options + '>';
  } else {
    return '<link rel="stylesheet" href="' + target + '">';
  }
}

function jschanged(content, target, options, alternateSearchPath) {
  // TODO: Handle alternateSearchPath.
  if (options) {
    return '<script src="' + target + '" ' + options + '></script>';
  } else {
    return '<script src="' + target + '"></script>';
  }
}


/* Gulp tasks. */
gulp.task('lint:js', function() {
  return gulp.src(lintableJS)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('lint:json', function() {
  return gulp.src(lintableJSON)
    .pipe(jsonlint())
    .pipe(jsonlint.reporter());
});

gulp.task('lint', ['lint:js', 'lint:json'], function() {
  gulp.watch(lintableJS, ['lint:js']);
  gulp.watch(lintableJSON, ['lint:json']);
});

gulp.task('clean:tmp', function() {
  return del([TMP]);
});

gulp.task('clean:dist', function() {
  return del([DIST]);
});

gulp.task('clean', ['clean:tmp', 'clean:dist']);

gulp.task('build:prep', ['clean'], function() {
  return merge(
    gulp.src(SRC + htmlFiles)
      .pipe(useref({
        // Custom block for case where build:css was already used on content.
        csschanged: csschanged,
        // Custom block for case where build:js was already used on content.
        jschanged: jschanged
      }))
      .pipe(gulp.dest(TMP)),
    gulp.src(SRC + imageFiles)
      .pipe(gulp.dest(TMP)),
    gulp.src(SRC + audioFiles)
      .pipe(gulp.dest(TMP)),
    gulp.src(SRC + videoFiles)
      .pipe(gulp.dest(TMP))
  );
});

/***** WiP *****/
// // NOTE: Use the vinyl branch until merged (addyosmani/critical#vinyl).
// // Currently causing worse PSI scores.
// gulp.task('build:critical', function() {
//   return gulp.src(TMP + htmlFiles)
//     .pipe(plumber())
//     .pipe(critical({
//       inline: true
//     }))
//     .pipe(gulp.dest(TMP));
// });

gulp.task('build:minify', function() {
  return merge(
    gulp.src(TMP + htmlFiles)
      .pipe(htmlmin({
        removeComments: true,
        collapseWhitespace: true,
        minifyJS: true,  // uglify
        minifyCSS: true  // clean-css
      }))
      .pipe(gulp.dest(TMP)),
    gulp.src(TMP + cssFiles)
      .pipe(cssnano())
      .pipe(gulp.dest(TMP)),
    gulp.src(TMP + jsFiles)
      .pipe(uglify())
      .pipe(gulp.dest(TMP)),
    gulp.src(TMP + imageFiles)
      .pipe(imagemin({
        use: [pngquant()]  // Better compression than optipng.
      }))
      .pipe(gulp.dest(TMP))
    // gulp.src(TMP + audioFiles)
    //   // TODO: Optimize audio files.
    //   .pipe(gulp.dest(TMP)),
    // gulp.src(TMP + videoFiles)
    //   // TODO: Optimize video files.
    //   .pipe(gulp.dest(TMP))
  );
});

gulp.task('build:output', function() {
  return merge(
    gulp.src(TMP + '/**')
      .pipe(gulp.dest(DIST)),
    gulp.src(bowerFiles)
      .pipe(gulp.dest(DIST + '/bower_components'))
  );
});

gulp.task('build', ['build:prep'], function(cb) {
  runSequence('build:minify',
              'build:output',
              'clean:tmp',
              cb);
});

/***** WiP *****/
// // TODO: Need a method for automating usage of the images once made.
// gulp.task('res', function() {
//   return gulp.src(imageFiles)
//     .pipe(responsive({
//       // TODO
//     }))
//     .pipe(gulp.dest(DIST));
// });

gulp.task('serve', function(cb) {
  browserSync.init({
    server: {
      baseDir: SRC,
      routes: {
        '/bower_components': './bower_components'
      }
    },
    notify: false,  // Prevents pop-over notifications in the browser.
    minify: false   // Prevents minification of client-side JS.
  }, cb);

  gulp.watch(htmlFiles, browserSync.reload);
  gulp.watch(cssFiles, browserSync.reload);
  gulp.watch(jsFiles, browserSync.reload);
  gulp.watch(imageFiles, browserSync.reload);
  gulp.watch(audioFiles, browserSync.reload);
  gulp.watch(videoFiles, browserSync.reload);
});

gulp.task('serve:dist', function(cb) {
  browserSync.init({
    server: {
      baseDir: DIST
    },
    notify: false,  // Prevents pop-over notifications in the browser.
    minify: false   // Prevents minification of client-side JS.
  }, cb);

  gulp.watch([DIST + '/**'], browserSync.reload);
});

gulp.task('serve:tunnelled', function(cb) {
  browserSync.init({
    server: {
      baseDir: DIST
      // baseDir: SRC,
      // routes: {
      //   '/bower_components': './bower_components'
      // }
    },
    notify: false,  // Prevents pop-over notifications in the browser.
    minify: false,  // Prevents minification of client-side JS.
    open: false,    // Prevents opening in browser.
    tunnel: true    // Tunnel the server through a random public url.
  }, cb);
});

gulp.task('psi:desktop', ['serve:tunnelled'], function() {
  var site = browserSync.instance.tunnel.url;
  // Ensure http protocol is used to avoid breaking resources.
  site = site.replace(/^https?/, 'http');

  return psi.output(site, {
    nokey: 'true',
    strategy: 'desktop',
    threshold: 1  // Prevents error if score is below default of 70.
  });
});

gulp.task('psi:mobile', ['serve:tunnelled'], function() {
  var site = browserSync.instance.tunnel.url;
  // Ensure http protocol is used to avoid breaking resources.
  site = site.replace(/^https?/, 'http');

  return psi.output(site, {
    nokey: 'true',
    strategy: 'mobile',
    threshold: 1  // Prevents error if score is below default of 70.
  });
});

gulp.task('psi', ['psi:desktop', 'psi:mobile'], function() {
  console.log('Terminating psi task...');
  browserSync.exit();
  process.exit(0);
});

gulp.task('deploy:gh-pages', function() {
  return gulp.src(DIST + '/**')
    .pipe(ghPages());
});

gulp.task('default', ['lint', 'serve']);
