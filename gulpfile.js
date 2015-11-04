// Include gulp & gulp plugins
var gulp               = require('gulp'),
    jshint             = require('gulp-jshint'),
    less               = require('gulp-less'),
    stylish            = require('jshint-stylish'),
    autoprefixer       = require('gulp-autoprefixer'),
    gutil              = require('gulp-util'),
    plumber            = require('gulp-plumber'),
    rename             = require('gulp-rename'),
    uglify             = require('gulp-uglify'),
    minifyCSS          = require('gulp-minify-css'),
    connect            = require('gulp-connect'),
    htmlreplace        = require('gulp-html-replace'),
    ngAnnotate         = require('gulp-ng-annotate'),
    historyApiFallback = require('connect-history-api-fallback'),
    Server             = require('karma').Server,
    protractor         = require('gulp-protractor').protractor,
    Proxy              = require('gulp-connect-proxy');

// Creating error handling exception using gulp-util
var onError = function (err) {  
  gutil.beep();
  console.log(err);
};

// Lint task
gulp.task('lint', function() {
  return gulp.src('app/scripts/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(connect.reload());
});

// Compile LESS files
gulp.task('less', function() {
  return gulp.src(['app/less/style-default.less', 'app/less/style-creator.less', 'app/less/style-runtime.less'])
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(less())
    .pipe(autoprefixer({
      browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1', 'IE 9'],
      cascade: true
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

gulp.task('server', function() {
	connect.server({
		root: 'app',
		port: 4200,
		livereload: true,
		//middleware: function(connect, opt) {
		//	console.log(opt);
		//	opt.route = '/proxy';
		//	var proxy = new Proxy(opt);
		//	return [proxy, historyApiFallback({
		//		// See: https://github.com/bripkens/connect-history-api-fallback
		//		verbose: true,
		//		rewrites: [
		//			{
		//				from: /^.*\/elements\/edit\/.*$/,
		//				to: function(context) {
		//					return '/';
		//				}
		//			}
		//		]
		//	})];
		//}
	})
});


gulp.task('html', function () {
  return gulp.src('/app/views/*.html')
    .pipe(connect.reload());
});

// gulp.task('compress', function() {
//   return gulp.src('scripts/*.js')
//    .pipe(uglify())
//    .pipe(gulp.dest('dist/js'));
// });

// gulp.task('htmlreplace', function() {
//   gulp.src('index.html')
//     .pipe(htmlreplace({
//      'css': 'dist/css/styles.css',
//      'js/plugins': 'dist/js/plugins.js',
//      'js/modules': 'dist/js/modules.js'
//      'js/angular': 'dist/js/angular-scripts.js'
//     }))
//     .pipe(gulp.dest('build/'));
// });

// Watch files for changes
gulp.task('watch', function() {
  gulp.watch('app/scripts/*.js', ['lint']);
  gulp.watch('app/less/*.less', ['less']);
  gulp.watch('app/views/*.html', ['html']);
});

// Default task
gulp.task('default', ['server', 'lint', 'less', 'watch']);
// Build task
//gulp.task('build', ['minifyCSS', 'htmlreplace', 'angular']);

gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('e2e', function() {
  return gulp.src(['./tests/e2e/**/*.js'])
    .pipe(protractor({
      configFile: "protractor.config.js"
    }))
    .on('error', function(e) { throw e });
});
