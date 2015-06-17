'use strict';

angularApp.service('FormService', function FormService($http) {

  return {

    form: function (id) {
      // $http returns a promise, which has a then function, which also returns a promise
      return $http.get('/static-data/forms/'+id+'.json').then(function (response) {
        // The return value gets picked up by the then fn in the controller.
        return response.data;
      });
    },
    element: function(id) {
      return $http.get('/static-data/elements/'+id+'.json').then(function(response) {
        return response.data;
      });
    }
  };
});
