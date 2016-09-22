'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var _ = require('../libs/lodash.min.js');


describe('workspace', function () {
  var page;


  // before each test, load a new page and create a template
  // maximize the window area for clicking
  beforeEach(function () {
    page = WorkspacePage;
    page.get();
    page.selectGridView();
    browser.driver.manage().window().maximize();

  });


  // github issue #375
  it("should have logo, search nav, breadcrumbs, toolbar and create new buttons", function () {

    // should be on the dashboard page
    expect(page.isDashboard()).toBe(true);

    // should have a logo, search nav, breadcrumbs and nav in the header
    expect(page.createLogo().isDisplayed()).toBe(true);
    expect(page.createSearchNav().isDisplayed()).toBe(true);
    expect(page.createBreadcrumb().isDisplayed()).toBe(true);
    expect(page.createToolbar().isDisplayed()).toBe(true);
    expect(page.createNew().isDisplayed()).toBe(true);

    // search nav should be empty
    page.createSearchNavText().then(function (value) {
      expect(value).toBe('');
    });

    // expect two folders in the breadcrumb  All / Users ....don't know user's name
    // open the Users folder
    page.openFolder(1);
  });

  // github issue #376, #377: functioning trash and options buttons
  it("should have trash and options button", function () {
    var name = page.createRandomFolderName();

    // trash should not be visible
    expect(page.createTrashButton().isPresent()).toBe(false);
    expect(page.createMoreOptionsButton().isPresent()).toBe(false);

    //create a folder, select it, and expect the trash to be visible
    page.createFolder(name).then(function () {
      browser.waitForAngular().then(function () {
        // until something is selected
        page.createFirstFolder().click();
        browser.wait(page.createFirstSelected().isDisplayed());
        browser.wait(page.createTrashButton().isDisplayed());
        browser.wait(page.createMoreOptionsButton().isDisplayed());

        page.deleteResource(name, page.folderType());
      });
    });

  });


}); 
