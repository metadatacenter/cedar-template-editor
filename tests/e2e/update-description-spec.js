'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var testConfig = require('../config/test-env.js');
var ShareModal = require('../modals/share-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');
var _ = require('../libs/lodash.min.js');

describe('update-description', function () {
  var EC = protractor.ExpectedConditions;
  var workspacePage = WorkspacePage;
  var toastyModal = ToastyModal;
  var shareModal = ShareModal;
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

  beforeEach(function () {
  });

  afterEach(function () {
  });

  // reset user selections to defaults
  it('should be on the workspace', function () {
    console.log('update-description should be on the workspace');
    workspacePage.onWorkspace();
  });

  describe('in info panel', function () {

    it("should fail to update description of a resource shared as readable with Everybody group", function () {
      console.log('update-description should fail to update description of a resource shared as readable with Everybody group');
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      workspacePage.closeInfoPanel();
      var template = workspacePage.createTemplate('Readable');

      shareModal.shareResourceWithGroup(template, 'template', testConfig.everybodyGroup, false, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      workspacePage.navigateToUserFolder(testConfig.testUserName1);
      workspacePage.selectResource(template, 'template');
      workspacePage.clearSearch();

      workspacePage.openInfoPanel();
      expect(workspacePage.createDetailsPanelDescriptionEditButton().isDisplayed()).toBe(false);
      workspacePage.closeInfoPanel();

      resources.push(createResource(template, 'template', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should update description of a resource shared as writable with Everybody group", function () {
      console.log('update-description should update description of a resource shared as writable with Everybody group');
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      var template = workspacePage.createTemplate('Writable');

      shareModal.shareResourceWithGroup(template, 'template', testConfig.everybodyGroup, true, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      workspacePage.navigateToUserFolder(testConfig.testUserName2);
      workspacePage.selectResource(template, 'template');
      workspacePage.openInfoPanel();

      workspacePage.createDetailsPanelDescriptionEditButton().click();
      workspacePage.createDetailsPanelDescription().sendKeys(workspacePage.createTitle('New description') + protractor.Key.ENTER);
      toastyModal.isSuccess();
      workspacePage.closeInfoPanel();

      resources.push(createResource(template, 'template', testConfig.testUser2, testConfig.testPassword2));
    });

    it("should fail to update description of a resource shared as readable with a user", function () {
      console.log('update-description should fail to update description of a resource shared as readable with a user');
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      var template = workspacePage.createTemplate('Readable');
      shareModal.shareResource(template, 'template', testConfig.testUserName2, false, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      workspacePage.navigateToUserFolder(testConfig.testUserName1);
      workspacePage.selectResource(template, 'template');
      workspacePage.clearSearch();
      workspacePage.openInfoPanel();

      expect(workspacePage.createDetailsPanelDescriptionEditButton().isDisplayed()).toBe(false);
      workspacePage.closeInfoPanel();

      resources.push(createResource(template, 'template', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should update description of a resource shared as writable with a user", function () {
      console.log('update-description should update description of a resource shared as writable with a user');
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      var template = workspacePage.createTemplate('Writable');
      shareModal.shareResource(template, 'template', testConfig.testUserName1, true, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      workspacePage.navigateToUserFolder(testConfig.testUserName2);
      workspacePage.selectResource(template, 'template');
      workspacePage.openInfoPanel();

      workspacePage.createDetailsPanelDescriptionEditButton().click();
      workspacePage.createDetailsPanelDescription().sendKeys(workspacePage.createTitle('New description') + protractor.Key.ENTER);
      toastyModal.isSuccess();
      workspacePage.closeInfoPanel();

      resources.push(createResource(template, 'template', testConfig.testUser2, testConfig.testPassword2));
    });
  });

  describe('remove created resources', function () {

    it('should delete resource from the user workspace', function () {
      console.log('update-description should delete " + resources.length + " resource from the user workspace');
      for (var i = 0; i < resources.length; i++) {
        (function (resource) {
          console.log("update-description should delete " + resource.title + " for user " + resource.username);
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


