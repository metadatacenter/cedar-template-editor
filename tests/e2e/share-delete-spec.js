'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var testConfig = require('../config/test-env.js');
var MoveModal = require('../modals/move-modal.js');
var ShareModal = require('../modals/share-modal.js');
var CopyModal = require('../modals/copy-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');
var _ = require('../libs/lodash.min.js');

describe('share-delete', function () {
  var EC = protractor.ExpectedConditions;
  var workspacePage = WorkspacePage;
  var toastyModal = ToastyModal;
  var moveModal = MoveModal;
  var shareModal = ShareModal;
  var copyModal = CopyModal;
  var sweetAlertModal = SweetAlertModal;
  var target1Folder;
  var target2Folder;
  var target1Writable;
  var folder;


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

  // reset user selections to defaults
  it('should be on the workspace', function () {
    workspacePage.onWorkspace();
  });

  describe('share and delete', function () {

    it("should create a folder", function () {
      // create a resource for user 2
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      folder = workspacePage.createFolder('Writable');
      resources.push(createResource(folder, 'folder', testConfig.testUser2, testConfig.testPassword2));
    });

    it("should share a writable resource via user", function () {
      workspacePage.shareResource(folder, 'folder');
      shareModal.shareWithUser(testConfig.testUserName1, true, false);
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      workspacePage.shareAndDeleteEnabled(folder, 'folder');
    });

    it("should create a folder", function () {
      // create a resource for user 2
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      folder = workspacePage.createFolder('Writable');
      resources.push(createResource(folder, 'folder', testConfig.testUser2, testConfig.testPassword2));
    });

    it("should share a writable resource with group", function () {
      // give everybody write access
      workspacePage.shareResource(folder, 'folder');
      shareModal.shareWithGroup(testConfig.everybodyGroup, true, false);
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      workspacePage.shareAndDeleteEnabled(folder, 'folder');
    });

    it("should create a folder", function () {
      // create a resource for user 1
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      folder = workspacePage.createFolder('Readable');
      resources.push(createResource(folder, 'folder', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should fail to move, share, and delete a readable resource", function () {
      // give read access to user 2
      workspacePage.shareResource(folder, 'folder');
      shareModal.shareWithUser(testConfig.testUserName2, false, false);
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      workspacePage.moveShareDisabled(folder, 'folder');
    });

    it("should create a folder", function () {
      // create a resource for user 1
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      folder = workspacePage.createFolder('Readable');
      resources.push(createResource(folder, 'folder', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should fail to move, share, and delete a readable resource shared via group", function () {
      // give read access to everybody
      workspacePage.shareResource(folder, 'folder');
      shareModal.shareWithGroup(testConfig.everybodyGroup, false, false);
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      workspacePage.moveShareDisabled(folder, 'folder');
    });
  });

  describe('remove created resources', function () {

    it('should delete resource from the user workspace', function () {
      workspacePage.deleteResources(resources);
    });
  });

});


