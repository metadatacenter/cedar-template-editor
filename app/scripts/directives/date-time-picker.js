// Enabling Bootstrap Datepickers for date inputs
angularApp.directive('dateTimePicker', function () {
  return {

    restrict: 'A',
    link: function ($scope, $element, attrs) {
    	var inputElement = $element.children('.form-control');

      $element.datetimepicker({
				icons: 	{
		      time: 'fa fa-clock-o',
          date: 'fa fa-calendar',
          up: 'fa fa-lg fa-angle-up',
          down: 'fa fa-lg fa-angle-down',
          previous: 'fa fa-lg fa-angle-left',
          next: 'fa fa-lg fa-angle-right',
          today: 'glyphicon glyphicon-screenshot',
          clear: 'fa fa-trash',
				}
			}).on('dp.change', function() {
        // Each time the date-time-picker date is changed trigger change function
        // ngModel listens for "input" event, so need to let Angular know to listen for when change event happens
				inputElement.trigger('input');
			});
    }
  };
});