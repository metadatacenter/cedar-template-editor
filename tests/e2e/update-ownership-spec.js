'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var ShareModal = require('../modals/share-modal.js');
var testConfig = require('../config/test-env.js');

describe('update-ownership', function () {
  var workspacePage;
  var toastyModal;
  var shareModal;

  var resources = [];

  beforeEach(function () {
    workspacePage = WorkspacePage;
    toastyModal = ToastyModal;
    shareModal = ShareModal;
    browser.driver.manage().window().maximize();
  });

  afterEach(function () {
    workspacePage.clickLogo();
  });


  it("should give ownership of a folder owned by current user to another user", function () {
    var folder = workspacePage.createFolder('Owned');
    resources.push(folder);

    // change ownership of created folder to another user
    shareModal.shareResource(folder, 'folder', testConfig.testUserName2, false, true);
    workspacePage.clickLogo();

    // select resource and open details sidebar
    workspacePage.rightClickResource(folder, 'folder');
    workspacePage.createRightClickInfoMenuItem().click();

    // verify that the presented owner username is the new one assigned above
    expect(workspacePage.createDetailsPanelOwnerValue().getText()).toBe(testConfig.testUserName2);
  });


  it("should fail to change ownership of a folder shared as readable with current user", function () {
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
    var folder = workspacePage.createFolder('Writable');
    resources.push(folder);
    shareModal.shareResource(folder, 'folder', testConfig.testUserName1, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    workspacePage.navigateToUserFolder(testConfig.testUserName2);
    shareModal.openDialogViaRightClick(folder, 'folder');

    expect(shareModal.canChangeOwnership()).toBe(false);
    shareModal.clickDone();
  });


  it("should fail to change ownership of a folder shared as readable with Everybody group", function () {
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
    var folder = workspacePage.createFolder('Writable');
    resources.push(folder);
    shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    workspacePage.navigateToUserFolder(testConfig.testUserName2);
    shareModal.openDialogViaRightClick(folder, 'folder');

    expect(shareModal.canChangeOwnership()).toBe(false);
    shareModal.clickDone();
  });


  it("should delete the test resources created", function () {
    for (var i = 0; i < resources.length; i++) {
      workspacePage.deleteResourceViaRightClick(resources[i], 'folder');
      toastyModal.isSuccess();
      workspacePage.clearSearch();
    }
  });


});


