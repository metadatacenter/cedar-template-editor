// Karma configuration
// Generated on Fri Oct 16 2015 21:31:13 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: 'app',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'requirejs'],


    // list of files / patterns to load in the browser
    files: [
      // bower
      { pattern: 'bower_components/**/*.js', included: false },

      // config files
      { pattern: 'config/*.json', included: false },
      { pattern: 'resources/*.json', included: false },

      // custom libraries
      { pattern: 'cedar/scripts/**/*.js', included: false },

      // third party libraries
      { pattern: 'third_party_components/**/*.js', included: false },

      { pattern: 'scripts/**/*.js', included: false },
      { pattern: 'scripts/app.js', included: false },
      'scripts/keycloak/keycloak.js',
      'scripts/handlers/KeycloakUserHandler.js',
      'scripts/handlers/NoauthUserHandler.js',
      'require-config.js',
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
    browsers: ['Chrome', 'Firefox'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  })
}
