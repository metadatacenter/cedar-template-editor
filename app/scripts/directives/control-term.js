// Enabling Bootstrap Datepickers for date inputs
angularApp.directive('controlTerm', function ($timeout) {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      field: '=',
      options: "="
    },
    templateUrl: "./views/directive-templates/control-term.html",
    controller: "TermsController"
  };
});