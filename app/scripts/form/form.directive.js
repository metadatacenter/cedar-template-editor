'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.formDirective', [])
      .directive('formDirective', formDirective);

  // TODO: refactor to cedarFormDirective <cedar-form-directive>


  formDirective.$inject = ['$rootScope', '$document', '$timeout', '$translate', '$http', 'DataManipulationService',
                           'FieldTypeService', 'DataUtilService', 'SubmissionService',
                           'UIMessageService', 'UrlService', 'AuthorizedBackendService', 'HttpBuilderService',
                           "ValidationService"];


  function formDirective($rootScope, $document, $timeout, $translate, $http, DataManipulationService, FieldTypeService,
                         DataUtilService, SubmissionService, UIMessageService, UrlService, AuthorizedBackendService,
                         HttpBuilderService, ValidationService) {
    return {
      templateUrl: 'scripts/form/form.directive.html',
      restrict   : 'E',
      scope      : {
        pageIndex      : '=',
        form           : '=',
        isEditData     : "=",
        model          : '=',
        path           : '='
      },
      controller : function ($scope) {

        $scope.directiveName = 'form';
        $scope.forms = {};
        $scope.model = $scope.model || {};
        $scope.checkSubmission = false;
        $scope.pageIndex = $scope.pageIndex || 0;

        $scope.currentPage = [],
            $scope.pageIndex = 0,
            $scope.pagesArray = [];

        $scope.expanded = true;

        $scope.metaToRDF = null;
        $scope.metaToRDFError = null;

        $scope.relabel = function (key) {
          // operates on templates and elements, so use the root scope json which
          // is element or form
          DataManipulationService.relabel($rootScope.jsonToSave, key);
        };


        var paginate = function () {
          if ($scope.form) {

            var orderArray = [];
            var dimension = 0;

            $scope.form._ui = $scope.form._ui || {};
            $scope.form._ui.order = $scope.form._ui.order || [];

            // This code is to allow render previous templates (Before inline_edit). We can remove this later
            if (!$scope.form._ui.order.length) {
              angular.forEach($scope.form.properties, function (value, key) {
                if (value.properties || value.items && value.items.properties) {
                  $scope.form._ui.order.push(key);
                }
              });
            }

            angular.forEach($scope.form._ui.order, function (field, index) {
              // If item added is of type Page Break, jump into next page array for storage of following fields
              if ($scope.form.properties[field].properties &&
                  $scope.form.properties[field]._ui &&
                  $scope.form.properties[field]._ui.inputType == 'page-break') {
                dimension++;
              }
              // Push field key into page array
              orderArray[dimension] = orderArray[dimension] || [];
              orderArray[dimension].push(field);
            });

            $scope.pagesArray = orderArray;
          }
        };

        $scope.removeChild = function (fieldOrElement) {

          DataManipulationService.removeChild($scope.form, fieldOrElement);

          var schema = $rootScope.schemaOf(fieldOrElement);
          var isElement = $rootScope.isElement(schema);
          var state = isElement ? 'invalidElementState' : 'invalidFieldState';
          $scope.$emit(state, ["remove", DataManipulationService.getTitle(fieldOrElement), DataManipulationService.getId(fieldOrElement)]);
        };

        $scope.renameChildKey = function (child, newKey) {
          if (!child) {
            return;
          }

          var childId = DataManipulationService.idOf(child);
          if (!childId || /^tmp\-/.test(childId)) {
            var p = $scope.form.properties;
            if (p[newKey] && p[newKey] == child) {
              return;
            }

            newKey = DataManipulationService.getAcceptableKey(p, newKey);
            angular.forEach(p, function (value, key) {
              if (!value) {
                return;
              }

              var idOfValue = DataManipulationService.idOf(value);
              if (idOfValue && idOfValue == childId) {
                DataManipulationService.renameKeyOfObject(p, key, newKey);

                if (p["@context"] && p["@context"].properties) {
                  DataManipulationService.renameKeyOfObject(p["@context"].properties, key, newKey);

                  if (p["@context"].properties[newKey] && p["@context"].properties[newKey].enum) {


                    //p["@context"].properties[newKey].enum[0] = DataManipulationService.getEnumOf(newKey);
                    p["@context"].properties[newKey].enum[0] = DataManipulationService.getPropertyOf(newKey,
                        p["@context"].properties[newKey].enum[0]);
                  }
                }

                if (p["@context"].required) {
                  var idx = p["@context"].required.indexOf(key);
                  p["@context"].required[idx] = newKey;
                }

                // Rename key in the 'order' array
                $scope.form._ui.order = DataManipulationService.renameItemInArray($scope.form._ui.order, key, newKey);

                // Rename key in the 'required' array
                $scope.form.required = DataManipulationService.renameItemInArray($scope.form.required, key, newKey);
              }
            });
          }
        }

        $scope.addPopover = function () {
          //Initializing Bootstrap Popover fn for each item loaded
          $timeout(function () {
            angular.element('[data-toggle="popover"]').popover();
          }, 1000);
        };

        $document.on('click', function (e) {
          // Check if Popovers exist and close on click anywhere but the popover toggle icon
          if (angular.element(e.target).data('toggle') !== 'popover' && angular.element('.popover').length) {
            angular.element('[data-toggle="popover"]').popover('hide');
          }
        });

        // Load the previous page of the form
        $scope.previousPage = function () {
          $scope.pageIndex--;
          $scope.currentPage = $scope.pagesArray[$scope.pageIndex];
        };

        // Load the next page of the form
        $scope.nextPage = function () {
          $scope.pageIndex++;
          $scope.currentPage = $scope.pagesArray[$scope.pageIndex];
        };

        // Load an arbitrary page number attached to the index of it via runtime.html template
        $scope.setCurrentPage = function (page) {
          $scope.pageIndex = page;
          $scope.currentPage = $scope.pagesArray[$scope.pageIndex];
        };

        var startParseForm = function () {
          if ($scope.form) {
            var model;
            if ($rootScope.isRuntime()) {
              if ($scope.isEditData) {
                model = {};
              } else {
                model = $scope.model;
              }
            } else {
              model = $scope.model;
            }

            if ($rootScope.isRuntime()) {
              $scope.parseForm($scope.form.properties, model);

              $rootScope.formModel = model;
              $rootScope.rootElement = $scope.form;
            } else {
              $rootScope.findChildren($scope.form.properties, model);
            }

            paginate();
          }
        };

        $scope.deselectAll = function () {
          console.log("deselectAll");
        }

        $scope.parseForm = function (iterator, parentModel, parentKey) {

          angular.forEach(iterator, function (value, name) {
            // Add @context information to instance
            if (name == '@context') {
              parentModel['@context'] = DataManipulationService.generateInstanceContext(value);
            }
            // Add @type information to template/element instance
            else if (name == '@type') {
              var type = DataManipulationService.generateInstanceType(value);
              if (type) {
                parentModel['@type'] = type;
              }
            }

            if (!DataUtilService.isSpecialKey(name)) {
              // Template Element
              if ($rootScope.schemaOf(value)['@type'] == 'https://schema.metadatacenter.org/core/TemplateElement') {
                var min = value.minItems || 0;

                // Handle position and nesting within $scope.model if it does not exist
                if (!DataManipulationService.isCardinalElement(value)) {
                  parentModel[name] = {};
                } else {
                  parentModel[name] = [];
                  for (var i = 0; i < min; i++) {
                    parentModel[name].push({});
                  }
                }

                if (angular.isArray(parentModel[name])) {
                  for (var i = 0; i < min; i++) {
                    // Indication of nested element or nested fields reached, recursively call function
                    $scope.parseForm($rootScope.propertiesOf(value), parentModel[name][i], name);
                  }
                } else {
                  $scope.parseForm($rootScope.propertiesOf(value), parentModel[name], name);
                }
                // Template Field
              } else {
                // Not a Static Field
                if (!value._ui || !value._ui.inputType || !FieldTypeService.isStaticField(value._ui.inputType)) {

                  var min = value.minItems || 0;

                  // Assign empty field instance model to $scope.model only if it does not exist
                  if (parentModel[name] == undefined) {
                    // Not multiple instance
                    if (!DataManipulationService.isCardinalElement(value)) {
                      // Multiple choice fields (checkbox and multi-choice list) store an array of values
                      if (DataManipulationService.isMultipleChoiceField(value)) {
                        parentModel[name] = [];
                      }
                      // All other fields, including the radio field and the list field with single option
                      else {
                        parentModel[name] = {};
                      }
                      // Multiple instance
                    } else {
                      parentModel[name] = [];
                      for (var i = 0; i < min; i++) {
                        var obj = {};
                        parentModel[name].push(obj);
                      }
                    }
                    // Set default values and types for element fields
                    DataManipulationService.initializeValue(value, parentModel[name]);
                    // Initialize value type for those fields that have it
                    if ((value) && (value._ui) && (value._ui.inputType) && ((value._ui.inputType == 'textfield') ||
                        (value._ui.inputType == 'date') || (value._ui.inputType == 'numeric'))) {
                      DataManipulationService.initializeValueType(value, parentModel[name]);
                    }
                    DataManipulationService.defaultOptionsToModel(value, parentModel[name]);
                  }
                }
              }
            }
          });
        };

        //
        // custom external validation
        //

        // get the validation errors from the different validation services
        $scope.doValidation = function (instance, url, type) {

          AuthorizedBackendService.doCall(
              HttpBuilderService.post(url, angular.toJson(instance)),
              function (response) {

                var data = response.data;
                if (!data.isValid || !data.validates) {

                  $scope.$emit('validationError',
                      ['remove', '', type]);

                  var errors = data.messages || data.errors;
                  for (var i = 0; i < errors.length; i++) {
                    // log to the console always
                    console.log(errors[i]);

                    $scope.$emit('validationError',
                        ['add', errors[i], type + i]);

                  }
                } else {

                  $scope.$emit('validationError',
                      ['remove', '', type]);

                  UIMessageService.flashSuccess('Submission Validated', {"title": "title"},
                      'Success');
                }
              },
              function (err) {
                UIMessageService.showBackendError($translate.instant('VALIDATION.externalValidation'), err);
              }
          );
        };

        $scope.validateInstance = function (instance, type) {
          switch (type) {
            case 'biosample':
              $scope.doValidation(instance, UrlService.biosampleValidation(), 'biosample');
              break;
            case 'airr':
              $scope.doValidation(instance, UrlService.airrValidation(), 'airr');
              break;
            case 'lincs':
              $scope.doValidation(instance, UrlService.lincsValidation(), 'lincs');
              break;
          }
        };

        $scope.$on('external-validation', function (event, params) {
          if (params && params[0]) {
            $scope.validateInstance($scope.model, params[0]);
          }
        });




//
// watches
//

// Angular's $watch function to call $scope.parseForm on form.properties initial population and on update
        $scope.$watch('form.properties', function () {
          startParseForm();
        });

// watch the dirty flag on the form
        $scope.$watch('forms.templateForm.$dirty', function () {
          $rootScope.setDirty($scope.forms.templateForm.$dirty);
        });

        $scope.$on("form:clean", function () {
          $scope.forms.templateForm.$setPristine();
          $rootScope.setDirty($scope.forms.templateForm.$dirty);
        });

        $scope.$on("form:dirty", function () {
          $scope.forms.templateForm.$setDirty();
          $rootScope.setDirty($scope.forms.templateForm.$dirty);
        });

        $scope.$on("form:update", function () {
          startParseForm();
          $scope.forms.templateForm.$setDirty();
          $rootScope.setDirty($scope.forms.templateForm.$dirty);
        });

        $scope.$on("form:reset", function () {
          $scope.forms.templateForm.$setDirty();
          $rootScope.setDirty($scope.forms.templateForm.$dirty);
        });

// Angular $watch function to run the Bootstrap Popover initialization on new form elements when they load
        $scope.$watch('page', function () {
          $scope.addPopover();
        });

// keep our rdf up-to-date
        $scope.$watch('model', function () {
          $scope.toRDF();
        }, true);

// Watching for the 'submitForm' event to be $broadcast from parent 'RuntimeController'
        $scope.$on('submitForm', function (event) {
          // Make the model (populated template) available to the parent
          $scope.$parent.instance = $scope.model;
          $scope.checkSubmission = true;
          var type = ValidationService.isValidationTemplate($rootScope.documentTitle, 'validation');
          if (type) {
            $scope.validateInstance($scope.$parent.instance, type);
          }
        });

        $scope.$on('formHasRequiredFields', function (event) {
          $scope.form.requiredFields = true;
        });

//
//
//

// create a copy of the form with the _tmp fields stripped out
        $scope.stripTmpFields = function () {

          var copiedForm = jQuery.extend(true, {}, $scope.model);
          if (copiedForm) {
            DataManipulationService.stripTmps(copiedForm);
          }
          return copiedForm;
        };

        $scope.toRDF = function () {
          var jsonld = require('jsonld');
          var copiedForm = jQuery.extend(true, {}, $scope.model);
          if (copiedForm) {
            jsonld.toRDF(copiedForm, {format: 'application/nquads'}, function (err, nquads) {
              $scope.metaToRDFError = err;
              $scope.metaToRDF = nquads;
              return nquads;
            });
          }
        };

        $scope.getRDF = function () {
          return $scope.metaToRDF;
        };

        $scope.getRDFError = function () {
          var result = $translate.instant('SERVER.RDF.SaveFirst');
          if ($scope.metaToRDFError) {
            result = $scope.metaToRDFError.details.cause.message;
          }
          return result;
        };

        $scope.isField = function (item) {
          return ($scope.getType(item) === 'https://schema.metadatacenter.org/core/TemplateField');
        };

        $scope.isHidden = function(item) {
          var node = $scope.form.properties[item];
          return DataManipulationService.isHidden(node);
        };

        $scope.getPreviousItem = function (index) {
          if (index) {
            return $scope.pagesArray[$scope.pageIndex][index];
          }
        };

        $scope.getPreviousField = function (page, index) {
          if ($scope.getPreviousItem(page, index)) {
            return $scope.form.properties[$scope.getPreviousItem(index)];
          }
        };

        $scope.getStaticPrevious = function (page, index) {
          if (index) {
            return ($scope.getType($scope.getPreviousItem(page,
                index)) === 'https://schema.metadatacenter.org/core/StaticTemplateField');
          } else {
            return false;
          }
        };

        $scope.getStaticField = function (item) {
          // if the previous item is static, then return it here
          var isStatic = ($scope.getType(item) === 'https://schema.metadatacenter.org/core/StaticTemplateField');
          return null;
        };

        $scope.isElement = function (item) {
          return ($scope.getType(item) === 'https://schema.metadatacenter.org/core/TemplateElement');
        };

        $scope.toggleExpanded = function () {
          $scope.expanded = !$scope.expanded;
        };

        $scope.close = function () {
          $scope.expanded = false;
        };

        $scope.isExpanded = function () {
          return $scope.expanded;
        };

        $scope.getType = function (item) {
          var obj = $scope.form.properties[item];
          var schema = $rootScope.schemaOf(obj);
          return schema['@type'];
        };

        $scope.isStaticField = function (field) {
          if (field) {
            var schema = $rootScope.schemaOf(field);
            var type = schema['@type'];
            return (type === 'https://schema.metadatacenter.org/core/StaticTemplateField');
          }
        };

        $scope.lastIndex = function (path) {
          if (path) {
            var indices = path.split('-');
            return indices[indices.length - 1];
          }
        };

        $scope.isActive = function () {
          return true;
        };

        $scope.getTitle = function () {
          return DataManipulationService.getTitle($scope.form);
        };

        $scope.isExpandable = function () {
          return true;
        };

// expand all the elements nested inside the form
        $scope.expandAll = function () {

          // expand the form
          $scope.expanded = true;

          $timeout(function () {

            // expand all the elements inside the form
            var schema = $rootScope.schemaOf($scope.form);
            var selectedKey;
            var props = $rootScope.propertiesOf($scope.form);
            angular.forEach(props, function (value, key) {
              var valueSchema = $rootScope.schemaOf(value);
              var valueId = valueSchema["@id"];
              var isElement = $rootScope.isElement(valueSchema);
              if ($rootScope.isElement(valueSchema)) {
                $scope.$broadcast("expandAll", [valueId]);
              }
            });

          }, 0);
        };

        $scope.uid = 'form';

// find the next sibling to activate
        $scope.activateNextSiblingOf = function (fieldKey, parentKey) {
          var index = 0;
          var order = $rootScope.schemaOf($scope.form)._ui.order;
          var props = $rootScope.schemaOf($scope.form).properties;
          var idx = order.indexOf(fieldKey);

          idx += 1;
          var found = false;
          while (idx < order.length && !found) {
            var nextKey = order[idx];
            var next = props[nextKey];
            found = !DataManipulationService.isStaticField(next);
            idx += 1;
          }
          if (found) {
            var next = props[nextKey];
            $rootScope.$broadcast("setActive",
                [DataManipulationService.getId(next), 0, $scope.path, nextKey, parentKey, true,
                 $scope.uid + '-' + nextKey]);
            return next;
          }
        };

      }
    }
        ;
  }
  ;

})
;
