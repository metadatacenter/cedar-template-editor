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
  var target1Folder;
  var target2Folder;
  var target1Writable;


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

  describe('copy and move', function () {

    it('should create target folders', function () {
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      target1Folder = workspacePage.createFolder('Target');
      shareModal.shareResource(target1Folder, 'folder', testConfig.testUserName2, false, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      target1Writable = workspacePage.createFolder('Target');
      shareModal.shareResource(target1Writable, 'folder', testConfig.testUserName2, true, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      target2Folder = workspacePage.createFolder('Target');
      shareModal.shareResource(target2Folder, 'folder', testConfig.testUserName1, false, false);
      workspacePage.clearSearch();
    });

    it("should copy and move resource to folder", function () {
      // create a user 1 resource
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      var sourceTemplate = workspacePage.createTemplate('Source');
      resources.push(createResource(sourceTemplate, 'template', testConfig.testUser1, testConfig.testPassword1));

      // copy resource to user 1 target
      workspacePage.copyResource(sourceTemplate, 'template');
      copyModal.copyToDestination(target1Folder);
      toastyModal.isSuccess();
      workspacePage.clearSearch();
      resources.push(createResource(sourceTemplate, 'template', testConfig.testUser1, testConfig.testPassword1));

      // move resource to user 1 target
      workspacePage.moveResource(sourceTemplate, 'template');
      moveModal.moveToDestination(target1Folder);
      toastyModal.isSuccess();
      workspacePage.clearSearch();
    });

    // TODO failed
    xit("should fail to move and succeed to copy a readable resource", function () {
      // share readable resource with user 1
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      var sourceTemplate = workspacePage.createTemplate('Source');
      resources.push(createResource(sourceTemplate, 'template', testConfig.testUser2, testConfig.testPassword2));
      shareModal.shareResource(sourceTemplate, 'template', testConfig.testUserName1, false, false);
      workspacePage.clearSearch();

      // succeed to copy readable resource
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      workspacePage.copyResource(sourceTemplate, 'template');
      copyModal.copyToUserFolder(testConfig.testUserName1, target1Writable);
      resources.push(createResource(sourceTemplate, 'template', testConfig.testUser2, testConfig.testPassword2));
      toastyModal.isSuccess();
      workspacePage.clearSearch();

      // TODO fail to move to readable resource
      //workspacePage.navigateToUserFolder(testConfig.testUserName2);
      //workspacePage.moveDisabled(sourceTemplate, 'template');

    });

    it("should fail to copy and move to a readable folder", function () {
      // create a user 2 resource
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      var sourceTemplate = workspacePage.createTemplate('Source');
      resources.push(createResource(sourceTemplate, 'template', testConfig.testUser2, testConfig.testPassword2));

      // cannot copy resource to user 1's readable folder
      workspacePage.copyResource(sourceTemplate, 'template');
      copyModal.copyToUserFolder(testConfig.testUserName1, target1Folder);
      sweetAlertModal.noWriteAccess();
      sweetAlertModal.confirm();
      workspacePage.clearSearch();

      // cannot move resource to user 1's readable folder
      workspacePage.moveResource(sourceTemplate, 'template');
      moveModal.moveToUserFolder(testConfig.testUserName1, target1Folder);
      sweetAlertModal.noWriteAccess();
      sweetAlertModal.confirm();
      workspacePage.clearSearch();
    });

    it("should move resource to a writable folder", function () {
      // create user 2 resource
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      var sourceTemplate = workspacePage.createTemplate('Source');
      resources.push(createResource(sourceTemplate, 'template', testConfig.testUser2, testConfig.testPassword2));
      shareModal.shareResource(sourceTemplate, 'template', testConfig.testUserName1, true, false);
      workspacePage.clearSearch();

      // copy resource to user 1 writable target
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      workspacePage.copyResource(sourceTemplate, 'template');
      copyModal.copyToDestination(target1Writable);
      resources.push(createResource(sourceTemplate, 'template', testConfig.testUser1, testConfig.testPassword1));
      toastyModal.isSuccess();
      workspacePage.clearSearch();

    });

    it("should mark targets as deletable", function () {
      resources.push(createResource(target1Folder, 'folder', testConfig.testUser1, testConfig.testPassword1));
      resources.push(createResource(target1Writable, 'folder', testConfig.testUser1, testConfig.testPassword1));
      resources.push(createResource(target2Folder, 'folder', testConfig.testUser2, testConfig.testPassword2));
    });
  });

  describe('remove created resources', function () {

    it('should delete resource from the user workspace', function () {
      for (var i = 0; i < resources.length; i++) {
        (function (resource) {
          console.log("copy and move, share and delete should delete " + resource.title + " for user " + resource.username);
          workspacePage.login(resource.username, resource.password);
          workspacePage.deleteResourceViaRightClick(resource.title, resource.type);
          toastyModal.isSuccess();
          workspacePage.clearSearch();
        })
        (resources[i]);
      }
    });
  });

});


