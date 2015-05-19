'use strict';

// coffeescript's for in loop
var __indexOf = [].indexOf || function(item) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this && this[i] === item) return i;
        }
        return -1;
    };

angularApp.directive('fieldDirective', function($http, $compile) {

    var getTemplateUrl = function(field, context) {
        var templateUrl = './views/directive-templates/field-'+context+'/';
        var supported_fields = [
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
        ]

        if (__indexOf.call(supported_fields, field.input_type) >= 0) {
            return templateUrl += field.input_type + '.html';
        }
    }

    var linker = function(scope, element) {
        // GET template content from path
        var templateUrl = getTemplateUrl(scope.field, scope.context);
        $http.get(templateUrl).success(function(data) {
            element.html(data);
            $compile(element.contents())(scope);
            
            //Initializing Bootstrap Popover fn for each item loaded
            angular.element('[data-toggle="popover"]').popover();
        });
    }

    return {
        template: '<div>{{field}}</div>',
        restrict: 'EA',
        scope: {
            context: '@context',
            field: '=',
            delete: '&'
        },
        transclude: true,
        link: linker
    };
});