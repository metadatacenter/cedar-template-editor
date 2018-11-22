'use strict';

define(['angular'], function (angular) {
  angular.module('cedar.templateEditor.service.valueRecommenderService', [])
      .service('ValueRecommenderService', ValueRecommenderService);

  ValueRecommenderService.$inject = ['DataManipulationService', '$translate', 'UrlService',
                                     'UIMessageService', 'AuthorizedBackendService', 'HttpBuilderService', 'autocompleteService'];

  function ValueRecommenderService(DataManipulationService, $translate, UrlService,
                                   UIMessageService, AuthorizedBackendService, HttpBuilderService, autocompleteService) {

    var http_default_config = {};
    var canGenerateRecommendations;


    var templateId;
    var template;

    var service = {
      serviceId: 'ValueRecommenderService',
      valueRecommendationResults : [],
      populatedFields: []
    };

    /**
     * Initialize service
     */
    service.init = function (templId, templ) {
      templateId = templId;
      template = templ;
      DataManipulationService.addPathInfo(template, null);

      http_default_config = {
        'headers': {
          'Content-Type': 'application/json'
        }
      };
      // Set isValueRecommendationEnabled using the templateId
      service.canGenerateRecommendations(templateId).then(function (results) {
        if (results['canGenerateRecommendations']) {
          canGenerateRecommendations = results['canGenerateRecommendations'];
        }
        else {
          canGenerateRecommendations = false;
        }
      });
      // Clear valueRecommendationResults and populatedFields
      service.valueRecommendationResults = [];
      service.populatedFields = [];
    };

    service.getIsValueRecommendationEnabled = function (field) {
      if (DataManipulationService.schemaOf(field)._ui.valueRecommendationEnabled && canGenerateRecommendations) {
        return true;
      }
      else {
        return false;
      }
    };

    service.getValueRecommendationResults = function (fieldId) {
      var fieldId = DataManipulationService.getId(field);
      if (fieldId) {
        if (angular.isUndefined(service.valueRecommendationResults[fieldId])) {
          return [];
        }
        else {
          return service.valueRecommendationResults[fieldId];
        }
      }
      else {
        return [];
      }
    };

    service.updatePopulatedFields = function (field, valueLabel, valueType) {
      var fieldId = DataManipulationService.getId(field);
      if (fieldId) {
        if (valueLabel) {
          service.populatedFields[fieldId] = {
            'fieldPath' : field._path,
            'fieldValueLabel': valueLabel
          }
          if (valueType) {
            service.populatedFields[fieldId]['fieldValueType'] = valueType;
          }
        }
        else {
          delete service.populatedFields[fieldId];
        }
      }
    };

    // Returns all populated fields (name and value) except excludedFieldId, which is the field that is being filled out
    service.getRelevantPopulatedFields = function (excludedFieldId) {
      var relevantPopulatedFieldsArray = [];
      if (service.populatedFields) {
        // Shallow copy
        var relevantPopulatedFields = $.extend({}, service.populatedFields);
        // Exclude current field
        delete relevantPopulatedFields[excludedFieldId];
        // Get hash values as an array
        relevantPopulatedFieldsArray = $.map(relevantPopulatedFields, function (v) {
          return v;
        });
      }
      return relevantPopulatedFieldsArray;
    };

    service.updateValueRecommendationResults = function (field, term) {
      var query = term || '*';
      var fieldId = DataManipulationService.getId(field);
      if (fieldId) {
        var targetFieldPath = field._path;
        service.getRecommendation(targetFieldPath, service.getRelevantPopulatedFields(fieldId)).then(
            function (recommendation) {
              var controlledTerms = autocompleteService.autocompleteResultsCache[fieldId][query]['results'];
              if (recommendation.recommendedValues) {
                if (recommendation.recommendedValues.length == 0 && controlledTerms.length == 0) {
                  recommendation.recommendedValues.push({
                    'valueLabel': $translate.instant('VALUERECOMMENDER.noResults'),
                    'score'     : undefined
                  })
                }
                else {
                  var recommendedLabels = [];
                  for (var i = 0; i < recommendation.recommendedValues.length; i++) {
                    recommendedLabels.push(recommendation.recommendedValues[i].valueLabel.toLowerCase());
                  }
                }
              }

              // Add the list of controlled terms to the recommendation results (if any)
              for (var i = 0; i < controlledTerms.length; i++) {
                // Check if the ontology term is part of the recommendations
                if ($.inArray(controlledTerms[i].label.toLowerCase(), recommendedLabels) == -1) {
                  recommendation.recommendedValues.push({
                    'valueLabel': controlledTerms[i].label,
                    'valueType' : controlledTerms[i]['@id'],
                    'score'     : undefined
                  });
                }
              }
              service.valueRecommendationResults[fieldId] = recommendation.recommendedValues;
            });
      }
    }

    service.canGenerateRecommendations = function (templateId) {
      var input = {};
      if (templateId != null) {
        input['templateId'] = templateId;
      }
      return AuthorizedBackendService.doCall(
          HttpBuilderService.post(UrlService.canGenerateRecommendations(), angular.toJson(input)),
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
      inputData['targetField'] = {'fieldPath': targetFieldPath};

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
    };

    return service;
  }
});
