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

  it("should show the ", function () {
    workspacePage.onWorkspace();
  });

  describe('right sidebar', function () {

    describe('info and permissions', function () {
      var template;

      it("should create sample template", function () {
        workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
        template = workspacePage.createTemplate('Sidebar');
        resources.push(createResource(template, 'template', testConfig.testUser1, testConfig.testPassword1));
      });

      it('should check the info', function () {
        workspacePage.openInfoPanel();
        workspacePage.selectResource(template, 'template');
        workspacePage.isInfoPanelTitle(template);
        workspacePage.isInfoPanelPath('/Users/' + testConfig.testUserName1);
        expect(workspacePage.getOwner()).toBe(testConfig.testUserName1);
        expect(workspacePage.getPermission('owner').count()).toBe(1);
        expect(workspacePage.getPermission('write').count()).toBe(1);
        expect(workspacePage.getPermission('read').count()).toBe(1);
        workspacePage.clearSearch();
      });

      it('should transfer ownership to another ', function () {
        workspacePage.shareResource(template, 'template');
        shareModal.shareWithUser(testConfig.testUserName2, 'owner');
        workspacePage.clearSearch();
        workspacePage.selectResource(template, 'template');
        workspacePage.isInfoPanelTitle(template);
        workspacePage.isInfoPanelPath('/Users/' + testConfig.testUserName1);
        expect(workspacePage.getOwner()).toBe(testConfig.testUserName2);
        expect(workspacePage.getPermission('owner').count()).toBe(0);
        expect(workspacePage.getPermission('write').count()).toBe(1);
        expect(workspacePage.getPermission('read').count()).toBe(1);
        workspacePage.clearSearch();
      });

      it('should set read permission only for current user', function () {
        workspacePage.shareResource(template, 'template');
        shareModal.shareWithUser(testConfig.testUserName1, 'read');
        workspacePage.isInfoPanelTitle(template);
        workspacePage.isInfoPanelPath('/Users/' + testConfig.testUserName1);
        expect(workspacePage.getOwner()).toBe(testConfig.testUserName2);
        expect(workspacePage.getPermission('owner').count()).toBe(0);
        expect(workspacePage.getPermission('read').count()).toBe(1);
        // TODO fails expect(workspacePage.getPermission('write').count()).toBe(0);
        workspacePage.clearSearch();
      });
    });

    describe('should share with everybody as readable ', function () {
      var template;

      it("should create sample template", function () {
        workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
        template = workspacePage.createTemplate('Sidebar');
        resources.push(createResource(template, 'template', testConfig.testUser1, testConfig.testPassword1));
      });

      it("should share with everybody as readable", function () {
        workspacePage.shareResource(template, 'template');
        shareModal.shareWithGroup(testConfig.everybodyGroup, 'read');
      });

      it("should check readable", function () {
        workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
        workspacePage.selectResource(template, 'template');
        workspacePage.isInfoPanelTitle(template);
        workspacePage.isInfoPanelPath('/Users/' + testConfig.testUserName1);
        expect(workspacePage.getOwner()).toBe(testConfig.testUserName1);
        expect(workspacePage.getPermission('owner').count()).toBe(0);
        expect(workspacePage.getPermission('write').count()).toBe(0);
        expect(workspacePage.getPermission('read').count()).toBe(1);
        workspacePage.clearSearch();
      });
    });

    describe('should share with everybody as writable ', function () {
      var template;

      it("should create sample template", function () {
        workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
        template = workspacePage.createTemplate('Sidebar');
        resources.push(createResource(template, 'template', testConfig.testUser1, testConfig.testPassword1));
      });

      it("should share with everybody as writable", function () {
        workspacePage.shareResource(template, 'template');
        shareModal.shareWithGroup(testConfig.everybodyGroup, 'write');
      });

      it("should check writable", function () {
        workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
        workspacePage.selectResource(template, 'template');
        workspacePage.isInfoPanelTitle(template);
        workspacePage.isInfoPanelPath('/Users/' + testConfig.testUserName1);
        expect(workspacePage.getOwner()).toBe(testConfig.testUserName1);
        expect(workspacePage.getPermission('owner').count()).toBe(0);
        expect(workspacePage.getPermission('write').count()).toBe(1);
        expect(workspacePage.getPermission('read').count()).toBe(1);
        workspacePage.clearSearch();
      });
    });

  });

  describe('remove created resources', function () {

    it('should delete resource from the user workspace', function () {
      workspacePage.deleteResources(resources);
    });

  });
});