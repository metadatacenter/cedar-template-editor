'use strict';

define([
    'angular'
], function (angular) {
    angular.module('cedar.templateEditor.form.runtimeToolbarDirective', [])
        .directive('runtimeToolbarDirective', runtimeToolbarDirective);

    runtimeToolbarDirective.$inject = ["$rootScope"];

    function runtimeToolbarDirective($rootScope) {

        var linker = function ($scope, $element, attrs) {

        };


        return {
            templateUrl: 'scripts/form/runtime-toolbar.directive.html',
            restrict: 'EA',
            scope: {
                fieldOrElement: '=',
                add: '&',
                spreadsheet: '&',
                model: '='
            },
            controller: function ($scope, $element) {

            },
            replace: true,
            link: linker
        };

    }

});