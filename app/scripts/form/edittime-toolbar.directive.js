'use strict';

define([
    'angular'
], function (angular) {
    angular.module('cedar.templateEditor.form.edittimeToolbarDirective', [])
        .directive('edittimeToolbarDirective', edittimeToolbarDirective);

    edittimeToolbarDirective.$inject = ["$rootScope"];

    function edittimeToolbarDirective($rootScope) {

        var linker = function ($scope, $element, attrs) {

        };


        return {
            templateUrl: 'scripts/form/edittime-toolbar.directive.html',
            restrict: 'EA',
            scope: {
                fieldOrElement: '=',
                uuid: '=',
                delete: '&',
                duplicate: '&',
                isEdit: '&',
                model: '='
            },
            controller: function ($scope, $element) {

                $scope.showModal = function (id) {
                    jQuery("#" + id).modal('show');
                };

                $scope.getValueModalId = function () {
                    var fieldId = $scope.fieldOrElement['@id'] || $scope.fieldOrElement.items['@id'];
                    var id = fieldId.substring(fieldId.lastIndexOf('/') + 1);
                    return "control-options-" + id + "-" + "values";
                };

                $scope.getFieldModalId = function () {
                    var fieldId = $scope.fieldOrElement['@id'] || $scope.fieldOrElement.items['@id'];
                    var id = fieldId.substring(fieldId.lastIndexOf('/') + 1);
                    return "control-options-" + id + "-" +  "field";
                };

            },
            replace: true,
            link: linker
        };

    }

});