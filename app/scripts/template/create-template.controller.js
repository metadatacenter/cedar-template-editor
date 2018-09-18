'use strict';

define([
      'angular'
    ], function (angular) {
      angular.module('cedar.templateEditor.template.createTemplateController', [])
          .controller('CreateTemplateController', CreateTemplateController);

      CreateTemplateController.$inject = ["$rootScope", "$scope", "$routeParams", "$timeout", "$location", "$translate",
                                          "$filter", "TrackingService", "HeaderService", "StagingService",
                                          "DataTemplateService", "FieldTypeService",
                                          "TemplateService", "resourceService", "UIMessageService", "UIUtilService",
                                          "DataManipulationService",
                                          "controlledTermDataService", "StringUtilsService",
                                          "DataUtilService", "AuthorizedBackendService",
                                          "FrontendUrlService", "QueryParamUtilsService", "CONST",  "CedarUser"];

      function CreateTemplateController($rootScope, $scope, $routeParams, $timeout, $location, $translate, $filter,
                                        TrackingService, HeaderService, StagingService, DataTemplateService,
                                        FieldTypeService, TemplateService, resourceService, UIMessageService,
                                        UIUtilService, DataManipulationService, controlledTermDataService,
                                        StringUtilsService,
                                        DataUtilService, AuthorizedBackendService,
                                        FrontendUrlService, QueryParamUtilsService, CONST,  CedarUser) {

        $rootScope.showSearch = false;

        // Set Page Title variable when this controller is active
        $rootScope.pageTitle = 'Template Designer';
        $rootScope.searchBrowseModalId = "search-browse-modal";
        $rootScope.finderModalId = "finder-modal";

        var dms = DataManipulationService;

        var pageId = CONST.pageId.TEMPLATE;
        HeaderService.configure(pageId);
        StagingService.configure(pageId);
        $scope.primaryFieldTypes = FieldTypeService.getPrimaryFieldTypes();
        $scope.otherFieldTypes = FieldTypeService.getOtherFieldTypes();
        $scope.saveButtonDisabled = false;
        $scope.viewType = 'popup';

        // template details
        $scope.details;
        $scope.cannotWrite;

        $scope.isTemplate = true;

        // validate the resource
        var checkValidation = function (node) {
          if (node) {
            return resourceService.validateResource(
                node, CONST.resourceType.TEMPLATE,
                function (response) {

                  var json = angular.toJson(response);
                  var status = response.validates == "true";
                  UIUtilService.logValidation(status, json);

                  $timeout(function () {
                    $rootScope.$broadcast("form:validation", {state: status});
                  });

                },
                function (error) {
                  UIMessageService.showBackendError('SERVER.FOLDER.load.error', error);
                }
            );
          }
        };

        $scope.checkLocking = function () {
          if ($scope.details) {
            // Check write permission
            var writePermission = resourceService.canWrite($scope.details);

            // Check publication status
            var isPublished = DataManipulationService.isPublished($scope.details);

            // Check if the resource has instances (only for templates)
            // TODO: check all instances, not only the visible ones
            var hasInstances = false;
            if (UIUtilService.getVisibleMetadata() > 0) {
              hasInstances = true;
            }
            // Result
            var canWrite = writePermission && !isPublished && !hasInstances;
            $scope.cannotWrite = !canWrite;
            $scope.saveButtonDisabled = !canWrite;
            return canWrite;
          }
          return false;
        };

        // This function watches for changes in the _ui.title field and autogenerates the schema title and description fields
        $scope.$watch('cannotWrite', function () {
          UIUtilService.setLocked($scope.cannotWrite);
        });

        var doSearchTemplateInstances = function (id) {
          var limit = 1;
          var offset = 0;
          var sort = 'name';

          // TODO this should use the /report call to get the invisible instances as well as the visible
          resourceService.hasMetadata(
              id,
              {sort: sort, limit: limit, offset: offset},
              function (response) {
                UIUtilService.setTotalMetadata(response.resources.length);
                UIUtilService.setVisibleMetadata(response.totalCount || 0);
                UIUtilService.setInstances(response.resources);
                $scope.checkLocking();
              },
              function (error) {
                UIMessageService.showBackendError('SERVER.SEARCH.error', error);
              }
          );
        };

        var getDetails = function (id) {
          resourceService.getResourceDetailFromId(
              id, CONST.resourceType.TEMPLATE,
              function (response) {
                $scope.details = response;
                doSearchTemplateInstances(id);
              },
              function (error) {
                UIMessageService.showBackendError('SERVER.' + 'TEMPLATE' + '.load.error', error);
              }
          );
        };


        var getTemplate = function () {
          // Load existing form if $routeParams.id parameter is supplied
          if ($routeParams.id) {
            // Fetch existing form and assign to $scope.form property
            AuthorizedBackendService.doCall(
                TemplateService.getTemplate($routeParams.id),
                function (response) {

                  $scope.form = response.data;
                  var copiedForm = jQuery.extend(true, {}, $scope.form);
                  if (copiedForm) {
                    return resourceService.validateResource(
                        copiedForm, CONST.resourceType.TEMPLATE,
                        function (response) {
                          //TODO turn this off for now
                          //if (response.validates == "true") {


                          HeaderService.dataContainer.currentObjectScope = $scope.form;
                          $rootScope.keyOfRootElement = $scope.form["@id"];
                          $rootScope.rootElement = $scope.form;
                          $rootScope.jsonToSave = $scope.form;

                          UIUtilService.setStatus($scope.form[CONST.publication.STATUS]);
                          UIUtilService.setVersion($scope.form[CONST.publication.VERSION]);
                          UIUtilService.setTotalMetadata(0);
                          UIUtilService.setVisibleMetadata(0);

                          DataManipulationService.createDomIds($scope.form);
                          //$scope.getType();
                          $rootScope.$broadcast('form:clean');
                          $rootScope.$broadcast("form:validation", {state: true});
                          getDetails($scope.form["@id"]);
                          // } else {
                          //   // TODO validate before loading template-controller
                          //   $rootScope.goToHome();
                          //   UIMessageService.showWarning(
                          //       'GENERIC.Warning',
                          //       'VALIDATION.templateLoad',
                          //       'GENERIC.Ok'
                          //   );
                          // }
                        },
                        function (error) {
                          UIMessageService.showBackendError('SERVER.FOLDER.load.error', error);
                        }
                    );
                  }
                },
                function (err) {
                  UIMessageService.showBackendError('SERVER.TEMPLATE.load.error', err);
                }
            );
          } else {
            // If we're not loading an existing form then let's create a new empty $scope.form property
            $scope.form = DataTemplateService.getTemplate();

            UIUtilService.setValidation(true);
            HeaderService.dataContainer.currentObjectScope = $scope.form;
            $rootScope.keyOfRootElement = $scope.form["@id"];
            $rootScope.rootElement = $scope.form;
            $rootScope.jsonToSave = $scope.form;

            UIUtilService.setStatus($scope.form[CONST.publication.STATUS]);
            UIUtilService.setVersion($scope.form[CONST.publication.VERSION]);
            UIUtilService.setTotalMetadata(0);
            UIUtilService.setVisibleMetadata(0);

            DataManipulationService.createDomIds($scope.form);
            $rootScope.$broadcast('form:clean');
          }
        };

        getTemplate();


        var populateCreatingFieldOrElement = function () {
          $scope.invalidFieldStates = {};
          $scope.invalidElementStates = {};
          $scope.$broadcast('saveForm');

          TrackingService.eventTrack('saveForm', {category: 'creating', label: 'saveForm'});
          TrackingService.pageTrack();

          //DataManipulationService.updateKeys($scope.form);
        };

        var dontHaveCreatingFieldOrElement = function () {
          return $rootScope.isEmpty($scope.invalidFieldStates) && $rootScope.isEmpty($scope.invalidElementStates);
        };

        $scope.isPropertiesEmpty = function () {
          return DataUtilService.isPropertiesEmpty($scope.form);
        };

        // Add newly configured field to the element object
        $scope.addField = function ( fieldType) {
          populateCreatingFieldOrElement();
          if (dontHaveCreatingFieldOrElement()) {
            var domId = DataManipulationService.createDomId();
            StagingService.addFieldToForm($scope.form, fieldType, false, domId, function (el) {
              // now we are sure that the element was successfully added
              UIUtilService.scrollToDomId(domId);
              $scope.toggleMore();
              UIUtilService.setDirty(true);

            });
          }
        };

        $scope.moreIsOpen = false;
        $scope.toggleMore = function () {
          $scope.moreIsOpen = !$scope.moreIsOpen;
        };

        $scope.getTitle = function (node) {
          return DataManipulationService.getTitle(node);
        };

        $scope.addElementToTemplate = function (element) {
          populateCreatingFieldOrElement();
          if (dontHaveCreatingFieldOrElement()) {

            DataManipulationService.createDomIds(element);

            var domId = DataManipulationService.createDomId();
            StagingService.addElementToForm($scope.form, element["@id"], domId, function (e) {

              // now we are sure that the element was successfully added, scroll to it and hide its nested contents
              UIUtilService.scrollToDomId(domId);
              UIUtilService.setDirty(true);

            });
            $rootScope.$broadcast("form:update", element);
          }
        };

        $scope.addStandAloneFieldToTemplate = function (node) {
          populateCreatingFieldOrElement();
          if (dontHaveCreatingFieldOrElement()) {

            DataManipulationService.createDomIds(node);

            var domId = DataManipulationService.createDomId();
            StagingService.addStandAloneFieldToForm($scope.form, node["@id"], domId, function (e) {

              // now we are sure that the element was successfully added, scroll to it and hide its nested contents
              UIUtilService.scrollToDomId(domId);
              UIUtilService.setDirty(true);

            });
            $rootScope.$broadcast("form:update", node);
          }
        };

        // which details tab is open?
        $scope.showCardinality = false;
        $scope.isTabActive = function (item) {
          return ($scope.showCardinality && item == "cardinality");
        };
        $scope.toggleTab = function (item) {
          $scope.showCardinality = !$scope.showCardinality;
        };


        // Function to add additional options for radio, checkbox, and list fieldTypes
        $scope.addOption = DataManipulationService.addOption;

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
              'TEMPLATEEDITOR.clear.confirm',
              'GENERIC.YesClearIt'
          );
        };

        $scope.doReset = function () {
          // Loop through $scope.form.properties object and delete each field leaving default json-ld syntax in place
          angular.forEach($scope.form.properties, function (value, key) {
            if (!DataUtilService.isSpecialKey(key)) {
              delete $scope.form.properties[key];
            }
          });
          $scope.form._ui.order = [];
          // Broadcast the reset event which will trigger the emptying of formFields formFieldsOrder
          // $rootScope.$broadcast('form:reset');
          UIUtilService.setDirty(false);
        };

        $scope.saveTemplate = function () {
          populateCreatingFieldOrElement();
          if (dontHaveCreatingFieldOrElement()) {
            UIMessageService.conditionalOrConfirmedExecution(
                StagingService.isEmpty(),
                function () {
                  $scope.doSaveTemplate();
                },
                'GENERIC.AreYouSure',
                'TEMPLATEEDITOR.save.nonEmptyStagingConfirm',
                'GENERIC.YesSaveIt'
            );
          }
        };


        // Stores the template into the database
        $scope.doSaveTemplate = function () {


          var doSave = function(response) {
            UIUtilService.logValidation(response.headers("CEDAR-Validation-Status"));

            // confirm message
            var title = dms.getTitle(response.data);
            UIMessageService.flashSuccess('SERVER.TEMPLATE.create.success', {"title": title},
                'GENERIC.Created');

            // Reload page with template id
            DataManipulationService.createDomIds(response.data);
            var newId = response.data['@id'];
            $location.path(FrontendUrlService.getTemplateEdit(newId));

            UIUtilService.setDirty(false);
          };

          var doUpdate = function(response) {
            UIUtilService.logValidation(response.headers("CEDAR-Validation-Status"));

            UIMessageService.flashSuccess('SERVER.TEMPLATE.update.success',
                {"title": dms.getTitle($scope.form)}, 'GENERIC.Updated');
            owner.enableSaveButton();

            UIUtilService.setDirty(false);
          };

          this.disableSaveButton();
          var owner = this;

          // First check to make sure Template Name, Template Description are not blank
          $scope.templateErrorMessages = [];
          $scope.templateSuccessMessages = [];


          // If Template Name is blank, produce error message
          var title = dms.getTitle($scope.form);
          if (!title.length) {
            $scope.templateErrorMessages.push($translate.instant("VALIDATION.templateNameEmpty"));
            owner.enableSaveButton();
          }


          // If there are no Template level error messages
          if ($scope.templateErrorMessages.length == 0) {
            // If maxItems is N, then remove maxItems
            DataManipulationService.removeUnnecessaryMaxItems($scope.form.properties);
            DataManipulationService.defaultSchemaTitleAndDescription($scope.form);

            // Saving the template for the first time
            if ($routeParams.id == undefined) {

              DataManipulationService.stripTmps($scope.form);
              DataManipulationService.updateKeys($scope.form);

              AuthorizedBackendService.doCall(
                  TemplateService.saveTemplate(QueryParamUtilsService.getFolderId(), $scope.form),
                  function (response) {
                    doSave(response);
                  },
                  function (err) {
                    if (err.data.errorKey == "noWriteAccessToFolder") {
                      AuthorizedBackendService.doCall(
                          TemplateService.saveTemplate(CedarUser.getHomeFolderId(), $scope.form),
                          function (response) {
                            doSave(response);
                            // tell user where you put it
                            UIMessageService.flashWarning('SERVER.INSTANCE.create.homeFolder');
                          },
                          function (err) {
                            UIMessageService.showBackendError('SERVER.TEMPLATE.create.error', err);
                            owner.enableSaveButton();
                          });
                    } else {
                      UIMessageService.showBackendError('SERVER.TEMPLATE.create.error', err);
                      owner.enableSaveButton();
                    }
                  }
              );
            }
            // Updating an existing template
            else {
              var id = $scope.form['@id'];
              DataManipulationService.updateKeys($scope.form);
              $rootScope.jsonToSave = $scope.form;
              var copiedForm = jQuery.extend(true, {}, $scope.form);
              if (copiedForm) {
                // strip the temps from the copied form only, and save the copy
                DataManipulationService.stripTmps(copiedForm);
                AuthorizedBackendService.doCall(
                    TemplateService.updateTemplate(id, copiedForm),
                    function (response) {
                      doUpdate(response);
                    },
                    function (err) {
                        UIMessageService.showBackendError('SERVER.TEMPLATE.update.error', err);
                        owner.enableSaveButton();
                    }
                );
              }
            }
          }
        };

        // close all the first order elements
        var closeAllElements = function () {
          angular.forEach($scope.form._ui.order, function (key, index) {
            var node = $scope.form.properties[key];
            var schema = DataManipulationService.schemaOf(node);
            if (DataUtilService.isElement(schema)) {
              UIUtilService.toggleElement(DataManipulationService.getDomId(node));
            }
          });
        };

        $scope.invalidFieldStates = {};
        $scope.invalidElementStates = {};

        $scope.$on('invalidFieldState', function (event, args) {
          if (args[0] == 'add') {
            $scope.invalidFieldStates[args[2]] = args[1];
          }
          if (args[0] == 'remove') {
            delete $scope.invalidFieldStates[args[2]];
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

        $scope.$watch('form["schema:identifier"]', function (identifier) {
          if (!angular.isUndefined($scope.form) && !identifier) {
            dms.removeIdentifier($scope.form);
          }
        });

        // watch for changes in the title field and generate the schema title and description fields
        $scope.$watch('form["schema:name"]', function (v) {
          if (!angular.isUndefined($scope.form)) {
            var title = dms.getTitle($scope.form);
            if (title && title.length > 0) {
              var capitalizedTitle = $filter('capitalizeFirst')(title);
              $scope.form.title = $translate.instant("GENERATEDVALUE.templateTitle", {title: capitalizedTitle});
              $scope.form.description = $translate.instant("GENERATEDVALUE.templateDescription",
                  {title: capitalizedTitle, version: window.cedarVersion});
            } else {
              dms.setTitle($scope.form, "");
              dms.setDescription($scope.form, "");
            }
            $rootScope.documentTitle = title;
          }
        });

        // watch for changes in the form and defaults the title and description fields
        $scope.$watch('form', function (v) {
          if (dms.schemaOf($scope.form)) {
            if (!dms.getTitle($scope.form)) {
              dms.setTitle($scope.form, $translate.instant("VALIDATION.noNameField"));
            }
            if (!dms.getDescription($scope.form)) {
              dms.setDescription($scope.form, $translate.instant("VALIDATION.noDescriptionField"));
            }
          }
          $scope.toRDF();
        });

        // create a copy of the form with the _tmp fields stripped out
        $scope.stripTmpFields = function () {
          var copiedForm = jQuery.extend(true, {}, $rootScope.jsonToSave);
          if (copiedForm) {
            DataManipulationService.stripTmps(copiedForm);
            DataManipulationService.updateKeys(copiedForm);
          }
          return copiedForm;
        };


        $scope.toRDF = function () {
          var jsonld = require('jsonld');
          var copiedForm = jQuery.extend(true, {}, $rootScope.jsonToSave);
          if (copiedForm) {
            jsonld.toRDF(copiedForm, {format: 'application/nquads'}, function (err, nquads) {
              $rootScope.jsonToRDF = nquads;
              return nquads;
            });
          }
        };

        // cancel the form and go back to the current folder
        $scope.cancelTemplate = function () {
          $location.url(FrontendUrlService.getFolderContents(QueryParamUtilsService.getFolderId()));
        };


        $scope.elementSearch = function () {
          jQuery("body").trigger("click");
          jQuery("#" + $scope.searchBrowseModalId).modal("show");
        };

        $scope.addElementFromPicker = function () {
          if ($scope.pickerResource) {
            $scope.addElementToTemplate($scope.pickerResource);
          }
          $scope.hideSearchBrowsePicker();
        };

        // $scope.pickElementFromPicker = function (resource) {
        //   $scope.addElementToTemplate(resource);
        //   $scope.hideSearchBrowsePicker();
        // };

        $scope.pickElementFromPicker = function (resource) {
          if (resource.nodeType == 'element') {
            $scope.addElementToTemplate(resource);
          } else if (resource.nodeType == 'field') {
            $scope.addStandAloneFieldToTemplate(resource);
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
          $scope.$broadcast('finderModalVisible');
        };

        $scope.hideFinder = function () {
          jQuery("#finder-modal").modal('hide');
        };

        $scope.enableSaveButton = function () {
          $timeout(function () {
            $scope.saveButtonDisabled = false;
          }, 1000);
        };

        $scope.disableSaveButton = function () {
          $scope.saveButtonDisabled = true;
        };

        $scope.showModal = function (type, searchScope) {
          var options = {"filterSelection":type, "searchScope": searchScope, "modalId":"controlled-term-modal", "model": $scope.form, "id":dms.getId($scope.form), "q": $scope.getTitle($scope.form),'source': null,'termType': null, 'term': null, "advanced": false, "permission": ["read","write"]};
          UIUtilService.showModal(options);
        };

        //TODO this event resets modal state and closes modal
        $scope.$on("field:controlledTermAdded", function (event,args) {
          if (dms.getId($scope.form) == args[1]) {
            UIUtilService.hideModal();
            UIUtilService.setDirty(true);
            // $scope.setAddedFieldMap();
          }

        });






      }

    }
);
