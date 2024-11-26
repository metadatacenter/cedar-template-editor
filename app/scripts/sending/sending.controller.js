'use strict';

define([
  'angular',
  'cedar/template-editor/sending/sending.controller'
], function(angular) {
    angular.module('cedar.templateEditor.sending.sendingController', [])
      .directive('appSending', function() {
        return {
        restrict: 'E',
        scope: {
            isSending: '='  // Equivalent to Angular's @Input()
        },        
        templateUrl: 'scripts/sending/sending.html',
        controller: function($scope) {
            // Any logic for the component can go here
            // In this case, we are just passing `isSending` to the template
        },
        controllerAs: '$ctrl',
        bindToController: true
        };
    });
});