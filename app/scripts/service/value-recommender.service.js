'use strict';

define(['angular'], function (angular) {
  angular.module('cedar.templateEditor.service.valueRecommenderService', [])
      .service('ValueRecommenderService', ValueRecommenderService);

  ValueRecommenderService.$inject = ['DataManipulationService', '$translate', 'UrlService',
                                     'UIMessageService', 'AuthorizedBackendService', 'HttpBuilderService', 'autocompleteService'];

  function ValueRecommenderService(DataManipulationService, $translate, UrlService,
                                   UIMessageService, AuthorizedBackendService, HttpBuilderService, autocompleteService) {

    var http_default_config = {};
    var isValueRecommendationEnabled = false;
    var hasInstances;


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
      service.hasInstances(templateId).then(function (results) {
        hasInstances = results;
        //isValueRecommendationEnabled = results;
        //if (results == true)
        //  UIMessageService.flashSuccess($translate.instant('VALUERECOMMENDER.enabled'), null, $translate.instant('GENERIC.GoodNews'));
      });
    };


    service.getIsValueRecommendationEnabled = function (field) {
      return (DataManipulationService.schemaOf(field)._ui.valueRecommendationEnabled && hasInstances);
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


    service.updatePopulatedFields = function (field, value) {
      var fieldId = DataManipulationService.getId(field);
      if (fieldId) {
        if (value) {
          service.populatedFields[fieldId] = {
            "path" : field._path,
            "value": value
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

    service.updateValueRecommendationResults = function (field, index) {
      var fieldId = DataManipulationService.getId(field);
      if (fieldId) {
        var targetFieldPath = field._path;
        service.getRecommendation(targetFieldPath, service.getRelevantPopulatedFields(fieldId)).then(
            function (recommendation) {
              var controlledTerms = autocompleteService.autocompleteResultsCache[fieldId][index]['results'];

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
              service.valueRecommendationResults[fieldId] = recommendation.recommendedValues;
            });
      }
    }
    
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
      if (service.populatedFields.length > 0) {
        inputData['populatedFields'] = service.populatedFields;
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
    };

    return service;
  }
});
