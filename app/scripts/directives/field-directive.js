'use strict';

// coffeescript's for in loop
var __indexOf = [].indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (i in this && this[i] === item) return i;
  }
  return -1;
};

angularApp.directive('fieldDirective', function($http, $compile, $document) {

  var getTemplateUrl = function(field, directory) {
    var templateUrl = './views/directive-templates/field-'+directory+'/',
        supported_fields = [
          'textfield',
          'email',
          'textarea',
          'checkbox',
          'date',
          'dropdown',
          'radio',
          'list',
          'audio-visual',
          'numeric',
          'phone-number',
          'section-break',
          'page-break',
          'location',
          'control-term'
        ];

    if (__indexOf.call(supported_fields, field.input_type) >= 0) {
        return templateUrl += field.input_type + '.html';
    }
  };

  var linker = function(scope, element) {
    // GET template content from path
    var templateUrl = getTemplateUrl(scope.field, scope.directory);
    
    $http.get(templateUrl).success(function(data) {
      element.html(data);
      $compile(element.contents())(scope);
    });

    //Initializing Bootstrap Popover fn for each item loaded
    angular.element('[data-toggle="popover"]').popover();

    $document.on('click', function(e) {
      // Check if Popovers exist and close on click anywhere but the popover toggle icon
      if( angular.element(e.target).data('toggle') !== 'popover' && angular.element('.popover').length ) {
        angular.element('[data-toggle="popover"]').popover('hide');
      }
    });
  }

  return {
    template: '<div>{{field}}</div>',
    restrict: 'EA',
    scope: {
        directory: '@',
        field: '=',
        model: '=',
        delete: '&',
        add: '&'
    },
    transclude: true,
    link: linker
  };
});