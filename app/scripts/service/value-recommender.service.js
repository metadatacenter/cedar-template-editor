'use strict';

define(['angular'], function (angular) {
  angular.module('cedar.templateEditor.service.valueRecommenderService', [])
      .service('ValueRecommenderService', ValueRecommenderService);

  ValueRecommenderService.$inject = ['$http', '$q', 'UrlService'];

  function ValueRecommenderService($http, $q, UrlService) {

    var base = null;
    //var config = null;
    var http_default_config = {};

    var service = {
      serviceId: 'ValueRecommenderService'
    };

    /**
     * Initialize service.
     */
    service.init = function () {
      //config = cedarBootstrap.getBaseConfig(this.serviceId);
      base = 'http://localhost:9005/';
      http_default_config = {
        //  'headers': {
        //    'Authorization': 'apikey token=' + apiKey
        //  }
      };
    }

    /**
     * Service methods.
     */

    service.getRecommendation = function (fieldName) {
      //return $http.post(base + '/recommender', http_default_config).then(function (response) {
      //  return response.data;
      //}).catch(function (err) {
      //  return err;
      //});
      console.log('Call to getRecommendation - Query: ' + fieldName);
      var example =
      {
        "fieldName"        : "platform._value",
        "recommendedValues": [
          {
            "value": fieldName + "1",
            "score": 38
          },
          {
            "value": fieldName + "2",
            "score": 32
          }, {
            "value": fieldName + "3",
            "score": 12
          }
        ]
      }
      return example;
    };
    return service;
  }
});
