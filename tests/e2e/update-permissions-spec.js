'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var ShareModal = require('../modals/share-modal.js');
var testConfig = require('../config/test-env.js');

describe('update-permissions', function () {
  var workspacePage = WorkspacePage;
  var shareModal = ShareModal;

  var resources = [];

  beforeEach(function () {
  });

  afterEach(function () {
  });


  it("should fail to change permissions of a folder shared as readable with current user", function () {
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


  it("should be able to change permissions of a folder shared as writable with current user", function () {
    workspacePage.loginIfNecessary(testConfig.testUserName2, testConfig.testUser2, testConfig.testPassword2);

    var folder = workspacePage.createFolder('Writable');
    resources.push(folder);
    shareModal.shareResource(folder, 'folder', testConfig.testUserName1, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    workspacePage.navigateToUserFolder(testConfig.testUserName2);
    shareModal.openDialogViaRightClick(folder, 'folder');

    expect(shareModal.canShare()).toBe(true);
    shareModal.clickDone();
  });


  it("should fail to change permissions of a folder shared as readable with Everybody group", function () {
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


  it("should be able to change permissions of a folder shared as writable with Everybody group", function () {
    workspacePage.loginIfNecessary(testConfig.testUserName2, testConfig.testUser2, testConfig.testPassword2);

    var folder = workspacePage.createFolder('Writable');
    resources.push(folder);
    shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    workspacePage.navigateToUserFolder(testConfig.testUserName2);
    shareModal.openDialogViaRightClick(folder, 'folder');

    expect(shareModal.canShare()).toBe(true);
    shareModal.clickDone();
  });


  xit("should delete the test resources created", function () {
    workspacePage.loginIfNecessary(testConfig.testUserName1, testConfig.testUser1, testConfig.testPassword1);
    workspacePage.deleteArray(resources, 'folder');
  }, 200000);


});


