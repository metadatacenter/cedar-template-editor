// Karma configuration
// Generated on Fri Oct 16 2015 21:31:13 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'app/bower_components/jquery/jquery.js',
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-animate/angular-animate.js',
      'app/bower_components/bootstrap/dist/js/bootstrap.js',
      'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'app/bower_components/moment/min/moment.min.js',
      'app/bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
      'app/bower_components/bootstrap-select/dist/js/bootstrap-select.min.js',
      'app/scripts/app.js',
      'app/scripts/app-config.js',
      'app/scripts/app-run.js',
      'app/scripts/filters.js',
      'app/scripts/controllers/dashboard.js',
      'app/scripts/controllers/dashboard-list.js',
      'app/scripts/controllers/create-element.js',
      'app/scripts/controllers/create-template.js',
      'app/scripts/controllers/header.js',
      'app/scripts/controllers/runtime.js',
      'app/scripts/controllers/terms.js',
      'app/scripts/services/form-service.js',
      'app/scripts/directives/form-directive.js',
      'app/scripts/directives/form-preview.js',
      'app/scripts/directives/element-directive.js',
      'app/scripts/directives/field-directive.js',
      'app/scripts/directives/cedar-close-navbar.js',
      'app/scripts/directives/with-floating-label.js',
      'app/scripts/directives/resize-height.js',
      'app/scripts/directives/cedar-position-json-tools.js',
      'app/scripts/directives/date-time-picker.js',
      'app/scripts/directives/select-picker.js',
      'app/scripts/directives/angular-validator.js',
      'app/scripts/directives/cedar-sticky-left-menu.js',
      'app/scripts/directives/cedar-switch-navbar.js',
      'tests/**/*.js'
    ],


    // list of files to exclude
    exclude: [
      '**/*.swp'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'notify-send'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  })
}
