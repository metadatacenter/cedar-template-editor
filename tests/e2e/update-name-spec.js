'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var ShareModal = require('../modals/share-modal.js');
var RenameModal = require('../modals/rename-modal.js');
var testConfig = require('../config/test-env.js');

describe('update-name', function () {
  var workspacePage = WorkspacePage;
  var toastyModal = ToastyModal;
  var shareModal = ShareModal;
  var renameModal = RenameModal;

  var resourcesUser1 = [];
  var resourcesUser2 = [];

  beforeEach(function () {
  });

  afterEach(function () {
  });


  it("should fail to update name of a resource shared as readable with Everybody group", function () {
    workspacePage.loginIfNecessary(testConfig.testUserName1, testConfig.testUser1, testConfig.testPassword1);

    var folder = workspacePage.createFolder('Readable');
    resourcesUser1.push(folder);
    shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    workspacePage.selectResource(folder, 'folder');
    workspacePage.createMoreOptionsButton().click();
    expect(workspacePage.createRenameResourceButton().getAttribute('class')).toMatch('link-disabled');
  });


  it("should fail to update name of a resource shared as readable with a user", function () {
    workspacePage.loginIfNecessary(testConfig.testUserName2, testConfig.testUser2, testConfig.testPassword2);

    var folder = workspacePage.createFolder('Readable');
    resourcesUser2.push(folder);
    shareModal.shareResource(folder, 'folder', testConfig.testUserName1, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    workspacePage.selectResource(folder, 'folder');
    workspacePage.createMoreOptionsButton().click();
    expect(workspacePage.createRenameResourceButton().getAttribute('class')).toMatch('link-disabled');
  });


  it("should update name of a resource shared as writable with Everybody group", function () {
    workspacePage.loginIfNecessary(testConfig.testUserName1, testConfig.testUser1, testConfig.testPassword1);

    var folder = workspacePage.createFolder('Writable');
    shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    workspacePage.navigateToUserFolder(testConfig.testUserName1);
    workspacePage.rightClickResource(folder, 'folder');

    // change name
    var newFolderName = workspacePage.createTitle('NewWritable');
    resourcesUser1.push(newFolderName);
    workspacePage.createRightClickRenameMenuItem().click();
    renameModal.renameTo(newFolderName);
    toastyModal.isSuccess();
  });


  it("should update name of a resource shared as writable with a user", function () {
    workspacePage.loginIfNecessary(testConfig.testUserName2, testConfig.testUser2, testConfig.testPassword2);

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
    workspacePage.loginIfNecessary(testConfig.testUserName1, testConfig.testUser1, testConfig.testPassword1);
    for (var i = 0; i < resourcesUser1.length; i++) {
      workspacePage.deleteResourceViaRightClick(resourcesUser1[i], 'folder');
      toastyModal.isSuccess();
      workspacePage.clearSearch();
    }
  }, 200000);


  it("should delete the test resources created by " + testConfig.testUserName2, function () {
    workspacePage.loginIfNecessary(testConfig.testUserName2, testConfig.testUser2, testConfig.testPassword2);
    for(var j = 0; j < resourcesUser2.length; j++) {
      workspacePage.deleteResourceViaRightClick(resourcesUser2[j], 'folder');
      toastyModal.isSuccess();
      workspacePage.clearSearch();
    }
  }, 200000);


});


