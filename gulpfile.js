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
    Proxy              = require('gulp-connect-proxy',
    request            = require('sync-request'),
    fs                 = require('fs')
);

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

gulp.task('copy:resources', function() {
  var glyphiconsGlob = 'app/bower_components/bootstrap/fonts/*.*';
  return gulp.src(glyphiconsGlob).pipe(gulp.dest('app/fonts/'));
});

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

gulp.task('cache-ontologies', function() {
  var apiKey = 'apikey token=3bdf57dc-4d53-4ca1-b6c1-a1f1fe651ea9';
  var options = {
    headers: {
      'Authorization': apiKey
    }
  }
  var ontologies = [];

  var response = request('GET', 'http://data.bioontology.org/ontologies', options);
  if (response.statusCode == 200) {
    ontologies = JSON.parse(response.getBody());
    for (var i = 0; i < ontologies.length; i++) {
      var ontology = ontologies[i];

      // load ontology categories
      var url = 'http://data.bioontology.org/ontologies/' + ontology.acronym + '/categories';
      var response = request('GET', url, options);
      if (response.statusCode == 200) {
        console.log('Retrieved category information for ' + ontology.acronym);
        var ontologyCategories = JSON.parse(response.getBody());
        ontology.categories = ontologyCategories;

        // aggregrate ontology category names
        var ontologyCategoryNames = [];
        for (var j = 0; j < ontologyCategories.length; j++) {
          ontologyCategoryNames.push(ontologyCategories[j].name);
        }
        ontology.categoriesNames = ontologyCategoryNames.join(', '); // TODO: rename variable?
      } else {
        console.log('Error requesting ontology categoies for ' + ontology.acronym + '-- ' + url);
      }

      // load ontology metrics
      var url = 'http://data.bioontology.org/ontologies/' + ontology.acronym + '/metrics';
      var response = request('GET', url, options);
      if (response.statusCode == 200) {
        console.log('Retrieved metric information for ' + ontology.acronym);
        var ontologyMetrics = JSON.parse(response.getBody());
        ontology.metrics = ontologyMetrics;
      } else {
        console.log('Error requesting ontology metrics for ' + ontology.acronym + ' -- ' + url + '; response.statusCode: ' + response.statusCode);
      }

    }
  } else {
    console.log('Error requesting ontology catalog');
  }

  // write to cache file
  fs.writeFileSync('app/cache/ontologies.json', JSON.stringify(ontologies));

});

gulp.task('cache-value-sets', function() {
  var apiKey = 'apikey token=3bdf57dc-4d53-4ca1-b6c1-a1f1fe651ea9';
  var options = {
    headers: {
      'Authorization': apiKey
    }
  }
  var valueSets = [];

  var uri = 'http://data.bioontology.org/ontologies/NLMVS/classes/roots';
  var response = request('GET', 'http://data.bioontology.org/ontologies/NLMVS/classes/roots', options);
  if (response.statusCode == 200) {
    valueSets = JSON.parse(response.getBody());

    // count children to determine size
    for (var i = 0; i < valueSets.length; i++) {
      var valueSetUri = valueSets[i].links.self + '?include=childrenCount';
      var valueSetResponse = request('GET', valueSetUri, options);
      if (valueSetResponse.statusCode == 200) {
        console.log('Retrieved value set at: ' + valueSetUri);
        var valueSet = JSON.parse(valueSetResponse.getBody());
        valueSets[i].numChildren = valueSet.childrenCount;
      } else {
        console.log('Error requesting ontology metrics for ' + ontology.acronym + ' -- ' + url + '; response.statusCode: ' + response.statusCode);
      }
    }
  } else {
    console.log('Error requesting value set catalog');
    return;
  }

  // write to cache file
  fs.writeFileSync('app/cache/value-sets.json', JSON.stringify(valueSets));

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
gulp.task('default', ['server', 'lint', 'less', 'copy:resources', 'watch']);
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
