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
    workspacePage.onWorkspace();
  });

  describe('via more-options button', function () {

    it("should fail to delete a resource shared as readable with Everybody", function () {
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      var folder = workspacePage.createFolder('Readable');

      shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, false, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      workspacePage.navigateToUserFolder(testConfig.testUserName1);
      workspacePage.selectResource(folder, 'folder');
      workspacePage.createMoreOptionsButton().click();
      expect(workspacePage.createDeleteResourceButton().getAttribute('class')).toMatch('link-disabled');

      resources.push(createResource(folder, 'folder', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should delete a resource shared as writable with Everybody", function () {
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      var folder = workspacePage.createFolder('Writable');

      shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, true, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      workspacePage.navigateToUserFolder(testConfig.testUserName2);
      workspacePage.deleteResource(folder, 'folder');
    });

    it("should fail to delete a resource shared as readable with a user", function () {
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      var folder = workspacePage.createFolder('Readable');

      shareModal.shareResource(folder, 'folder', testConfig.testUserName2, false, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      workspacePage.navigateToUserFolder(testConfig.testUserName1);
      workspacePage.selectResource(folder, 'folder');
      workspacePage.createMoreOptionsButton().click();
      expect(workspacePage.createDeleteResourceButton().getAttribute('class')).toMatch('link-disabled');

      resources.push(createResource(folder, 'folder', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should delete a resource shared as writable with a user", function () {
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      var folder = workspacePage.createFolder('Writable');

      shareModal.shareResource(folder, 'folder', testConfig.testUserName1, true, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      workspacePage.navigateToUserFolder(testConfig.testUserName2);
      workspacePage.deleteResource(folder, 'folder');
    });
  });


  describe('via right-click', function () {

    it("should fail to delete a resource shared as readable with Everybody", function () {
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      var folder = workspacePage.createFolder('Readable');

      shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, false, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      workspacePage.navigateToUserFolder(testConfig.testUserName1);
      workspacePage.rightClickResource(folder, 'folder');
      expect(workspacePage.createRightClickDeleteMenuItem().getAttribute('class')).toMatch('link-disabled');

      resources.push(createResource(folder, 'folder', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should delete a resource shared as writable with Everybody", function () {
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      var folder = workspacePage.createFolder('Writable');

      shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, true, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      workspacePage.navigateToUserFolder(testConfig.testUserName2);
      workspacePage.deleteResourceViaRightClick(folder, 'folder');

      toastyModal.isSuccess();
    });

    it("should fail to delete a resource shared as readable with a user", function () {
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      var folder = workspacePage.createFolder('Readable');

      shareModal.shareResource(folder, 'folder', testConfig.testUserName2, false, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      workspacePage.navigateToUserFolder(testConfig.testUserName1);
      workspacePage.rightClickResource(folder, 'folder');
      expect(workspacePage.createRightClickDeleteMenuItem().getAttribute('class')).toMatch('link-disabled');

      resources.push(createResource(folder, 'folder', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should delete a resource shared as writable with a user", function () {
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      var folder = workspacePage.createFolder('Writable');

      shareModal.shareResource(folder, 'folder', testConfig.testUserName1, true, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      workspacePage.navigateToUserFolder(testConfig.testUserName2);
      workspacePage.deleteResourceViaRightClick(folder, 'folder');

      toastyModal.isSuccess();
    });
  });

  describe('remove created resources', function () {

    it('should delete resource from the user workspace', function () {
      for (var i = 0; i < resources.length; i++) {
        (function (resource) {
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


