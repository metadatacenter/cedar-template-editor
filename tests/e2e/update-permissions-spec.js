'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var testConfig = require('../config/test-env.js');
var ShareModal = require('../modals/share-modal.js');
var _ = require('../libs/lodash.min.js');

xdescribe('update-permissions', function () {
  var EC = protractor.ExpectedConditions;
  var workspacePage = WorkspacePage;
  var toastyModal = ToastyModal;
  var shareModal = ShareModal;

  var resources = [];
  var createResource = function (title, type, username, password) {
    var result = new Object;
    result.title = title;
    result.type = type;
    result.username = username;
    result.password = password;
    return result;
  };

  beforeEach(function () {
  });

  afterEach(function () {
  });

  // reset user selections to defaults
  it('should be on the workspace', function () {
    console.log('update-permissions should be on the workspace');
    workspacePage.onWorkspace();
  });

  // TODO remove this...redundant with delete-resource.js
  describe('with permissions', function () {


    it("should fail to change permissions of a folder shared as readable with current user", function () {
      console.log('update-permissions should fail to change permissions of a folder shared as readable with current user');
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      var folder = workspacePage.createFolder('Readable');
      resources.push(createResource(folder, 'folder', testConfig.testUser1, testConfig.testPassword1));

      shareModal.shareResource(folder, 'folder', testConfig.testUserName2, false, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      workspacePage.navigateToUserFolder(testConfig.testUserName1);
      shareModal.shareDisabledViaRightClick(folder, 'folder');

    });



    it("should be able to change permissions of a folder shared as writable with Everybody", function () {
      console.log('update-permissions should be able to change permissions of a folder shared as writable with Everybody');
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      var folder = workspacePage.createFolder('Writable');
      resources.push(createResource(folder, 'folder', testConfig.testUser2, testConfig.testPassword2));

      shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, true, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      workspacePage.navigateToUserFolder(testConfig.testUserName2);
      shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, false, false);

    });


    it("should be able to change permissions of a folder shared as writable with current user", function () {
      console.log('update-permissions should be able to change permissions of a folder shared as writable with current user');
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      var folder = workspacePage.createFolder('Writable');
      resources.push(createResource(folder, 'folder', testConfig.testUser2, testConfig.testPassword2));

      shareModal.shareResource(folder, 'folder', testConfig.testUserName1, true, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      workspacePage.navigateToUserFolder(testConfig.testUserName2);
      shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, false, false);

    });


    it("should fail to change permissions of a folder shared as readable with Everybody group", function () {
      console.log('update-permissions should fail to change permissions of a folder shared as readable with Everybody group');
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      var folder = workspacePage.createFolder('Readable');
      resources.push(createResource(folder, 'folder', testConfig.testUser1, testConfig.testPassword1));

      shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, false, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      workspacePage.navigateToUserFolder(testConfig.testUserName1);
      shareModal.shareDisabledViaRightClick(folder, 'folder');

    });



  });

  describe('remove created resources', function () {

    it('should delete " + resources.length + " resource from the user workspace', function () {
      console.log('update-permissions should delete ' + resources.length + ' resource from the user workspace');
      for (var i = 0; i < resources.length; i++) {
        (function (resource) {
          console.log("update-permissions should delete " + resource.title + " for user " + resource.username);
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


