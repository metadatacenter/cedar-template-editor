'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var testConfig = require('../config/test-env.js');
var ShareModal = require('../modals/share-modal.js');

describe('workspace-sidebar', function () {
  var workspacePage = WorkspacePage;
  var shareModal = ShareModal;
  var EC = protractor.ExpectedConditions;

  var resources = [];
  var createResource = function (title, type, username, password) {
    var result = new Object;
    result.title = title;
    result.type = type;
    result.username = username;
    result.password = password;
    return result;
  };

  jasmine.getEnv().addReporter(workspacePage.myReporter());

  beforeEach(function () {
  });

  afterEach(function () {
  });

  it("should show the details sidebar", function () {
    workspacePage.onWorkspace();
  });

  describe('remove created resources', function () {
    var template;

    it("should show the details sidebar", function () {
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      template = workspacePage.createTemplate('Sidebar');
      resources.push(createResource(template, 'template', testConfig.testUser1, testConfig.testPassword1));
    });

    it('select the template', function () {
      workspacePage.openInfoPanel();
      workspacePage.selectResource(template, 'template');
    });

    it('should show the template title, owner, and location', function () {
      workspacePage.isInfoPanelTitle(template);
      workspacePage.isInfoPanelPath('/Users/' + testConfig.testUserName1);
      expect(workspacePage.getOwner()).toBe(testConfig.testUserName1);
      expect(workspacePage.getPermission('owner').count()).toBe(1);
      expect(workspacePage.getPermission('write').count()).toBe(1);
      expect(workspacePage.getPermission('read').count()).toBe(1);
      workspacePage.clearSearch();
    });

    it('should transfer ownership to user 2', function () {
      workspacePage.shareResource(template, 'template');
      shareModal.shareWithUser(testConfig.testUserName2, true, true);
    });

    it('should transfer ownership to user 2', function () {
      workspacePage.isInfoPanelTitle(template);
      workspacePage.isInfoPanelPath('/Users/' + testConfig.testUserName1);
      expect(workspacePage.getOwner()).toBe(testConfig.testUserName2);
      expect(workspacePage.getPermission('owner').count()).toBe(0);
      expect(workspacePage.getPermission('write').count()).toBe(1);
      expect(workspacePage.getPermission('read').count()).toBe(1);
      workspacePage.clearSearch();
    });
    

  });


  describe('remove created resources', function () {

    it('should delete resource from the user workspace', function () {
      workspacePage.deleteResources(resources);
    });

  });
});