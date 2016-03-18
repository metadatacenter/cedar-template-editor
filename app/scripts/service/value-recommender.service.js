'use strict';

define(['angular'], function (angular) {
  angular.module('cedar.templateEditor.service.valueRecommenderService', [])
      .service('ValueRecommenderService', ValueRecommenderService);

  ValueRecommenderService.$inject = ['$rootScope', '$http', 'DataManipulationService', '$translate', 'UrlService'];

  function ValueRecommenderService($rootScope, $http, DataManipulationService, $translate, UrlService) {


    var base;
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
      base = UrlService.valueRecommender();
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
      return service;
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
        var fieldName = DataManipulationService.getFieldName($rootScope.propertiesOf(field)._ui.title);
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
      console.log(field);
      var fieldId = field['@id'];
      var fieldName = DataManipulationService.getFieldName($rootScope.propertiesOf(field)._ui.title);
      service.getRecommendation(fieldName + "._value", service.getRelevantPopulatedFields(fieldId)).then(function (recommendation) {
        if (recommendation.recommendedValues.length == 0) {
          recommendation.recommendedValues.push({'value' : $translate.instant('VALUERECOMMENDER.noResults'), 'score' : undefined})
        }
        valueRecommendationResults[fieldId] = recommendation.recommendedValues;
      });

    }

    // Invoke the Value Recommender service
    service.getRecommendation = function (targetFieldName, populatedFields) {
      var inputData = {};
      if (populatedFields.length > 0) {
        inputData['populatedFields'] = populatedFields;
      }
      inputData['targetField'] = {'name' : targetFieldName};
      console.log("Input Data: ");
      console.log(inputData);
      return $http.post(base + '/recommend', inputData, http_default_config).then(function (response) {
        return response.data;
      }).catch(function (err) {
        return err;
      });
    };

    /**
     * Messages
     */
    service.getNoResultsMsg = function() {
      return $translate.instant('VALUERECOMMENDER.noResults');
    }

    return service;
  }
});
