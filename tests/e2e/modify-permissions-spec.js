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

describe('modify-permissions', function () {
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
    workspacePage.clickLogo();
  });


  it("should give ownership of a folder owned by current user to another user", function () {
    // create a folder
    var folder = workspacePage.createFolder('Test');

    // change ownership of created folder to another user
    shareModal.shareResource(folder, 'folder', testUserName2, false, true);
    browser.sleep(2000);
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



});


