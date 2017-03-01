'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var ShareModal = require('../modals/share-modal.js');
var testConfig = require('../config/test-env.js');

describe('update-permissions', function () {
  var workspacePage;
  var shareModal;

  beforeEach(function () {
    workspacePage = WorkspacePage;
    shareModal = ShareModal;
    browser.driver.manage().window().maximize();
  });

  afterEach(function () {
    workspacePage.clickLogo();
  });


  it("should fail to change permissions of a folder shared as readable with current user", function () {
    var folder = workspacePage.createFolder('Readable');
    shareModal.shareResource(folder, 'folder', testConfig.testUserName2, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    workspacePage.navigateToUserFolder(testConfig.testUserName1);
    shareModal.openDialogViaRightClick(folder, 'folder');

    expect(shareModal.canShare()).toBe(false);
    shareModal.clickDone();
  });


  it("should be able to change permissions of a folder shared as writable with current user", function () {
    var folder = workspacePage.createFolder('Writable');
    shareModal.shareResource(folder, 'folder', testConfig.testUserName1, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    workspacePage.navigateToUserFolder(testConfig.testUserName2);
    shareModal.openDialogViaRightClick(folder, 'folder');

    expect(shareModal.canShare()).toBe(true);
    shareModal.clickDone();
  });


  it("should fail to change permissions of a folder shared as readable with Everybody group", function () {
    var folder = workspacePage.createFolder('Readable');
    shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    workspacePage.navigateToUserFolder(testConfig.testUserName1);
    shareModal.openDialogViaRightClick(folder, 'folder');

    expect(shareModal.canShare()).toBe(false);
    shareModal.clickDone();
  });


  it("should be able to change permissions of a folder shared as writable with Everybody group", function () {
    var folder = workspacePage.createFolder('Writable');
    shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    workspacePage.navigateToUserFolder(testConfig.testUserName2);
    shareModal.openDialogViaRightClick(folder, 'folder');

    expect(shareModal.canShare()).toBe(true);
    shareModal.clickDone();
  });


});


