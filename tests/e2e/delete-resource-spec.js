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
      shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, false, false);

      // workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      // workspacePage.navigateToUserFolder(testConfig.testUserName2);
      workspacePage.deleteResource(folder, 'folder');
    });

    xit("should be able to change permissions of a writable resource", function () {
      console.log('delete-resource should be able to change permissions of a writable resource');

      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      var folder = workspacePage.createFolder('Writable');
      resources.push(createResource(folder, 'folder', testConfig.testUser2, testConfig.testPassword2));

      shareModal.shareResource(folder, 'folder', testConfig.testUserName1, true, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      workspacePage.navigateToUserFolder(testConfig.testUserName2);
      shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, false, false);
    });

    it("should be able to change permissions of a resource shared as writable with Everybody", function () {
      console.log('delete-resource should be able to change permissions of a folder resource as writable with Everybody');

      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      var folder = workspacePage.createFolder('Writable');
      resources.push(createResource(folder, 'folder', testConfig.testUser2, testConfig.testPassword2));

      shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, true, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      workspacePage.navigateToUserFolder(testConfig.testUserName2);
      shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, false, false);

    });

    it("should delete a resource shared as writable with Everybody", function () {
      console.log('delete-resource should delete a resource shared as writable with Everybody');

      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      var folder = workspacePage.createFolder('Writable');

      shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, true, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      workspacePage.navigateToUserFolder(testConfig.testUserName2);
      workspacePage.deleteResource(folder, 'folder');
    });



    it("should fail to delete a resource shared as readable with a user", function () {
      console.log('delete-resource should fail to delete a resource shared as readable with a user');

      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      var folder = workspacePage.createFolder('Readable');
      resources.push(createResource(folder, 'folder', testConfig.testUser1, testConfig.testPassword1));

      shareModal.shareResource(folder, 'folder', testConfig.testUserName2, false, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      workspacePage.navigateToUserFolder(testConfig.testUserName1);
      shareModal.shareDisabledViaRightClick(folder, 'folder');
    });

    it("should fail to delete a resource shared as readable with Everybody with right-click", function () {
      console.log('delete-resource should fail to delete a resource shared as readable with Everybody with right-click');

      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      var folder = workspacePage.createFolder('Readable');
      resources.push(createResource(folder, 'folder', testConfig.testUser1, testConfig.testPassword1));

      shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, false, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      workspacePage.navigateToUserFolder(testConfig.testUserName1);
      shareModal.shareDisabledViaRightClick(folder, 'folder');
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


