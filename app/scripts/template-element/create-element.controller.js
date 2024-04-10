'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.templateElement.createElementController', [])
      .controller('CreateElementController', CreateElementController);

  CreateElementController.$inject = ["$rootScope", "$scope", "$routeParams", "$timeout", "$location", "$translate",
                                     "$filter", "HeaderService", "StagingService", "DataTemplateService",
                                     "FieldTypeService", "TemplateElementService", "resourceService", "ValidationService","UIMessageService",
                                     "DataManipulationService", "schemaService","DataUtilService", "UIUtilService", "AuthorizedBackendService",
                                     "FrontendUrlService", "QueryParamUtilsService", "CONST","CedarUser"];


  function CreateElementController($rootScope, $scope, $routeParams, $timeout, $location, $translate, $filter,
                                   HeaderService, StagingService, DataTemplateService, FieldTypeService,
                                   TemplateElementService, resourceService, ValidationService,UIMessageService,
                                   DataManipulationService,schemaService,
                                   DataUtilService,UIUtilService,
                                   AuthorizedBackendService, FrontendUrlService, QueryParamUtilsService, CONST,CedarUser) {

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

    $scope.canWrite = function () {
      if (!$scope.details) {
        return true;
      }
      else {
        // Check write permission
        var writePermission = resourceService.canWrite($scope.details);

        // Check publication status
        var isPublished = schemaService.isPublished($scope.details);

        // Result
        var canWrite = writePermission && !isPublished;
        $scope.cannotWrite = !canWrite;
        return canWrite;
      }
    };

    $scope.checkLocking = function () {
      return $scope.canWrite();
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

              UIUtilService.setStatus($scope.element[CONST.publication.STATUS]);
              UIUtilService.setVersion($scope.element[CONST.publication.VERSION]);
              UIUtilService.setTotalMetadata(0);
              UIUtilService.setVisibleMetadata(0);



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


              $rootScope.documentTitle = dms.getTitle($scope.form);

              dms.createDomIds($scope.element);

              $scope.elementSchema = dms.schemaOf($scope.element);

              $rootScope.jsonToSave = $scope.element;
              ValidationService.checkValidation();
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

        UIUtilService.setStatus($scope.element[CONST.publication.STATUS]);
        UIUtilService.setVersion($scope.element[CONST.publication.VERSION]);
        UIUtilService.setTotalMetadata(0);
        UIUtilService.setVisibleMetadata(0);

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
          ValidationService.checkValidation($scope.element);
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
          UIUtilService.setDirty(true);
          ValidationService.checkValidation($scope.element);
          $rootScope.$broadcast("form:update", element);
        });
      }
    };

    $scope.addStandAloneFieldToElement = function (node) {
      populateCreatingFieldOrElement();
      if (dontHaveCreatingFieldOrElement()) {
        dms.createDomIds(node);

        var domId = DataManipulationService.createDomId();
        StagingService.addStandAloneFieldToForm($scope.element, dms.getId(node), domId, function (e) {

          // now we are sure that the element was successfully added, scroll to it and hide its nested contents
          UIUtilService.scrollToDomId(domId);
          UIUtilService.setDirty(true);
          ValidationService.checkValidation($scope.element);
          $rootScope.$broadcast("form:update", node);
        });
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

      var doSave = function(response) {
        ValidationService.logValidation(response.headers("CEDAR-Validation-Status"));

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
      };

      var doUpdate = function(response) {
        ValidationService.logValidation(response.headers("CEDAR-Validation-Status"));

        UIMessageService.flashSuccess('SERVER.ELEMENT.update.success', {"title": response.data.title},
            'GENERIC.Updated');

        owner.enableSaveButton();
        $scope.setClean();
      };

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
        schemaService.removeUnnecessaryMaxItems($scope.element.properties);
        schemaService.defaultSchemaTitleAndDescription($scope.element);

        this.disableSaveButton();
        var owner = this;

        // Check if the element is already stored into the DB
        if ($routeParams.id == undefined) {
          dms.stripTmps($scope.element);
          dms.updateKeys($scope.element);

          AuthorizedBackendService.doCall(
              TemplateElementService.saveTemplateElement(QueryParamUtilsService.getFolderId(), $scope.element),
              function (response) {
                doSave(response);
              },
              function (err) {

                if (err.data.errorKey == "noWriteAccessToFolder") {
                  AuthorizedBackendService.doCall(
                      TemplateElementService.saveTemplateElement(CedarUser.getHomeFolderId(), $scope.element),
                      function (response) {
                        doSave(response);
                        UIMessageService.flashWarning('SERVER.INSTANCE.create.homeFolder');
                      },
                      function (err) {
                        UIMessageService.showBackendError('SERVER.ELEMENT.create.error', err);
                        owner.enableSaveButton();
                      });
                } else {
                  UIMessageService.showBackendError('SERVER.ELEMENT.create.error', err);
                  owner.enableSaveButton();
                }
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
                  doUpdate(response);
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

    $scope.$watch('element["schema:identifier"]', function (identifier) {
      if (!angular.isUndefined($scope.element) && !identifier) {
        schemaService.removeIdentifier($scope.element);
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
      if (resource.resourceType == 'element') {
        $scope.addElementToElement(resource);
      } else if (resource.resourceType == 'field') {
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
    // finder modal
    //

    $scope.showFinderModal = function () {
      // open and activate the modal
      $scope.finderModalVisible = true;
      $rootScope.$broadcast('finderModalVisible');
    };

    // $scope.hideFinder = function () {
    //   jQuery("#finder-modal").modal('hide')
    // };

    $scope.enableSaveButton = function () {
      $timeout(function () {
        $scope.saveButtonDisabled = false;
      }, 1000);
    };

    $scope.disableSaveButton = function () {
      $scope.saveButtonDisabled = true;
    };

    //
    // controlled terms modal
    //

    $scope.showModal = function (type, searchScope) {
      var options = {"filterSelection":type, "searchScope": searchScope, "modalId":"controlled-term-modal", "model": $scope.element, "id":dms.getId($scope.element), "q": dms.getTitle($scope.element),'source': null,'termType': null, 'term': null, "advanced": false, "permission": ["read","write"]};
      UIUtilService.showModal(options);
    };

    $scope.$on("field:controlledTermAdded", function (event,args) {
      if (args[1] == dms.getId($scope.element)) {
        UIUtilService.hideModal();
        UIUtilService.setDirty(true);
      }
    });

    //
    // Collapsible panel with additional metadata for the template
    //
    $scope.additionalInfoPanelIsOpen = false;
    $scope.toggleAdditionalInfoPanel = function () {
      $scope.additionalInfoPanelIsOpen = !$scope.additionalInfoPanelIsOpen;
    };
    $scope.getAdditionalInfoButtonTooltip = function() {
      if (!$scope.additionalInfoPanelIsOpen) {
        return $translate.instant("CREATOR.showAdditionalFields");
      }
      else {
        return $translate.instant("CREATOR.hideAdditionalFields");
      }
    };

    $scope.copyJson2Clipboard = function () {
      navigator.clipboard.writeText($filter('json')(this.stripTmpFields())).then(function(){
        UIMessageService.flashSuccess('METADATAEDITOR.JsonSchemaCopied', {"title": "METADATAEDITOR.JsonSchemaCopied"}, 'GENERIC.Copied');
        $scope.$apply();
      }).catch((err)=>{
        UIMessageService.flashWarning('METADATAEDITOR.JsonSchemaCopyFail', {"title": "METADATAEDITOR.JsonSchemaCopyFail"}, 'GENERIC.Error');
        console.error(err);
        $scope.$apply();
      });
    };

  }
});
