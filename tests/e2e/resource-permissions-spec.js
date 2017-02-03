'use strict';
var WorkspacePage = require('../pages/workspace-new-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');
var MoveModal = require('../modals/move-modal.js');
var ShareModal = require('../modals/share-modal.js');
var testConfig = require('../config/test-env.js');
var permissions = require('../config/permissions.js');

describe('resource-permissions', function () {
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


  /* Move tests */

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
    shareModal.shareResource(sharedFolderTitle, 'folder', permissions.testUserName2, false, false);

    // logout current user and login as the user with whom the folder was shared
    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    // create a template to move to the shared folder
    var sourceTemplate = workspacePage.createTemplate('Source');

    // move created template to shared folder
    workspacePage.moveResource(sourceTemplate, 'template');
    moveModal.moveToUserFolder(permissions.testUserName1, sharedFolderTitle);
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
    shareModal.shareResource(sourceTemplate, 'template', permissions.testUserName1, true, false);
    workspacePage.clickLogo(); // reset search
    shareModal.shareResource(targetFolder, 'folder', permissions.testUserName1, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    // go to Test User 2's folder to see the shared folders
    workspacePage.navigateToUserFolder(permissions.testUserName2);

    // move source to target folder
    workspacePage.moveResource(sourceTemplate, 'template');
    moveModal.moveToDestination(targetFolder);
    toastyModal.isSuccess();
  });


  it("should move a writable resource not owned by current user to an unwritable folder", function () {
    // create source template and target shared folder
    var sourceTemplate = workspacePage.createTemplate('Source');
    var targetFolder = workspacePage.createFolder('Target');

    shareModal.shareResource(sourceTemplate, 'template', permissions.testUserName2, true, false);
    workspacePage.clickLogo(); // reset search
    shareModal.shareResource(targetFolder, 'folder', permissions.testUserName2, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
    workspacePage.navigateToUserFolder(permissions.testUserName1);

    workspacePage.moveResource(sourceTemplate, 'template');
    moveModal.moveToDestination(targetFolder);
    toastyModal.isError();
  });


  it("should move an unwritable resource not owned by current user to an unwritable folder", function () {
    // create source template and target shared folder
    var sourceTemplate = workspacePage.createTemplate('Source');
    var targetFolder = workspacePage.createFolder('Target');

    // share both folders
    shareModal.shareResource(sourceTemplate, 'template', permissions.testUserName1, false, false);
    workspacePage.clickLogo(); // reset search
    shareModal.shareResource(targetFolder, 'folder', permissions.testUserName1, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    // go to Test User 2's folder to see the shared folders
    workspacePage.navigateToUserFolder(permissions.testUserName2);

    // move source template to target folder
    workspacePage.moveResource(sourceTemplate, 'template');
    moveModal.moveToDestination(permissions.testUserName2, targetFolder);
    toastyModal.isError();
  });


});


