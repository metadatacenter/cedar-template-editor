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
    browser.driver.manage().window().maximize();

  });

  for (var j = 0; j < 0; j++) {
    (function () {

      // functioning trash and options buttons
      it("should create a folder", function () {

        page.isDashboard().then(function () {

          //create a folder
          sampleFolder = page.createRandomFolderName();
          page.createFolder(sampleFolder);

        });
      });


      describe('with sample folder', function () {

        // functioning trash and options buttons
        it("should have trash and options button hidden", function () {

          page.isDashboard().then(function () {

            // trash and more should not be visible
            expect(page.createTrashButton().isPresent()).toBe(false);
            expect(page.createMoreOptionsButton().isPresent()).toBe(false);

          });
        });


        it("should have logo", function () {

          page.isDashboard().then(function () {
            page.isReady(page.createLogo()).then(function () {
            });
          });

        });
        it("should have search nav", function () {

          page.isDashboard().then(function () {
            page.isReady(page.createSearchNav()).then(function () {
            });
          });
        });
        it("should have bread crumb", function () {

          page.isDashboard().then(function () {
            page.isReady(page.createBreadcrumb()).then(function () {
            });
          });
        });

        it("should have create button", function () {

          page.isDashboard().then(function () {
            page.isReady(page.createButton()).then(function () {
            });
          });
        });

        it("should have empty search nav", function () {

          page.isDashboard().then(function () {

            // search nav should be empty
            page.createSearchNavInput().getText().then(function (value) {
              expect(value).toBe('');

            });
          });
        });

        it("should open the folder in the bread crumb", function () {

          page.isDashboard().then(function () {
            // expect two folders in the breadcrumb  All / Users ....don't know user's name
            // open the Users folder
            page.openFolder(1).then(function () {
            });
          });
        });


        // functioning trash and options buttons
        it("should have trash and options button visible if something is selected", function () {

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

      });

      // delete the folder
      it("should delete the sample folder", function () {

        page.isDashboard().then(function () {

          // delete a folder
          page.deleteResource(sampleFolder, page.folderType());
        });

      });
    })
    (j);
  }

});


