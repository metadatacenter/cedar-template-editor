'use strict';

angularApp.service('FormService', function FormService($http) {

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
        form: function (id) {
          // $http returns a promise, which has a then function, which also returns a promise
          var promise = $http.get('/static-data/forms/sample_runtime_'+id+'.json').then(function (response) {
            // The then function here is an opportunity to modify the response
            //console.log(response);
            // The return value gets picked up by the then fn in the controller.
            return response.data;
          });

            // Return the promise to the controller
            return promise;
        },
        forms: function() {
            return $http.get(formsJsonPath).then(function (response) {
                return response.data;
            });
        }
    };
});
