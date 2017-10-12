/*jslint node: true */
/*global define */
'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.core.run', [])
      .run(cedarTemplateEditorCoreRun);

  cedarTemplateEditorCoreRun.$inject = ['$rootScope', '$window', 'DataTemplateService',
                                        'DataManipulationService', 'FieldTypeService', 'UrlService',
                                        'UserService', 'RichTextConfigService',
                                        'provisionalClassService', 'CedarUser', 'UISettingsService',
                                        'TrackingService', 'MessagingService',
                                        '$httpParamSerializer', '$location'];


  function cedarTemplateEditorCoreRun($rootScope, $window, DataTemplateService,
                                      DataManipulationService, FieldTypeService, UrlService,
                                      UserService, RichTextConfigService,
                                      provisionalClassService, CedarUser, UISettingsService,
                                      TrackingService, MessagingService,
                                      $httpParamSerializer, $location) {

    $rootScope.isArray = angular.isArray;

    $rootScope.pageId = null;

    $rootScope.sortableOptions = {
      handle: ".sortable-handler"
    };

    $rootScope.propertiesOf = DataManipulationService.propertiesOf;
    $rootScope.schemaOf = DataManipulationService.schemaOf;


    // Simple function to check if an object is empty
    $rootScope.isEmpty = function (obj) {
      return !obj || Object.keys(obj).length === 0;
    };


    CedarUser.init();
    // Make it available for everybody through rootScope
    $rootScope.cedarUser = CedarUser;

    // Inject user data:
    // read from Keycloak
    // read in Non-Angular way from user.... REST endpoint
    UserService.injectUserHandler($window.bootstrapUserHandler);

    // Init the services that have dependencies on configuration
    DataTemplateService.init();
    FieldTypeService.init();
    UrlService.init();
    provisionalClassService.init();
    DataManipulationService.init();
    UISettingsService.init();
    TrackingService.init();
    MessagingService.init();

    // Make objects available through rootScope
    //$rootScope.cts = ControlledTermService;
    //$rootScope.vrs = ValueRecommenderService;
    $rootScope.editorOptions = RichTextConfigService.getConfig("default");

    $rootScope.util = {
      buildUrl: function (url, params) {
        var serializedParams = $httpParamSerializer(params);
        if (serializedParams.length > 0) {
          url += ((url.indexOf('?') === -1) ? '?' : '&') + serializedParams;
        }
        return url;
      }
    };

    //$rootScope.$on('$locationChangeStart', function (event) {
    //  $rootScope.setHeader();
    //});

    $rootScope.setHeader = function () {

      var e = jQuery("#top-navigation");
      e.removeClass('metadata').removeClass('template').removeClass('dashboard').removeClass('element');
      //jQuery("body").css('overflow:scroll');

      if ($location.path().startsWith("/dashboard")) {
        //jQuery("body").css('overflow:hidden');
        e.addClass('dashboard');
      } else if ($location.path().startsWith("/elements")) {
        e.addClass('element');

      } else if ($location.path().startsWith("/templates")) {
        e.addClass('template');

      } else if ($location.path().startsWith("/instances")) {
        e.addClass('metadata');
      }
    };

    $rootScope.documentState = {
      valid: true
    };

    $rootScope.$on("form:validation", function (even, options) {
      $rootScope.setValidation(options.state);
    });

    $rootScope.setValidation = function (value) {
      console.log('setValidation',value);
      $rootScope.documentState.valid = value;
    };
    $rootScope.isValid = function () {
      console.log('isValid',$rootScope.documentState.valid);
      return $rootScope.documentState.valid;
    };

    $rootScope.$on("form:dirty", function () {
      console.log('on form:dirty');
      $rootScope.setDirty(true);
    });

    // keeping track of dirty, locked, and valid documents
    $rootScope.dirty = false;
    $rootScope.setDirty = function (value) {
      $rootScope.dirty = value;
    };
    $rootScope.isDirty = function () {
      return $rootScope.dirty;
    };

    $rootScope.locked = false;
    $rootScope.setLocked = function (value) {
      $rootScope.locked = value;
    };
    $rootScope.isLocked = function () {
      return $rootScope.locked;
    };





  }

});
