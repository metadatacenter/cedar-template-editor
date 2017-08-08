/**
 * Webpack configuration object
 */

const path = require('path');

module.exports = {


  output: {
    // options related to how webpack emits results

    path: path.resolve(__dirname, "dist"), // string
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)

    filename: "bundle.js", // string
    // the filename template for entry chunks

    publicPath: "/assets/", // string
    // the url to the output directory resolved relative to the HTML page

    library: "MyLibrary", // string,
    // the name of the exported library

    libraryTarget: "umd", // universal module definition
    // the type of the exported library

    /* Advanced output configuration (click to show) */
  },

  module: {
    // configuration regarding modules

    rules: [
      // rules for modules (configure loaders, parser options, etc.)

      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, "app")
        ],
        exclude: [
          path.resolve(__dirname, "app/demo-files")
        ],
        // these are matching conditions, each accepting a regular expression or string
        // test and include have the same behavior, both must be matched
        // exclude must not be matched (takes preferrence over test and include)
        // Best practices:
        // - Use RegExp only in test and for filename matching
        // - Use arrays of absolute paths in include and exclude
        // - Try to avoid exclude and prefer include

        issuer: { test, include, exclude },
        // conditions for the issuer (the origin of the import)

        enforce: "pre",
        enforce: "post",
        // flags to apply these rules, even if they are overridden (advanced option)

        loader: "babel-loader",
        // the loader which should be applied, it'll be resolved relative to the context
        // -loader suffix is no longer optional in webpack2 for clarity reasons
        // see webpack 1 upgrade guide

        options: {
          presets: ["es2015"]
        },
        // options for the loader
      },

      {
        test: /\.html$/,

        use: [
          // apply multiple loaders and options
          "htmllint-loader",
          {
            loader: "html-loader",
            options: {
              /* ... */
            }
          }
        ]
      },

      { oneOf: [ /* rules */ ] },
      // only use one of these nested rules

      { rules: [ /* rules */ ] },
      // use all of these nested rules (combine with conditions to be useful)

      { resource: { and: [ /* conditions */ ] } },
      // matches only if all conditions are matched

      { resource: { or: [ /* conditions */ ] } },
      { resource: [ /* conditions */ ] },
      // matches if any condition is matched (default for arrays)

      { resource: { not: /* condition */ } }
      // matches if the condition is not matched
    ],

    /* Advanced module configuration (click to show) */
  },


  resolve: {
    modules: [
      path.join(__dirname, 'dev/app/'), // baseUrl
      path.join(__dirname, 'node_modules')
    ],

        extensions: [
      '.js', '.jsx', '.coffee'
    ],

    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules|app\/assets/,
        enforce: "pre",
        loader: "eslint-loader",
        options: {
          failOnWarning: false,
          failOnError: true
        }
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ],


    alias: {
      //Aliases
      angular: path.join(__dirname, 'dev/app/assets/vendor/angular/angular.min'),
      angularMocks: path.join(__dirname, 'dev/app/assets/vendor/angular-mocks/angular-mocks'),
      jquery: path.join(__dirname, 'dev/app/assets/vendor/jquery/jquery.min'),
      moment: path.join(__dirname, 'dev/app/assets/vendor/moment/min/moment.min'),
      lib: 'dev/app/assets/vendor',
      thirdparty: 'dev/app/assets/vendor/third_party_components',
      text: 'dev/app/assets/vendor/requirejs-plugins/lib/text',
      json: 'dev/app/assets/vendor/requirejs-plugins/src/json',
      app : 'scripts/app',
      scripts: 'scripts',
      ckeditor: 'dev/app/assets/vendor/ng-ckeditor/libs/ckeditor/ckeditor',
      jsonld: 'dev/app/assets/vendor/jsonld/js/jsonld'
      //...
    }
  },

  shim    : {
    'angular'                                                                            : {
      'deps'   : ['jquery'],
      'exports': 'angular'
    },
    'angularMocks'                                                                       : {
      deps     : ['angular'],
      'exports': 'angular.mock'
    },
    'lib/angucomplete-alt/angulcomplete-alt'                                             : ['angular'],
    'lib/angular-animate/angular-animate.min'                                            : ['angular'],
    'lib/angular-bootstrap/ui-bootstrap.min'                                             : ['angular'],
    'lib/angular-bootstrap/ui-bootstrap-tpls.min'                                        : ['angular'],
    'lib/angular-route/angular-route.min'                                                : ['angular'],
    'lib/angular-sanitize/angular-sanitize.min'                                          : ['angular'],
    'lib/angular-translate/angular-translate.min'                                        : ['angular'],
    'lib/angular-translate-loader-static-files/angular-translate-loader-static-files.min': ['lib/angular-translate/angular-translate.min'],
    'lib/angular-toasty/dist/angular-toasty.min'                                         : ['angular'],
    'lib/angular-ui-select/dist/select.min'                                              : ['angular'],
    'lib/angular-ui-sortable/sortable.min'                                               : ['angular'],
    'lib/angulartics/dist/angulartics.min'                                               : ['angular'],


    '3rdparty/angular-fitvids/angular-fitvids': {
      deps   : ['angular', 'jquery'],
      exports: 'fitVids'
    },

    'lib/ng-ckeditor/ng-ckeditor.min': ['angular', 'ckeditor'],
    'ckeditor'                       : {
      'exports': 'CKEDITOR'
    },

    // 'lib/ngHandsontable/dist/ngHandsontable.min'                                 : ['angular',
    //                                                                                 'lib/handsontable/dist/handsontable.full'],
    'lib/handsontable/dist/handsontable.full'                                : {'exports': 'Handsontable'},
    'lib/bootstrap/dist/js/bootstrap.min'                                        : ['jquery'],
    'lib/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min': ['jquery'],
    'lib/bootstrap-select/dist/js/bootstrap-select.min'                          : ['lib/bootstrap/dist/js/bootstrap.min'],
    'scripts/handsontable/SpreadsheetContext'                      : ['lib/handsontable/dist/handsontable.full'],
    'scripts/handsontable/MultiCheckboxEditor'                     : ['lib/handsontable/dist/handsontable.full'],
    'lib/ngprogress/build/ngprogress.min'                                        : ['angular'],
  },
  priority: [
    'jquery',
    'angular',
  ],
  deps    : window.__karma__ ? allTestFiles : [],
  callback: window.__karma__ ? window.__karma__.start : null,
  baseUrl : window.__karma__ ? '/base' : '',
  urlArgs : "v=" + window.cedarCacheControl
});

// do not load the full app here.
// maybe we will be redirected to Keycloak for authentication
require([
  'angular',
], function (angular) {
  var $html = angular.element(document.getElementsByTagName('html')[0]);
  angular.element().ready(function () {

    function continueWithAngularApp() {
      //console.log("continueWithAngularApp");
      require([
        'angular',
        'app',
      ], function (angular, app) {
        angular.bootstrap(document, ['cedar.templateEditor']);

        // Set the ng-app class for Angular Protractor tests
        var root = document.documentElement;

        angular.element(root).addClass('ng-app');

      });
    }

    function successInitUserHandler(authenticated) {
      //console.log("User handler init success. Authenticated: " + authenticated);
      if (!authenticated) {
        window.bootstrapUserHandler.doLogin();
      } else {
        var uph = new UserProfileHandler();
        uph.proceed(window.bootstrapUserHandler, continueWithAngularApp);
      }
    }

    function failInitUserHandler() {
      alert("There was an error initializing the application!");
    }

    window.bootstrapUserHandler = new KeycloakUserHandler();
    window.bootstrapUserHandler.initUserHandler(successInitUserHandler, failInitUserHandler);
  });

});