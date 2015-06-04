// Enabling Bootstrap Datepickers for date inputs
angularApp.directive('selectPicker', function ($timeout) {
  return {

    restrict: 'A',
    link: function ($scope, $element, attrs) {
      $timeout(function() {
        $element.selectpicker({
          style: 'btn-select-picker',
          iconBase: 'fa',
          tickIcon: 'fa-check',
        });
      }, 25);
    }
  };
});