'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var testConfig = require('../config/test-env.js');
var ShareModal = require('../modals/share-modal.js');
var _ = require('../libs/lodash.min.js');

describe('update-name', function () {
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

  describe('in info panel', function () {

    it("should give ownership of a folder owned by current user to another user", function () {
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      var folder = workspacePage.createFolder('Owned');

      // change ownership of created folder to another user
      shareModal.shareResource(folder, 'folder', testConfig.testUserName2, false, true);
      workspacePage.clearSearch();

      // select resource and open details sidebar
      workspacePage.openInfoPanel();
      workspacePage.selectResource(folder, 'folder');

      // verify that the presented owner username is the new one assigned above
      workspacePage.createDetailsPanelOwnerValue().getText().then(function (text) {
        expect(text).toBe(testConfig.testUserName2);
      });
      workspacePage.closeInfoPanel();

      resources.push(createResource(folder, 'folder', testConfig.testUser1, testConfig.testPassword1));
    });


    it("should fail to change ownership of a folder shared as readable with current user", function () {
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      var folder = workspacePage.createFolder('Readable');

      shareModal.shareResource(folder, 'folder', testConfig.testUserName2, false, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      workspacePage.navigateToUserFolder(testConfig.testUserName1);
      shareModal.openDialogViaRightClick(folder, 'folder');
      expect(shareModal.canShare()).toBe(false);
      shareModal.clickDone();

      resources.push(createResource(folder, 'folder', testConfig.testUser1, testConfig.testPassword1));
    });


    it("should fail to change ownership of a folder shared as writable with current user", function () {
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      var folder = workspacePage.createFolder('Writable');

      shareModal.shareResource(folder, 'folder', testConfig.testUserName1, true, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      workspacePage.navigateToUserFolder(testConfig.testUserName2);
      shareModal.openDialogViaRightClick(folder, 'folder');

      shareModal.canChangeOwnership().then(function (canChange) {
        expect(canChange).toBe(false);
      });
      shareModal.clickDone();

      resources.push(createResource(folder, 'folder', testConfig.testUser2, testConfig.testPassword2));
    });


    it("should fail to change ownership of a folder shared as readable with Everybody group", function () {
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      var folder = workspacePage.createFolder('Readable');

      shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, false, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      workspacePage.navigateToUserFolder(testConfig.testUserName1);
      shareModal.openDialogViaRightClick(folder, 'folder');

      expect(shareModal.canShare()).toBe(false);
      shareModal.clickDone();

      resources.push(createResource(folder, 'folder', testConfig.testUser1, testConfig.testPassword1));
    });


    it("should fail to change ownership of a folder shared as writable with Everybody group", function () {
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      var folder = workspacePage.createFolder('Writable');

      shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, true, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      workspacePage.navigateToUserFolder(testConfig.testUserName2);
      shareModal.openDialogViaRightClick(folder, 'folder');

      shareModal.canChangeOwnership().then(function (canChange) {
        expect(canChange).toBe(false);
      });
      shareModal.clickDone();

      resources.push(createResource(folder, 'folder', testConfig.testUser2, testConfig.testPassword2));
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


