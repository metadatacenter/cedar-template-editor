'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var ToastyPage = require('../pages/toasty-page.js');
var _ = require('../libs/lodash.min.js');


xdescribe('workspace', function () {
  var EC = protractor.ExpectedConditions;
  var page;
  var toastyPage;
  var sampleFolder;


  // before each test, load a new page and create a template
  // maximize the window area for clicking
  beforeEach(function () {

    page = WorkspacePage;
    toastyPage = ToastyPage;
    browser.driver.manage().window().maximize();

    page.get();
    browser.ignoreSynchronization = null;
    browser.wait(EC.presenceOf(element(by.css('.navbar.dashboard'))));

  });

  afterEach(function () {

    browser.ignoreSynchronization = true;

  });

  for (var j = 0; j < 1; j++) {
    (function () {

      // functioning trash and options buttons
      xit("should create a folder", function () {

        sampleFolder = 'folder' + page.getRandomInt(1, 99999999);
        page.createFolderNew(sampleFolder);
        toastyPage.isToastyNew();

      });

      // functioning trash and options buttons
      xit("should have trash and options buttons hidden, search, breadcrumbs, and create buttons visible", function () {

        browser.wait(EC.invisibilityOf(page.createTrashButton()));
        browser.wait(EC.invisibilityOf(page.createMoreOptionsButton()));
        browser.wait(EC.visibilityOf(page.createLogo()));

        browser.wait(EC.visibilityOf(page.createSearchNav()));
        page.createSearchNavInput().getText().then(function (value) {
          expect(value).toBe('');
        });

        browser.wait(EC.visibilityOf(page.createBreadcrumb()));
        browser.wait(EC.visibilityOf(page.createButton()));


      });

      xit("should open the folder in the bread crumb", function () {

        page.isDashboard().then(function () {
          // expect two folders in the breadcrumb  All / Users ....don't know user's name
          // open the Users folder
          page.openFolder(1).then(function () {
          });
        });
      });

      // functioning trash and options buttons
      xit("should have trash and options button visible if something is selected", function () {

        page.isDashboard().then(function () {

          page.isReady(page.createFirstFolder()).then(function () {
            page.createFirstFolder().click().then(function () {
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

      xit("should delete the sample folder", function () {
        page.deleteResourceNew('folder', sampleFolder);
        toastyPage.isToastyNew();
      });
    })
    (j);
  }

});


