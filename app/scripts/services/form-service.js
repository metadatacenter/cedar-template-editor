'use strict';

angularApp.service('FormService', function FormService($http) {

  return {

    form: function (id) {
      // $http returns a promise, which has a then function, which also returns a promise
      return $http.get('/static-data/forms/'+id+'.json').then(function (response) {
        // The return value gets picked up by the then function in the controller.
        return response.data;
      }).catch(function(err) {
        console.log(err);
      });
    },
    submission: function (id) {
      // $http returns a promise, which has a then function, which also returns a promise
      return $http.get('/static-data/submissions/'+id+'.json').then(function (response) {
        // The return value gets picked up by the then function in the controller.
        return response.data;
      }).catch(function(err) {
        console.log(err);
      });
    },
    element: function(id) {
      return $http.get('/static-data/elements/'+id+'.json').then(function(response) {
        // The return value gets picked up by the then function in the controller.
        return response.data;
      }).catch(function(err) {
        console.log(err);
      });
    },
    elementList: function() {
      return $http.get('/static-data/dashboard/template-elements.json').then(function(response) {
        // The return value gets picked up by the then function in the controller.
        return response.data;
      }).catch(function(err) {
        console.log(err);
      });
    },
    formList: function() {
      return $http.get('/static-data/dashboard/metadata-templates.json').then(function(response) {
        // The return value gets picked up by the then function in the controller.
        return response.data;
      }).catch(function(err) {
        console.log(err);
      });
    },
    submissionList: function() {
      return $http.get('/static-data/dashboard/template-submissions.json').then(function(response) {
        // The return value gets picked up by the then function in the controller.
        return response.data;
      }).catch(function(err) {
        console.log(err);
      });
    }
  };
});
