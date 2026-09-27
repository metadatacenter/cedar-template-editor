'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.templateInstance.createInstanceController', [])
      .controller('CreateInstanceController', CreateInstanceController);

  CreateInstanceController.$inject = [
    '$browser', '$rootScope', '$scope', '$routeParams', '$timeout', '$translate', '$window',
    'AuthorizedBackendService', 'CedarUser', 'CeeConfigService', 'CeeDirtyTrackerService',
    'CONST', 'FrontendUrlService', 'HeaderService', 'PreviousRouteService', 'QueryParamUtilsService',
    'resourceService', 'TemplateInstanceService', 'TemplateService', 'UIMessageService', 'UIUtilService'
  ];

  function CreateInstanceController($browser, $rootScope, $scope, $routeParams, $timeout, $translate, $window,
                                    AuthorizedBackendService, CedarUser, CeeConfigService,
                                    CeeDirtyTrackerService, CONST, FrontendUrlService, HeaderService,
                                    PreviousRouteService, QueryParamUtilsService, resourceService,
                                    TemplateInstanceService, TemplateService, UIMessageService,
                                    UIUtilService) {
    var vm = this;
    var form = null;
    // The stored artifact this page is editing: what the server returned from the load, from the
    // create, or from the last update. Null while the metadata has never been saved, which is what
    // makes the next save a create rather than an update.
    var savedInstance = null;
    var cee = null;
    var ceeConfigured = false;
    var destroyed = false;
    var pendingArtifact = null;
    // The routed view may not have linked the editor element when this controller first looks for
    // it, so wait for it across digests rather than failing the page on the first miss.
    var ceeWaitTicks = 20;

    vm.loading = true;
    vm.canEdit = true;
    vm.saveButtonDisabled = false;
    vm.validationReport = null;
    vm.validationProblems = [];
    vm.missingRequiredFieldCount = 0;
    vm.missingRequiredFieldMessage = '';

    // The metadata's own name, edited here rather than only through the Workbench's Rename. New
    // metadata starts from the name this page has always generated, the template's name followed
    // by "metadata", and keeps it unless the user types another. `savedInstanceName` is the name
    // the stored artifact carries, so a change to the field can count towards the dirty state.
    vm.instanceName = null;
    var savedInstanceName = null;

    function generatedInstanceName() {
      return form['schema:name'] + $translate.instant('GENERATEDVALUE.instanceTitle');
    }

    // The name that is saved: the field's text, or the generated one when the field is blank.
    function chosenInstanceName() {
      var typed = (vm.instanceName || '').trim();
      return typed.length > 0 ? typed : generatedInstanceName();
    }

    function instanceNameDirty() {
      return savedInstanceName !== null && chosenInstanceName() !== savedInstanceName;
    }

    // The bar above names the metadata being edited, and `doUpdate` already points it at the
    // saved name. Following the field while it is typed is that same intent a moment earlier,
    // so the bar stops naming the template while the field names the metadata. The chosen name
    // rather than the raw text, so an emptied field shows the generated name that would be
    // saved instead of showing nothing.
    vm.instanceNameChanged = function () {
      $rootScope.documentTitle = chosenInstanceName();
      if (instanceNameDirty()) {
        UIUtilService.setDirty(true);
      }
    };

    function updateValidationReport(report) {
      var requiredCount;
      var completedRequiredCount;

      vm.validationReport = report && typeof report === 'object' ? report : null;
      vm.validationProblems = vm.validationReport && angular.isArray(vm.validationReport.problems) ?
          vm.validationReport.problems : [];
      requiredCount = vm.validationReport && angular.isNumber(vm.validationReport.requiredFieldValueCount) ?
          vm.validationReport.requiredFieldValueCount : 0;
      completedRequiredCount = vm.validationReport &&
          angular.isNumber(vm.validationReport.nonNullRequiredFieldValueCount) ?
          vm.validationReport.nonNullRequiredFieldValueCount : 0;
      vm.missingRequiredFieldCount = Math.max(0, requiredCount - completedRequiredCount);
      vm.missingRequiredFieldMessage = vm.missingRequiredFieldCount === 1 ?
          '1 required field is missing.' : vm.missingRequiredFieldCount + ' required fields are missing.';
      vm.validationWarnings = vm.validationProblems.filter(function (problem) {
        return ['required', 'missingProperty', 'minItems'].indexOf(problem.code) !== -1;
      });
      vm.validationErrors = vm.validationProblems.filter(function (problem) {
        return ['required', 'missingProperty', 'minItems'].indexOf(problem.code) === -1;
      });
      if (vm.missingRequiredFieldCount > 0 && !vm.validationProblems.some(function (problem) {
        return problem.code === 'required';
      })) {
        vm.validationWarnings.push({message: vm.missingRequiredFieldMessage});
      }
      if (vm.validationReport && vm.validationReport.isValid === false &&
          !vm.validationWarnings.length && !vm.validationErrors.length) {
        vm.validationErrors.push({message: 'Review invalid metadata before saving.'});
      }
    }

    vm.showValidationReport = function () {
      return vm.validationReport !== null && vm.validationReport.isValid === false;
    };

    vm.problemPath = function (problem) {
      if (problem && angular.isArray(problem.path) && problem.path.length > 0) {
        return problem.path.join(' / ');
      }
      return problem && problem.field ? problem.field : 'Metadata';
    };

    function showLoadError(messageKey, error) {
      UIMessageService.showBackendError(messageKey, error);
      UIUtilService.setDirty(false);
      $window.location.assign(FrontendUrlService.getWorkspaceReturn(
          QueryParamUtilsService.getReturnTo(), QueryParamUtilsService.getFolderId()));
    }

    function markClean() {
      if (cee) {
        CeeDirtyTrackerService.markClean(cee.currentMetadata);
      }
      UIUtilService.setDirty(false);
    }

    // The embeddable editor takes one configuration and reports every later assignment as
    // ignored, so read-only mode has to be settled before the first one. Editing reads the write
    // Editor capability to settle it, which answers after this controller has run and can answer after
    // the artifact itself has loaded — so the artifact waits in presentArtifact until the editor
    // is configured, rather than the configuration chasing it.
    function configureEditor() {
      var config;
      var artifact;
      if (destroyed || ceeConfigured || !cee) {
        return;
      }
      config = angular.copy(CeeConfigService.getConfig());
      config.readOnlyMode = !vm.canEdit;
      cee.config = config;
      ceeConfigured = true;
      UIUtilService.setLocked(!vm.canEdit, 'TEMPLATEEDITOR.lock.noEditPermission');
      if (pendingArtifact) {
        artifact = pendingArtifact;
        pendingArtifact = null;
        presentArtifact(artifact);
      }
    }

    function presentArtifact(artifact) {
      if (!ceeConfigured) {
        pendingArtifact = artifact;
        return;
      }
      if (artifact.instanceObject) {
        cee.templateAndInstanceObject = artifact;
      } else {
        cee.templateObject = artifact.templateObject;
      }
      finishLoad();
    }

    function onCeeChange(event) {
      if (destroyed) { return; }
      var report = event && event.detail ? event.detail.dataQualityReport : null;
      updateValidationReport(report || cee.dataQualityReport);
      var dirty = CeeDirtyTrackerService.hasBaseline() ?
          CeeDirtyTrackerService.isDirty(cee.currentMetadata) : true;
      UIUtilService.setDirty(dirty || instanceNameDirty());
      $scope.$evalAsync();
    }

    $scope.$on('$destroy', function () {
      destroyed = true;
      if (cee) { cee.removeEventListener('change', onCeeChange); }
    });

    function finishLoad() {
      vm.loading = false;
      updateValidationReport(cee.dataQualityReport);
      $timeout(markClean, 0);
    }

    function loadEditCapability(id) {
      resourceService.getResourceDetailFromId(
          id,
          CONST.resourceType.INSTANCE,
          function (details) {
            vm.canEdit = resourceService.canEdit(details);
            configureEditor();
          },
          function () {
            vm.canEdit = false;
            configureEditor();
          }
      );
    }

    function loadTemplate(templateId) {
      AuthorizedBackendService.doCall(
          TemplateService.getTemplate(FrontendUrlService.decodeRouteIdentifier(templateId)),
          function (response) {
            form = response.data;
            $rootScope.documentTitle = form['schema:name'];
            vm.instanceName = generatedInstanceName();
            savedInstanceName = vm.instanceName;
            presentArtifact({templateObject: form});
          },
          function (error) {
            showLoadError('SERVER.TEMPLATE.load.error', error);
          }
      );
    }

    function loadInstance(instanceId) {
      AuthorizedBackendService.doCall(
          TemplateInstanceService.getTemplateInstance(instanceId),
          function (instanceResponse) {
            savedInstance = instanceResponse.data;
            $rootScope.documentTitle = savedInstance['schema:name'];
            vm.instanceName = savedInstance['schema:name'];
            savedInstanceName = vm.instanceName;
            loadEditCapability(savedInstance['@id']);

            AuthorizedBackendService.doCall(
                TemplateService.getTemplate(savedInstance['schema:isBasedOn']),
                function (templateResponse) {
                  form = templateResponse.data;
                  presentArtifact({
                    templateObject: form,
                    instanceObject: savedInstance
                  });
                },
                function (error) {
                  showLoadError('SERVER.TEMPLATE.load-for-instance.error', error);
                }
            );
          },
          function (error) {
            showLoadError('SERVER.INSTANCE.load.error', error);
          }
      );
    }

    function enableSave() {
      vm.saveButtonDisabled = false;
    }

    /**
     * Point the address bar at the saved metadata, without loading the page again.
     *
     * Not through `$location`: create and edit are two route definitions, and ngRoute rebuilds the
     * view and its controller whenever the URL resolves to a different one. That discarded the
     * editor, and was the reason a first save used to cost a full page load.
     *
     * Not through `history.replaceState` either. Every digest compares the browser's URL with the
     * one AngularJS last recorded (`$browser.$$checkUrlChange`), so a rewrite AngularJS did not make
     * reaches ngRoute on the next digest and rebuilds the view all the same. The rebuilt view's
     * controller then looked for the editor while the outgoing view was still leaving, found the
     * outgoing one, and configured it a second time, which the editor ignores. The incoming editor
     * was never configured and stayed empty. `$browser.url` rewrites the address and the recorded
     * URL together, so the digest finds nothing to report. `$location` keeps the create URL it
     * parsed; nothing on this page writes `$location`, and the two parameters it is read for,
     * `folderId` and `returnTo`, are the same on both addresses.
     *
     * Replacing rather than pushing, so Back returns where the user came from rather than to a
     * create form for metadata that now exists.
     *
     * False for an edit address on another origin, which the browser would refuse to show without
     * loading it; `$browser.url` records the URL before rewriting, so it is not asked to try. The
     * caller then loads that address, which is what this save did before.
     */
    function showEditAddress(editUrl) {
      var target;
      try {
        target = new URL(editUrl, $window.location.href);
      } catch (e) {
        return false;
      }
      if (target.origin !== $window.location.origin || !$window.history || !$window.history.replaceState) {
        return false;
      }
      $browser.url(target.href, true);
      return true;
    }

    /**
     * Record what the server stored, and go on editing it.
     *
     * The editor is told nothing. It already shows the metadata that was just saved, and the one
     * thing it lacks is an identifier, which `updateInstance` supplies from here. Handing it the
     * stored artifact instead would rebuild every widget to no visible effect and lose the reader's
     * place in a long form.
     */
    function saveCreated(response) {
      var editUrl = FrontendUrlService.getInstanceEdit(
          response.data['@id'], QueryParamUtilsService.getFolderId(), QueryParamUtilsService.getReturnTo());
      savedInstance = response.data;
      savedInstanceName = savedInstance['schema:name'];
      vm.instanceName = savedInstanceName;
      $rootScope.documentTitle = savedInstanceName;
      markClean();
      if (showEditAddress(editUrl)) {
        // The create address the page arrived on is gone, and the metadata it would create now
        // exists. Tell the back stack, which tracks AngularJS location changes and would otherwise
        // record that address as somewhere to return to.
        PreviousRouteService.supersedeCurrent();
        UIMessageService.flashSuccess('SERVER.INSTANCE.create.success', null, 'GENERIC.Created');
        enableSave();
      } else {
        UIMessageService.flashAfterReload('success', 'SERVER.INSTANCE.create.success', 'GENERIC.Created');
        $window.location.assign(editUrl);
      }
    }

    function createInstance(metadata) {
      metadata['schema:isBasedOn'] = FrontendUrlService.decodeRouteIdentifier($routeParams.templateId);
      metadata['schema:name'] = chosenInstanceName();
      metadata['schema:description'] = metadata['schema:description'] ||
          form['schema:description'] + $translate.instant('GENERATEDVALUE.instanceDescription');

      var folderId = QueryParamUtilsService.getFolderId() || CedarUser.getHomeFolderId();
      AuthorizedBackendService.doCall(
          TemplateInstanceService.saveTemplateInstance(folderId, metadata),
          saveCreated,
          function (error) {
            UIMessageService.showBackendError('SERVER.INSTANCE.create.error', error);
            enableSave();
          }
      );
    }

    function updateInstance(metadata) {
      // The editor's copy has no identifier until it is given one: it holds the metadata, not the
      // artifact the server stored it as. Provenance is not sent with it either, because a
      // non-verbatim PUT restores creation provenance and reconciles child identifiers from the
      // stored artifact.
      metadata['@id'] = savedInstance['@id'];
      metadata.$$cedarEtag = savedInstance.$$cedarEtag;
      metadata['schema:name'] = chosenInstanceName();
      AuthorizedBackendService.doCall(
          TemplateInstanceService.updateTemplateInstance(metadata['@id'], metadata),
          function () {
            savedInstance = metadata;
            savedInstanceName = metadata['schema:name'];
            vm.instanceName = savedInstanceName;
            $rootScope.documentTitle = savedInstanceName;
            markClean();
            UIMessageService.flashSuccess('SERVER.INSTANCE.update.success', null, 'GENERIC.Updated');
            enableSave();
          },
          function (error) {
            UIMessageService.showBackendError('SERVER.INSTANCE.update.error', error);
            enableSave();
          }
      );
    }

    vm.save = function () {
      if (vm.saveButtonDisabled || !vm.canEdit || !cee || !cee.currentMetadata) {
        return;
      }
      updateValidationReport(cee.dataQualityReport);
      if (vm.validationErrors.length) {
        return;
      }
      vm.saveButtonDisabled = true;
      var metadata = angular.copy(cee.currentMetadata);
      // Whether this page has stored the metadata yet, rather than whether the editor's copy
      // carries an identifier: after a first save it still does not, and the artifact that copy
      // belongs to is held here.
      if (savedInstance === null) {
        createInstance(metadata);
      } else {
        updateInstance(metadata);
      }
    };

    vm.cancel = function () {
      UIUtilService.setDirty(false);
      $window.location.assign(FrontendUrlService.getWorkspaceReturn(
          QueryParamUtilsService.getReturnTo(), QueryParamUtilsService.getFolderId()));
    };

    $rootScope.showSearch = false;
    $rootScope.pageTitle = 'Metadata Editor';
    HeaderService.configure(CONST.pageId.RUNTIME);
    CeeDirtyTrackerService.reset();

    /**
     * The editor in this controller's view.
     *
     * During a route change the outgoing view stays on the page while it leaves, and ngView inserts
     * the incoming view after it. The first editor on the page can therefore belong to the view
     * being removed, and configuring that one leaves this view's editor empty. The last is always
     * this view's.
     */
    function viewEditor() {
      var editors = $window.document.querySelectorAll('cedar-embeddable-editor');
      return editors.length ? editors[editors.length - 1] : null;
    }

    function startWhenEditorPresent() {
      if (destroyed) { return; }
      cee = viewEditor();
      if (!cee) {
        // A page whose editor is one digest late is still a working page. Only a wait that runs
        // out means the editor is genuinely absent.
        if (ceeWaitTicks-- > 0) {
          $timeout(startWhenEditorPresent, 0);
          return;
        }
        showLoadError('SERVER.INSTANCE.load.error', new Error('CEDAR Embeddable Editor did not initialize'));
        return;
      }
      cee.addEventListener('change', onCeeChange);

      if ($routeParams.templateId !== undefined) {
        // Creating an instance reads no resource details, so nothing is left to settle.
        configureEditor();
        loadTemplate($routeParams.templateId);
      } else if ($routeParams.id !== undefined) {
        loadInstance(FrontendUrlService.decodeRouteIdentifier($routeParams.id));
      }
    }

    $timeout(startWhenEditorPresent, 0);
  }
});
