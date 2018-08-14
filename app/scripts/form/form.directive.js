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
                           "ValidationService", "UIUtilService"];


  function formDirective($rootScope, $document, $timeout, $translate, $http, DataManipulationService, FieldTypeService,
                         DataUtilService, SubmissionService, UIMessageService, UrlService, AuthorizedBackendService,
                         HttpBuilderService, ValidationService, UIUtilService) {
    return {
      templateUrl: 'scripts/form/form.directive.html',
      restrict   : 'E',
      scope      : {
        pageIndex : '=',
        form      : '=',
        isEditData: "=",
        model     : '=',
        path      : '='
      },
      controller : function ($scope) {

        var dms = DataManipulationService;

        $scope.directiveName = 'form';
        $scope.forms = {};
        $scope.model = $scope.model || {};
        $scope.checkSubmission = false;
        $scope.pageIndex = $scope.pageIndex || 0;
        $scope.pageMin = 0;
        $scope.pageMax = 0;

        $scope.currentPage = [],
            $scope.pageIndex = 0,
            $scope.pagesArray = [];

        $scope.expanded = true;

        $scope.metaToRDF = null;
        $scope.metaToRDFError = null;


        $scope.isRuntime = function () {
          return UIUtilService.isRuntime();
        };

        $scope.isEditState = function (node) {
          return UIUtilService.isEditState(node);
        };

        $scope.isShowOutput = function () {
          return UIUtilService.isShowOutput();
        };

        $scope.toggleShowOutput = function () {
          return UIUtilService.toggleShowOutput();
        };

        $scope.scrollToAnchor = function (hash) {
          UIUtilService.scrollToAnchor(hash);
        };

        $scope.getShowOutputTab = function () {
          return UIUtilService.getShowOutputTab();
        };

        $scope.setShowOutputTab = function (index) {
          return UIUtilService.setShowOutputTab(index);
        };

        $scope.relabel = function (key) {
          // operates on templates and elements, so use the root scope json which
          // is element or form
          dms.relabel($rootScope.jsonToSave, key);
        };

        var paginate = function () {
          if ($scope.form) {

            var orderArray = [];
            var titles = [];
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
              if ($scope.form.properties[field]._ui && $scope.form.properties[field]._ui.inputType == 'page-break') {
                if (index == 0) {
                  titles.push($scope.getTitle());
                } else {
                  dimension++;
                  titles.push(dms.getTitle($scope.form.properties[field]));
                }
              }
              // Push field key into page array
              orderArray[dimension] = orderArray[dimension] || [];
              orderArray[dimension].push(field);
            });

            if (titles.length == 0) {
              titles.push($scope.getTitle());
            }

            $scope.pagesArray = orderArray;
            $scope.pageMax = $scope.pagesArray.length - 1;
            $scope.pageTitles = titles;
          }
        };

        // remove the child node from the form
        $scope.removeChild = function (node) {
          if (dms.firstClassField($scope.form,node)) {
            $scope.form = {};
          } else {
            dms.removeChild($scope.form, node);
            var state = DataUtilService.isElement(node) ? 'invalidElementState' : 'invalidFieldState';
            $scope.$emit(state, ["remove", dms.getTitle(node), dms.getId(node)]);
          }


        };

        // // rename the key of a child in the form
        // $scope.renameChildKey = function (child, newKey) {
        //   dms.renameChildKey($scope.form, child, newKey);
        // };

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


        $scope.pageTitle = function () {
          return ($scope.pagesArray.length > 1 ? ($scope.pageIndex + 1) + '. ' : '') +
              $scope.pageTitles ?  $scope.pageTitles[$scope.pageIndex]: '';
        };


        $scope.selectPage = function (i) {
          $scope.pageIndex = i;
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
            if (UIUtilService.isRuntime()) {
              if ($scope.isEditData) {
                model = {};
              } else {
                model = $scope.model;
              }
            } else {
              model = $scope.model;
            }

            if (UIUtilService.isRuntime()) {
              $scope.parseForm($scope.form.properties, model);

              $rootScope.formModel = model;
              $rootScope.rootElement = $scope.form;
            } else {
              DataManipulationService.findChildren($scope.form.properties, model);
            }

            paginate();
          }
        };

        $scope.deselectAll = function () {
          console.log("deselectAll");
        };

        $scope.parseForm = function (iterator, parentModel, parentKey) {

          angular.forEach(iterator, function (value, name) {
            // Add @context information to instance
            if (name == '@context') {
              parentModel['@context'] = dms.generateInstanceContext(value);
            }
            // Add @type information to template/element instance
            else if (name == '@type') {
              var type = dms.generateInstanceType(value);
              if (type) {
                parentModel['@type'] = type;
              }
            }

            if (!DataUtilService.isSpecialKey(name)) {
              if (dms.schemaOf(value)['@type'] == 'https://schema.metadatacenter.org/core/TemplateElement') {
                // Template Element
                var min = value.minItems || 0;

                // Handle position and nesting within $scope.model if it does not exist
                if (!dms.isCardinalElement(value)) {
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
                    $scope.parseForm(dms.propertiesOf(value), parentModel[name][i], name);
                  }
                } else {
                  $scope.parseForm(dms.propertiesOf(value), parentModel[name], name);
                }


              } else {
                // Template Field
                if (!dms.isStaticField(value)) {
                  // Not a Static Field
                  var min = value.minItems || 0;

                  // Assign empty field instance model to $scope.model only if it does not exist
                  if (parentModel[name] == undefined) {
                    // Not multiple instance
                    if (!dms.isCardinalElement(value)) {
                      // Multiple choice fields (checkbox and multi-choice list) store an array of values
                      if (dms.isMultipleChoiceField(value)) {
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
                    // Set default values and types for fields
                    dms.initializeValue(value, parentModel[name]);
                    // Initialize value type for those fields that have it
                    if (dms.isTextFieldType(value) || dms.isDateType(value) || dms.isNumericField(value)) {
                      dms.initializeValueType(value, parentModel[name]);
                    }
                    if (dms.isAttributeValueType(value)) {
                      // remove the @context entry for this attribute-value fields
                      // delete the context int the parent
                      delete parentModel['@context'][name];
                      parentModel[name] = [];
                    }
                    dms.defaultOptionsToModel(value, parentModel[name]);
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
        $scope.$watch('forms.templateForm.$dirty', function (value) {
          UIUtilService.setForm($scope.forms.templateForm);
          if (value) {
            UIUtilService.setDirty(value);
          }
        });

        $scope.$on("form:firstDirty", function (event) {
          if (UIUtilService.hasMetadata()) {
            UIMessageService.flashWarning("The template has metadata and should not be modified.");
          }
          if (UIUtilService.isLocked()) {
            UIMessageService.flashWarning('Modifications cannot be saved without write permission.');
          }
        });

        $scope.$on("form:clean", function () {
          UIUtilService.setDirty(false);
        });

        $scope.$on("form:update", function () {
          startParseForm();
          UIUtilService.setDirty(true);
        });

        $scope.$on("form:reset", function () {
          UIUtilService.setDirty(true);
        });

        // Angular $watch function to run the Bootstrap Popover initialization on new form elements when they load
        $scope.$watch('page', function () {
          $scope.addPopover();
        });

        // keep our rdf up-to-date
        $scope.$watch('model', function () {
          UIUtilService.toRDF($scope.model);
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
        $scope.cleanForm = function () {

          var copiedForm = jQuery.extend(true, {}, $scope.model);
          if (copiedForm) {
            dms.stripTmps(copiedForm);
          }
          UIUtilService.toRDF();

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
          return UIUtilService.getRDF();
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

        $scope.isFirstClassField = function(node) {
          return node && (dms.getType(node) === 'https://schema.metadatacenter.org/core/TemplateField');
        };

        $scope.isSectionBreak = function (item) {
          var properties = dms.propertiesOf($scope.form);
          var node = properties[item];
          return dms.isSectionBreak(node);
        };

        $scope.isHidden = function (item) {
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
          var properties = dms.propertiesOf($scope.form);
          var node = properties[item];
          return dms.getType(node);
        };

        $scope.isStaticField = function (node) {
          return dms.isStaticField(node);
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
          return dms.getTitle($scope.form);
        };

        $scope.getFormTitle = function (item) {
          return dms.getTitle($scope.form.properties[item]);
        };


        $scope.formatTitle = function () {
          return UIUtilService.formatTitle($scope.form);
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
            var schema = dms.schemaOf($scope.form);
            var selectedKey;
            var props = dms.propertiesOf($scope.form);
            angular.forEach(props, function (value, key) {
              if (DataUtilService.isElement(value)) {
                $scope.$broadcast("expandAll", [dms.getId(value)]);
              }
            });

          }, 0);
        };



        // find the next sibling to activate
        $scope.activateNextSiblingOf = function (fieldKey, parentKey) {
          var index = 0;
          var order = dms.schemaOf($scope.form)._ui.order;
          var props = dms.schemaOf($scope.form).properties;
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

        //
        // init
        //

        $scope.uid = 'form';


      }
    };
  };

});
