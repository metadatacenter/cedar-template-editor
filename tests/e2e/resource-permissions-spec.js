'use strict';
var WorkspacePage = require('../pages/workspace-new-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');
var MoveModal = require('../modals/move-modal.js');
var testConfig = require('../config/test-env.js');

var testUserName1 = 'Test User 1';
var testUserName2 = 'Test User 2';

describe('resource-permissions', function () {
  var workspacePage;
  var toastyModal;
  var sweetAlertModal;
  var moveModal;

  beforeEach(function () {
    workspacePage = WorkspacePage;
    toastyModal = ToastyModal;
    sweetAlertModal = SweetAlertModal;
    moveModal = MoveModal;
    browser.driver.manage().window().maximize();

    console.log(jasmine.getEnv().currentSpec.description);
  });

  afterEach(function () {
    workspacePage.clickLogo();
  });


  it("should move a resource owned by current user to a writable folder", function () {
    // create template and target folder
    var sourceTemplate = workspacePage.createTemplate('Source');
    var targetFolder = workspacePage.createFolder('Target');

    // move template to target folder
    workspacePage.moveResource(sourceTemplate, 'template');
    moveModal.moveToDestination(targetFolder);
    toastyModal.isSuccess();

    workspacePage.clickLogo();
    workspacePage.deleteResource(sourceTemplate, 'template');
    workspacePage.deleteResource(targetFolder, 'folder');
  });


  it("should move a resource owned by current user to an unwritable folder", function () {
    // create a folder to share with another user
    var sharedFolderTitle = workspacePage.createFolder('Shared');

    // share folder
    workspacePage.shareResource(sharedFolderTitle, 'folder', testUserName2, false);

    // logout current user and login as the user with whom the folder was shared
    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    // create a template to move to the shared folder
    var sourceTemplate = workspacePage.createTemplate('Source');

    // move created template to shared folder
    workspacePage.moveResource(sourceTemplate, 'template');
    moveModal.moveToUserFolder(testUserName1, sharedFolderTitle);
    toastyModal.isError();

    // delete template
    workspacePage.clickLogo();
    workspacePage.deleteResource(sourceTemplate, 'template');
  });


  it("should move a writable resource not owned by current user to a writable folder", function () {
    // create source template and target shared folder
    var sourceTemplate = workspacePage.createTemplate('Source');
    var targetFolder = workspacePage.createFolder('Target');

    // share the template and folder
    workspacePage.shareResource(sourceTemplate, 'template', testUserName1, true);
    browser.sleep(2000);
    workspacePage.clickLogo(); // reset search
    workspacePage.shareResource(targetFolder, 'folder', testUserName1, true); // TODO fails due to #273

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    // go to Test User 2's folder to see the shared folders
    workspacePage.navigateToUserFolder(testUserName2);

    // move source to target folder
    workspacePage.moveResource(sourceTemplate, 'template');
    moveModal.moveToDestination(testUserName2, targetFolder);
    toastyModal.isSuccess();
  });


  it("should move a writable resource not owned by current user to an unwritable folder", function () {
    // create source template and target shared folder
    var sourceTemplate = workspacePage.createTemplate('Source');
    var targetFolder = workspacePage.createFolder('Target');

    workspacePage.shareResource(sourceTemplate, 'template', testUserName2, true);
    browser.sleep(2000);
    workspacePage.clickLogo(); // reset search
    workspacePage.shareResource(targetFolder, 'folder', testUserName2, false); // TODO fails due to issue #273

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
    workspacePage.navigateToUserFolder(testUserName1);

    workspacePage.moveResource(sourceTemplate, 'template');
    moveModal.moveToDestination(targetFolder);
    toastyModal.isError();
  });


  it("should move an unwritable resource not owned by current user to an unwritable folder", function () {
    // create source template and target shared folder
    var sourceTemplate = workspacePage.createTemplate('Source');
    var targetFolder = workspacePage.createFolder('Target');

    // share both folders
    workspacePage.shareResource(sourceTemplate, 'template', testUserName1, false);
    browser.sleep(2000);
    workspacePage.clickLogo(); // reset search
    workspacePage.shareResource(targetFolder, 'folder', testUserName1, false); // TODO fails due to issue #273

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    // go to Test User 2's folder to see the shared folders
    workspacePage.navigateToUserFolder(testUserName2);

    // move source template to target folder
    workspacePage.moveResource(sourceTemplate, 'template');
    moveModal.moveToDestination(testUserName2, targetFolder);
    toastyModal.isError();
  });


});


