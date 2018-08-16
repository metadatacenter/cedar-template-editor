'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var testConfig = require('../config/test-env.js');
var ShareModal = require('../modals/share-modal.js');

describe('workspace-sidebar', function () {
  var workspacePage = WorkspacePage;
  var shareModal = ShareModal;

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

    it('should show the template title, owner, and location', function () {
      workspacePage.openInfoPanel();
      workspacePage.selectResource(template, 'template');

      workspacePage.isInfoPanelOwner(testConfig.testUserName1);
      workspacePage.isInfoPanelTitle(template);
      workspacePage.isInfoPanelPath('/Users/' + testConfig.testUserName1);

      workspacePage.clearSearch();
    });

    it('should update owner', function () {
      workspacePage.shareResource(template, 'template');
      shareModal.shareWithUser(testConfig.testUserName2, true, true);

      workspacePage.selectResource(template, 'template');
      workspacePage.isInfoPanelOwner(testConfig.testUserName2);

      //workspacePage.hasPermissionOwner();
      //workspacePage.hasPermissionWrite(testConfig.testUserName2, true);
      //workspacePage.hasPermissionRead(testConfig.testUserName2, true);

      workspacePage.clearSearch();
    });

  });


  describe('remove created resources', function () {

    it('should delete resource from the user workspace', function () {
      workspacePage.deleteResources(resources);
    });

  });
});