// Include gulp & gulp plugins
var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    less = require('gulp-less'),
    stylish = require('jshint-stylish'),
    autoprefixer = require('gulp-autoprefixer'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    connect = require('gulp-connect'),
    htmlreplace = require('gulp-html-replace'),
    ngAnnotate = require('gulp-ng-annotate'),
    historyApiFallback = require('connect-history-api-fallback'),
    Server = require('karma').Server,
    protractor = require('gulp-protractor').protractor,
    replace = require('gulp-replace'),
    colors = require('colors'),
    Proxy = require('gulp-connect-proxy',
        request = require('sync-request'),
        fs = require('fs')
    );

/**
 * Create error handling exception using gulp-util.
 */
var onError = function (err) {
  gutil.beep();
  console.log(err.red);
  this.emit('end'); //added so that gulp will end the task on error, and won't hang.
};

// Lint task
gulp.task('lint', function () {
  return gulp.src('app/scripts/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter(stylish))
      .pipe(connect.reload());
});

// Compile LESS files
gulp.task('less', function () {
  return gulp.src(['app/less/style-default.less', 'app/less/style-creator.less', 'app/less/style-runtime.less'])
      .pipe(plumber({
        errorHandler: onError
      }))
      .pipe(less().on('error', gutil.log))
      .pipe(autoprefixer({
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1', 'IE 9'],
        cascade : true
      }))
      .pipe(gulp.dest('app/css'))
      .pipe(connect.reload());
});

// Minify CSS files
// gulp.task('minifyCSS', function() {
//  return gulp.src('css/*')
//    .pipe(minifyCSS())
//   .pipe(gulp.dest('build/style.min.css'));
// });

// Support AngularJS dependency injection for minified file
// gulp.task('angular', function () {
//  return gulp.src('app/scripts/app.js')
//    .pipe(ngAnnotate())
//    .pipe(gulp.dest('dist/js'));
// });

gulp.task('copy:resources', function () {
  var glyphiconsGlob = 'app/bower_components/bootstrap/fonts/*.*';
  return gulp.src(glyphiconsGlob).pipe(gulp.dest('app/fonts/'));
});


gulp.task('server-development', function () {
  console.log("Server development");
  connect.server({
    root      : 'app',
    port      : 4200,
    livereload: true,
    fallback  : 'app/index.html'
  });
});

gulp.task('html', function () {
  return gulp.src('/app/views/*.html')
      .pipe(connect.reload());
});

// Task to replace service URLs
gulp.task('replace-url', function () {
  gulp.src(['app/config/src/url-service.conf.json'])
      .pipe(replace('templateServerUrl', 'https://template.' + cedarHost))
      .pipe(replace('resourceServerUrl', 'https://resource.' + cedarHost))
      .pipe(replace('userServerUrl', 'https://user.' + cedarHost))
      .pipe(replace('terminologyServerUrl', 'https://terminology.' + cedarHost))
      .pipe(replace('resourceServerUrl', 'https://resource.' + cedarHost))
      .pipe(replace('valueRecommenderServerUrl', 'https://valuerecommender.' + cedarHost))
      .pipe(replace('schemaServerUrl', 'https://schema.' + cedarHost))
      .pipe(gulp.dest('app/config/'));
});

// Task to set up tracking
gulp.task('replace-tracking', function () {
  gulp.src(['app/config/src/tracking-service.conf.json'])
      .pipe(replace('googleAnalyticsKey', cedarAnalyticsKey))
      .pipe(gulp.dest('app/config/'));
});

// Watch files for changes
gulp.task('watch', function () {
  gulp.watch('app/scripts/*.js', ['lint']);
  gulp.watch('app/less/*.less', ['less']);
  gulp.watch('app/views/*.html', ['html']);
});

// Tasks for tests
gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun : true
  }, done).start();
});

gulp.task('test-env', function () {
  gulp.src(['tests/config/src/test-env.js'])
      .pipe(replace('protractorBaseUrl', 'https://cedar.' + cedarHost))
      .pipe(replace('protractorTestUser1', cedarTestUser1))
      .pipe(replace('protractorTestPassword1', cedarTestPassword1))
      .pipe(replace('protractorTestUser2', cedarTestUser2))
      .pipe(replace('protractorTestPassword2', cedarTestPassword2))
      .pipe(replace('protractorTestUser3', cedarTestUser3))
      .pipe(replace('protractorTestPassword3', cedarTestPassword3))
      .pipe(replace('protractorSeleniumServerJar', cedarSeleniumServerJar))
      .pipe(replace('protractorChromeDriver', cedarChromeDriver))
      .pipe(gulp.dest('tests/config/'));
});

gulp.task('e2e', ['test-env'], function () {
  return gulp.src(['./tests/e2e/**/*.js'])
      .pipe(protractor({
        configFile: "protractor.config.js"
      }))
      .on('error', function (e) {
        throw e
      });
});

function exitWithError(msg) {
  onError(msg);
  console.log("Please see: https://github.com/metadatacenter/cedar-docs/wiki/Configure-environment-variables-on-OS-X".yellow);
  console.log("Please restart the application after setting the variables!".green);
  console.log();
  console.log();
  process.exit();
}

function readAllEnvVarsOrFail() {
  for (var key  in envConfig) {
    var value = process.env[key];
    if (!value) {
      exitWithError('You need to set the following environment variable: ' + key);
    } else {
      envConfig[key] = value;
      if (key.indexOf('PASSWORD') <= -1) {
        console.log(("- Environment variable " + key + " found: ").green + value.bold);
      }
    }
  }
}

// Get environment variables
var envConfig = {
  'CEDAR_PROFILE'            : null,
  'CEDAR_HOST'               : null,
  'CEDAR_ANALYTICS_KEY'      : null,
  'CEDAR_TEST_USER1'         : null,
  'CEDAR_TEST_USER1_PASSWORD': null,
  'CEDAR_TEST_USER2'         : null,
  'CEDAR_TEST_USER2_PASSWORD': null,
  'CEDAR_TEST_USER3'         : null,
  'CEDAR_TEST_USER3_PASSWORD': null,
  'CEDAR_SELENIUM_SERVER_JAR': null,
  'CEDAR_CHROME_DRIVER'      : null
};
console.log();
console.log();
console.log("-------------------------------------------- ************* --------------------------------------------".red);
console.log("- Starting CEDAR front end server...".green);
readAllEnvVarsOrFail();
var cedarProfile = envConfig['CEDAR_PROFILE'];
var cedarHost = envConfig['CEDAR_HOST'];
var cedarAnalyticsKey = envConfig['CEDAR_ANALYTICS_KEY'];
var cedarTestUser1 = envConfig['CEDAR_TEST_USER1'];
var cedarTestPassword1 = envConfig['CEDAR_TEST_USER1_PASSWORD'];
var cedarTestUser2 = envConfig['CEDAR_TEST_USER2'];
var cedarTestPassword2 = envConfig['CEDAR_TEST_USER2_PASSWORD'];
var cedarTestUser3 = envConfig['CEDAR_TEST_USER3'];
var cedarTestPassword3 = envConfig['CEDAR_TEST_USER3_PASSWORD'];
var cedarSeleniumServerJar = envConfig['CEDAR_SELENIUM_SERVER_JAR'];
var cedarChromeDriver = envConfig['CEDAR_CHROME_DRIVER'];
console.log("-------------------------------------------- ************* --------------------------------------------".red);
console.log();

// Prepare task list
var taskNameList = [];
if (cedarProfile === 'local') {
  taskNameList.push('server-development');
  taskNameList.push('watch');
} else if (cedarProfile === 'server') {
  console.log("Editor is configuring URLs, and exiting. The frontend content will be served by nginx");
} else {
  exitWithError("Invalid CEDAR_PROFILE value. Please set to 'local' or 'server'");
}

taskNameList.push('lint', 'less', 'copy:resources', 'replace-url', 'replace-tracking', 'test-env');
// Launch tasks
gulp.task('default', taskNameList);
