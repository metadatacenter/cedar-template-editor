'use strict';
var WorkspacePage = require('../pages/workspace-new-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');
var MoveModal = require('../modals/move-modal.js');
var ShareModal = require('../modals/share-modal.js');
var testConfig = require('../config/test-env.js');
var permissions = require('../config/permissions.js');

xdescribe('update-permissions', function () {
  var workspacePage;
  var toastyModal;
  var sweetAlertModal;
  var moveModal;
  var shareModal;

  beforeEach(function () {
    workspacePage = WorkspacePage;
    toastyModal = ToastyModal;
    sweetAlertModal = SweetAlertModal;
    moveModal = MoveModal;
    shareModal = ShareModal;
    browser.driver.manage().window().maximize();
  });

  afterEach(function () {
    browser.sleep(1000);
    workspacePage.clickLogo();
  });


  it("should fail to change permissions of a folder shared as readable with current user", function () {
    var folder = workspacePage.createFolder('Readable');
    shareModal.shareResource(folder, 'folder', permissions.testUserName2, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    workspacePage.navigateToUserFolder(permissions.testUserName1);
    shareModal.openDialogViaRightClick(folder, 'folder');

    expect(shareModal.canShare()).toBe(false);
    shareModal.clickDone();
  });


  it("should be able to change permissions of a folder shared as writable with current user", function () {
    var folder = workspacePage.createFolder('Writable');
    shareModal.shareResource(folder, 'folder', permissions.testUserName1, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    workspacePage.navigateToUserFolder(permissions.testUserName2);
    shareModal.openDialogViaRightClick(folder, 'folder');

    expect(shareModal.canShare()).toBe(true);
    shareModal.clickDone();
  });


  it("should fail to change permissions of a folder shared as readable with Everybody group", function () {
    var folder = workspacePage.createFolder('Readable');
    shareModal.shareResourceWithGroup(folder, 'folder', permissions.everybodyGroup, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    workspacePage.navigateToUserFolder(permissions.testUserName1);
    shareModal.openDialogViaRightClick(folder, 'folder');

    expect(shareModal.canShare()).toBe(false);
    shareModal.clickDone();
  });


  it("should be able to change permissions of a folder shared as writable with Everybody group", function () {
    var folder = workspacePage.createFolder('Writable');
    shareModal.shareResourceWithGroup(folder, 'folder', permissions.everybodyGroup, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    workspacePage.navigateToUserFolder(permissions.testUserName2);
    shareModal.openDialogViaRightClick(folder, 'folder');

    expect(shareModal.canShare()).toBe(true);
    shareModal.clickDone();
  });


});


