'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var _ = require('../libs/lodash.min.js');


describe('workspace', function () {
  var page;
  var sampleFolder;


  // before each test, load a new page and create a template
  // maximize the window area for clicking
  beforeEach(function () {
    page = WorkspacePage;
    page.get();
    //page.selectGridView();
    browser.driver.manage().window().maximize();

  });

  for (var j = 0; j < 10; j++) {
    (function () {

  // functioning trash and options buttons
  it("should create a folder", function () {

    page.isDashboard().then(function () {

      //create a folder
      sampleFolder = page.createRandomFolderName();
      page.createFolder(sampleFolder);

    });

  });


  xdescribe('with sample folder', function () {

    // functioning trash and options buttons
    it("should have trash and options button hidden", function () {

      page.isDashboard().then(function () {

        // trash and more should not be visible
        expect(page.createTrashButton().isPresent()).toBe(false);
        expect(page.createMoreOptionsButton().isPresent()).toBe(false);

      });

    });

  // github issue #375
  it("should have logo, search nav, breadcrumbs, toolbar and create new buttons", function () {

    page.isDashboard().then(function () {

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
  });


  // functioning trash and options buttons
  it("should have trash and options button visible if something is selected", function () {

    page.isDashboard().then(function () {

      page.isReady(page.createFirstFolder()).then(function () {
        page.createFirstFolder().click();
        page.isReady(page.createFirstSelected()).then(function () {
          page.isReady(page.createFirstSelected()).then(function () {
            page.isReady(page.createTrashButton()).then(function () {
              page.isReady(page.createMoreOptionsButton()).then(function () {

                expect(page.createTrashButton().isPresent()).toBe(true);
                expect(page.createMoreOptionsButton().isPresent()).toBe(true);

              });
            });
          });
        });
      });
    });
  });

  });

  // delete the folder
  it("should delete a folder", function () {

    page.isDashboard().then(function () {

      // delete a folder
      page.deleteResource(sampleFolder, page.folderType());
    });

  });
    })
    (j);
  }

});


