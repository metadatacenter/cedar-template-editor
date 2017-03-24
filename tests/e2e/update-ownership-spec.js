'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var ShareModal = require('../modals/share-modal.js');
var testConfig = require('../config/test-env.js');

describe('update-ownership', function () {
  var workspacePage = WorkspacePage;
  var toastyModal = ToastyModal;
  var shareModal = ShareModal;

  var resources = [];

  beforeEach(function () {
  });

  afterEach(function () {
  });


  it("should give ownership of a folder owned by current user to another user", function () {
    workspacePage.loginIfNecessary(testConfig.testUserName1, testConfig.testUser1, testConfig.testPassword1);

    var folder = workspacePage.createFolder('Owned');
    resources.push(folder);

    // change ownership of created folder to another user
    shareModal.shareResource(folder, 'folder', testConfig.testUserName2, false, true);
    workspacePage.clickLogo();

    // select resource and open details sidebar
    workspacePage.openInfoPanel();
    workspacePage.selectResource(folder, 'folder');

    // verify that the presented owner username is the new one assigned above
    workspacePage.createDetailsPanelOwnerValue().getText().then(function(text) {
      expect(text).toBe(testConfig.testUserName2);
    });
    workspacePage.closeInfoPanel();
  });


  it("should fail to change ownership of a folder shared as readable with current user", function () {
    workspacePage.loginIfNecessary(testConfig.testUserName1, testConfig.testUser1, testConfig.testPassword1);

    var folder = workspacePage.createFolder('Readable');
    resources.push(folder);
    shareModal.shareResource(folder, 'folder', testConfig.testUserName2, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    workspacePage.navigateToUserFolder(testConfig.testUserName1);
    shareModal.openDialogViaRightClick(folder, 'folder');

    expect(shareModal.canShare()).toBe(false);
    shareModal.clickDone();
  });


  it("should fail to change ownership of a folder shared as writable with current user", function () {
    workspacePage.loginIfNecessary(testConfig.testUserName2, testConfig.testUser2, testConfig.testPassword2);

    var folder = workspacePage.createFolder('Writable');
    resources.push(folder);
    shareModal.shareResource(folder, 'folder', testConfig.testUserName1, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    workspacePage.navigateToUserFolder(testConfig.testUserName2);
    shareModal.openDialogViaRightClick(folder, 'folder');

    shareModal.canChangeOwnership().then(function(canChange) {
      expect(canChange).toBe(false);
    });
    shareModal.clickDone();
  });


  it("should fail to change ownership of a folder shared as readable with Everybody group", function () {
    workspacePage.loginIfNecessary(testConfig.testUserName1, testConfig.testUser1, testConfig.testPassword1);

    var folder = workspacePage.createFolder('Readable');
    resources.push(folder);
    shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    workspacePage.navigateToUserFolder(testConfig.testUserName1);
    shareModal.openDialogViaRightClick(folder, 'folder');

    expect(shareModal.canShare()).toBe(false);
    shareModal.clickDone();
  });


  it("should fail to change ownership of a folder shared as writable with Everybody group", function () {
    workspacePage.loginIfNecessary(testConfig.testUserName2, testConfig.testUser2, testConfig.testPassword2);

    var folder = workspacePage.createFolder('Writable');
    resources.push(folder);
    shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    workspacePage.navigateToUserFolder(testConfig.testUserName2);
    shareModal.openDialogViaRightClick(folder, 'folder');

    shareModal.canChangeOwnership().then(function(canChange) {
      expect(canChange).toBe(false);
    });
    shareModal.clickDone();
  });


  it("should delete the test resources created", function () {
    workspacePage.loginIfNecessary(testConfig.testUserName1, testConfig.testUser1, testConfig.testPassword1);
    workspacePage.deleteArray(resources, 'folder');
  }, 200000);


});


