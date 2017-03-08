'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var ShareModal = require('../modals/share-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');
var testConfig = require('../config/test-env.js');

describe('delete-resource', function () {
  var workspacePage;
  var toastyModal;
  var shareModal;
  var sweetAlertModal;

  var resources = [];

  beforeEach(function () {
    workspacePage = WorkspacePage;
    toastyModal = ToastyModal;
    shareModal = ShareModal;
    sweetAlertModal = SweetAlertModal;
    browser.driver.manage().window().maximize();
  });

  afterEach(function () {
    workspacePage.clickLogo();
  });


  it("should fail to delete (via more-options button) a resource shared as readable with Everybody group", function () {
    workspacePage.onWorkspace();
    var folder = workspacePage.createFolder('Readable');
    resources.push(folder);
    shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    workspacePage.navigateToUserFolder(testConfig.testUserName1);
    workspacePage.selectResource(folder, 'folder');
    workspacePage.createMoreOptionsButton().click();
    expect(workspacePage.createDeleteResourceButton().isPresent()).toBe(false);
  });


  it("should delete (via more-options button) a resource shared as writable with Everybody group", function () {
    var folder = workspacePage.createFolder('Writable');
    shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    workspacePage.navigateToUserFolder(testConfig.testUserName2);
    workspacePage.deleteResource(folder, 'folder');
  });


  it("should fail to delete (via more-options button) a resource shared as readable with a user", function () {
    var folder = workspacePage.createFolder('Readable');
    resources.push(folder);
    shareModal.shareResource(folder, 'folder', testConfig.testUserName2, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    workspacePage.navigateToUserFolder(testConfig.testUserName1);
    workspacePage.selectResource(folder, 'folder');
    workspacePage.createMoreOptionsButton().click();
    expect(workspacePage.createDeleteResourceButton().isPresent()).toBe(false);
  });


  it("should delete (via more-options button) a resource shared as writable with a user", function () {
    var folder = workspacePage.createFolder('Writable');
    shareModal.shareResource(folder, 'folder', testConfig.testUserName1, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    workspacePage.navigateToUserFolder(testConfig.testUserName2);
    workspacePage.deleteResource(folder, 'folder');
  });


  /* use right-click */

  it("should fail to delete (via right-click) a resource shared as readable with Everybody group", function () {
    var folder = workspacePage.createFolder('Readable');
    resources.push(folder);
    shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    workspacePage.navigateToUserFolder(testConfig.testUserName1);
    workspacePage.deleteResourceViaRightClick(folder, 'folder');

    sweetAlertModal.hasInsufficientPermissions();
    sweetAlertModal.confirm();
  });


  it("should delete (via right-click) a resource shared as writable with Everybody group", function () {
    var folder = workspacePage.createFolder('Writable');
    shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    workspacePage.navigateToUserFolder(testConfig.testUserName2);
    workspacePage.deleteResourceViaRightClick(folder, 'folder');

    toastyModal.isSuccess();
  });


  it("should fail to delete (via right-click) a resource shared as readable with a user", function () {
    var folder = workspacePage.createFolder('Readable');
    resources.push(folder);
    shareModal.shareResource(folder, 'folder', testConfig.testUserName2, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    workspacePage.navigateToUserFolder(testConfig.testUserName1);
    workspacePage.deleteResourceViaRightClick(folder, 'folder');

    sweetAlertModal.hasInsufficientPermissions();
    sweetAlertModal.confirm();
  });


  it("should delete (via right-click) a resource shared as writable with a user", function () {
    var folder = workspacePage.createFolder('Writable');
    shareModal.shareResource(folder, 'folder', testConfig.testUserName1, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    workspacePage.navigateToUserFolder(testConfig.testUserName2);
    workspacePage.deleteResourceViaRightClick(folder, 'folder');

    toastyModal.isSuccess();
  });


  it("should delete the test resources created", function () {
    for(var i = 0; i < resources.length; i++) {
      workspacePage.deleteResourceViaRightClick(resources[i], 'folder');
      toastyModal.isSuccess();
      workspacePage.clearSearch();
    }
  });


});


