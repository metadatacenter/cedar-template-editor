'use strict';

define([
  'angular',
  'angularMocks',
  'cedar/template-editor/service/http-builder.service',
  'cedar/template-editor/service/resource.service'
], function () {

  describe('resourceService group concurrency requests:', function () {
    var service;
    var requests;
    var membershipRevision;

    beforeEach(module('cedar.templateEditor.service.httpBuilderService'));
    beforeEach(module('cedar.templateEditor.service.resourceService', function ($provide) {
      requests = [];
      membershipRevision = 8;
      $provide.value('AuthorizedBackendService', {
        doCall: function (request, success) {
          requests.push(request);
          if (request.method === 'GET' && request.url === '/group/one/users') {
            success({data: {users: [], $$cedarEtag: '"8"'}});
          } else if (request.method === 'PUT' && request.url === '/group/one/users') {
            // AuthorizedBackendService advances the request artifact from the response ETag.
            request.cedarArtifact.$$cedarEtag = '"' + (++membershipRevision) + '"';
            success({data: {}});
          } else {
            success({data: {}});
          }
        }
      });
      $provide.value('UISettingsService', {});
      $provide.value('UIUtilService', {});
      $provide.value('DataManipulationService', {});
      $provide.value('CedarUser', {});
      $provide.value('UrlService', {
        getGroup: function () { return '/group/one'; },
        getGroupMembers: function () { return '/group/one/users'; }
      });
      $provide.value('CONST', {resourceType: {}});
    }));

    beforeEach(inject(function (_resourceService_) {
      service = _resourceService_;
    }));

    it('advances the membership validator after every successful replacement', function () {
      var group = {'@id': 'one', users: [], $$cedarEtag: '"7"'};
      service.getGroupMembers(group, angular.noop, angular.noop);
      for (var revision = 9; revision <= 12; revision++) {
        service.updateGroupMembers(group, angular.noop, angular.noop);
        expect(group.$$cedarMembershipEtag).toBe('"' + revision + '"');
        expect(group.$$cedarEtag).toBe('"7"');
      }
    });

    it('keeps group details and membership validators separate', function () {
      var group = {'@id': 'one', 'schema:name': 'Group', $$cedarEtag: '"7"'};

      service.getGroupMembers(group, angular.noop, angular.noop);
      expect(group.$$cedarEtag).toBe('"7"');
      expect(group.$$cedarMembershipEtag).toBe('"8"');

      service.updateGroup(group, angular.noop, angular.noop);
      expect(requests.pop().cedarArtifact).toBe(group);
      expect(group.$$cedarMembershipEtag).toBe('"8"');

      group.$$cedarEtag = '"9"';
      service.updateGroupMembers(group, angular.noop, angular.noop);
      expect(requests.pop().cedarArtifact.$$cedarEtag).toBe('"9"');
      expect(group.$$cedarMembershipEtag).toBe('"9"');
      expect(group.$$cedarEtag).toBe('"9"');
    });
  });
});
