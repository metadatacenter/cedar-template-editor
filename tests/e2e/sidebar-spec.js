'use strict';
var WorkspacePage = require('../pages/workspace-page.js');

describe('workspace-sidebar', function () {
  var page = WorkspacePage;
  var folder;

  beforeEach(function () {
  });

  afterEach(function () {
  });


  it("should show the details sidebar", function () {
    console.log("should show the details sidebar");
    page.onWorkspace();
    page.isInfoPanelOpen().then(function(result) {
      if(result) {
        page.closeInfoPanel();
      }
    });
    expect(page.createDetailsPanel().isPresent()).toBe(false);
    page.openInfoPanel();
    expect(page.createDetailsPanel().isDisplayed()).toBe(true);
  });


  it('should show the user name in the title', function () {
    console.log("should show the user name in the title");
    page.onWorkspace();
    page.openInfoPanel(); // ensure that info panel is open
    expect(page.createDetailsPanelTitle().getText()).toBe(page.createBreadcrumbUserName().getText());
  });


  it("should show folder name on the title of the sidebar", function () {
    console.log("should show folder name on the title of the sidebar");
    page.onWorkspace();
    page.openInfoPanel(); // ensure that info panel is open
    folder = page.createFolder('TestSidebar');
    page.selectResource(folder, 'folder');
    expect(page.createDetailsPanelTitle().isPresent()).toBe(true);
    expect(page.createDetailsPanelTitle().getText()).toBe(folder);
    page.clearSearch();
  });


  it("should hide the details sidebar", function () {
    console.log("should hide the details sidebar");
    page.onWorkspace();
    page.closeInfoPanel();
    expect(page.createDetailsPanel().isPresent()).toBe(false);
  });


  it("should delete the test folder created", function () {
    console.log("should delete the test folder created");
    page.deleteResource(folder, 'folder');
  });


});