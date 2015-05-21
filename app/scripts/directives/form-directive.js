'use strict';

var pattern = /^@/i;

angularApp.directive('formDirective', function () {
  return {
    controller: function($scope){
      $scope.submit = function(){
        alert('Form submitted..');
        $scope.form.submitted = true;
      }

      $scope.cancel = function(){
        alert('Form canceled..');
      }

      // Returning false if the object key value passed into the element-directive belongs to json-ld '@'
      $scope.ignoreKey = function(key) {
        var result = pattern.test(key);
        return !result;
      }

      $scope.model = {};

      $scope.updateModel = function(primary, secondary, tertiary) {

        if(!(tertiary in $scope.model)) {

          if(!(secondary in $scope.model)) {

            $scope.model[primary] = {};
          } else {
            $scope.model[secondary][primary] = {};
          }
        } else {
          $scope.model[tertiary][secondary][primary] = {};
        }
        console.log($scope.model);
      }
    },
    templateUrl: './views/directive-templates/form/form.html',
    restrict: 'E',
    scope: {
        form:'='
    }
  };
});
