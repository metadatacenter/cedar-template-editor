'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var ShareModal = require('../modals/share-modal.js');
var RenameModal = require('../modals/rename-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');
var testConfig = require('../config/test-env.js');

describe('update-name', function () {
  var workspacePage;
  var toastyModal;
  var shareModal;
  var renameModal;
  var sweetAlertModal;

  beforeEach(function () {
    workspacePage = WorkspacePage;
    toastyModal = ToastyModal;
    shareModal = ShareModal;
    renameModal = RenameModal;
    sweetAlertModal = SweetAlertModal;
    browser.driver.manage().window().maximize();
  });

  afterEach(function () {
    workspacePage.clickLogo();
  });


  it("should fail to update name of a resource shared as readable with Everybody group", function () {
    var folder = workspacePage.createFolder('Readable');
    shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    workspacePage.navigateToUserFolder(testConfig.testUserName1);
    workspacePage.rightClickResource(folder, 'folder');

    // change name
    var newFolderName = workspacePage.createTitle('NewReadable');
    workspacePage.createRightClickRenameMenuItem().click();
    renameModal.renameTo(newFolderName);
    sweetAlertModal.hasInsufficientPermissions();
    sweetAlertModal.confirm();
  });


  it("should fail to update name of a resource shared as readable with a user", function () {
    var folder = workspacePage.createFolder('Readable');
    shareModal.shareResource(folder, 'folder', testConfig.testUserName1, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    workspacePage.navigateToUserFolder(testConfig.testUserName2);
    workspacePage.rightClickResource(folder, 'folder');

    // change name
    var newFolderName = workspacePage.createTitle('NewReadable');
    workspacePage.createRightClickRenameMenuItem().click();
    renameModal.renameTo(newFolderName);
    sweetAlertModal.hasInsufficientPermissions();
    sweetAlertModal.confirm();
  });


  it("should update name of a resource shared as writable with Everybody group", function () {
    var folder = workspacePage.createFolder('Writable');
    shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    workspacePage.navigateToUserFolder(testConfig.testUserName1);
    workspacePage.rightClickResource(folder, 'folder');

    // change name
    var newFolderName = workspacePage.createTitle('NewWritable');
    workspacePage.createRightClickRenameMenuItem().click();
    renameModal.renameTo(newFolderName);
    toastyModal.isSuccess();
  });


  it("should update name of a resource shared as writable with a user", function () {
    var folder = workspacePage.createFolder('Writable');
    shareModal.shareResource(folder, 'folder', testConfig.testUserName1, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    workspacePage.navigateToUserFolder(testConfig.testUserName2);
    workspacePage.rightClickResource(folder, 'folder');

    // change name
    var newFolderName = workspacePage.createTitle('NewWritable');
    workspacePage.createRightClickRenameMenuItem().click();
    renameModal.renameTo(newFolderName);
    toastyModal.isSuccess();
  });


});


