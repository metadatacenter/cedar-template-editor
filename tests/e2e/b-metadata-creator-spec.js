'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var MetadataPage = require('../pages/metadata-page.js');
var TemplatePage = require('../pages/template-creator-page.js');
var _ = require('../libs/lodash.min.js');
var sampleTitle;
var sampleTemplateUrl;
var sampleMetadataUrl;


describe('metadata-creator', function () {
  var metadataPage;
  var workspacePage;
  var templatePage;


  // before each test, load a new page and create a template
  // maximize the window area for clicking
  beforeEach(function () {
    workspacePage = WorkspacePage;
    metadataPage = MetadataPage;
    templatePage = TemplatePage;
    browser.driver.manage().window().maximize();
    workspacePage.get();
    workspacePage.selectGridView();
    browser.waitForAngular();

  });

  for (var j = 0; j < 10; j++) {
    (function () {


  it("should create the sample template", function () {

    sampleTitle = "template" + metadataPage.getRandomInt(1, 99999);

    workspacePage.isReady(workspacePage.createNew()).then(function () {

      browser.actions().mouseMove(workspacePage.createNew()).perform().then(function () {
        workspacePage.isReady(workspacePage.createNewTemplateButton()).then(function () {
          workspacePage.createNewTemplateButton().click().then(function () {

            // create the sample template
            templatePage.setTemplateTitle(sampleTitle).then(function () {
            templatePage.addTextField().then(function () {
            templatePage.addTextField().then(function () {
            templatePage.clickSaveTemplate();

            browser.getCurrentUrl().then(function (value) {
              sampleTemplateUrl = value;
            });
          });
            });
            });
          });
        });
      });
    });
  });


    xit("should open the sample template", function () {

      browser.get(sampleTemplateUrl).then(function () {
        templatePage.isReady(element(by.css('#top-navigation.template'))).then(function () {
        });
      });
    });

    it("should create metadata from the template", function () {

      workspacePage.openTemplate(sampleTitle).then(function () {

        // wait for the metadata form to be displayed
        metadataPage.isReady(metadataPage.createPageName()).then(function () {

          // save the metadata, don't need to enter anything into form
          metadataPage.isReady(metadataPage.createSaveMetadataButton()).then(function () {

            metadataPage.createSaveMetadataButton().click().then(function () {

              // this will bring up the popup with the confirmation message
              metadataPage.isReady(metadataPage.createToastyConfirmationPopup()).then(function () {

                metadataPage.isReady(metadataPage.toastyMessageText()).then(function () {

                  metadataPage.toastyMessageText().getText().then(function (value) {
                    expect(value.indexOf(metadataPage.createMetadataMessage()) !== -1).toBe(true);

                    browser.getCurrentUrl().then(function (value) {
                      sampleMetadataUrl = value;


                    });
                  });
                });
              });
            });
          });
        });
      });
    });

  xdescribe('with sample template', function () {


    it("should open metadata editor", function () {

      workspacePage.openTemplate(sampleTitle).then(function () {
        metadataPage.isReady(metadataPage.createPageName()).then(function () {
          expect(metadataPage.isMetadata()).toBe(true);
        });
      });
    });

    it("should show metadata editor header, back arrow, title, and json preview", function () {

      browser.get(sampleMetadataUrl).then(function () {
        metadataPage.isReady(metadataPage.createPageName()).then(function () {

          // should have top nav basics displayed
          expect(metadataPage.topNavigation().isDisplayed()).toBe(true);
          expect(metadataPage.topNavBackArrow().isDisplayed()).toBe(true);
          expect(metadataPage.documentTitle().isDisplayed()).toBe(true);
          expect(metadataPage.templateJson().isDisplayed()).toBe(true);
          expect(metadataPage.metadataJson().isDisplayed()).toBe(true);

        });
      });
    });

    it("should have the correct document title", function () {

      browser.get(sampleMetadataUrl).then(function () {
        metadataPage.isReady(metadataPage.createPageName()).then(function () {

          // and the right document
          metadataPage.isReady(metadataPage.documentTitle()).then(function () {
            metadataPage.documentTitle().getText().then(function (text) {
              var result = text.indexOf(sampleTitle) !== -1;
              expect(result).toBe(true);
            });
          });
        });
      });
    });

    it("should have the correct page title", function () {

      browser.get(sampleMetadataUrl).then(function () {
        metadataPage.isReady(metadataPage.createPageName()).then(function () {

          // and the right page title
          metadataPage.isReady(metadataPage.pageTitle()).then(function () {
            metadataPage.pageTitle().getText().then(function (text) {
              expect(metadataPage.metadataPageTitle() === text).toBe(true);
            });
          });
        });
      });
    });

  });

  })
  (j);
}

    it("should delete template from the workspace, ", function () {
      workspacePage.deleteResource(sampleTitle, workspacePage.templateType());
    });



  it("should delete metadata from the workspace, ", function () {
    workspacePage.deleteResource(sampleTitle, workspacePage.metadataType());
  });


});

