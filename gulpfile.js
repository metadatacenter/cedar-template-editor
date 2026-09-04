// Include gulp & gulp plugins
var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    less = require('gulp-less'),
    stylish = require('jshint-stylish'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    connect = require('gulp-connect'),
    htmlreplace = require('gulp-html-replace'),
    ngAnnotate = require('gulp-ng-annotate'),
    historyApiFallback = require('connect-history-api-fallback'),
    Server = require('karma').Server,
    replace = require('gulp-replace'),
    wait = require('gulp-wait'),
    colors = require('colors'),
    Proxy = require('gulp-connect-proxy',
        request = require('sync-request'),
        fs = require('fs')
    );
var execFileSync = require('child_process').execFileSync;

/**
 * Create error handling exception.
 */
var onError = function (err) {
  process.stdout.write('\x07');
  console.log(err.red);
  this.emit('end'); //added so that gulp will end the task on error, and won't hang.
};

// Lint task
gulp.task('lint', function (done) {
  return gulp.src('app/scripts/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter(stylish))
      .pipe(connect.reload());
  done();
});

// Compile LESS files
gulp.task('less', function (done) {
  return gulp.src(['app/less/style-creator.less'])
      .pipe(plumber({
        errorHandler: onError
      }))
      .pipe(less().on('error', console.error))
      .pipe(autoprefixer({
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1', 'IE 9'],
        cascade : true
      }))
      .pipe(gulp.dest('app/css'))
      .pipe(connect.reload());
  done();
});

gulp.task('copy:resources', function () {
  var glyphiconsGlob = 'app/bower_components/bootstrap/fonts/*.*';
  return gulp.src(glyphiconsGlob).pipe(gulp.dest('app/fonts/'));
});

gulp.task('copy:cee', function () {
  return gulp.src('node_modules/cedar-embeddable-editor/cedar-embeddable-editor.js')
      .pipe(gulp.dest('app/third_party_components/cedar-embeddable-editor/'));
});


gulp.task('server-development', function (done) {
  console.log("Server development");
  connect.server({
    root      : 'app',
    port      : 4200,
    livereload: true,
    fallback  : 'app/index.html',
    host: '0.0.0.0' // Listen on all interfaces
  });
  done();
});

gulp.task('html', function (done) {
  return gulp.src('/app/views/*.html')
      .pipe(connect.reload());
  done();
});

// Task to replace service URLs
gulp.task('replace-url', function (done) {
  gulp.src(['app/config/src/url-service.conf.json'])
      .pipe(replace('templateServerUrl', 'https://template.' + cedarRestHost))
      .pipe(replace('resourceServerUrl', 'https://resource.' + cedarRestHost))
      .pipe(replace('userServerUrl', 'https://user.' + cedarRestHost))
      .pipe(replace('terminologyServerUrl', 'https://terminology.' + cedarRestHost))
      .pipe(replace('resourceServerUrl', 'https://resource.' + cedarRestHost))
      .pipe(replace('valueRecommenderServerUrl', 'https://valuerecommender.' + cedarRestHost))
      .pipe(replace('groupServerUrl', 'https://group.' + cedarRestHost))
      .pipe(replace('schemaServerUrl', 'https://schema.' + cedarRestHost))
      .pipe(replace('submissionServerUrl', 'https://submission.' + cedarRestHost))
      .pipe(replace('messagingServerUrl', 'https://messaging.' + cedarRestHost))
      .pipe(replace('openViewBaseUrl', 'https://openview.' + cedarRestHost))
      .pipe(replace('impexServerUrl', 'https://impex.' + cedarRestHost))
      // The monitoring dashboard is a sibling frontend (not a REST service), so it hangs off the UI host.
      .pipe(replace('monitoringFrontendUrl', 'https://monitoring.' + cedarUIHost))
      .pipe(replace('dataciteDOIBaseUrl', 'https://bridging.' + cedarRestHost + '/doi/datacite'))
      .pipe(replace('downloadBaseUrl', 'https://bridging.' + cedarRestHost + '/resources/download'))
      .pipe(gulp.dest('app/config/'));
  done();
  gulp.src(['app/config/src/embeddable-editor-config.json'])
      .pipe(replace('terminologyBaseUrlValue', 'https://terminology.' + cedarRestHost + '/'))
      .pipe(replace('bridgeBaseUrlValue', 'https://bridge.' + cedarRestHost + '/'))
      .pipe(gulp.dest('app/config/'));
  done();
});

// Task to set up version numbers in included js file
gulp.task('replace-version', function (done) {
  gulp.src(['app/config/src/version.js'])
      .pipe(replace('cedarVersionValue', cedarVersion))
      .pipe(replace('cedarVersionModifierValue', cedarVersionModifier))
      .pipe(replace('cedarSourceCommitValue', cedarSourceCommit))
      .pipe(replace('cedarDevelopmentModeValue', cedarFrontendBehavior === 'develop'))
      .pipe(replace('dataciteEnabledValue', dataciteEnabled))
      .pipe(replace('cedarGA4TrackingIdValue', cedarGA4TrackingId))
      .pipe(gulp.dest('app/config/'));
  done();
});

// Watch files for changes
gulp.task('watch', function (done) {
  gulp.watch('app/scripts/*.js', gulp.series('lint'));
  gulp.watch('app/less/*.less', gulp.series('less'));
  gulp.watch('app/views/*.html', gulp.series('html'));
  done();
});

// Sets up the environment required to run the Karma tests in Travis
gulp.task('karma-travis-env', gulp.series(['replace-url', 'replace-version', 'lint', 'less', 'copy:resources'], function (done) {
  done();
}));

gulp.task('karma-tests', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, function (exitCode) {
    done();
    process.exit(exitCode);
  }).start();
});




function exitWithError(msg) {
  onError(msg);
  console.log(
      "Please see: https://github.com/metadatacenter/cedar-docs/wiki/Configure-environment-variables-on-OS-X".yellow);
  console.log("Please restart the application after setting the variables!".green);
  console.log();
  console.log();
  process.exit();
}

function readAllEnvVarsOrFail() {
  console.log("- Environment variables used:".yellow);
  for (var key  in envConfig) {
    if (!process.env.hasOwnProperty(key)) {
      exitWithError('You need to set the following environment variable: ' + key);
    } else {
      var value = process.env[key];
      envConfig[key] = value;
      if (key.indexOf('PASSWORD') <= -1) {
        console.log(("- Environment variable " + key + " found: ").green + value.bold);
      } else {
        console.log(("- Environment variable " + key + " found: ").green + "*******".bold);
      }
    }
  }
}

function getFrontendEnvVar(varNameSuffix) {
  return 'CEDAR_FRONTEND_' + cedarFrontendTarget + '_' + varNameSuffix;
}

function resolveSourceCommit() {
  var supplied = process.env.CEDAR_SOURCE_COMMIT;
  if (supplied && /^[0-9a-f]{40}$/.test(supplied)) {
    return supplied;
  }
  try {
    var commit = execFileSync('git', ['rev-parse', '--verify', 'HEAD'], {
      cwd: __dirname,
      encoding: 'utf8'
    }).trim();
    return /^[0-9a-f]{40}$/.test(commit) ? commit : '';
  } catch (error) {
    return '';
  }
}

// Get environment variables
let envConfig = {
  'CEDAR_GA4_TRACKING_ID'     : null,
  'CEDAR_FRONTEND_BEHAVIOR'   : null,
  'CEDAR_FRONTEND_TARGET'     : null,
  'CEDAR_VERSION'             : null,
  'CEDAR_VERSION_MODIFIER'    : null,
  'CEDAR_DATACITE_ENABLED'    : null
};
console.log();
console.log();
console.log(
    "-------------------------------------------- ************* --------------------------------------------".red);
console.log("- Starting CEDAR front end server...".green);
readAllEnvVarsOrFail();
const cedarGA4TrackingId = envConfig['CEDAR_GA4_TRACKING_ID'];
const cedarFrontendBehavior = envConfig['CEDAR_FRONTEND_BEHAVIOR'];
const cedarFrontendTarget = envConfig['CEDAR_FRONTEND_TARGET'];
const cedarVersion = envConfig['CEDAR_VERSION'];
const cedarVersionModifier = envConfig['CEDAR_VERSION_MODIFIER'];
const dataciteEnabled = envConfig['CEDAR_DATACITE_ENABLED'];
const cedarSourceCommit = resolveSourceCommit();
if (cedarFrontendBehavior === 'server' && !cedarSourceCommit) {
  exitWithError('Server payload generation requires a Git source commit');
}

var cedarUIHostVarName = getFrontendEnvVar('UI_HOST');
envConfig[cedarUIHostVarName] = null;
var cedarRestHostVarName = getFrontendEnvVar('REST_HOST');
envConfig[cedarRestHostVarName] = null;

readAllEnvVarsOrFail();

var cedarUIHost = envConfig[cedarUIHostVarName];
var cedarRestHost = envConfig[cedarRestHostVarName];

console.log(
    "-------------------------------------------- ************* --------------------------------------------".red);
console.log();

// Prepare task list
var taskNameList = [];
if (cedarFrontendBehavior === 'develop') {
  taskNameList.push('server-development');
  taskNameList.push('watch');
} else if (cedarFrontendBehavior === 'server') {
  console.log("Editor is configuring URLs, and exiting. The frontend content will be served by nginx");
} else {
  exitWithError("Invalid CEDAR_FRONTEND_BEHAVIOR value. Please set to 'develop' or 'server'!");
}

taskNameList.push('lint', 'less', 'copy:resources', 'copy:cee', 'replace-url', 'replace-version');
// Launch tasks
gulp.task('default', gulp.series(taskNameList, function (done) {
  done();
}));
