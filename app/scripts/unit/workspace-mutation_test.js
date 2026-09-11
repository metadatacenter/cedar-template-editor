'use strict';
define(['angular', 'angularMocks', 'cedar/template-editor/search-browse/cedar-search-browse-picker.directive'], function () {
  describe('Workspace concurrent deletions:', function () {
    var vm, service, selection, settings;
    beforeEach(module('cedar.templateEditor.searchBrowse.cedarSearchBrowsePickerDirective'));
    beforeEach(module(function ($provide) {
      $provide.value('CedarUser', {getUIPreferences: function () { return {resourceTypeFilters: {}}; }, setStatus: angular.noop, getSortDirection: angular.noop, getSort: angular.noop, getVersion: angular.noop, getStatus: angular.noop});
      $provide.value('DataManipulationService', {});
      $provide.value('schemaService', {});
      $provide.value('UIUtilService', {setTotalMetadata: angular.noop, setVisibleMetadata: angular.noop, setInstances: angular.noop});
      $provide.value('UrlService', {});
      $provide.value('CategoryService', {initCategories: angular.noop});
      $provide.value('UserService', {});
    }));
    beforeEach(inject(function ($injector, $controller, $rootScope, $timeout, CedarUser) {
      selection = null;
      settings = {
        getRequestLimit: function () { return 20; }, saveStatus: angular.noop,
        resetSelected: jasmine.createSpy('resetSelected'),
        getSelected: function () { return selection; }, hasSelected: function () { return !!selection; }
      };
      service = {deleteResource: jasmine.createSpy('deleteResource'), canDelete: function () { return true; },
        getFacets: angular.noop, getResources: angular.noop, getResourceDetail: angular.noop};
      vm = $controller($injector.get('cedarSearchBrowsePickerDirective')[0].controller, {
        $location: {search: function () { return {folderId: 'folder'}; }, hash: function () { return ''; }},
        $timeout: $timeout, $scope: $rootScope.$new(), $rootScope: $rootScope, $window: {},
        $translate: {}, CedarUser: CedarUser, resourceService: service,
        UIMessageService: {confirmedExecution: function (f) { f(); }, flashSuccess: angular.noop, showBackendError: angular.noop},
        UISettingsService: settings, QueryParamUtilsService: {}, AuthorizedBackendService: {},
        FrontendUrlService: {}, UIProgressService: {}, CONST: {publication: {ALL: 'all'}, resourceType: {FOLDER: 'folder'}}, MessagingService: {}
      });
      settings.resetSelected.calls.reset();
    }));
    it('sends one delete per resource while allowing two distinct resources in flight', function () {
      var one = {'@id': 'one', resourceType: 'folder'}, two = {'@id': 'two', resourceType: 'template'};
      vm.resources = [one, two]; vm.totalCount = 2; selection = two;
      vm.deleteResource(one); vm.deleteResource(one); vm.deleteResource(two);
      expect(service.deleteResource.calls.count()).toBe(2);
      service.deleteResource.calls.argsFor(0)[1]({});
      expect(vm.resources).toEqual([two]);
      expect(vm.totalCount).toBe(1);
      expect(settings.resetSelected).not.toHaveBeenCalled();
      service.deleteResource.calls.argsFor(1)[1]({});
      expect(vm.totalCount).toBe(0);
      expect(settings.resetSelected).toHaveBeenCalled();
    });
    it('does not change the new listing when a deletion from an old listing finishes', function () {
      var one = {'@id': 'one', resourceType: 'folder'};
      vm.deleteResource(one);
      vm.resources = [{'@id': 'new'}]; vm.totalCount = 1;
      service.deleteResource.calls.mostRecent().args[1]({});
      expect(vm.totalCount).toBe(1);
      expect(vm.resources.length).toBe(1);
      expect(settings.resetSelected).not.toHaveBeenCalled();
    });
    it('allows retry after a failed delete', function () {
      var one = {'@id': 'one', resourceType: 'folder'};
      vm.deleteResource(one);
      service.deleteResource.calls.mostRecent().args[2]({status: 412});
      vm.deleteResource(one);
      expect(service.deleteResource.calls.count()).toBe(2);
    });
  });
});
