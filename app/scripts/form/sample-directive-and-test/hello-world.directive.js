'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.helloWorldDirective', []).directive('helloWorldDirective', helloWorldDirective);

  helloWorldDirective.$inject = [];

  function helloWorldDirective() {

    return {
      restrict: 'EA',
      scope: false,
      templateUrl: 'scripts/form/sample-directive-and-test/hello-world.directive.html',
      //template: '<div><p>This is a nice hello world message</p></div>',
      controller: function($scope) {}
    };
  }

});