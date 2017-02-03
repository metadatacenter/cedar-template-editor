'use strict';
var WorkspacePage = require('../pages/workspace-new-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');
var MoveModal = require('../modals/move-modal.js');
var ShareModal = require('../modals/share-modal.js');
var testConfig = require('../config/test-env.js');
var permissions = require('../config/permissions.js');
var EC = protractor.ExpectedConditions;

describe('update-ownership', function () {
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

    console.log(jasmine.getEnv().currentSpec.description);
  });

  afterEach(function () {
    browser.sleep(1000);
    workspacePage.clickLogo();
  });


  xit("should give ownership of a folder owned by current user to another user", function () {
    var folder = workspacePage.createFolder('Owned');

    // change ownership of created folder to another user
    shareModal.shareResource(folder, 'folder', permissions.testUserName2, false, true);
    workspacePage.clickLogo();

    // select resource and open details sidebar
    workspacePage.selectResource(folder, 'folder');
    var sidebarBtn = workspacePage.createViewDetailsButton();
    browser.wait(EC.elementToBeClickable(sidebarBtn));
    sidebarBtn.click();

    // verify that the presented owner username is the new one assigned above
    expect(workspacePage.createDetailsPanelOwnerValue().getText()).toBe(permissions.testUserName2); // TODO fails due to issue #290
  });


  it("should fail to change ownership of a folder shared as readable with current user", function () {
    var folder = workspacePage.createFolder('Readable');
    shareModal.shareResource(folder, 'folder', permissions.testUserName2, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    workspacePage.navigateToUserFolder(permissions.testUserName1);
    shareModal.openDialogViaRightClick(folder, 'folder');

    expect(shareModal.canShare()).toBe(false);
    shareModal.clickDone();
  });


  it("should fail to change ownership of a folder shared as writable with current user", function () {
    var folder = workspacePage.createFolder('Writable');
    shareModal.shareResource(folder, 'folder', permissions.testUserName1, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    workspacePage.navigateToUserFolder(permissions.testUserName2);
    shareModal.openDialogViaRightClick(folder, 'folder');

    expect(shareModal.canChangeOwnership()).toBe(false);
    shareModal.clickDone();
  });


  it("should fail to change ownership of a folder shared as readable with Everybody group", function () {
    var folder = workspacePage.createFolder('Readable');
    shareModal.shareResourceWithGroup(folder, 'folder', permissions.everybodyGroup, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    workspacePage.navigateToUserFolder(permissions.testUserName1);
    shareModal.openDialogViaRightClick(folder, 'folder');

    expect(shareModal.canShare()).toBe(false);
    shareModal.clickDone();
  });


  it("should fail to change ownership of a folder shared as writable with Everybody group", function () {
    var folder = workspacePage.createFolder('Writable');
    shareModal.shareResourceWithGroup(folder, 'folder', permissions.everybodyGroup, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    workspacePage.navigateToUserFolder(permissions.testUserName2);
    shareModal.openDialogViaRightClick(folder, 'folder');

    expect(shareModal.canChangeOwnership()).toBe(false);
    shareModal.clickDone();
  });


});


