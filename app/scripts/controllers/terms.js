'use strict';

// Controller for the functionality of adding controlled terms to fields and elements
angularApp.controller('TermsController', function($scope) {

    $scope.enumTemp = [];

    $scope.updateEnum = function(properties) {
      // Remove invalid values from the array
      for (var i = 0; i < $scope.enumTemp.length; i++) {
        if ($scope.enumTemp[i] == "" || $scope.enumTemp[i] == null) {
          // Remove value
          $scope.enumTemp.splice(i, 1);
        }
      }
      if ($scope.enumTemp.length > 0) {
        properties['@type'].oneOf[0].enum = $scope.enumTemp;
        properties['@type'].oneOf[1].items.enum = $scope.enumTemp;
      }
      else {
        delete properties['@type'].oneOf[0].enum
        delete properties['@type'].oneOf[1].items.enum
      }
    }
  }
);