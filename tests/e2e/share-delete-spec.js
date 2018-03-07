'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var testConfig = require('../config/test-env.js');
var MoveModal = require('../modals/move-modal.js');
var ShareModal = require('../modals/share-modal.js');
var CopyModal = require('../modals/copy-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');
var _ = require('../libs/lodash.min.js');

describe('share-delete', function () {
  var EC = protractor.ExpectedConditions;
  var workspacePage = WorkspacePage;
  var toastyModal = ToastyModal;
  var moveModal = MoveModal;
  var shareModal = ShareModal;
  var copyModal = CopyModal;
  var sweetAlertModal = SweetAlertModal;
  var target1Folder;
  var target2Folder;
  var target1Writable;


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

  // reset user selections to defaults
  it('should be on the workspace', function () {
    workspacePage.onWorkspace();
  });

  describe('share and delete', function () {

    it("should delete a resource with more options", function () {
      // create a resource for user 2
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      var folder = workspacePage.createFolder('Writable');

      // delete it
      workspacePage.deleteResource(folder, 'folder');
    });

    it("should delete a resource  with right click", function () {
      // create a resource for user 2
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      var folder = workspacePage.createFolder('Writable');

      // delete it
      workspacePage.deleteResourceViaRightClick(folder, 'folder');
      toastyModal.isSuccess();
    });

    it("should share and delete a writable resource via user", function () {
      // create a resource for user 2
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      var folder = workspacePage.createFolder('Writable');

      // give user 1 write access
      shareModal.shareResource(folder, 'folder', testConfig.testUserName1, true, false);
      workspacePage.clearSearch();

      // can user 1 share and delete?
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      workspacePage.navigateToUserFolder(testConfig.testUserName2);
      shareModal.shareAndDeleteEnabled(folder, 'folder');
      workspacePage.clearSearch();

      // user 1 updates sharing and deletes
      shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, true, false);
      workspacePage.clearSearch();
      workspacePage.deleteResource(folder, 'folder');
    });

    it("should share and delete a writable resource via group", function () {
      // create a resource for user 2
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      var folder = workspacePage.createFolder('Writable');

      // give everybody write access
      shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, true, false);
      workspacePage.clearSearch();

      // can user 1 share and delete?
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      workspacePage.navigateToUserFolder(testConfig.testUserName2);
      shareModal.shareAndDeleteEnabled(folder, 'folder');
      workspacePage.clearSearch();

      // user 1 updates sharing and deletes
      workspacePage.navigateToUserFolder(testConfig.testUserName2);
      shareModal.shareResource(folder, 'folder', testConfig.testUserName2, true, false);
      workspacePage.clearSearch();
      workspacePage.deleteResource(folder, 'folder');
    });

    it("should fail to move, share, and delete a readable resource", function () {
      // create a resource for user 1
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      var folder = workspacePage.createFolder('Readable');
      resources.push(createResource(folder, 'folder', testConfig.testUser1, testConfig.testPassword1));

      // give read access to user 2
      shareModal.shareResource(folder, 'folder', testConfig.testUserName2, false, false);
      workspacePage.clearSearch();

      // user 2 should not be able to share or delete
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      workspacePage.navigateToUserFolder(testConfig.testUserName1);
      shareModal.moveShareDeleteDisabled(folder, 'folder');
    });

    it("should fail to moe, share, and delete a readable resource via group", function () {
      // create a resource for user 1
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      var folder = workspacePage.createFolder('Readable');
      resources.push(createResource(folder, 'folder', testConfig.testUser1, testConfig.testPassword1));

      // give read access to everybody
      shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, false, false);
      workspacePage.clearSearch();

      // user 2 should not be able to share or delete
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      workspacePage.navigateToUserFolder(testConfig.testUserName1);
      shareModal.moveShareDeleteDisabled(folder, 'folder');
    });

  });

  describe('remove created resources', function () {

    it('should delete resource from the user workspace', function () {
      workspacePage.deleteResources(resources);
      // for (var i = 0; i < resources.length; i++) {
      //   (function (resource) {
      //     console.log("copy and move, share and delete should delete " + resource.title + " for user " + resource.username);
      //     workspacePage.login(resource.username, resource.password);
      //     workspacePage.deleteResourceViaRightClick(resource.title, resource.type);
      //     toastyModal.isSuccess();
      //     workspacePage.clearSearch();
      //   })
      //   (resources[i]);
      // }
    });
  });

});


