'use strict';

define(['angular'], function (angular) {
  angular.module('cedar.templateEditor.service.valueRecommenderService', [])
      .service('ValueRecommenderService', ValueRecommenderService);

  ValueRecommenderService.$inject = ['$rootScope', '$http', '$q', 'UrlService'];

  function ValueRecommenderService($rootScope, $http, $q, UrlService) {

    var base = 'https://valuerecommender.metadatacenter.orgx';
    //var config = null;
    var http_default_config = {};

    var isValueRecommendationEnabled = true;
    var valueRecommendationResults;
    var populatedFields;

    var service = {
      serviceId: 'ValueRecommenderService'
    };

    /**
     * Initialize service.
     */
    service.init = function () {
      //config = cedarBootstrap.getBaseConfig(this.serviceId);
      http_default_config = {
          'headers': {
            'Content-Type': 'application/json'
          }
      };
      if (angular.isUndefined(valueRecommendationResults)) {
        valueRecommendationResults = [];
      }
      if (angular.isUndefined(populatedFields)) {
        populatedFields = [];
      }
    }

    /**
     * Getters
     */
    service.getIsValueRecommendationEnabled = function() {
      return isValueRecommendationEnabled;
    }

    service.getValueRecommendationResults = function(fieldId) {
      if (angular.isUndefined(valueRecommendationResults[fieldId])) {
        return [];
      }
      else {
        return valueRecommendationResults[fieldId];
      }
    }

    /**
     * Service methods.
     */
    service.updatePopulatedFields = function(field, value) {
      var fieldId = field['@id'];
      if (value) {
        var fieldName = $rootScope.propertiesOf(field)._ui.title;
        populatedFields[fieldId] = {
          "name" : fieldName + '._value',
          "value": value
        }
      }
      else {
        delete populatedFields[fieldId];
      }
    }

    // Returns all populated fields (name and value) except excludedFieldId, which is the field that is being filled out
    service.getRelevantPopulatedFields = function(excludedFieldId) {
      var relevantPopulatedFieldsArray = [];
      if (populatedFields) {
        // Shallow copy
        var relevantPopulatedFields = $.extend({}, populatedFields);
        // Exclude current field
        delete relevantPopulatedFields[excludedFieldId];
        // Get hash values as an array
        relevantPopulatedFieldsArray = $.map(relevantPopulatedFields, function (v) {
          return v;
        });
      }
      return relevantPopulatedFieldsArray;
    }

    service.updateValueRecommendationResults = function (field) {
      var fieldId = field['@id'];
      var fieldName = $rootScope.propertiesOf(field)._ui.title;
      service.getRecommendation(fieldName + "._value", service.getRelevantPopulatedFields(fieldId)).then(function (recommendation) {
        valueRecommendationResults[fieldId] = recommendation.recommendedValues;
      });

    }

    /** Call to Value Recommender Service **/
    service.getRecommendation = function (targetFieldName, populatedFields) {
      var inputData = {};
      var recommendation;
      if (populatedFields.length > 0) {
        inputData['populatedFields'] = populatedFields;
      }
      inputData['targetField'] = {'name' : targetFieldName};

      return $http.post(base + '/recommend', inputData, http_default_config).then(function (response) {
        return response.data;
      }).catch(function (err) {
        return err;
      });

      //console.log('Call to getRecommendation - Query: ' + fieldName);
      //var example =
      //{
      //  "fieldName"        : "platform._value",
      //  "recommendedValues": [
      //    {
      //      "value": targetFieldName + "1",
      //      "score": 38
      //    },
      //    {
      //      "value": targetFieldName + "2",
      //      "score": 32
      //    }, {
      //      "value": targetFieldName + "3",
      //      "score": 12
      //    }
      //  ]
      //}
      //return example;
    };

    return service;
  }
});
