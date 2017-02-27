'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var MetadataPage = require('../pages/metadata-page.js');
var TemplatePage = require('../pages/template-creator-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');

var _ = require('../libs/lodash.min.js');
var sampleTitle;
var sampleDescription;
var sampleTemplateUrl;
var sampleMetadataUrl ;
var pageName = 'template';


describe('clean-up', function () {
  var EC = protractor.ExpectedConditions;
  var metadataPage;
  var workspacePage;
  var templatePage;
  var toastyModal;
  var sweetAlertModal;

  // before each test
  // maximize the window area for clicking
  beforeEach(function () {

    workspacePage = WorkspacePage;
    metadataPage = MetadataPage;
    templatePage = TemplatePage;
    toastyModal = ToastyModal;
    sweetAlertModal = SweetAlertModal;
    browser.driver.manage().window().maximize();

  });

  afterEach(function () {
  });


  it("should have a logo", function () {
    workspacePage.hasLogo();
    workspacePage.onWorkspace();
  });

  // rereset user selections to defaults
  it('should reset user selections', function () {
    workspacePage.closeInfoPanel(false);
    workspacePage.setSortOrder('sortCreated');
    workspacePage.setTypeFilters();
  });




  // turn these on if you need to clean up the workspace
  for (var i = 0; i < 10; i++) {

    it('should delete any Protractor resource from the workspace', function () {

      workspacePage.canDeleteNew();

    });

  }

});

