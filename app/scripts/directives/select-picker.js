// Enabling Bootstrap Datepickers for date inputs
angularApp.directive('selectPicker', function () {
  return {

    restrict: 'A',
    link: function ($scope, $element, attrs) {
    	$element.selectpicker({
        style: 'btn-select-picker',
      });
    }
  };
});