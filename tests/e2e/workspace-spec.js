'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var MetadataPage = require('../pages/metadata-page.js');
var TemplatePage = require('../pages/template-creator-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');
var MoveModal = require('../modals/move-modal.js');
var testConfig = require('../config/test-env.js');
var _ = require('../libs/lodash.min.js');

var folder;
var template;

describe('workspace', function () {
  var EC = protractor.ExpectedConditions;

  var workspacePage = WorkspacePage;
  var metadataPage = MetadataPage;
  var templatePage = TemplatePage;
  var toastyModal = ToastyModal;
  var sweetAlertModal = SweetAlertModal;
  var moveModal = MoveModal;

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

  it("should be on the workspace page", function () {
    workspacePage.onWorkspace();
  });

  describe('create resources', function () {
    var template;

    it("should create a  template", function () {
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      template = workspacePage.createTemplate('SrcWrksp');
      resources.push(createResource(template, 'template', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should open info panel and inspect title", function () {
      workspacePage.openInfoPanel();
    });


  });

  xdescribe('create resources', function () {

    it("should have workspace stuff", function () {
      workspacePage.hasLogo();
      workspacePage.hasBreadcrumb();
      workspacePage.hasSearchNav();
      workspacePage.hasCreateNew();
      workspacePage.hasMessaging();
      workspacePage.hasUserMenu();
    });

    it("should show left sidebar", function () {
      workspacePage.createSidebarLeft().isPresent().then(function (result) {
        console.log('left sidebar present', result);
      });
    });

    it("should show filter options", function () {
      workspacePage.createFilterOptions().isPresent().then(function (result) {
        console.log('filter options present', result);
      });
    });

    it("should show shares", function () {
      workspacePage.createShares().isPresent().then(function (result) {
        console.log('shares present', result);
      });
    });

    it("should show workspace link", function () {
      workspacePage.createWorkspaceLink().isPresent().then(function (result) {
        console.log('workspace present', result);
      });
    });

    it("should show shared link", function () {
      workspacePage.createSharedWithMeLink().isPresent().then(function (result) {
        console.log('shared present', result);
      });
    });


    xit("should display workspace link", function () {
      workspacePage.createWorkspaceLink().isDisplayed().then(function (result) {
        console.log('workspace displayed', result);
      });
    });

    xit("should show shared link", function () {
      workspacePage.createSharedWithMeLink().isDisplayed().then(function (result) {
        console.log('shared displayed', result);
      });
    });

    xit("should show work space", function () {
      workspacePage.hasWorkspace();
    });

    xit("should show shared with me", function () {
      workspacePage.hasSharedWithMe();
    });

    // create resources
    it("should create a folder", function () {
      folder = workspacePage.createTitle('Src');
      workspacePage.createResource('folder', folder, 'description');
      resources.push(createResource(folder, 'folder', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should create a  template", function () {
      template = workspacePage.createTitle('Src');
      workspacePage.createResource('template', template, 'description');
      resources.push(createResource(template, 'template', testConfig.testUser1, testConfig.testPassword1));
    });

    // top navigation
    it("should open messaging", function () {
      workspacePage.openMessaging();
      workspacePage.closeMessaging();
      workspacePage.onWorkspace();
    });

    it("should open user profile", function () {
      workspacePage.openUserProfile();
      workspacePage.closeUserProfile();
      workspacePage.onWorkspace();
    });


    it("should open grid and list views", function () {
      workspacePage.setView('grid');
      workspacePage.setView('list');
    });

    // workspace navigation
    it("should open the folder in the bread crumb", function () {
      workspacePage.clickBreadcrumb(1);
      workspacePage.createBreadcrumbFolders().getText().then(function (first) {
        workspacePage.clickSharedWithMe();
        workspacePage.createBreadcrumbFolders().getText().then(function (second) {
          expect(first == second).toBe(false);
          workspacePage.clickLogo();
          workspacePage.createBreadcrumbFolders().getText().then(function (third) {
            expect(third == second).toBe(false);
          });
        });
      });
    });

    it("should open info panel and inspect title", function () {
      workspacePage.openInfoPanel();
      expect(workspacePage.infoPanelTabs().isDisplayed()).toBe(true);
      workspacePage.infoPanelTitle().getText().then(function (title) {
        workspacePage.createBreadcrumbUserName().getText().then(function (user) {
          expect(title == user).toBe(true);

          workspacePage.selectResource(folder, 'folder');
          workspacePage.infoPanelTitle().getText().then(function (value) {
            expect(folder == value).toBe(true);

            workspacePage.clickLogo();
            workspacePage.closeInfoPanel();
          });
        });
      });
    });

  });

  describe('remove all created resources', function () {

    // clean up created resources
    it('should delete resource from the user workspace for user', function () {
      for (var i = 0; i < resources.length; i++) {
        (function (resource) {
          workspacePage.login(resource.username, resource.password);
          workspacePage.deleteResource(resource.title, resource.type);
        })
        (resources[i]);
      }
    });

  });

});


