'use strict';

define(['angular'], function (angular) {
  angular.module('cedar.templateEditor.service.valueRecommenderService', [])
      .service('ValueRecommenderService', ValueRecommenderService);

  ValueRecommenderService.$inject = ['$rootScope', 'DataManipulationService', '$translate', 'UrlService',
                                     'UIMessageService', 'AuthorizedBackendService', 'HttpBuilderService'];

  function ValueRecommenderService($rootScope, DataManipulationService, $translate, UrlService,
                                   UIMessageService, AuthorizedBackendService, HttpBuilderService) {

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
      service.hasInstances(templateId).then(function (results) {
        hasInstances = results;
        //isValueRecommendationEnabled = results;
        //if (results == true)
        //  UIMessageService.flashSuccess($translate.instant('VALUERECOMMENDER.enabled'), null, $translate.instant('GENERIC.GoodNews'));
      });
    };

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
    };

    service.getValueRecommendationResults = function (fieldId) {
      if (angular.isUndefined(valueRecommendationResults[fieldId])) {
        return [];
      }
      else {
        return valueRecommendationResults[fieldId];
      }
    };

    /**
     * Service methods.
     */
    service.updatePopulatedFields = function (field, value) {
      var fieldId = field['@id'];
      if (value) {
        populatedFields[fieldId] = {
          "path" : field._path,
          "value": value
        }
      }
      else {
        delete populatedFields[fieldId];
      }
    };

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
    };

    service.updateValueRecommendationResults = function (field) {
      var fieldId;
      if (field.type == 'array') {
        fieldId = field.items['@id'];
      }
      else {
        fieldId = field['@id'];
      }
      var targetFieldPath = field._path;
      service.getRecommendation(targetFieldPath, service.getRelevantPopulatedFields(fieldId)).then(
          function (recommendation) {
            console.log('Recommendation: ');
            console.log(recommendation);
            var controlledTerms = $rootScope.autocompleteResultsCache[fieldId]['results'];

            if (recommendation.recommendedValues) {
              if (recommendation.recommendedValues.length == 0 && controlledTerms.length == 0) {
                recommendation.recommendedValues.push({
                  'value': $translate.instant('VALUERECOMMENDER.noResults'),
                  'score': undefined
                })
              }
              var recommendedLabels = [];
              for (var i = 0; i < recommendation.recommendedValues.length; i++) {
                recommendedLabels.push(recommendation.recommendedValues[i].value.toLowerCase());
              }
            }

            // Add the list of controlled terms to the recommendation results (if any)
            for (var i = 0; i < controlledTerms.length; i++) {
              // Check if the ontology term has been already recommended or not
              if ($.inArray(controlledTerms[i].label.toLowerCase(), recommendedLabels) == -1) {
                recommendation.recommendedValues.push({
                  'value'   : controlledTerms[i].label,
                  'valueUri': controlledTerms[i]['@id'],
                  'score'   : undefined
                });
              }
            }
            valueRecommendationResults[fieldId] = recommendation.recommendedValues;
          });
    };

    service.hasInstances = function (templateId) {
      return AuthorizedBackendService.doCall(
          HttpBuilderService.get(UrlService.hasInstances(templateId)),
          function (response) {
            return response.data;
          },
          function (err) {
            //UIMessageService.showBackendError($translate.instant('VALUERECOMMENDER.errorCallingService'), err);
            console.log($translate.instant('VALUERECOMMENDER.errorCallingService'));
          }
      );
    };

    // Invoke the Value Recommender service
    service.getRecommendation = function (targetFieldPath, populatedFields) {
      var inputData = {};
      if (populatedFields.length > 0) {
        inputData['populatedFields'] = populatedFields;
      }
      inputData['templateId'] = templateId;
      inputData['targetField'] = {'path': targetFieldPath};

      return AuthorizedBackendService.doCall(
          HttpBuilderService.post(UrlService.getValueRecommendation(), angular.toJson(inputData)),
          function (response) {
            return response.data;
          },
          function (err) {
            UIMessageService.showBackendError($translate.instant('VALUERECOMMENDER.errorCallingService'), err);
          }
      );
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
