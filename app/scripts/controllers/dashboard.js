'use strict';

var DashboardController = function ($rootScope, $scope, FormService, HeaderService) {

  // set Page Title variable when this controller is active
  $rootScope.pageTitle = 'Dashboard';

  // Create $scope arrays to load defaults elements/templates into
  $scope.elementDefaults = [];
  $scope.templateDefaults = [];
  $scope.submissionDefaults = [];
  // Configure mini header
  HeaderService.configure("DASHBOARD");

  // Define function to make async request to location of json objects and assign proper
  // scope array with returned list of data
  $scope.getDefaults = function(type, scopeArray) {
    FormService[type]().then(function(response) {
      // Sort by the 'favorites' boolean parameter
      var sortFavorites = $rootScope.sortBoolean(response, 'favorite');
      // Slicing the top 3 out into new array and returning to the template
      $scope[scopeArray] = sortFavorites.slice(0,3);
    }).catch(function(err) {
      console.log(err);
    });
  };
  // Call getDefaults with parameters
  $scope.getDefaults('formList', 'templateDefaults');
  $scope.getDefaults('elementList', 'elementDefaults');

  // Submissions have a bit different requirements so they get their own function
  $scope.getSubmissions = function() {
    FormService.populatedTemplatesList().then(function(response) {
      $scope.submissionDefaults = response;
    }).catch(function(err) {
      console.log(err);
    });
  };
  $scope.getSubmissions();

  // Remove template
  $scope.removeTemplate = function(id) {
    FormService.removeTemplate(id).then(function(response) {
      // Reload templates
      $scope.getDefaults('formList', 'templateDefaults');
    }).catch(function(err) {
      console.log(err);
    });
  }
  // Remove element
  $scope.removeElement = function(id) {
    FormService.removeElement(id).then(function(response) {
      // Reload elements
      $scope.getDefaults('elementList', 'elementDefaults');
    }).catch(function(err) {
      console.log(err);
    });
  }
  // Remove populated template
  $scope.removePopulatedTemplate = function(id) {
    FormService.removePopulatedTemplate(id).then(function(response) {
      // Reload populated templates
      $scope.getSubmissions();
    }).catch(function(err) {
      console.log(err);
    });
  }
};

DashboardController.$inject = ["$rootScope", "$scope", "FormService", "HeaderService"];
angularApp.controller('DashboardController', DashboardController);