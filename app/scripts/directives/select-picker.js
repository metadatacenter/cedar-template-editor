// Enabling Bootstrap Datepickers for date inputs
angularApp.directive('selectPicker', function ($rootScope, $timeout) {
  return {
    restrict: 'A',
    scope: {
      field: '='
    },
    link: function ($scope, $element, attrs) {
      // update local $scope.model to value of $parent.model if available
      if ($scope.$parent.model != undefined ) {
        $scope.model = $scope.$parent.model;
      }

      var default_array;
      var properties;

      if ($scope.field) {
        properties = $rootScope.propertiesOf($scope.field);
      }

      if ($scope.model != undefined) {
        // If returning to an already populated select list field, load selections
        default_array = $scope.model._value;

      } else if ($scope.field && properties._ui.defaultOption) {
        default_array = [];

        // If default select options have been set for an empty field
        var defaultOptions = properties._ui.defaultOption;

        for (var property in defaultOptions) {
          if (defaultOptions.hasOwnProperty(property)) {
            // Push into array that is set via $element.selectpicker 'val' method
            default_array.push(property);
          }
        }
        $scope.model = $scope.model || {};
        $scope.model['_value'] = default_array;
      }

      $timeout(function() {
        $element.selectpicker({
          style: 'btn-select-picker',
          iconBase: 'fa',
          tickIcon: 'fa-check',
        });

        if (default_array) {
          // If defaults were loaded during field item configuration, manually load defaults into the selectpicker
          $element.selectpicker('val', default_array);
        }

        $('.caret').addClass('glyphicon').addClass('glyphicon-chevron-down');

      }, 25);
      $element.on('change', function() {
        // Runtime document output is 3 $scope levels above this directive at this point, passing the $model up to be
        // assigned at the field-directive.js level
        $scope.model = $element.val();
      });
    }
  };
});
