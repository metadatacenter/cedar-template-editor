'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');
var MoveModal = require('../modals/move-modal.js');
var ShareModal = require('../modals/share-modal.js');
var RenameModal = require('../modals/rename-modal.js');
var testConfig = require('../config/test-env.js');
var permissions = require('../config/permissions.js');

xdescribe('update-name', function () {
  var workspacePage;
  var toastyModal;
  var sweetAlertModal;
  var moveModal;
  var shareModal;
  var renameModal;

  beforeEach(function () {
    workspacePage = WorkspacePage;
    toastyModal = ToastyModal;
    sweetAlertModal = SweetAlertModal;
    moveModal = MoveModal;
    shareModal = ShareModal;
    renameModal = RenameModal;
    browser.driver.manage().window().maximize();
  });

  afterEach(function () {
    workspacePage.clickLogo();
  });


  it("should fail to update name of a resource shared as readable with Everybody group", function () {
    var folder = workspacePage.createFolder('Readable');
    shareModal.shareResourceWithGroup(folder, 'folder', permissions.everybodyGroup, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    workspacePage.navigateToUserFolder(permissions.testUserName1);
    workspacePage.rightClickResource(folder, 'folder');

    // change name
    workspacePage.createRightClickRenameMenuItem().click();
    renameModal.renameTo('New name');
    toastyModal.isError();
  });


  it("should fail to update name of a resource shared as readable with a user", function () {
    var folder = workspacePage.createFolder('Readable');
    shareModal.shareResource(folder, 'folder', permissions.testUserName1, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    workspacePage.navigateToUserFolder(permissions.testUserName2);
    workspacePage.rightClickResource(folder, 'folder');

    // change name
    workspacePage.createRightClickRenameMenuItem().click();
    renameModal.renameTo('New name');
    toastyModal.isError();
  });


  it("should update name of a resource shared as writable with Everybody group", function () {
    var folder = workspacePage.createFolder('Writable');
    shareModal.shareResourceWithGroup(folder, 'folder', permissions.everybodyGroup, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    workspacePage.navigateToUserFolder(permissions.testUserName1);
    workspacePage.rightClickResource(folder, 'folder');

    // change name
    workspacePage.createRightClickRenameMenuItem().click();
    renameModal.renameTo(workspacePage.createTitle('New name'));
    toastyModal.isSuccess();
  });


  it("should update name of a resource shared as writable with a user", function () {
    var folder = workspacePage.createFolder('Writable');
    shareModal.shareResource(folder, 'folder', permissions.testUserName1, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    workspacePage.navigateToUserFolder(permissions.testUserName2);
    workspacePage.rightClickResource(folder, 'folder');

    // change name
    workspacePage.createRightClickRenameMenuItem().click();
    renameModal.renameTo('New name');
    toastyModal.isSuccess();
  });


});


