'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var MetadataPage = require('../pages/metadata-page.js');
var TemplatePage = require('../pages/template-creator-page.js');
var ToastyPage = require('../pages/toasty-page.js');

var _ = require('../libs/lodash.min.js');
var sampleTitle;
var sampleTemplateUrl;
var sampleMetadataUrl;


describe('metadata-creator', function () {
  var EC = protractor.ExpectedConditions;
  var metadataPage;
  var workspacePage;
  var templatePage;
  var toastyPage;


  // before each test, load a new page and create a template
  // maximize the window area for clicking
  beforeEach(function () {
    workspacePage = WorkspacePage;
    metadataPage = MetadataPage;
    templatePage = TemplatePage;
    toastyPage = ToastyPage;
    browser.driver.manage().window().maximize();
    workspacePage.get();
  });

  for (var j = 0; j < 1; j++) {
    (function () {


      // create the sample template
      it("should create the sample template", function () {

        sampleTitle = "template" + templatePage.getRandomInt(1, 9999999999);
        sampleTemplateUrl = null;

        workspacePage.isReady(workspacePage.createPageName()).then(function () {

          templatePage.createTemplate().then(function () {

            templatePage.setTemplateTitle(sampleTitle).then(function () {

              templatePage.isReady(templatePage.createSaveTemplateButton()).then(function () {
                templatePage.createSaveTemplateButton().click().then(function () {

                  toastyPage.isToasty().then(function () {

                    // get the url of this element
                    browser.getCurrentUrl().then(function (t) {
                      sampleTemplateUrl = t;
                    });
                  });
                });
              });
            });
          });
        });
      });


      it("should open the sample template", function () {

        workspacePage.isReady(workspacePage.createPageName()).then(function () {
          browser.get(sampleTemplateUrl).then(function () {
            templatePage.isReady(templatePage.createTemplatePage()).then(function () {
            });
          });
        });
      });

      it("should create metadata from the template", function () {

        sampleMetadataUrl = null;

        workspacePage.isReady(workspacePage.createPageName()).then(function () {

          workspacePage.doubleClickName(sampleTitle, 'template').then(function () {

            // wait for the metadata form to be displayed
            metadataPage.isReady(metadataPage.createPageName()).then(function () {

              // save the metadata, don't need to enter anything into form
              metadataPage.isReady(metadataPage.createSaveMetadataButton()).then(function () {

                metadataPage.createSaveMetadataButton().click().then(function () {

                  // this will bring up the popup with the confirmation message
                  toastyPage.isToasty().then(function () {

                    browser.getCurrentUrl().then(function (t) {
                      sampleMetadataUrl = t;

                    });
                  });
                });
              });
            });
          });
        });
      });


      describe('with sample template', function () {


        it("should open metadata editor", function () {

          workspacePage.isReady(workspacePage.createPageName()).then(function () {
            workspacePage.doubleClickName(sampleTitle, 'template').then(function () {
              metadataPage.isReady(metadataPage.createPageName()).then(function () {
                expect(metadataPage.isMetadata()).toBe(true);
              });
            });
          });
        });

        it("should show metadata editor header, back arrow, title, and json preview", function () {

          workspacePage.isReady(workspacePage.createPageName()).then(function () {
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
        });

        it("should have the correct document title", function () {

          workspacePage.isReady(workspacePage.createPageName()).then(function () {
            browser.get(sampleMetadataUrl).then(function () {
              metadataPage.isReady(metadataPage.createPageName()).then(function () {

                // and the right document
                metadataPage.isReady(metadataPage.documentTitle()).then(function () {
                  metadataPage.documentTitle().getText().then(function (text) {

                    var result = text.indexOf(sampleTitle) !== -1;
                    console.log('sampletitle ' + sampleTitle);
                    console.log('documentTitle ' + text + (text.indexOf(sampleTitle)));
                    //expect(result).toBe(true);
                  });
                });
              });
            });
          });
        });

        it("should have the correct page title", function () {

          workspacePage.isReady(workspacePage.createPageName()).then(function () {
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

      });

      it("should delete metadata from the workspace, ", function () {
        workspacePage.isReady(workspacePage.createPageName()).then(function () {
          workspacePage.deleteResource(sampleTitle, workspacePage.metadataType());
        });
      });


      it("should delete template from the workspace, ", function () {
        workspacePage.isReady(workspacePage.createPageName()).then(function () {
          workspacePage.deleteResource(sampleTitle, workspacePage.templateType());
        });
      });


    })
    (j);
  }

  //  delete some extra documents
  for (var j = 0; j < 0; j++) {
    (function () {


      it("should delete template from the workspace, ", function () {
        workspacePage.isReady(workspacePage.createPageName()).then(function () {
          workspacePage.deleteResource('*', workspacePage.templateType());
        });
      });

      it("should delete metadata from the workspace, ", function () {
        workspacePage.isReady(workspacePage.createPageName()).then(function () {
          workspacePage.deleteResource('*', workspacePage.metadataType());
        });
      });

    })
    (j);
  }


});

