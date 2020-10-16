/**
 * RequireJS configuration file
 */

require.config({
  paths   : {
    'angular'     : 'bower_components/angular/angular.min',
    'angularMocks': 'bower_components/angular-mocks/angular-mocks',
    'jquery'      : 'bower_components/jquery/jquery.min',
    'moment'      : 'bower_components/moment/min/moment.min',

    'lib'     : 'bower_components',
    '3rdparty': 'third_party_components',

    // requirejs plugins
    'text': 'bower_components/requirejs-plugins/lib/text',
    'json': 'bower_components/requirejs-plugins/src/json',

    'app'                  : 'scripts/app',
    'cedar/template-editor': 'scripts',

    'ckeditor': 'bower_components/ng-ckeditor/libs/ckeditor/ckeditor',
    'jsonld'  : 'bower_components/jsonld/js/jsonld',
    'ngFlow'  : 'bower_components/ng-flow/dist/ng-flow-standalone',
    'flow'    : 'bower_components/flow.js/dist/flow'

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
    'ngFlow'                                                                             : ['angular'],
    'flow'                                                                               : ['angular'],


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
    'lib/handsontable/dist/handsontable.full'               : {'exports': 'Handsontable'},
    'lib/bootstrap/dist/js/bootstrap.min'                   : ['jquery'],
    'lib/bootstrap-select/dist/js/bootstrap-select.min'     : ['lib/bootstrap/dist/js/bootstrap.min'],
    'cedar/template-editor/handsontable/SpreadsheetContext' : ['lib/handsontable/dist/handsontable.full'],
    'cedar/template-editor/handsontable/MultiCheckboxEditor': ['lib/handsontable/dist/handsontable.full'],
    'lib/ngprogress/build/ngprogress.min'                   : ['angular'],
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
  'angular'
], function (angular) {
  var $html = angular.element(document.getElementsByTagName('html')[0]);
  angular.element().ready(function () {

    function continueWithAngularApp() {
      require([
        'angular',
        'app',
        'ngFlow'
      ], function (angular, app, ngFlow) {
        angular.bootstrap(document, ['cedar.templateEditor']);

        // Set the ng-app class for Angular Protractor tests
        const root = document.documentElement;

        angular.element(root).addClass('ng-app');

      });
    }

    function successInitUserHandler(authenticated) {
      if (!authenticated) {
        window.bootstrapUserHandler.doLogin();
      } else {
        const uph = new UserProfileHandler();
        uph.proceed(window.bootstrapUserHandler, continueWithAngularApp);
      }
    }

    function failInitUserHandler() {
      alert("There was an error initializing the application!");
    }

    function createUUID() {
      let dt = new Date().getTime();
      let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      return uuid;
    }

    window.cedarClientSessionId = createUUID();
    window.bootstrapUserHandler = new KeycloakUserHandler();
    window.bootstrapUserHandler.initUserHandler(successInitUserHandler, failInitUserHandler);
  });

});
