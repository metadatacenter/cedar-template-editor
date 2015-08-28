// Enabling Bootstrap Datepickers for date inputs
angularApp.directive('selectPicker', function ($timeout) {
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

      var default_array = [];
      if ($scope.model != undefined) {
        // If returning to an already populated select list field, load selections
        default_array = $scope.model.value;

      } else if ($scope.field && $scope.field.properties.info.default_option) {
        // If default select options have been set for an empty field
        var default_options = $scope.field.properties.info.default_option;

        for (var property in default_options) {
          if (default_options.hasOwnProperty(property)) {
            // Push into array that is set via $element.selectpicker 'val' method
            default_array.push(property);
          }
        }
        $scope.model = $scope.model || {};
        $scope.model['value'] = default_array;
      }

      $timeout(function() {
        $element.selectpicker({
          style: 'btn-select-picker',
          iconBase: 'fa',
          tickIcon: 'fa-check',
        });
        // If defaults were loaded during field item configuration, manually load defaults into the selectpicker
        $element.selectpicker('val', default_array);
      }, 25);
      $element.on('change', function() {
        // Runtime document output is 3 $scope levels above this directive at this point, passing the $model up to be
        // assigned at the field-directive.js level
        $scope.model = $element.val();
      });
    }
  };
});