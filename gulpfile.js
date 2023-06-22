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
    wait = require('gulp-wait'),
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
      .pipe(less().on('error', gutil.log))
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


gulp.task('server-development', function (done) {
  console.log("Server development");
  connect.server({
    root      : 'app',
    port      : 4200,
    livereload: true,
    fallback  : 'app/index.html'
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
      .pipe(replace('artifactsFrontendUrl', 'https://artifacts.' + cedarRestHost))
      .pipe(replace('dataciteDOIBaseUrl', 'https://bridging.' + cedarRestHost + '/doi/datacite'))
      .pipe(gulp.dest('app/config/'));
  done();
});

// Task to set up tracking
gulp.task('replace-tracking', function (done) {
  gulp.src(['app/config/src/tracking-service.conf.json'])
      .pipe(replace('googleAnalyticsKey', cedarAnalyticsKey))
      .pipe(gulp.dest('app/config/'));
  done();
});

// Task to set up version numbers in included js file
gulp.task('replace-version', function (done) {
  gulp.src(['app/config/src/version.js'])
      .pipe(replace('cedarVersionValue', cedarVersion))
      .pipe(replace('cedarVersionModifierValue', cedarVersionModifier))
      .pipe(replace('dataciteEnabledValue', dataciteEnabled))
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
gulp.task('karma-travis-env', gulp.series(['replace-url', 'replace-tracking', 'replace-version', 'lint', 'less', 'copy:resources'], function (done) {
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

gulp.task('test-env', function (done) {
  gulp.src(['tests/config/src/test-env.js'], {allowEmpty:true})
      .pipe(replace('protractorBaseUrl', 'https://cedar.' + cedarUIHost))
      .pipe(replace('protractorTestUser1Login', cedarTestUser1Login))
      .pipe(replace('protractorTestUser1Password', cedarTestUser1Password))
      .pipe(replace('protractorTestUser1Name', cedarTestUser1Name))
      .pipe(replace('protractorTestUser2Login', cedarTestUser2Login))
      .pipe(replace('protractorTestUser2Password', cedarTestUser2Password))
      .pipe(replace('protractorTestUser2Name', cedarTestUser2Name))
      .pipe(replace('protractorCedarVersion', cedarVersion))
      .pipe(gulp.dest('tests/config/'));
  done();
});

// Protractor tests
gulp.task('test-clean-up', gulp.series('test-env', function () {
  return gulp.src([
    './tests/e2e/clean-up-spec.js'
  ])
      .pipe(protractor({
        configFile: "protractor-sequential.config.js"
      }))
      .on('error', function (e) {
        throw e
      });
}));

gulp.task('test-work-space', gulp.series('test-env', function () {
  return gulp.src([
    './tests/e2e/workspace-spec.js'
  ])
      .pipe(protractor({
        configFile: "protractor-sequential.config.js"
      }))
      .on('error', function (e) {
        throw e
      });
}));

gulp.task('test-staging', gulp.series('test-env', function () {
  return gulp.src([
    './tests/e2e/staging-spec.js'
  ])
      .pipe(protractor({
        configFile: "protractor-sequential.config.js"
      }))
      .on('error', function (e) {
        throw e
      });
}));

gulp.task('test-sidebar', gulp.series('test-env', function () {
  return gulp.src([
    './tests/e2e/sidebar-spec.js'
  ])
      .pipe(protractor({
        configFile: "protractor-sequential.config.js"
      }))
      .on('error', function (e) {
        throw e
      });
}));

gulp.task('test-all', gulp.series('test-env', function () {
  return gulp.src([
    './tests/e2e/clean-up-spec.js',
    './tests/e2e/sidebar-spec.js',
    './tests/e2e/metadata-creator-spec.js',
    './tests/e2e/template-creator-spec.js',
    './tests/e2e/copy-move-spec.js',
    './tests/e2e/share-delete-spec.js',

  ])
      .pipe(protractor({
        configFile: "protractor-sequential.config.js"
      }))
      .on('error', function (e) {
        throw e
      });
}));

gulp.task('test-folder-permissions', gulp.series('test-env', function () {
  return gulp.src([
    './tests/e2e/clean-up-spec.js',
    './tests/e2e/folder-permissions-spec.js',
  ])
      .pipe(protractor({
        configFile: "protractor-sequential.config.js"
      }))
      .on('error', function (e) {
        throw e
      });
}));

gulp.task('test-resource-permissions', gulp.series('test-env', function () {
  return gulp.src([
    './tests/e2e/clean-up-spec.js',
    './tests/e2e/resource-permissions-spec.js',
  ])
      .pipe(protractor({
        configFile: "protractor-sequential.config.js"
      }))
      .on('error', function (e) {
        throw e
      });
}));

gulp.task('test-delete', gulp.series('test-env', function () {
  return gulp.src([
    './tests/e2e/create-folders-spec.js',
  ])
      .pipe(protractor({
        configFile: "protractor-sequential.config.js"
      }))
      .on('error', function (e) {
        throw e
      });
}));

gulp.task('test-copy-move', gulp.series('test-env', function () {
  return gulp.src([
    './tests/e2e/copy-move-spec.js',
  ])
      .pipe(protractor({
        configFile: "protractor-sequential.config.js"
      }))
      .on('error', function (e) {
        throw e
      });
}));

gulp.task('test-share-delete', gulp.series('test-env', function () {
  return gulp.src([
    './tests/e2e/share-delete-spec.js',
  ])
      .pipe(protractor({
        configFile: "protractor-sequential.config.js"
      }))
      .on('error', function (e) {
        throw e
      });
}));

gulp.task('test-permissions', gulp.series('test-env', function () {
  return gulp.src([
    './tests/e2e/delete-resource-spec.js',
    './tests/e2e/folder-permissions-spec.js',
    './tests/e2e/resource-permissions-spec.js',
    './tests/e2e/update-permissions-spec.js'
  ])
      .pipe(protractor({
        configFile: "protractor-sequential.config.js"
      }))
      .on('error', function (e) {
        throw e
      });
}));

gulp.task('test-update-permissions', gulp.series('test-env', function () {
  return gulp.src([
    './tests/e2e/update-permissions-spec.js'
  ])
      .pipe(protractor({
        configFile: "protractor-sequential.config.js"
      }))
      .on('error', function (e) {
        throw e
      });
}));



gulp.task('test--update-permissions', gulp.series('test-env', function () {
  return gulp.src([
    './tests/e2e/update-permissions-spec.js'
  ])
      .pipe(protractor({
        configFile: "protractor-sequential.config.js"
      }))
      .on('error', function (e) {
        throw e
      });
}));

gulp.task('test-metadata', gulp.series('test-env', function () {
  return gulp.src([
    './tests/e2e/metadata-creator-spec.js'
  ])
      .pipe(protractor({
        configFile: "protractor-sequential.config.js"
      }))
      .on('error', function (e) {
        throw e
      });
}));

gulp.task('test-template', gulp.series('test-env', function () {
  return gulp.src([
    './tests/e2e/template-creator-spec.js'
  ])
      .pipe(protractor({
        configFile: "protractor-sequential.config.js"
      }))
      .on('error', function (e) {
        throw e
      });
}));


gulp.task('test-form', gulp.series('test-env', function () {
  return gulp.src([
    './tests/e2e/metadata-creator-spec.js',
    './tests/e2e/template-creator-spec.js'
  ])
      .pipe(protractor({
        configFile: "protractor-sequential.config.js"
      }))
      .on('error', function (e) {
        throw e
      });
}));



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

// Get environment variables
let envConfig = {
  'CEDAR_ANALYTICS_KEY'       : null,
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
const cedarAnalyticsKey = envConfig['CEDAR_ANALYTICS_KEY'];
const cedarFrontendBehavior = envConfig['CEDAR_FRONTEND_BEHAVIOR'];
const cedarFrontendTarget = envConfig['CEDAR_FRONTEND_TARGET'];
const cedarVersion = envConfig['CEDAR_VERSION'];
const cedarVersionModifier = envConfig['CEDAR_VERSION_MODIFIER'];
const dataciteEnabled = envConfig['CEDAR_DATACITE_ENABLED'];

var cedarUIHostVarName = getFrontendEnvVar('UI_HOST');
envConfig[cedarUIHostVarName] = null;
var cedarRestHostVarName = getFrontendEnvVar('REST_HOST');
envConfig[cedarRestHostVarName] = null;

var cedarUser1LoginVarName = getFrontendEnvVar('USER1_LOGIN');
envConfig[cedarUser1LoginVarName] = null;
var cedarUser1PasswordVarName = getFrontendEnvVar('USER1_PASSWORD');
envConfig[cedarUser1PasswordVarName] = null;
var cedarUser1NameVarName = getFrontendEnvVar('USER1_NAME');
envConfig[cedarUser1NameVarName] = null;

var cedarUser2LoginVarName = getFrontendEnvVar('USER2_LOGIN');
envConfig[cedarUser2LoginVarName] = null;
var cedarUser2PasswordVarName = getFrontendEnvVar('USER2_PASSWORD');
envConfig[cedarUser2PasswordVarName] = null;
var cedarUser2NameVarName = getFrontendEnvVar('USER2_NAME');
envConfig[cedarUser2NameVarName] = null;

readAllEnvVarsOrFail();

var cedarUIHost = envConfig[cedarUIHostVarName];
var cedarRestHost = envConfig[cedarRestHostVarName];

var cedarTestUser1Login = envConfig[cedarUser1LoginVarName];
var cedarTestUser1Password = envConfig[cedarUser1PasswordVarName];
var cedarTestUser1Name = envConfig[cedarUser1NameVarName];

var cedarTestUser2Login = envConfig[cedarUser2LoginVarName];
var cedarTestUser2Name = envConfig[cedarUser2NameVarName];
var cedarTestUser2Password = envConfig[cedarUser2PasswordVarName];

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

taskNameList.push('lint', 'less', 'copy:resources', 'replace-url', 'replace-tracking', 'replace-version', 'test-env');
// Launch tasks
gulp.task('default', gulp.series(taskNameList, function (done) {
  done();
}));
