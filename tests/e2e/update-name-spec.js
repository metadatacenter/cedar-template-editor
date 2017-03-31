'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var testConfig = require('../config/test-env.js');
var ShareModal = require('../modals/share-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');
var _ = require('../libs/lodash.min.js');

describe('update-name', function () {
  var EC = protractor.ExpectedConditions;
  var workspacePage = WorkspacePage;
  var toastyModal = ToastyModal;
  var shareModal = ShareModal;
  var sweetAlertModal = SweetAlertModal;

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


  it("should fail to update name of a resource shared as readable with Everybody group", function () {
    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    var folder = workspacePage.createFolder('Readable');

    shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, false, false);
    workspacePage.clearSearch();

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    workspacePage.selectResource(folder, 'folder');
    workspacePage.createMoreOptionsButton().click();
    expect(workspacePage.createRenameResourceButton().getAttribute('class')).toMatch('link-disabled');

    resources.push(createResource(folder, 'folder', testConfig.testUser1, testConfig.testPassword1));
  });


  it("should fail to update name of a resource shared as readable with a user", function () {
    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    var folder = workspacePage.createFolder('Readable');

    shareModal.shareResource(folder, 'folder', testConfig.testUserName1, false, false);
    workspacePage.clearSearch();

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    workspacePage.selectResource(folder, 'folder');
    workspacePage.createMoreOptionsButton().click();
    expect(workspacePage.createRenameResourceButton().getAttribute('class')).toMatch('link-disabled');

    resources.push(createResource(folder, 'folder', testConfig.testUser2, testConfig.testPassword2));
  });


  it("should update name of a resource shared as writable with Everybody group", function () {
    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    var folder = workspacePage.createFolder('Writable');

    shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, true, false);
    workspacePage.clearSearch();

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    workspacePage.navigateToUserFolder(testConfig.testUserName1);
    workspacePage.rightClickResource(folder, 'folder');

    // change name
    var newFolderName = workspacePage.createTitle('NewWritable');
    workspacePage.createRightClickRenameMenuItem().click();
    renameModal.renameTo(newFolderName);
    toastyModal.isSuccess();

    resources.push(createResource(newFolderName, 'folder', testConfig.testUser1, testConfig.testPassword1));
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
    resourcesUser2.push(newFolderName);
    workspacePage.createRightClickRenameMenuItem().click();
    renameModal.renameTo(newFolderName);
    toastyModal.isSuccess();
  });


  it("should delete the test resources created by " + testConfig.testUserName1, function () {
    for (var i = 0; i < resourcesUser1.length; i++) {
      workspacePage.deleteResourceViaRightClick(resourcesUser1[i], 'folder');
      toastyModal.isSuccess();
      workspacePage.clearSearch();
    }
  });


  it("should delete the test resources created by " + testConfig.testUserName2, function () {
    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    for(var j = 0; j < resourcesUser2.length; j++) {
      workspacePage.deleteResourceViaRightClick(resourcesUser2[j], 'folder');
      toastyModal.isSuccess();
      workspacePage.clearSearch();
    }

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
  });


});


