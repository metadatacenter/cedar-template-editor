'use strict';
var WorkspacePage = require('../pages/workspace-new-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');
var MoveModal = require('../modals/move-modal.js');
var ShareModal = require('../modals/share-modal.js');
var testConfig = require('../config/test-env.js');
var EC = protractor.ExpectedConditions;

var testUserName1 = 'Test User 1';
var testUserName2 = 'Test User 2';
var everybodyGroup = 'Everybody';

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


  it("should give ownership of a folder owned by current user to another user", function () {
    var folder = workspacePage.createFolder('Owned');

    // change ownership of created folder to another user
    shareModal.shareResource(folder, 'folder', testUserName2, false, true);
    browser.sleep(1000);
    workspacePage.clickLogo();

    // select resource and open details sidebar
    workspacePage.selectResource(folder, 'folder');
    var sidebarBtn = workspacePage.createViewDetailsButton();
    browser.wait(EC.elementToBeClickable(sidebarBtn));
    sidebarBtn.click();
    expect(workspacePage.createDetailsPanel().isDisplayed()).toBe(true);

    // verify that the presented owner username is the new one assigned above
    expect(workspacePage.createDetailsPanelOwnerValue().getText()).toBe(testUserName2); // TODO fails due to issue #290
  });


  it("should fail to change ownership of a folder shared as readable with current user", function () {
    var folder = workspacePage.createFolder('Readable');

    shareModal.shareResource(folder, 'folder', testUserName2, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    workspacePage.navigateToUserFolder(testUserName1);
    shareModal.openDialogViaMoreOptions(folder, 'folder');
    expect(shareModal.canShare()).toBe(false);
    shareModal.clickDone();
  });


  it("should fail to change ownership of a folder shared as writable with current user", function () {
    var folder = workspacePage.createFolder('Writable');

    shareModal.shareResource(folder, 'folder', testUserName1, true, false); // TODO fails due to issue #273

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    workspacePage.navigateToUserFolder(testUserName2);
    shareModal.openDialogViaMoreOptions(folder, 'folder');
    expect(shareModal.canChangeOwnership()).toBe(false);
    shareModal.clickDone();
  });


  it("should fail to change ownership of a folder shared as readable with Everybody group", function () {
    var folder = workspacePage.createFolder('Readable');

    shareModal.shareResourceWithGroup(folder, 'folder', everybodyGroup, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    workspacePage.navigateToUserFolder(testUserName1);
    shareModal.openDialogViaMoreOptions(folder, 'folder');
    expect(shareModal.canShare()).toBe(false);
    shareModal.clickDone();
  });


  it("should fail to change ownership of a folder shared as writable with Everybody group", function () {
    var folder = workspacePage.createFolder('Writable');

    shareModal.shareResourceWithGroup(folder, 'folder', everybodyGroup, true, false); // TODO fails due to issue #273

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    workspacePage.navigateToUserFolder(testUserName2);
    shareModal.openDialogViaMoreOptions(folder, 'folder');
    expect(shareModal.canChangeOwnership()).toBe(false);
    shareModal.clickDone();
  });


});


