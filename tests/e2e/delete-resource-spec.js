'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var testConfig = require('../config/test-env.js');
var ShareModal = require('../modals/share-modal.js');
var _ = require('../libs/lodash.min.js');

describe('delete-resource', function () {
  var EC = protractor.ExpectedConditions;
  var workspacePage = WorkspacePage;
  var toastyModal = ToastyModal;
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

  beforeEach(function () {
  });

  afterEach(function () {
  });

  // reset user selections to defaults
  it('should be on the workspace', function () {
    console.log('should be on the workspace');
    workspacePage.onWorkspace();
  });

  describe('sharing and deleting', function () {

    it("should delete a resource with more options", function () {
      console.log('delete-resource should delete a resource with more options');

      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      var folder = workspacePage.createFolder('Writable');

      workspacePage.deleteResource(folder, 'folder');
    });

    it("should delete a resource  with right click", function () {
      console.log('delete-resource should delete a resource with right click');

      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      var folder = workspacePage.createFolder('Writable');

      workspacePage.deleteResourceViaRightClick(folder, 'folder');
      toastyModal.isSuccess();
    });

    it("should share and delete a resource writable but not owned", function () {
      console.log('delete-resource should share and delete a resource writable but not owned');

      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      var folder = workspacePage.createFolder('Writable');

      shareModal.shareResource(folder, 'folder', testConfig.testUserName1, true, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      workspacePage.navigateToUserFolder(testConfig.testUserName2);

      shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, true, false);
      workspacePage.clearSearch();

      workspacePage.deleteResource(folder, 'folder');
    });

    it("should share and delete a writable but not owned resource via group", function () {
      console.log('delete-resource should share and delete a writable but not owned resource via group');

      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      var folder = workspacePage.createFolder('Writable');
      resources.push(createResource(folder, 'folder', testConfig.testUser2, testConfig.testPassword2));

      shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, true, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      workspacePage.navigateToUserFolder(testConfig.testUserName2);

      shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, false, false);
      workspacePage.clearSearch();

      workspacePage.deleteResource(folder, 'folder');
    });

    it("should fail to share and delete a readable but not owned resource", function () {
      console.log('delete-resource should fail to share and delete a readable but not owned resource');

      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      var folder = workspacePage.createFolder('Readable');
      resources.push(createResource(folder, 'folder', testConfig.testUser1, testConfig.testPassword1));

      shareModal.shareResource(folder, 'folder', testConfig.testUserName2, false, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      workspacePage.navigateToUserFolder(testConfig.testUserName1);

      shareModal.shareDisabledViaRightClick(folder, 'folder');
      workspacePage.clearSearch();

      shareModal.deleteDisabledViaRightClick(folder, 'folder');
      workspacePage.clearSearch();
    });


    it("should fail to share and delete a readable but not owned resource via group", function () {
      console.log('delete-resource should fail to share and delete a readable but not owned resource via group');

      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      var folder = workspacePage.createFolder('Readable');
      resources.push(createResource(folder, 'folder', testConfig.testUser1, testConfig.testPassword1));

      shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, false, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      workspacePage.navigateToUserFolder(testConfig.testUserName1);

      shareModal.shareDisabledViaRightClick(folder, 'folder');
      workspacePage.clearSearch();

      shareModal.deleteDisabledViaRightClick(folder, 'folder');
      workspacePage.clearSearch();
    });

  });

  describe('remove created resources', function () {

    it('should delete resource from the user workspace', function () {
      console.log('delete-resource should delete ' + resources.length + ' resources from the user workspace');
      for (var i = 0; i < resources.length; i++) {
        (function (resource) {
          console.log("delete-resource should delete " + resource.title + " for user " + resource.username);
          workspacePage.login(resource.username, resource.password);
          workspacePage.deleteResourceViaRightClick(resource.title, resource.type);
          toastyModal.isSuccess();
          workspacePage.clearSearch();
        })
        (resources[i]);
      }
    });
  });

});


