if (window.__karma__) {
  var allTestFiles = [];
  var TEST_REGEXP = /spec\.js$/;

  Object.keys(window.__karma__.files).forEach(function(file) {
    if (TEST_REGEXP.test(file)) {
      // Normalize paths to RequireJS module names.
      allTestFiles.push(file);
    }
  });
}

require.config({
  paths   : {
    'angular'     : 'bower_components/angular/angular',
    'angularMocks': 'bower_components/angular-mocks/angular-mocks',
    'jquery'      : 'bower_components/jquery/jquery',
    'moment'      : 'bower_components/moment/moment',

    'lib'       : 'bower_components',
    'lib/custom': 'cedar/scripts',
    '3rdparty'  : 'third_party_components',

    // requirejs plugins
    'text': 'bower_components/requirejs-plugins/lib/text',
    'json': 'bower_components/requirejs-plugins/src/json',

    'app'                  : 'scripts/app',
    'cedar/template-editor': 'scripts',

    'ckeditor': 'bower_components/ng-ckeditor/libs/ckeditor/ckeditor'
  },
  shim    : {
    'angular'                                                                        : {
      'deps'   : ['jquery'],
      'exports': 'angular'
    },
	'angularMocks': {
	  deps: ['angular'],
	  'exports': 'angular.mock'
	},
    'lib/angucomplete-alt/angulcomplete-alt'                                         : ['angular'],
    'lib/angular-animate/angular-animate'                                            : ['angular'],
    'lib/angular-bootstrap/ui-bootstrap'                                             : ['angular'],
    'lib/angular-bootstrap/ui-bootstrap-tpls'                                        : ['angular'],
    'lib/angular-route/angular-route'                                                : ['angular'],
    'lib/angular-sanitize/angular-sanitize'                                          : ['angular'],
    'lib/angular-translate/angular-translate'                                        : ['angular'],
    'lib/angular-translate-loader-static-files/angular-translate-loader-static-files': ['lib/angular-translate/angular-translate'],
    'lib/angular-toasty/dist/angular-toasty'                                         : ['angular'],
    'lib/angular-ui-select/dist/select'                                              : ['angular'],
    'lib/angular-ui-sortable/sortable'                                               : ['angular'],
    'lib/angulartics/angulartics'                                                    : ['angular'],
    'lib/angulartics-google-analytics/angulartics-google-analytics'                  : ['angular'],

    '3rdparty/angular-fitvids/angular-fitvids': {
      deps   : ['angular', 'jquery'],
      exports: 'fitVids'
    },

    'lib/ng-ckeditor/ng-ckeditor': ['angular', 'ckeditor']
    ,
    'ckeditor'                   : {
      'exports': 'CKEDITOR'
    },

    'lib/ngHandsontable/dist/ngHandsontable': ['angular',
                                               'lib/handsontable/dist/handsontable.full'],

    'lib/handsontable/dist/handsontable.full'                                    : {'exports': 'Handsontable'},
    'lib/bootstrap/dist/js/bootstrap'                                            : ['jquery'],
    'lib/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min': ['jquery'],
    'lib/bootstrap-select/dist/js/bootstrap-select.min'                          : ['lib/bootstrap/dist/js/bootstrap'],

    'lib/custom/handsontable/SpreadsheetContext' : ['lib/handsontable/dist/handsontable.full'],
    'lib/custom/handsontable/MultiCheckboxEditor': ['lib/handsontable/dist/handsontable.full'],
  },
  priority: [
    'jquery',
    'angular',
  ],
  deps: window.__karma__ ? allTestFiles : [],
  callback: window.__karma__ ? window.__karma__.start : null,
  baseUrl: window.__karma__ ? '/base' : '',
});

// do not load the full app here.
// maybe we will be redirected to Keycloak for authentication
require([
  'angular',
], function (angular) {
  var $html = angular.element(document.getElementsByTagName('html')[0]);
  angular.element().ready(function () {

    function continueWithAngularApp() {
      console.log("continueWithAngularApp");
      require([
        'angular',
        'app',
      ], function (angular, app) {
        angular.bootstrap(document, ['cedar.templateEditor']);
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

    if (window.__karma__) {
      // use this for unauthorized access during development
      window.bootstrapUserHandler = new NoauthUserHandler();
    } else {
      // use this for live servers
      window.bootstrapUserHandler = new KeycloakUserHandler();
    }
    window.bootstrapUserHandler.initUserHandler(successInitUserHandler, failInitUserHandler);
  });

});