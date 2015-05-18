'use strict';

angularApp.service('FormService', function FormService($http) {

    var formsJsonPath = './static-data/sample_forms.json';

    return {
        fields:[
            {
                name : 'textfield',
                value : 'Textfield'
            },
            {
                name : 'email',
                value : 'E-mail'
            },
            {
                name : 'password',
                value : 'Password'
            },
            {
                name : 'radio',
                value : 'Radio Buttons'
            },
            {
                name : 'dropdown',
                value : 'Dropdown List'
            },
            {
                name : 'date',
                value : 'Date'
            },
            {
                name : 'textarea',
                value : 'Text Area'
            },
            {
                name : 'checkbox',
                value : 'Checkbox'
            },
            {
                name : 'hidden',
                value : 'Hidden'
            },
            {
                name : 'list',
                value : 'Pick from a List'
            },
            {
                name : 'numeric',
                value : 'Numeric'
            },
            {
                name : 'audio-visual',
                value : 'Audio/Visual'
            },
            {
                name : 'phone-number',
                value : 'Phone Number'
            },
            {
                name : 'section-break',
                value : 'Section Break'
            },
            {
                name : 'page-break',
                value : 'Page Break'
            },
            {
                name : 'location',
                value : 'Location'
            },
            {
                name : 'control-term',
                value : 'Control Term'
            }
        ],
        form:function (id) {
            // $http returns a promise, which has a then function, which also returns a promise
            return $http.get(formsJsonPath).then(function (response) {
                var requestedForm = {};
                angular.forEach(response.data, function (form) {
                    if (form.form_id == id) requestedForm = form;
                });
                return requestedForm;
            });
        },
        forms: function() {
            return $http.get(formsJsonPath).then(function (response) {
                return response.data;
            });
        }
    };
});
