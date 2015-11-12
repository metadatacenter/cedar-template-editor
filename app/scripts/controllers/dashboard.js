'use strict';

var DashboardController = function ($rootScope, $scope, $routeParams, $location, FormService, HeaderService, UrlService, CONST) {

  // Define function to make async request to location of json objects and assign proper
  // scope array with returned list of data
  $scope.getDefaults = function (type, scopeArray) {
    FormService[type]().then(function (response) {
      // Sort by the 'favorites' boolean parameter
      var sortFavorites = $rootScope.sortBoolean(response, 'favorite');
      // Slicing the top 3 out into new array and returning to the template
      $scope[scopeArray] = sortFavorites.slice(0, 3);
    }).catch(function (err) {
      console.log(err);
    });
  };

  // Submissions have a bit different requirements so they get their own function
  $scope.getSubmissions = function () {
    FormService.populatedTemplatesList().then(function (response) {
      $scope.submissionDefaults = response;
    }).catch(function (err) {
      console.log(err);
    });
  };

  // Remove template
  $scope.removeTemplate = function (id) {
    FormService.removeTemplate(id).then(function (response) {
      // Reload templates
      $scope.getDefaults('formList', 'templateDefaults');
    }).catch(function (err) {
      console.log(err);
    });
  }

  // Remove element
  $scope.removeElement = function (id) {
    FormService.removeElement(id).then(function (response) {
      // Reload elements
      $scope.getDefaults('elementList', 'elementDefaults');
    }).catch(function (err) {
      console.log(err);
    });
  }

  // Remove populated template
  $scope.removeInstance = function (id) {
    FormService.removePopulatedTemplate(id).then(function (response) {
      // Reload populated templates
      $scope.getSubmissions();
    }).catch(function (err) {
      console.log(err);
    });
  }

  // ************************************************************************************

  // set Page Title variable when this controller is active
  $rootScope.pageTitle = 'Dashboard';

  // Create $scope arrays to load defaults elements/templates into
  $scope.elementDefaults = [];
  $scope.templateDefaults = [];
  $scope.submissionDefaults = [];

  // Inject constants
  $scope.CONST = CONST;

  var currentRole = $rootScope.applicationRole;
  var currentApplicationMode = $rootScope.applicationMode;
  if ($routeParams.role) {
    if ($routeParams.role == 'as-creator') {
      currentRole = 'creator';
      currentApplicationMode = CONST.applicationMode.CREATOR;
    } else if ($routeParams.role == 'as-instantiator') {
      currentRole = 'instantiator';
      currentApplicationMode = CONST.applicationMode.RUNTIME;
    }
  }
  if (currentApplicationMode == CONST.applicationMode.DEFAULT) {
    $location.path(UrlService.getRoleSelector());
    return;
  }

  // Configure mini header
  var pageId = CONST.pageId.DASHBOARD;
  HeaderService.configure(pageId, currentApplicationMode);
  $rootScope.applicationRole = currentRole;

  // Call getDefaults with parameters
  $scope.getDefaults('formList', 'templateDefaults');
  $scope.getDefaults('elementList', 'elementDefaults');
  $scope.getSubmissions();

};

DashboardController.$inject = ["$rootScope", "$scope", "$routeParams", "$location", "FormService", "HeaderService", "UrlService", "CONST"];
angularApp.controller('DashboardController', DashboardController);