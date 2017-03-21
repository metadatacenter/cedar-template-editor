'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var ShareModal = require('../modals/share-modal.js');
var testConfig = require('../config/test-env.js');

describe('delete-resource', function () {
  var workspacePage = WorkspacePage;
  var toastyModal = ToastyModal;
  var shareModal = ShareModal;

  var resources = [];

  beforeEach(function () {
  });

  afterEach(function () {
  });


  it("should fail to delete (via more-options button) a resource shared as readable with Everybody group", function () {
    workspacePage.loginIfNecessary(testConfig.testUserName1, testConfig.testUser1, testConfig.testPassword1);

    var folder = workspacePage.createFolder('Readable');
    resources.push(folder);
    shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    workspacePage.navigateToUserFolder(testConfig.testUserName1);
    workspacePage.selectResource(folder, 'folder');
    workspacePage.createMoreOptionsButton().click();
    expect(workspacePage.createDeleteResourceButton().getAttribute('class')).toMatch('link-disabled');
  });


  it("should delete (via more-options button) a resource shared as writable with Everybody group", function () {
    workspacePage.loginIfNecessary(testConfig.testUserName2, testConfig.testUser2, testConfig.testPassword2);

    var folder = workspacePage.createFolder('Writable');
    shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    workspacePage.navigateToUserFolder(testConfig.testUserName2);
    workspacePage.deleteResource(folder, 'folder');
  });


  it("should fail to delete (via more-options button) a resource shared as readable with a user", function () {
    workspacePage.loginIfNecessary(testConfig.testUserName1, testConfig.testUser1, testConfig.testPassword1);

    var folder = workspacePage.createFolder('Readable');
    resources.push(folder);
    shareModal.shareResource(folder, 'folder', testConfig.testUserName2, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    workspacePage.navigateToUserFolder(testConfig.testUserName1);
    workspacePage.selectResource(folder, 'folder');
    workspacePage.createMoreOptionsButton().click();
    expect(workspacePage.createDeleteResourceButton().getAttribute('class')).toMatch('link-disabled');
  });


  it("should delete (via more-options button) a resource shared as writable with a user", function () {
    workspacePage.loginIfNecessary(testConfig.testUserName2, testConfig.testUser2, testConfig.testPassword2);

    var folder = workspacePage.createFolder('Writable');
    shareModal.shareResource(folder, 'folder', testConfig.testUserName1, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    workspacePage.navigateToUserFolder(testConfig.testUserName2);
    workspacePage.deleteResource(folder, 'folder');
  });


  /* use right-click */

  it("should fail to delete (via right-click) a resource shared as readable with Everybody group", function () {
    workspacePage.loginIfNecessary(testConfig.testUserName1, testConfig.testUser1, testConfig.testPassword1);

    var folder = workspacePage.createFolder('Readable');
    resources.push(folder);
    shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    workspacePage.navigateToUserFolder(testConfig.testUserName1);
    workspacePage.rightClickResource(folder, 'folder');
    expect(workspacePage.createRightClickDeleteMenuItem().getAttribute('class')).toMatch('link-disabled');
  });


  it("should delete (via right-click) a resource shared as writable with Everybody group", function () {
    workspacePage.loginIfNecessary(testConfig.testUserName2, testConfig.testUser2, testConfig.testPassword2);

    var folder = workspacePage.createFolder('Writable');
    shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    workspacePage.navigateToUserFolder(testConfig.testUserName2);
    workspacePage.deleteResourceViaRightClick(folder, 'folder');

    toastyModal.isSuccess();
  });


  it("should fail to delete (via right-click) a resource shared as readable with a user", function () {
    workspacePage.loginIfNecessary(testConfig.testUserName1, testConfig.testUser1, testConfig.testPassword1);

    var folder = workspacePage.createFolder('Readable');
    resources.push(folder);
    shareModal.shareResource(folder, 'folder', testConfig.testUserName2, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    workspacePage.navigateToUserFolder(testConfig.testUserName1);
    workspacePage.rightClickResource(folder, 'folder');
    expect(workspacePage.createRightClickDeleteMenuItem().getAttribute('class')).toMatch('link-disabled');
  });


  it("should delete (via right-click) a resource shared as writable with a user", function () {
    workspacePage.loginIfNecessary(testConfig.testUserName2, testConfig.testUser2, testConfig.testPassword2);

    var folder = workspacePage.createFolder('Writable');
    shareModal.shareResource(folder, 'folder', testConfig.testUserName1, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    workspacePage.navigateToUserFolder(testConfig.testUserName2);
    workspacePage.deleteResourceViaRightClick(folder, 'folder');

    toastyModal.isSuccess();
  });


  it("should delete the test resources created", function () {
    workspacePage.loginIfNecessary(testConfig.testUserName1, testConfig.testUser1, testConfig.testPassword1);
    for (var i = 0; i < resources.length; i++) {
      workspacePage.deleteResourceViaRightClick(resources[i], 'folder');
      toastyModal.isSuccess();
      workspacePage.clearSearch();
    }
  });


});


