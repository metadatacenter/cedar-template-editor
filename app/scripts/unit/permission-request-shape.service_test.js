'use strict';

define([
  'angular',
  'angularMocks',
  'cedar/template-editor/service/http-builder.service',
  'cedar/template-editor/service/resource.service'
], function () {

  describe('resourceService permission request shape:', function () {
    var service;
    var requests;

    beforeEach(module('cedar.templateEditor.service.httpBuilderService'));
    beforeEach(module('cedar.templateEditor.service.resourceService', function ($provide) {
      requests = [];
      $provide.value('AuthorizedBackendService', {
        doCall: function (request, success) {
          requests.push(request);
          success({data: {}});
        }
      });
      $provide.value('UISettingsService', {});
      $provide.value('UIUtilService', {});
      $provide.value('DataManipulationService', {});
      $provide.value('CedarUser', {});
      $provide.value('UrlService', {
        templatePermission: function () { return '/template/one/permissions'; },
        getGroup: function () { return '/group/one'; },
        getGroupMembers: function () { return '/group/one/users'; }
      });
      $provide.value('CONST', {resourceType: {TEMPLATE: 'template'}});
    }));

    beforeEach(inject(function (_resourceService_) {
      service = _resourceService_;
    }));

    // The server returns a wider permissions payload than it accepts: a grant comes back with the
    // user's name and email, and goes in with an identifier alone. Echoing the response back is
    // refused, so the service narrows it.
    it('sends identifiers where the server returned whole users', function () {
      var fromTheServer = {
        owner: {'@id': 'users/1', firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.org'},
        userPermissions: [
          {user: {'@id': 'users/2', firstName: 'Grace', email: 'grace@example.org',
                  resourceType: 'user', 'schema:name': 'Grace Hopper'}, role: 'viewer'}
        ],
        groupPermissions: [
          {group: {'@id': 'groups/1', 'schema:name': 'Curators'}, role: 'writer'}
        ]
      };

      service.setResourceShare(
        {'@id': 'templates/1', resourceType: 'template'}, fromTheServer, angular.noop, angular.noop);

      var sent = requests.pop();
      expect(sent.data).toEqual({
        owner: {'@id': 'users/1'},
        userPermissions: [{user: {'@id': 'users/2'}, role: 'viewer'}],
        groupPermissions: [{group: {'@id': 'groups/1'}, role: 'writer'}]
      });
      expect(sent.cedarArtifact).toBe(fromTheServer);
    });

    // A group write accepts the name and the description. The document the server returns carries
    // its identifier, provenance and source hash too, and sending those back is refused.
    it('sends a group write as the name and the description alone', function () {
      var fromTheServer = {
        '@id': 'groups/1',
        '@context': {'schema:name': 'https://schema.org/name'},
        resourceType: 'group',
        'schema:name': 'Curators',
        'schema:description': 'the people who curate',
        'pav:createdOn': '2026-01-01T00:00:00-07:00',
        sourceHash: 'abc123',
        specialGroup: null
      };

      service.updateGroup(fromTheServer, angular.noop, angular.noop);

      var sent = requests.pop();
      expect(sent.data).toEqual({
        'schema:name': 'Curators',
        'schema:description': 'the people who curate'
      });
      expect(sent.cedarArtifact).toBe(fromTheServer);
    });

    it('sends group membership as identifiers and flags', function () {
      var group = {
        '@id': 'groups/1',
        users: [
          {user: {'@id': 'users/2', firstName: 'Grace', email: 'grace@example.org'},
           administrator: true, member: true}
        ]
      };

      service.updateGroupMembers(group, angular.noop, angular.noop);

      var sent = JSON.parse(requests.pop().data);
      expect(sent.users).toEqual([{user: {'@id': 'users/2'}, administrator: true, member: true}]);
    });
  });
});
