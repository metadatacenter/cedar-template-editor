'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var MetadataPage = require('../pages/metadata-page.js');
var TemplatePage = require('../pages/template-creator-page.js');
var ToastyPage = require('../pages/toasty-page.js');

var _ = require('../libs/lodash.min.js');
var sampleTitle;
var sampleTemplateUrl;
var sampleMetadataUrl;


xdescribe('metadata-creator', function () {
  var EC = protractor.ExpectedConditions;
  var metadataPage;
  var workspacePage;
  var templatePage;
  var toastyPage;


  // before each test, load a new page and create a template
  // maximize the window area for clicking
  beforeEach(function () {
    browser.ignoreSynchronization = false;
    workspacePage = WorkspacePage;
    metadataPage = MetadataPage;
    templatePage = TemplatePage;
    toastyPage = ToastyPage;
    browser.driver.manage().window().maximize();
    workspacePage.get();
    expect(workspacePage.createPageName().isPresent()).toBe(true);
    expect(workspacePage.createPageName().isDisplayed()).toBe(true);
  });

  for (var j = 0; j < 1; j++) {
    (function () {


          // create the sample template
          it("should create the sample template", function () {

            sampleTitle = "template" + templatePage.getRandomInt(1, 9999999999);
            sampleTemplateUrl = null;

            templatePage.createTemplateNew();
            templatePage.setTemplateTitleNew(sampleTitle);
            templatePage.createSaveTemplateButton().click();

            toastyPage.isToastyNew();

            // get the url of this element
            browser.getCurrentUrl().then(function (t) {
              sampleTemplateUrl = t;
              console.log('sampleTemplateUrl ' + sampleTemplateUrl);
            });

          });


          it("should open the sample template", function () {
            browser.get(sampleTemplateUrl);
            expect(templatePage.createPageName().isPresent()).toBe(true);
            expect(templatePage.createPageName().isDisplayed()).toBe(true);
          });

          it("should create metadata from the template", function () {

            sampleMetadataUrl = null;

            workspacePage.doubleClickNameNew(sampleTitle, 'template');
            metadataPage.createSaveMetadataButton().click();

            // this will bring up the popup with the confirmation message
            toastyPage.isToastyNew();

            browser.getCurrentUrl().then(function (t) {
              sampleMetadataUrl = t;
              console.log('sampleMetadataUrl ' + sampleMetadataUrl);

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
                        expect(result).toBe(true);
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


                // and the right document
                metadataPage.isReady(metadataPage.documentTitle()).then(function () {
                  metadataPage.documentTitle().getText().then(function (text) {
                    console.log('documentTitle ' + text);
                    var result = text.indexOf(sampleTitle) !== -1;
                    expect(result).toBe(true);

                  });
                });
              });
            });

          });

          xit("should delete metadata from the workspace, ", function () {

            if (sampleMetadataUrl) {
              //workspacePage.deleteResourceNew(sampleTitle, workspacePage.metadataType());

              createSearchNavInput.sendKeys(name + protractor.Key.ENTER);


              var createFirst = element.all(by.css(createFirstCss + type)).first();

              createFirst.click();

              createTrashButton.click();

              expect(createConfirmationDialog.getAttribute(sweetAlertCancelAttribute)).toBe('true');
              expect(createConfirmationDialog.getAttribute(sweetAlertConfirmAttribute)).toBe('true');

              createSweetAlertConfirmButton.click();

              createToastyMessageText.getText().then(function (value) {
               console.log('createToastyMessageText');
                console.log(value);

                var result = value.indexOf(toastyMessage + name + toastyMessageDeleted) !== -1;
                console.log('result');
                console.log(result);
              });
            }

          });


          it("should delete template from the workspace, ", function () {

            if (sampleTemplateUrl) {
              workspacePage.deleteResourceNew(sampleTitle, workspacePage.templateType());
            }

          });


        })
    (j);
  }

  //  delete some extra documents
  for (var j = 0; j < 0; j++) {
    (function () {


      it("should delete template from the workspace, ", function () {
        workspacePage.deleteResourceNew('*', workspacePage.templateType());

      });

      xit("should delete metadata from the workspace, ", function () {
        workspacePage.deleteResourceNew('*', workspacePage.metadataType());
      });

    })
    (j);
  }


});

