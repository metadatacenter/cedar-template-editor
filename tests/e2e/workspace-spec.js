'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var _ = require('../libs/lodash.min.js');


xdescribe('workspace', function () {
  var page;


  // before each test, load a new page and create a template
  // maximize the window area for clicking
  beforeEach(function () {
    page = WorkspacePage;
    page.get();
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

  // github issue #376: functioning trash button
  it("should have trash button", function () {
    var name = page.createRandomFolderName();

    // trash should not be visible
    expect(page.createTrashButton().isPresent()).toBe(false);

    //create a folder, select it, and expect the trash to be visible
    page.createFolder(name).then(function () {

      // until something is selected
      page.createFirstFolder().click();

      // now it should be displayed
      browser.wait(page.createTrashButton().isDisplayed());

      page.deleteResource(name, page.folderType());
    });
  });

  // github issue #377: functioning more options dropdown
  it("should have functioning more options dropdown", function () {
    var name = page.createRandomFolderName();

    // more button should not be visible
    expect(page.createMoreOptionsButton().isPresent()).toBe(false);

    //create a folder, select it, and expect the trash to be visible
    page.createFolder(name).then(function () {

      // until something is selected
      page.createFirstFolder().click();

      // now it should be displayed
      browser.wait(page.createMoreOptionsButton().isDisplayed());

      page.deleteResource(name, page.folderType());
    });
  });


}); 
