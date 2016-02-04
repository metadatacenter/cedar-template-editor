angularApp.directive('nameOfField', function () {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      field: "="
    },
    templateUrl: 'views/directive-templates/name-of-field.html',
    link: function ($scope, $element, attrs) {

    }
  };
});
