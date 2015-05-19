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
        var type = field.field_type;
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

        if (__indexOf.call(supported_fields, type) >= 0) {
            return templateUrl += type + '.html';
        }
    }

    var linker = function(scope, element) {
        // GET template content from path
        var templateUrl = getTemplateUrl(scope.field, scope.context);
        $http.get(templateUrl).success(function(data) {
            element.html(data);
            $compile(element.contents())(scope);
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