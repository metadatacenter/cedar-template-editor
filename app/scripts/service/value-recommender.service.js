'use strict';

define(['angular'], function (angular) {
  angular.module('cedar.templateEditor.service.valueRecommenderService', [])
      .service('ValueRecommenderService', ValueRecommenderService);

  ValueRecommenderService.$inject = ['$rootScope', '$http', 'DataManipulationService', '$translate', 'UrlService', 'UIMessageService'];

  function ValueRecommenderService($rootScope, $http, DataManipulationService, $translate, UrlService, UIMessageService) {

    var http_default_config = {};
    var isValueRecommendationEnabled = false;
    var hasInstances;
    var valueRecommendationResults;
    var populatedFields;
    var templateId;
    var template;

    var service = {
      serviceId: 'ValueRecommenderService'
    };

    /**
     * Initialize service
     */
    service.init = function (templId, templ) {
      templateId = templId;
      template = templ;

      DataManipulationService.addPathInfo(template, null);

      valueRecommendationResults = [];
      populatedFields = [];
      http_default_config = {
        'headers': {
          'Content-Type': 'application/json'
        }
      };
      // Set isValueRecommendationEnabled using the templateId
      service.hasInstances(templateId).then(function(results) {
        hasInstances = results;
        //isValueRecommendationEnabled = results;
        //if (results == true)
        //  UIMessageService.flashSuccess($translate.instant('VALUERECOMMENDER.enabled'), null, $translate.instant('GENERIC.GoodNews'));
      });
    }

    /**
     * Getters and Setters
     */
    service.getIsValueRecommendationEnabled = function (field) {
      if (field._ui.valueRecommendationEnabled && hasInstances) {
        return true;
      }
      else {
        return false;
      }
      //return isValueRecommendationEnabled;
    }

    service.getValueRecommendationResults = function (fieldId) {
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
    service.updatePopulatedFields = function (field, value) {
      var fieldId = field['@id'];
      if (value) {
        populatedFields[fieldId] = {
          "path": field._path,
          "value": value
        }
      }
      else {
        delete populatedFields[fieldId];
      }
    }

    // Returns all populated fields (name and value) except excludedFieldId, which is the field that is being filled out
    service.getRelevantPopulatedFields = function (excludedFieldId) {
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
      var targetFieldPath = field._path;
      service.getRecommendation(targetFieldPath, service.getRelevantPopulatedFields(fieldId)).then(function (recommendation) {
        if (recommendation.recommendedValues && recommendation.recommendedValues.length == 0) {
          recommendation.recommendedValues.push({
            'value': $translate.instant('VALUERECOMMENDER.noResults'),
            'score': undefined
          })
        }
        valueRecommendationResults[fieldId] = recommendation.recommendedValues;
      });

    }

    service.hasInstances = function(templateId) {
      return $http.get(UrlService.hasInstances(templateId), http_default_config).then(function (response) {
        return response.data;
      }).catch(function (err) {
        //UIMessageService.showBackendError($translate.instant('VALUERECOMMENDER.errorCallingService'), err);
        console.log($translate.instant('VALUERECOMMENDER.errorCallingService'));
      });
    }

    // Invoke the Value Recommender service
    service.getRecommendation = function (targetFieldPath, populatedFields) {
      var inputData = {};
      if (populatedFields.length > 0) {
        inputData['populatedFields'] = populatedFields;
      }
      inputData['templateId'] = templateId;
      inputData['targetField'] = {'path': targetFieldPath};
      return $http.post(UrlService.getValueRecommendation(), inputData, http_default_config).then(function (response) {
        return response.data;
      }).catch(function (err) {
        UIMessageService.showBackendError($translate.instant('VALUERECOMMENDER.errorCallingService'), err);
      });
    };

    /**
     * Messages
     */
    service.getNoResultsMsg = function () {
      return $translate.instant('VALUERECOMMENDER.noResults');
    }

    return service;
  }
});
