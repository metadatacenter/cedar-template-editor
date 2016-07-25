'use strict';

define([
    'angular'
], function (angular) {
    angular.module('cedar.templateEditor.form.fieldTitleDirective', [])
        .directive('fieldTitleDirective', fieldTitleDirective);

    fieldTitleDirective.$inject = ["$rootScope"];

    function fieldTitleDirective($rootScope) {

        var linker = function ($scope, $element, attrs) {



        };


        return {
            templateUrl: 'scripts/form/field-title.directive.html',
            restrict: 'EA',
            scope: {
                fieldOrElement: '=',
                model: '='
            },
            controller: function ($scope, $element) {

            },
            replace: true,
            link: linker
        };

    }

});