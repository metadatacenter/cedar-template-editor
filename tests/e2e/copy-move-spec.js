'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var testConfig = require('../config/test-env.js');
var MoveModal = require('../modals/move-modal.js');
var ShareModal = require('../modals/share-modal.js');
var CopyModal = require('../modals/copy-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');
var _ = require('../libs/lodash.min.js');

describe('copy and move', function () {
  var EC = protractor.ExpectedConditions;
  var workspacePage = WorkspacePage;
  var toastyModal = ToastyModal;
  var moveModal = MoveModal;
  var shareModal = ShareModal;
  var copyModal = CopyModal;
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

  jasmine.getEnv().addReporter(workspacePage.myReporter());

  beforeEach(function () {
  });

  afterEach(function () {
  });

  it('should be on the workspace', function () {
    workspacePage.onWorkspace();
  });

  // copy and move a readable template into a local folder
  describe('readable source', function () {

    var sourceTemplate;
    var targetFolder;
    var destFolder;

    it('should create folder and template for user ' + testConfig.testUser1, function () {
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      targetFolder = workspacePage.createFolder('TargetA');
      resources.push(createResource(targetFolder, 'folder', testConfig.testUser1, testConfig.testPassword1));
      sourceTemplate = workspacePage.createTemplate('SourceA');
      resources.unshift(createResource(sourceTemplate, 'template', testConfig.testUser1, testConfig.testPassword1));

    });

    it("should copy template to folder", function () {
      workspacePage.copyResource(sourceTemplate, 'template');
      copyModal.copyToDestination(targetFolder);
      toastyModal.isSuccess();
      resources.unshift(createResource(sourceTemplate, 'template', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should share folder with " + testConfig.testUserName2 + ' as readable ', function () {
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      workspacePage.shareResource(targetFolder, 'folder');
      shareModal.shareWithUser(testConfig.testUserName2, 'read');
    });

    it('should create folder for user ' + testConfig.testUser2, function () {
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      destFolder = workspacePage.createFolder('DestinationA');
      resources.push(createResource(destFolder, 'folder', testConfig.testUser2, testConfig.testPassword2));
    });

    // TODO failing
    xit("should fail to move the readable resource", function () {
      workspacePage.moveShareDisabled(sourceTemplate, 'template');
    });

    it("should succeed to copy the readable resource", function () {
      workspacePage.copyResource(sourceTemplate, 'template');
      copyModal.copyToDestination(destFolder);
      toastyModal.isSuccess();
      workspacePage.clearSearch();
      resources.unshift(createResource(sourceTemplate, 'template', testConfig.testUser2, testConfig.testPassword2));
    });
  });

  // copy and move a writable template into a local folder
  describe('writable source', function () {

    var targetFolder;
    var destFolder;
    var sourceTemplate;

    it('should create folder and template for user ' + testConfig.testUser1, function () {
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      sourceTemplate = workspacePage.createTemplate('SourceB');
      resources.unshift(createResource(sourceTemplate, 'template', testConfig.testUser1, testConfig.testPassword1));
      targetFolder = workspacePage.createFolder('TargetB');
      resources.push(createResource(targetFolder, 'folder', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should copy template to folder", function () {
      workspacePage.copyResource(sourceTemplate, 'template');
      copyModal.copyToDestination(targetFolder);
      toastyModal.isSuccess();
      workspacePage.clearSearch();
      resources.unshift(createResource(sourceTemplate, 'template', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should share folder with " + testConfig.testUserName2 + ' as writable ', function () {
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      workspacePage.shareResource(targetFolder, 'folder');
      shareModal.shareWithUser(testConfig.testUserName2, 'write');
    });

    it('should create folder and template for user ' + testConfig.testUser2, function () {
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      destFolder = workspacePage.createFolder('DestinationB');
      resources.push(createResource(destFolder, 'folder', testConfig.testUser2, testConfig.testPassword2));
    });

    it("should succeed to copy the writable resource", function () {
      workspacePage.copyResource(sourceTemplate, 'template');
      copyModal.copyToDestination(destFolder);
      toastyModal.isSuccess();
      workspacePage.clearSearch();
      resources.unshift(createResource(sourceTemplate, 'template', testConfig.testUser2, testConfig.testPassword2));
    });

    it("should succeed to move the writable resource", function () {
      workspacePage.moveResource(sourceTemplate, 'template');
      moveModal.moveToDestination(destFolder);
      toastyModal.isSuccess();
      workspacePage.clearSearch();
    });
  });

  // copy and move a template into a readable folder
  describe('readable destination', function () {

    var targetFolder;
    var sourceTemplate;

    it('should create folder for user ' + testConfig.testUser1, function () {
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      targetFolder = workspacePage.createFolder('TargetC');
      resources.push(createResource(targetFolder, 'folder', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should share folder with " + testConfig.testUserName2 + ' as readable ', function () {
      workspacePage.shareResource(targetFolder, 'folder');
      shareModal.shareWithUser(testConfig.testUserName2, 'read');
    });

    it("should create a resource for user " + testConfig.testUser2, function () {
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      sourceTemplate = workspacePage.createTemplate('SourceC');
      resources.unshift(createResource(sourceTemplate, 'template', testConfig.testUser2, testConfig.testPassword2));
    });

    // fails
    xit("should fail to copy  to a readable folder", function () {
      //workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      workspacePage.copyResource(sourceTemplate, 'template');
      copyModal.copyToUserFolder(testConfig.testUserName1, targetFolder);
      sweetAlertModal.noWriteAccess();
      sweetAlertModal.confirm();
      workspacePage.clearSearch();
    });

    xit("should fail to move to a readable folder", function () {
      //workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      workspacePage.moveResource(sourceTemplate, 'template');
      moveModal.moveToUserFolder(testConfig.testUserName1, targetFolder);
      sweetAlertModal.noWriteAccess();
      sweetAlertModal.confirm();
      workspacePage.clearSearch();
    });
  });

  // copy and move a template into a writable folder
  describe('writable destination', function () {

    var targetFolder;
    var sourceTemplate;

    it('should create folder for user ' + testConfig.testUser1, function () {
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      targetFolder = workspacePage.createFolder('TargetD');
      resources.push(createResource(targetFolder, 'folder', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should share folder with " + testConfig.testUserName2 + ' as readable ', function () {
      workspacePage.shareResource(targetFolder, 'folder');
      shareModal.shareWithUser(testConfig.testUserName2, 'write');
    });

    it("should create a resource for user " + testConfig.testUser2, function () {
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      sourceTemplate = workspacePage.createTemplate('SourceD');
      resources.unshift(createResource(sourceTemplate, 'template', testConfig.testUser2, testConfig.testPassword2));
    });

    xit("should copy to a readable folder", function () {
      workspacePage.copyResource(sourceTemplate, 'template');
      copyModal.copyToUserFolder(testConfig.testUserName1, targetFolder);
      toastyModal.isSuccess();
      resources.unshift(createResource(sourceTemplate, 'template', testConfig.testUser1, testConfig.testPassword1));
      workspacePage.clearSearch();
    });

    xit("should fail to move to a readable folder", function () {
      workspacePage.moveResource(sourceTemplate, 'template');
      moveModal.moveToUserFolder(testConfig.testUserName1, targetFolder);
      toastyModal.isSuccess();
      workspacePage.clearSearch();
    });
  });

  describe('remove created resources', function () {

    it('should delete resource from the user workspace', function () {
      workspacePage.deleteResources(resources);
    });

  });

});


