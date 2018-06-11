'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.templateElement.createElementController', [])
      .controller('CreateElementController', CreateElementController);

  CreateElementController.$inject = ["$rootScope", "$scope", "$routeParams", "$timeout", "$location", "$translate",
                                     "$filter", "HeaderService", "StagingService", "DataTemplateService",
                                     "FieldTypeService", "TemplateElementService", "resourceService", "UIMessageService",
                                     "DataManipulationService", "DataUtilService", "UIUtilService", "AuthorizedBackendService",
                                     "FrontendUrlService", "QueryParamUtilsService", "CONST"];


  function CreateElementController($rootScope, $scope, $routeParams, $timeout, $location, $translate, $filter,
                                   HeaderService, StagingService, DataTemplateService, FieldTypeService,
                                   TemplateElementService, resourceService, UIMessageService, DataManipulationService,
                                   DataUtilService,UIUtilService,
                                   AuthorizedBackendService, FrontendUrlService, QueryParamUtilsService, CONST) {

    var dms = DataManipulationService;

    $rootScope.showSearch = true;
    $rootScope.searchBrowseModalId = "search-browse-modal";
    $rootScope.finderModalId = "finder-modal";

    // Set page title variable when this controller is active
    $rootScope.pageTitle = 'Element Designer';
    // Setting default false flag for $scope.favorite
    //$scope.favorite = false;
    // Empty $scope object used to store values that get converted to their json-ld counterparts on the $scope.element object
    $scope.volatile = {};
    // Setting form preview setting to false by default
    //$scope.form = {};
    $scope.viewType = 'popup';

    $scope.isElement = true;

    // template details
    $scope.details;
    $scope.cannotWrite;
    $scope.lockReason = '';


    // can we write to this template?  if no details, then new element
    $scope.canWrite = function () {
      var result =  !$scope.details || resourceService.canWrite($scope.details);
      $scope.cannotWrite  =!result;
      return result;
      $scope.lockReason = 'no write permission';
    };

    // This function watches for changes in the _ui.title field and autogenerates the schema title and description fields
    $scope.$watch('cannotWrite', function () {
      UIUtilService.setLocked($scope.cannotWrite, $scope.lockReason);
    });

    $scope.showCreateEditForm = true;

    var pageId = CONST.pageId.ELEMENT;
    HeaderService.configure(pageId);
    StagingService.configure(pageId);

    $scope.primaryFieldTypes = FieldTypeService.getPrimaryFieldTypes();
    $scope.otherFieldTypes = FieldTypeService.getOtherFieldTypes();


    $scope.saveButtonDisabled = false;

    $scope.setClean = function() {
      $rootScope.$broadcast('form:clean');
      UIUtilService.setDirty(false);
    };



    // validate the resource
    var checkValidation = function (node) {

      if (node) {
        return resourceService.validateResource(
            node, CONST.resourceType.ELEMENT,
            function (response) {

              var json = angular.toJson(response);
              var status = response.validates == "true";
              UIUtilService.logValidation(status, json);

              $timeout(function () {
                $rootScope.$broadcast("form:validation", { state: status });
              });

            },
            function (error) {
              UIMessageService.showBackendError('SERVER.FOLDER.load.error', error);
            }
        );
      }
    };

    $scope.checkLocking = function () {
      var result = !$scope.hasInstances && ( !$scope.details || resourceService.canWrite($scope.details));
      $scope.cannotWrite = !result;
      return result;
    };

    var getDetails = function (id) {
      resourceService.getResourceDetailFromId(
          id, CONST.resourceType.ELEMENT,
          function (response) {
            $scope.details = response;
            $scope.canWrite();
          },
          function (error) {
            UIMessageService.showBackendError('SERVER.' + 'ELEMENT' + '.load.error', error);
          }
      );
    };

    var getElement = function () {
      $scope.form = {};
      // Load existing element if $routeParams.id parameter is supplied
      if ($routeParams.id) {
        // Fetch existing element and assign to $scope.element property
        AuthorizedBackendService.doCall(
            TemplateElementService.getTemplateElement($routeParams.id),
            function (response) {
              $scope.element = response.data;

              var copiedForm = jQuery.extend(true, {}, $scope.element);
              checkValidation(copiedForm);

              HeaderService.dataContainer.currentObjectScope = $scope.element;

              var key = $scope.element["@id"];
              $rootScope.keyOfRootElement = key;
              $rootScope.rootElement = $scope.form;
              $scope.form.properties = $scope.form.properties || {};
              $scope.form.properties[key] = $scope.element;
              $scope.form._ui = $scope.form._ui || {};
              $scope.form._ui.order = $scope.form._ui.order || [];
              $scope.form._ui.order.push(key);

              $scope.form._ui.propertyLabels = $scope.form._ui.propertyLabels || {};

              $rootScope.jsonToSave = $scope.element;
              $rootScope.documentTitle = dms.getTitle($scope.form);

              dms.createDomIds($scope.element);

              $scope.elementSchema = dms.schemaOf($scope.element);

              $scope.setClean();

              getDetails(key);

            },
            function (err) {
              UIMessageService.showBackendError('SERVER.ELEMENT.load.error', err);
              $rootScope.goToHome();
            }
        );
      } else {
        // If we're not loading an existing element then let's create a new empty $scope.element property
        $scope.element = DataTemplateService.getElement();

        UIUtilService.setValidation(true);

        HeaderService.dataContainer.currentObjectScope = $scope.element;

        var key = $scope.element["@id"] || dms.generateGUID();
        $rootScope.keyOfRootElement = key;
        $rootScope.rootElement = $scope.form;
        $scope.form.properties = $scope.form.properties || {};
        $scope.form.properties[key] = $scope.element;
        $scope.form._ui = $scope.form._ui || {};
        $scope.form._ui.order = $scope.form._ui.order || [];
        $scope.form._ui.order.push(key);

        $scope.form._ui.propertyLabels = $scope.form._ui.propertyLabels || {};

        $rootScope.jsonToSave = $scope.element;
        dms.createDomIds($scope.element);

        $scope.elementSchema = dms.schemaOf($scope.element);

        $scope.setClean();

      }
    };
    getElement();

    var populateCreatingFieldOrElement = function () {
      $scope.invalidFieldStates = {};
      $scope.invalidElementStates = {};
      $rootScope.$broadcast('saveForm');
      //dms.updateKeys($scope.form);
    };

    var dontHaveCreatingFieldOrElement = function () {
      return $rootScope.isEmpty($scope.invalidFieldStates) && $rootScope.isEmpty($scope.invalidElementStates);
    };

    // *** proxied functions
    // Return true if element.properties object only contains default values
    $scope.isPropertiesEmpty = function () {
      return DataUtilService.isPropertiesEmpty($scope.element);
    };

    // Add newly configured field to the element object
    $scope.addField = function (fieldType) {

      populateCreatingFieldOrElement();
      if (dontHaveCreatingFieldOrElement()) {
        StagingService.addFieldToElement($scope.element, fieldType);
        $scope.toggleMore();
        $timeout(function () {
          UIUtilService.setDirty(true);
        });
      }
      $scope.showMenuPopover = false;
    };


    $scope.moreIsOpen = false;
    $scope.toggleMore = function() {
      $scope.moreIsOpen = !$scope.moreIsOpen;
    };

    $scope.addElementToElement = function (element) {
      populateCreatingFieldOrElement();
      if (dontHaveCreatingFieldOrElement()) {

        DataManipulationService.createDomIds(element);

        var domId = DataManipulationService.createDomId();
        StagingService.addElementToForm($scope.element, element["@id"], domId, function (e) {

          // now we are sure that the element was successfully added, scroll to it and hide its nested contents
          UIUtilService.scrollToDomId(domId);

        });
        $rootScope.$broadcast("form:update", element);
      }
    };

    $scope.addStandAloneFieldToElement = function (node) {
      console.log('addStandAloneFieldToElement',node, $scope.element);
      populateCreatingFieldOrElement();
      if (dontHaveCreatingFieldOrElement()) {
        dms.createDomIds(node);

        var domId = DataManipulationService.createDomId();
        StagingService.addStandAloneFieldToForm($scope.element, dms.getId(node), domId, function (e) {

          // now we are sure that the element was successfully added, scroll to it and hide its nested contents
          UIUtilService.scrollToDomId(domId);

        });
        $rootScope.$broadcast("form:update", node);
      }
    };

    $scope.backToFolder = function () {
      $location.url(FrontendUrlService.getFolderContents(QueryParamUtilsService.getFolderId()));
    };

    // Reverts to empty form and removes all previously added fields/elements
    $scope.reset = function () {
      UIMessageService.confirmedExecution(
          function () {
            $timeout(function () {
              $scope.doReset();
              StagingService.resetPage();
            });
          },
          'GENERIC.AreYouSure',
          'ELEMENTEDITOR.clear.confirm',
          'GENERIC.YesClearIt'
      );
    };


    $scope.doReset = function () {
      // Loop through $scope.form.properties object and delete each field leaving default json-ld syntax in place
      angular.forEach($scope.element.properties, function (value, key) {
        if (!DataUtilService.isSpecialKey(key)) {
          delete $scope.element.properties[key];
        }
      });
      $scope.element._ui.order = [];
      UIUtilService.setDirty(false);
    };

    $scope.saveElement = function () {
      populateCreatingFieldOrElement();
      if (dontHaveCreatingFieldOrElement()) {
        UIMessageService.conditionalOrConfirmedExecution(
            StagingService.isEmpty(),
            function () {
              $scope.doSaveElement();
            },
            'GENERIC.AreYouSure',
            'ELEMENTEDITOR.save.nonEmptyStagingConfirm',
            'GENERIC.YesSaveIt'
        );
      }
    };

    // Stores the element into the database
    $scope.doSaveElement = function () {

      // First check to make sure Element Name, Element Description are not blank
      $scope.elementErrorMessages = [];
      $scope.elementSuccessMessages = [];


      // // If Element Name is blank, produce error message
      // var title = dms.getTitle($scope.element);
      // if (!title.length) {
      //   $scope.elementErrorMessages.push($translate.instant("VALIDATION.elementNameEmpty"));
      // }

      // If there are no Element level error messages
      if ($scope.elementErrorMessages.length == 0) {

        // If maxItems is N, then remove maxItems
        dms.removeUnnecessaryMaxItems($scope.element.properties);
        dms.defaultSchemaTitleAndDescription($scope.element);

        this.disableSaveButton();
        var owner = this;

        // Check if the element is already stored into the DB
        if ($routeParams.id == undefined) {
          dms.stripTmps($scope.element);
          dms.updateKeys($scope.element);

          AuthorizedBackendService.doCall(
              TemplateElementService.saveTemplateElement(QueryParamUtilsService.getFolderId(), $scope.element),
              function (response) {

                UIUtilService.logValidation(response.headers("CEDAR-Validation-Status"));

                // confirm message
                var title = dms.getTitle(response.data);
                UIMessageService.flashSuccess('SERVER.ELEMENT.create.success',
                    {"title": title},
                    'GENERIC.Created');
                // Reload page with element id
                var newId = response.data['@id'];
                dms.createDomIds(response.data);
                $location.path(FrontendUrlService.getElementEdit(newId));

                $scope.setClean();
              },
              function (err) {
                UIMessageService.showBackendError('SERVER.ELEMENT.create.error', err);
                owner.enableSaveButton();
              }
          );
        }
        // Update element
        else {
          var id = $scope.element['@id'];
          dms.updateKeys($scope.element);
          $rootScope.jsonToSave = $scope.element;

          var copiedForm = jQuery.extend(true, {}, $scope.element);
          if (copiedForm) {
            // strip the temps from the copied form only, and save the copy
            DataManipulationService.stripTmps(copiedForm);



            AuthorizedBackendService.doCall(
                TemplateElementService.updateTemplateElement(id, copiedForm),
                function (response) {

                  UIUtilService.logValidation(response.headers("CEDAR-Validation-Status"));

                  // dms.createDomIds(response.data);
                  // angular.extend($scope.element, response.data);

                  UIMessageService.flashSuccess('SERVER.ELEMENT.update.success', {"title": response.data.title},
                      'GENERIC.Updated');

                  owner.enableSaveButton();
                  $scope.setClean();


                },
                function (err) {
                  UIMessageService.showBackendError('SERVER.ELEMENT.update.error', err);
                  owner.enableSaveButton();
                }
            );
          }
        }
      }
    };

    $scope.invalidFieldStates = {};
    $scope.invalidElementStates = {};
    $scope.$on('invalidFieldState', function (event, args) {
      if (args[2] != $scope.element["@id"]) {
        if (args[0] == 'add') {
          $scope.invalidFieldStates[args[2]] = args[1];
        }
        if (args[0] == 'remove') {
          delete $scope.invalidFieldStates[args[2]];
        }
      }
    });
    $scope.$on('invalidElementState', function (event, args) {
      if (args[0] == 'add') {
        $scope.invalidElementStates[args[2]] = args[1];
      }
      if (args[0] == 'remove') {
        delete $scope.invalidElementStates[args[2]];
      }
    });


    // This function watches for changes in the title field and autogenerates the schema title and description fields
    $scope.$watch('element["schema:name"]', function (v) {
      if (!angular.isUndefined($scope.element)) {
        var title = dms.getTitle($scope.element);
        if (title && title.length > 0) {
          var capitalizedTitle = $filter('capitalizeFirst')(title);
          $scope.element.title = $translate.instant(
              "GENERATEDVALUE.elementTitle",
              {title: capitalizedTitle}
          );
          $scope.element.description = $translate.instant(
              "GENERATEDVALUE.elementDescription",
              {title: capitalizedTitle, version:window.cedarVersion}
          );
        } else {
          $scope.element.title = "";
          $scope.element.description = "";
        }
        $rootScope.documentTitle = title;
      }
    });

    // This function watches for changes in the form and defaults the title and description fields
    $scope.$watch('$scope.element', function (v) {
      if (dms.schemaOf($scope.element)) {
        if (!dms.getTitle($scope.element)) {
          dms.setTitle($scope.element, $translate.instant("VALIDATION.noNameElement"));
        }
        if (!dms.getDescription($scope.element)) {
          dms.setDescription($scope.element, $translate.instant("VALIDATION.noDescriptionElement"));
        }
      }
    });

    $scope.toRDF = function () {
      var jsonld = require('jsonld');
      var copiedForm = jQuery.extend(true, {}, $rootScope.jsonToSave);
      if (copiedForm) {
        jsonld.toRDF(copiedForm, {format: 'application/nquads'}, function(err, nquads) {
          $rootScope.jsonToRDF = nquads;
          return nquads;
        });
      }
    };

    // create a copy of the form with the _tmp fields stripped out
    $scope.stripTmpFields = function () {
      var copiedForm = jQuery.extend(true, {}, $rootScope.jsonToSave);
      if (copiedForm) {
        dms.stripTmps(copiedForm);
        dms.updateKeys(copiedForm);
      }
      return copiedForm;
    };

    $scope.cancelElement = function () {
      $location.url(FrontendUrlService.getFolderContents(QueryParamUtilsService.getFolderId()));
    };

    $scope.elementSearch = function () {
      jQuery("body").trigger("click");
      jQuery("#" + $scope.searchBrowseModalId).modal("show");
    }

    $scope.addElementFromPicker = function () {
      if ($scope.pickerResource) {
        $scope.addElementToElement($scope.pickerResource);
      }
      $scope.hideSearchBrowsePicker();
    };

    $scope.pickElementFromPicker = function (resource) {
      $scope.addElementToElement(resource);
      $scope.hideSearchBrowsePicker();
    };



    $scope.pickElementFromPicker = function (resource) {
      if (resource.nodeType == 'element') {
        $scope.addElementToElement(resource);
      } else if (resource.nodeType == 'field') {
        $scope.addStandAloneFieldToElement(resource);
      }

      $scope.hideSearchBrowsePicker();
    };

    $scope.selectElementFromPicker = function (resource) {
      $scope.pickerResource = resource;
    };

    $scope.showSearchBrowsePicker = function () {
      $scope.pickerResource = null;
    };

    $scope.hideSearchBrowsePicker = function () {
      jQuery("#" + $scope.searchBrowseModalId).modal('hide')
    };

    //
    // finder
    //

    $scope.showFinderModal = function () {
      // open and activate the modal
      $scope.finderModalVisible = true;
      $rootScope.$broadcast('finderModalVisible');
    };

    $scope.hideFinder = function () {
      jQuery("#finder-modal").modal('hide')
    };


    // $scope.addElementFromFinder = function () {
    //   if ($scope.finderResource) {
    //     $scope.addElementToTemplate($scope.finderResource);
    //   }
    //   $scope.hideFinder();
    // };
    //
    // $scope.showFinder = function () {
    //   $scope.finderResource = null;
    // };



    $scope.enableSaveButton = function () {
      $timeout(function () {
        $scope.saveButtonDisabled = false;
      }, 1000);
    };

    $scope.disableSaveButton = function () {
      $scope.saveButtonDisabled = true;
    };

    $scope.showModal = function (id) {
      console.log('showModal',id);
      jQuery("#" + id).modal('show');
    };

    //TODO this event resets modal state and closes modal
    $scope.$on("field:controlledTermAdded", function () {
      jQuery("#control-options-element-field").modal('hide');
    });

    // // update the property for a field
    // $scope.$on("property:propertyAdded", function (event, args) {
    //
    //   var propertyId = args[0];
    //   var propertyLabel = args[2];
    //   var id = args[1];
    //   var propertyDescription = args[3];
    //
    //   dms.updateProperty(propertyId, propertyLabel, propertyDescription, id, $scope.element);
    //
    //
    // });


  }

});
