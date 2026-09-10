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

    // The page under either renderer. The backend answers each request by its `kind`, which the
    // service stubs below put on the requests they build. Without `options.useCee` this is the
    // classic form path, where no embeddable editor exists and the form directive fills
    // $scope.instance.
    function controllerFor(routeParams, backend, options) {
      var settings = options || {};
      var scope = $rootScope.$new();
      var fakeWindow = {
        history: {replaceState: jasmine.createSpy('replaceState')},
        location: {assign: jasmine.createSpy('assign')}
      };
      var messages = {
        flashSuccess: jasmine.createSpy('flashSuccess'),
        flashAfterReload: jasmine.createSpy('flashAfterReload'),
        showBackendError: angular.noop
      };
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
        $window: fakeWindow,
        HeaderService: {configure: angular.noop, dataContainer: {}},
        TemplateService: {getTemplate: function () { return {kind: 'template'}; }},
        resourceService: {
          getResourceDetailFromId: function (id, type, success) { success({}); },
          canEdit: function () { return true; }
        },
        TemplateInstanceService: templateInstanceService,
        UIMessageService: messages,
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
          useMetadataEditorV2: function () { return settings.useCee === true; },
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
        CeeDirtyTrackerService: {
          reset: angular.noop,
          markClean: angular.noop,
          hasBaseline: function () { return true; },
          isDirty: function () { return true; }
        }
      });
      return {
        vm: vm,
        scope: scope,
        instances: templateInstanceService,
        uiUtil: uiUtilService,
        window: fakeWindow,
        messages: messages
      };
    }

    // The embeddable editor as the page finds it: an element in the document carrying the metadata.
    // `currentMetadata` is a getter that answers with a fresh copy, because the real one serializes
    // the form on every read — so nothing the page writes onto a copy is there the next time, which
    // is the whole reason the identifier has to be kept by the controller.
    function withEditor(metadata) {
      var element = document.createElement('cedar-embeddable-editor');
      Object.defineProperty(element, 'currentMetadata', {
        get: function () { return angular.copy(metadata); }
      });
      document.body.appendChild(element);
      return element;
    }

    afterEach(function () {
      var element = document.querySelector('cedar-embeddable-editor');
      if (element) {
        element.parentNode.removeChild(element);
      }
    });

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

    function creatingWithEditor() {
      withEditor({'schema:name': 'Example'});
      return controllerFor({templateId: 'template-1'}, function (request, success) {
        if (request.kind === 'template') {
          success({data: template});
        } else if (request.kind === 'save') {
          success({
            data: {'@id': 'instance-9', $$cedarEtag: '"1"'},
            headers: function () { return null; }
          });
        } else if (request.kind === 'update') {
          success({data: request.instance, headers: function () { return null; }});
        }
      }, {useCee: true});
    }

    it('keeps the embeddable editor on the page when the first save stores the metadata', function () {
      var page = creatingWithEditor();

      page.scope.saveInstance();

      expect(page.window.location.assign).not.toHaveBeenCalled();
      // The address a reload or a bookmark would use, so it lands on the saved metadata rather
      // than on a create form for metadata that now exists.
      expect(page.window.history.replaceState).toHaveBeenCalledWith(null, '', '/instances/edit/1');
      // Nothing discards this document, so the confirmation belongs on it.
      expect(page.messages.flashSuccess).toHaveBeenCalledWith(
          'SERVER.INSTANCE.create.success', null, 'GENERIC.Created');
      expect(page.messages.flashAfterReload).not.toHaveBeenCalled();
    });

    it('updates what it created on the next save, under the identifier the server assigned', function () {
      var page = creatingWithEditor();

      page.scope.saveInstance();
      page.scope.saveInstance();

      expect(document.querySelector('cedar-embeddable-editor').currentMetadata['@id']).toBeUndefined();
      expect(page.instances.saveTemplateInstance.calls.count()).toBe(1);
      expect(page.instances.updateTemplateInstance).toHaveBeenCalledWith(
          'instance-9', jasmine.objectContaining({'@id': 'instance-9', $$cedarEtag: '"1"'}));
    });

    it('loads the edit address when the browser refuses to rewrite it', function () {
      var page = creatingWithEditor();
      page.window.history.replaceState.and.throwError('cross-origin');

      page.scope.saveInstance();
      $timeout.flush();

      expect(page.window.location.assign).toHaveBeenCalledWith('/instances/edit/1');
    });

    it('confirms a classic-form save on the page its route change lands on', function () {
      var page = creating();

      page.scope.saveInstance();

      // A route change keeps the document, and `<toasty>` is a sibling of the routed view, so a
      // toast raised here survives it. Storing the confirmation instead left it waiting for a full
      // page load this path never performs, and it appeared on whichever page loaded next.
      expect(page.messages.flashSuccess).toHaveBeenCalledWith(
          'SERVER.INSTANCE.create.success', null, 'GENERIC.Created');
      expect(page.messages.flashAfterReload).not.toHaveBeenCalled();
    });

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

    it('names the metadata in the bar above as the field is typed, not only once saved', function () {
      var page = creating();

      page.vm.instanceName = 'Asthma cohort, run 7';
      page.vm.instanceNameChanged();

      expect($rootScope.documentTitle).toBe('Asthma cohort, run 7');
    });

    it('shows the name an empty field would save rather than an empty bar', function () {
      var page = creating();

      page.vm.instanceName = '   ';
      page.vm.instanceNameChanged();

      expect($rootScope.documentTitle).toBe('Template metadata');
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
