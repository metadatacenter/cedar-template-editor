'use strict';

angularApp.controller('CreateElementController', function ($rootScope, $scope, $dialog, FormService) {

    // set Page Title variable when this controller is active
    $rootScope.pageTitle = 'Element Creator';

    // new element
    $scope.element = {};
    $scope.element.id = 1;
    $scope.element.fields = [];

    // add new field drop-down:
    $scope.addField = {};
    $scope.addField.lastAddedID = 0;

    // create new field button click
    $scope.addNewField = function(fieldType){
      // incr field_id counter
      $scope.addField.lastAddedID++;

      var newField = {
        "id" : $scope.addField.lastAddedID,
        "title" : "",
        "description": "",
        "input_type" : fieldType,
        "required" : false,
      };

      // put newField into fields array
      $scope.element.fields.push(newField);
    }

    // deletes particular field on button click
    $scope.deleteField = function (field_id){
      for(var i = 0; i < $scope.element.fields.length; i++){
        if($scope.element.fields[i].field_id == field_id){
          $scope.element.fields.splice(i, 1);
          break;
        }
      }
    }

});
