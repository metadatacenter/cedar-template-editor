'use strict';
var WorkspacePage = require('../pages/workspace-new-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var ShareModal = require('../modals/share-modal.js');
var testConfig = require('../config/test-env.js');
var permissions = require('../config/permissions.js');

describe('update-description', function () {
  var workspacePage;
  var toastyModal;
  var shareModal;

  beforeEach(function () {
    workspacePage = WorkspacePage;
    toastyModal = ToastyModal;
    shareModal = ShareModal;
    browser.driver.manage().window().maximize();
  });

  afterEach(function () {
    workspacePage.clickLogo();
  });


  it("should fail to update description of a resource shared as readable with Everybody group", function () {
    var template = workspacePage.createTemplate('Readable');
    shareModal.shareResourceWithGroup(template, 'template', permissions.everybodyGroup, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    workspacePage.navigateToUserFolder(permissions.testUserName1);
    workspacePage.rightClickResource(template, 'template');

    // change description
    workspacePage.createRightClickInfoMenuItem().click();
    expect(workspacePage.createDetailsPanelDescriptionEditButton().isDisplayed()).toBe(false);
  });


  it("should update description of a resource shared as writable with Everybody group", function () {
    var template = workspacePage.createTemplate('Writable');
    shareModal.shareResourceWithGroup(template, 'template', permissions.everybodyGroup, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    workspacePage.navigateToUserFolder(permissions.testUserName2);
    workspacePage.rightClickResource(template, 'template');

    // change description
    workspacePage.createRightClickInfoMenuItem().click();
    workspacePage.createDetailsPanelDescriptionEditButton().click();
    workspacePage.createDetailsPanelDescription().sendKeys(workspacePage.createTitle('New description') + protractor.Key.ENTER);
    toastyModal.isSuccess();
  });


  it("should fail to update description of a resource shared as readable with a user", function () {
    var template = workspacePage.createTemplate('Readable');
    shareModal.shareResource(template, 'template', permissions.testUserName2, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    workspacePage.navigateToUserFolder(permissions.testUserName1);
    workspacePage.rightClickResource(template, 'template');

    // change description
    workspacePage.createRightClickInfoMenuItem().click();
    expect(workspacePage.createDetailsPanelDescriptionEditButton().isDisplayed()).toBe(false);
  });


  it("should update description of a resource shared as writable with a user", function () {
    var template = workspacePage.createTemplate('Writable');
    shareModal.shareResource(template, 'template', permissions.testUserName1, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    workspacePage.navigateToUserFolder(permissions.testUserName2);
    workspacePage.rightClickResource(template, 'template');

    // change description
    workspacePage.createRightClickInfoMenuItem().click();
    workspacePage.createDetailsPanelDescriptionEditButton().click();
    workspacePage.createDetailsPanelDescription().sendKeys(workspacePage.createTitle('New description') + protractor.Key.ENTER);
    toastyModal.isSuccess();
  });


});


