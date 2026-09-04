'use strict';

define([
  'angular',
  'angularMocks',
  'cedar/template-editor/template-instance/create-instance.controller'
], function () {

  describe('CreateInstanceController metadata name:', function () {
    var $controller;
    var $rootScope;
    var $timeout;

    beforeEach(module('cedar.templateEditor.templateInstance.createInstanceController'));

    beforeEach(inject(function (_$controller_, _$rootScope_, _$timeout_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      $timeout = _$timeout_;
    }));

    // The classic form path: no embeddable editor, the form directive fills $scope.instance. The
    // backend answers each request by its `kind`, which the service stubs below put on the requests
    // they build.
    function controllerFor(routeParams, backend) {
      var scope = $rootScope.$new();
      var templateInstanceService = {
        getTemplateInstance: function () { return {kind: 'instance'}; },
        saveTemplateInstance: jasmine.createSpy('saveTemplateInstance').and.callFake(
            function (folderId, instance) {
              return {kind: 'save', folderId: folderId, instance: instance};
            }),
        updateTemplateInstance: jasmine.createSpy('updateTemplateInstance').and.callFake(
            function (id, instance) {
              return {kind: 'update', id: id, instance: instance};
            })
      };
      var uiUtilService = {
        setDirty: jasmine.createSpy('setDirty'),
        setLocked: angular.noop,
        setStatus: angular.noop,
        setVersion: angular.noop
      };
      var vm = $controller('CreateInstanceController', {
        $translate: {
          instant: function (key) { return key === 'GENERATEDVALUE.instanceTitle' ? ' metadata' : ''; }
        },
        $rootScope: $rootScope,
        $scope: scope,
        $routeParams: routeParams,
        $location: {url: jasmine.createSpy('url')},
        HeaderService: {configure: angular.noop, dataContainer: {}},
        TemplateService: {getTemplate: function () { return {kind: 'template'}; }},
        resourceService: {
          getResourceDetailFromId: function (id, type, success) { success({}); },
          canWrite: function () { return true; }
        },
        TemplateInstanceService: templateInstanceService,
        UIMessageService: {
          flashSuccess: angular.noop,
          flashAfterReload: angular.noop,
          showBackendError: angular.noop
        },
        AuthorizedBackendService: {doCall: backend},
        CONST: {
          pageId: {RUNTIME: 'runtime'},
          resourceType: {INSTANCE: 'instance'},
          publication: {STATUS: 'bibo:status', VERSION: 'pav:version'},
          eventId: {form: {VALIDATION: 'validation'}}
        },
        $timeout: $timeout,
        QueryParamUtilsService: {
          getFolderId: function () { return 'folder'; },
          getReturnTo: function () { return null; }
        },
        FrontendUrlService: {getInstanceEdit: function () { return '/instances/edit/1'; }},
        ValidationService: {checkValidation: angular.noop, logValidation: angular.noop},
        ValueRecommenderService: {init: angular.noop},
        UIUtilService: uiUtilService,
        DataManipulationService: {},
        CedarUser: {
          useMetadataEditorV2: function () { return false; },
          getHomeFolderId: function () { return 'home'; }
        },
        UrlService: {fixSingleSlashHttps: function (value) { return value; }},
        CedarModelTypescriptLibrary: {
          CedarJsonReaders: {
            getStrict: function () { return {getTemplateInstanceReader: function () { return {}; }}; }
          },
          CedarYamlWriters: {
            getStrict: function () { return {getTemplateInstanceWriter: function () { return {}; }}; }
          }
        },
        CeeConfigService: {getConfig: function () { return {}; }},
        CeeDirtyTrackerService: {reset: angular.noop, markClean: angular.noop}
      });
      return {vm: vm, scope: scope, instances: templateInstanceService, uiUtil: uiUtilService};
    }

    var template = {'schema:name': 'Template', 'schema:description': 'About it'};

    function creating() {
      return controllerFor({templateId: 'template-1'}, function (request, success) {
        if (request.kind === 'template') {
          success({data: template});
        } else if (request.kind === 'save') {
          success({data: {'@id': 'instance-1'}, headers: function () { return null; }});
        }
      });
    }

    function editing() {
      return controllerFor({id: 'instance-1'}, function (request, success) {
        if (request.kind === 'instance') {
          success({data: {'@id': 'instance-1', 'schema:isBasedOn': 'template-1', 'schema:name': 'Saved instance'}});
        } else if (request.kind === 'template') {
          success({data: template});
        } else if (request.kind === 'update') {
          success({data: request.instance, headers: function () { return null; }});
        }
      });
    }

    it('starts new metadata from the generated name and saves it under the typed one', function () {
      var page = creating();
      expect(page.vm.instanceName).toBe('Template metadata');

      page.vm.instanceName = 'Asthma cohort, run 7';
      page.scope.saveInstance();

      expect(page.instances.saveTemplateInstance).toHaveBeenCalledWith(
          'folder', jasmine.objectContaining({'schema:name': 'Asthma cohort, run 7'}));
    });

    it('falls back to the generated name when the field is blank', function () {
      var page = creating();

      page.vm.instanceName = '   ';
      page.scope.saveInstance();

      expect(page.instances.saveTemplateInstance).toHaveBeenCalledWith(
          'folder', jasmine.objectContaining({'schema:name': 'Template metadata'}));
    });

    it('counts a changed name as unsaved work, and an unchanged one as none', function () {
      var page = creating();
      page.uiUtil.setDirty.calls.reset();

      page.vm.instanceName = 'Template metadata';
      page.vm.instanceNameChanged();
      expect(page.uiUtil.setDirty).not.toHaveBeenCalled();

      page.vm.instanceName = 'Something else';
      page.vm.instanceNameChanged();
      expect(page.uiUtil.setDirty).toHaveBeenCalledWith(true);
    });

    it('loads the saved name for editing and updates under the edited one', function () {
      var page = editing();
      expect(page.vm.instanceName).toBe('Saved instance');

      page.vm.instanceName = 'Renamed instance';
      page.scope.saveInstance();

      expect(page.instances.updateTemplateInstance).toHaveBeenCalledWith(
          'instance-1', jasmine.objectContaining({'schema:name': 'Renamed instance'}));
      expect($rootScope.documentTitle).toBe('Renamed instance');
    });
  });
});
