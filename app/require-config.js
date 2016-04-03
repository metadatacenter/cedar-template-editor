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
    'lib/angular-md5/angular-md5'                                                    : ['angular'],

    '3rdparty/angular-fitvids/angular-fitvids': {
      deps   : ['angular','jquery'],
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
});

// do not load the full app here.
// maybe we will be redirected to Keycloak for authentication
require([
  'angular',
], function(angular) {
  var $html = angular.element(document.getElementsByTagName('html')[0]);
  angular.element().ready(function() {

    function continueWithAngularApp() {
      require([
        'angular',
        'app',
      ], function(angular, app) {
        angular.bootstrap(document, ['cedar.templateEditor']);
      });
    }

    function successInitUserHandler(authenticated) {
      //console.log("User handler init success. Authenticated: " + authenticated);
      if (!authenticated) {
        window.bootstrapUserHandler.doLogin();
      } else {
        continueWithAngularApp();
      }
    }

    function failInitUserHandler() {
      alert("There was an error initializing the application!");
    }

    // use this for live servers
    window.bootstrapUserHandler = new KeycloakUserHandler();
    // use this for unauthorized access during development
    //window.bootstrapUserHandler = new NoauthUserHandler();

    window.bootstrapUserHandler.initUserHandler(successInitUserHandler, failInitUserHandler);
  });

});