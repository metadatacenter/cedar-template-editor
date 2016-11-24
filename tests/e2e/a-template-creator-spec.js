'use strict';
var TemplatePage = require('../pages/template-creator-page.js');
var WorkspacePage = require('../pages/workspace-page.js');
var ToastyPage = require('../pages/toasty-page.js');


var _ = require('../libs/lodash.min.js');


describe('template-creator', function () {
  var EC = protractor.ExpectedConditions;
  var page;
  var workspacePage;
  var toastyPage;

  //var fieldType = fieldTypes[0];
  var cleanJson;
  var dirtyJson;
  var sampleTitle;
  var sampleTemplateUrl;
  var sampleTemplateJson;
  var fieldTypes = [
    {
      "cedarType"         : "textfield",
      "iconClass"         : "cedar-svg-text",
      "label"             : "Text",
      "allowedInElement"  : true,
      "primaryField"      : true,
      "hasControlledTerms": true,
      "staticField"       : false
    },
    {
      "cedarType"         : "textarea",
      "iconClass"         : "cedar-svg-paragraph",
      "label"             : "Paragraph",
      "allowedInElement"  : true,
      "primaryField"      : true,
      "hasControlledTerms": false,
      "staticField"       : false
    },
    {
      "cedarType"         : "radio",
      "iconClass"         : "cedar-svg-multiple-choice",
      "label"             : "Multiple Choice",
      "allowedInElement"  : true,
      "primaryField"      : true,
      "hasControlledTerms": true,
      "staticField"       : false
    },
    {
      "cedarType"         : "checkbox",
      "iconClass"         : "cedar-svg-checkbox",
      "label"             : "Checkbox",
      "allowedInElement"  : true,
      "primaryField"      : true,
      "hasControlledTerms": true,
      "staticField"       : false
    },
    {
      "cedarType"         : "date",
      "iconClass"         : "cedar-svg-calendar",
      "label"             : "Date",
      "allowedInElement"  : true,
      "primaryField"      : false,
      "hasControlledTerms": false,
      "staticField"       : false
    },
    {
      "cedarType"         : "email",
      "iconClass"         : "cedar-svg-at",
      "label"             : "Email",
      "allowedInElement"  : true,
      "primaryField"      : false,
      "hasControlledTerms": false,
      "staticField"       : false
    },
    {
      "cedarType"         : "list",
      "iconClass"         : "cedar-svg-list",
      "allowedInElement"  : true,
      "primaryField"      : false,
      "label"             : "List",
      "hasControlledTerms": true,
      "staticField"       : false
    },
    {
      "cedarType"         : "numeric",
      "iconClass"         : "cedar-svg-numeric",
      "allowedInElement"  : true,
      "primaryField"      : false,
      "label"             : "Number",
      "hasControlledTerms": false,
      "staticField"       : false
    },
    {
      "cedarType"         : "phone-number",
      "iconClass"         : "cedar-svg-phone",
      "allowedInElement"  : true,
      "label"             : "Phone Number",
      "primaryField"      : false,
      "hasControlledTerms": false,
      "staticField"       : false
    },
    {
      "cedarType"         : "section-break",
      "iconClass"         : "cedar-svg-section-break",
      "allowedInElement"  : true,
      "label"             : "Section Break",
      "hasControlledTerms": false,
      "primaryField"      : false,
      "staticField"       : true
    },
    {
      "cedarType"         : "richtext",
      "iconClass"         : "cedar-svg-rich-text",
      "allowedInElement"  : true,
      "label"             : "Rich Text",
      "hasControlledTerms": false,
      "primaryField"      : false,
      "staticField"       : true
    },
    {
      "cedarType"         : "image",
      "iconClass"         : "cedar-svg-image",
      "allowedInElement"  : true,
      "label"             : "Image",
      "hasControlledTerms": false,
      "primaryField"      : false,
      "staticField"       : true
    },
    {
      "cedarType"         : "youtube",
      "iconClass"         : "cedar-svg-youtube",
      "allowedInElement"  : true,
      "label"             : "YouTube Video",
      "primaryField"      : false,
      "hasControlledTerms": false,
      "staticField"       : true
    }
  ];


  // before each test, load a new page and create a template
  // maximize the window area for clicking
  beforeEach(function () {

    workspacePage = WorkspacePage;
    page = TemplatePage;
    toastyPage = ToastyPage;
    browser.driver.manage().window().maximize();
    workspacePage.get();
    browser.wait(EC.presenceOf(element(by.css('.navbar.dashboard'))));
    browser.ignoreSynchronization = null;

  });

  afterEach(function () {

    browser.ignoreSynchronization = true;

  });


  for (var j = 0; j < 1; j++) {
    (function () {

      sampleTitle = null;
      sampleTemplateUrl = null;
      sampleTemplateJson = null;

      // create the sample template
      it("should create the sample template", function () {

        sampleTitle = "template" + page.getRandomInt(1, 9999999999);

        page.createTemplateNew();
        page.setTemplateTitleNew(sampleTitle);

        browser.wait(EC.presenceOf(page.createSaveTemplateButton()));
        browser.wait(EC.presenceOf(element(by.model('form._ui.title'))));
        browser.wait(EC.presenceOf(element(by.model('form._ui.description'))));
        page.createSaveTemplateButton().click();

        toastyPage.isToastyNew();

        // get the url of this element
        browser.getCurrentUrl().then(function (value) {
          sampleTemplateUrl = value;
          // TODO: can't reliable load from url later using browser.get(sampleTemplateUrl)
        });

      });

      for (var k = 0; k < fieldTypes.length; k++) {
        (function (fieldType) {

          it("should add and delete a " + fieldType.cedarType, function () {

            var field = element(by.css('.field-root .' + fieldType.iconClass));
            var type = fieldType.cedarType;
            var isMore = !fieldType.primaryField;
            var title = fieldType.label;
            var description = fieldType.label + ' description';

            page.createTemplateNew();
            browser.wait(EC.presenceOf(page.createSaveTemplateButton()));

            // create the field
            page.addFieldNew(type, isMore, title, description);
            browser.wait(EC.presenceOf(field));

            // delete the field
            browser.actions().mouseMove(field).perform();
            browser.wait(EC.elementToBeClickable(page.removeFieldButton()));
            page.removeFieldButton().click();
            browser.wait(EC.not(EC.presenceOf(field)));

          });

          it("should select and deselect a " + fieldType.cedarType, function () {

            var firstField;
            var lastField;

            var field = element(by.css('.field-root .' + fieldType.iconClass));
            var type = fieldType.cedarType;
            var isMore = !fieldType.primaryField;
            var title = fieldType.label;
            var description = fieldType.label + ' description';

            page.createTemplateNew();
            browser.wait(EC.presenceOf(page.createSaveTemplateButton()));

            // add two fields
            page.addFieldNew(fieldType.cedarType, isMore, title, description);
            page.addFieldNew(fieldType.cedarType, isMore, title, description);

            // do we have two fields
            var fields = element.all(by.css(page.cssFieldRoot));
            expect(fields.count()).toBe(2);

            firstField = fields.first();
            lastField = fields.last();

            // do we have each field
            expect(firstField.isPresent()).toBe(true);
            expect(lastField.isPresent()).toBe(true);

            // is the second field selected and not the first
            expect(lastField.element(by.model(page.modelFieldTitle)).isPresent()).toBe(true);
            expect(firstField.element(by.model(page.modelFieldTitle)).isPresent()).toBe(false);

            // click on the first field
            browser.actions().mouseMove(firstField).perform();
            browser.wait(EC.elementToBeClickable(firstField));
            firstField.click();

            // is the first selected and the second deselected
            expect(firstField.element(by.model(page.modelFieldTitle)).isPresent()).toBe(true);
            expect(lastField.element(by.model(page.modelFieldTitle)).isPresent()).toBe(false);

          });

        })
        (fieldTypes[k]);
      }

      it("should hang on to the sample template json", function () {

        page.createTemplateNew();
        browser.wait(EC.presenceOf(page.createSaveTemplateButton()));

        browser.wait(EC.elementToBeClickable(page.showJsonLink()));
        page.showJsonLink().click();

        browser.wait(EC.visibilityOf(page.showJsonLink()));
        expect(page.templateJSON().isDisplayed()).toBe(true);

        // get the dirty template
        browser.wait(EC.visibilityOf(page.jsonPreview()));

        page.jsonPreview().getText().then(function (value) {
          sampleTemplateJson = JSON.parse(value);
        });

      });

      //
      //// Verify that Clear button is present and active, expect clear to clear the element
      //xit("should should restore the template when clear is clicked and confirmed", function () {
      //
      //  page.isReady(page.createPageName()).then(function () {
      //    browser.get(sampleTemplateUrl).then(function () {
      //      page.isReady(page.createTemplatePage()).then(function () {
      //
      //        page.addField(fieldType.cedarType);
      //        page.addField(fieldType.cedarType);
      //
      //
      //        page.isReady(page.createClearTemplateButton()).then(function () {
      //          page.createClearTemplateButton().click();
      //
      //          page.isReady(page.createConfirmationDialog()).then(function () {
      //
      //            expect(page.createConfirmationDialog().getAttribute(page.sweetAlertCancelAttribute())).toBe('true');
      //            expect(page.createConfirmationDialog().getAttribute(page.sweetAlertConfirmAttribute())).toBe('true');
      //
      //            // expect confirm to clear the template,
      //            page.isReady(page.createSweetAlertConfirmButton()).then(function () {
      //              page.createSweetAlertConfirmButton().click().then(function () {
      //
      //
      //                page.isReady(page.showJsonLink()).then(function () {
      //                  browser.wait(EC.elementToBeClickable(page.showJsonLink())).then(function () {
      //                    page.showJsonLink().click().then(function () {
      //
      //                      page.isReady(page.templateJSON()).then(function () {
      //                        expect(page.templateJSON().isDisplayed()).toBe(true);
      //
      //                        // get the dirty template
      //                        page.jsonPreview().getText().then(function (value) {
      //
      //                          var currentJson = JSON.parse(value);
      //                          // TODO this one fails and needs to be fixed in code
      //                          //expect(_.isEqual(currentJson, sampleElementJson)).toBe(true);
      //                        });
      //                      });
      //                    });
      //                  });
      //                });
      //              });
      //            });
      //          });
      //        });
      //      });
      //    });
      //  });
      //});
      //
      //// Verify that JSON preview button shows template JSON; verify that this JSON is same as underlying JSON, Verify that clicking in JSON preview button hides visible JSON preview area
      //xit("should show and hide the JSON preview ", function () {
      //
      //  page.createTemplate().then(function () {
      //
      //    page.isReady(page.templateJSONHidden()).then(function () {
      //
      //      page.isReady(page.showJsonLink()).then(function () {
      //        browser.wait(EC.elementToBeClickable(page.showJsonLink())).then(function () {
      //          page.showJsonLink().click().then(function () {
      //
      //            page.isReady(page.templateJSON()).then(function () {
      //              expect(page.templateJSON().isDisplayed()).toBe(true);
      //
      //              page.showJsonLink().click().then(function () {
      //                page.isReady(page.templateJSONHidden()).then(function () {
      //                });
      //              });
      //            });
      //          });
      //        });
      //      });
      //    });
      //  });
      //});
      //
      //// set the clean json
      //xit("should see the json preview", function () {
      //
      //  page.createTemplate().then(function () {
      //    expect(page.templateJSON().isDisplayed()).toBe(false);
      //
      //    page.isReady(page.showJsonLink()).then(function () {
      //      browser.wait(EC.elementToBeClickable(page.showJsonLink())).then(function () {
      //        page.showJsonLink().click().then(function () {
      //
      //          page.isReady(page.jsonPreview()).then(function () {
      //
      //            page.jsonPreview().getText().then(function (value) {
      //
      //              // hang on to this json for use later
      //              cleanJson = JSON.parse(value);
      //
      //              expect(_.isEqual(cleanJson, page.emptyTemplateJson)).toBe(true);
      //            });
      //          });
      //        });
      //      });
      //    });
      //  });
      //});
      //
      //// should get the clean json
      //xit("should have valid json for a clean element", function () {
      //
      //  page.createTemplate().then(function () {
      //
      //    page.addField(fieldType.cedarType);
      //    page.addField(fieldType.cedarType);
      //
      //    page.isReady(page.showJsonLink()).then(function () {
      //      browser.wait(EC.elementToBeClickable(page.showJsonLink())).then(function () {
      //        page.showJsonLink().click().then(function () {
      //
      //          page.isReady(page.jsonPreview()).then(function () {
      //
      //
      //            // get the dirty template
      //            page.jsonPreview().getText().then(function (value) {
      //
      //              dirtyJson = JSON.parse(value);
      //              expect(_.isEqual(page.emptyTemplateJson, dirtyJson)).toBe(false);
      //
      //            });
      //          });
      //        });
      //      });
      //    });
      //  });
      //});
      //
      //// Verify that Clear button is present for dirty template
      //xit("should have clear displayed if template is dirty", function () {
      //
      //  page.createTemplate().then(function () {
      //
      //    page.addField(fieldType.cedarType);
      //    page.addField(fieldType.cedarType);
      //
      //    page.isReady(page.createClearTemplateButton()).then(function () {
      //      expect(page.createClearTemplateButton().isDisplayed()).toBe(true);
      //    });
      //  });
      //});
      //
      //// Verify that Clear button is present and active, expect clear to clear the element
      //xit("should change the json preview text when the element changes", function () {
      //
      //  page.createTemplate().then(function () {
      //
      //    page.addField(fieldType.cedarType);
      //    page.addField(fieldType.cedarType);
      //
      //    page.isReady(page.showJsonLink()).then(function () {
      //      browser.wait(EC.elementToBeClickable(page.showJsonLink())).then(function () {
      //        page.showJsonLink().click().then(function () {
      //
      //          page.isReady(page.jsonPreview()).then(function () {
      //
      //            // get the dirty template
      //            page.jsonPreview().getText().then(function (value) {
      //
      //              dirtyJson = JSON.parse(value);
      //              expect(_.isEqual(page.emptyTemplateJson, dirtyJson)).toBe(false);
      //
      //            });
      //          });
      //        });
      //      });
      //    });
      //  });
      //});
      //
      //// github issue #403:  Verify that the header is present and displays back button, name, description, title, JSON preview
      //xit("should be on the workspace page", function () {
      //
      //  page.isReady(page.createPageName()).then(function () {
      //    expect(page.isDashboard());
      //  });
      //});
      //
      //// Verify that the header is present and displays back button, name, description, title, JSON preview
      //xit("should show element editor header, title, description, and json preview", function () {
      //
      //  page.createTemplate().then(function () {
      //    page.isReady(page.topNavigation()).then(function () {
      //      expect(page.hasClass(page.topNavigation(), page.templateType())).toBe(true);
      //    });
      //  });
      //
      //});
      //
      //// github issue #403:  Verify that the header is present and displays back button, name, description, title, JSON preview
      //xit("should have editable title", function () {
      //
      //  page.createTemplate().then(function () {
      //    page.setTemplateTitle('whatever title').then(function () {
      //      page.templateTitle().getAttribute('value').then(function (value) {
      //        expect(_.isEqual(value, 'whatever title')).toBe(true);
      //      });
      //    });
      //  });
      //});
      //
      //// github issue #403:  Verify that the header is present and displays back button, name, description, title, JSON preview
      //xit("should have editable description", function () {
      //
      //  page.createTemplate().then(function () {
      //    page.setTemplateDescription('whatever description').then(function () {
      //      page.templateDescription().getAttribute('value').then(function (value) {
      //        expect(_.isEqual(value, 'whatever description')).toBe(true);
      //      });
      //    });
      //  });
      //});
      //
      //// github issue #404 Part 3 of 4:  Verify that Cancel button is present and active,
      //xit("should have Cancel button present and active", function () {
      //
      //  page.createTemplate().then(function () {
      //
      //    // make the template dirty
      //    page.addField(fieldTypes[0].cedarType).then(function () {
      //      page.addField(fieldTypes[0].cedarType).then(function () {
      //
      //        // clicking the cancel should cancel edits
      //        page.clickCancel(page.createCancelTemplateButton()).then(function () {
      //
      //          // and take us back to the workspace
      //          page.isReady(workspacePage.createPageName()).then(function () {
      //            expect(workspacePage.isDashboard()).toBe(true);
      //          });
      //        });
      //      });
      //    });
      //  });
      //});
      //
      //// github issue #403:  Verify that the header is present and displays back button, name, description, title, JSON preview
      //xit("should show element  header, title, description, and json preview", function () {
      //
      //  page.createTemplate().then(function () {
      //    // should have top nav basics
      //    page.isReady(page.topNavigation()).then(function () {
      //      page.isReady(page.topNavBackArrow()).then(function () {
      //        page.isReady(page.showJsonLink()).then(function () {
      //          expect(page.showJsonLink().isDisplayed()).toBe(true);
      //        });
      //      });
      //    });
      //  });
      //});
      //
      //// Verify that Clear button is present and active, expect clear to clear the element
      //xit("should not have clear displayed if template is clean", function () {
      //
      //  page.isReady(page.createPageName()).then(function () {
      //    browser.get(sampleTemplateUrl).then(function () {
      //      page.isReady(page.createTemplatePage()).then(function () {
      //
      //        // TODO these fail
      //        //  expect(page.createClearTemplateButton().isPresent()).toBe(true);
      //        //  expect(page.createClearTemplateButton().isDisplayed()).toBe(false);
      //      });
      //    });
      //  });
      //});
      //
      //// click backarrow and go back to dashboard
      //xit("should go to dashboard when back arrow clicked", function () {
      //
      //  page.createTemplate().then(function () {
      //    page.isReady(page.topNavBackArrow()).then(function () {
      //      page.topNavBackArrow().click();
      //      page.isReady(workspacePage.createPageName()).then(function () {
      //        expect(workspacePage.isDashboard()).toBe(true);
      //      });
      //    });
      //  });
      //
      //});
      //
      //// Verify that Clear button is present and active, expect cancelling the clear to not modify the template
      //xit("should not change the element when cleared and cancelled", function () {
      //
      //  page.createTemplate().then(function () {
      //
      //    page.addField(fieldType.cedarType).then(function () {
      //      page.addField(fieldType.cedarType).then(function () {
      //
      //        page.isReady(page.showJsonLink()).then(function () {
      //          browser.wait(EC.elementToBeClickable(page.showJsonLink())).then(function () {
      //            page.showJsonLink().click().then(function () {
      //
      //              page.isReady(page.jsonPreview()).then(function () {
      //
      //                // get the dirty template
      //                page.jsonPreview().getText().then(function (value) {
      //                  var beforeJson = JSON.parse(value);
      //
      //
      //                  page.isReady(page.createClearTemplateButton()).then(function () {
      //                    page.createClearTemplateButton().click().then(function () {
      //
      //                      page.isReady(page.createConfirmationDialog()).then(function () {
      //
      //                        expect(page.createConfirmationDialog().getAttribute(page.sweetAlertCancelAttribute())).toBe('true');
      //                        expect(page.createConfirmationDialog().getAttribute(page.sweetAlertConfirmAttribute())).toBe('true');
      //
      //                        // expect confirm to clear the template,
      //                        page.isReady(page.createSweetAlertCancelButton()).then(function () {
      //                          page.createSweetAlertCancelButton().click().then(function () {
      //
      //                            page.isReady(page.jsonPreview()).then(function () {
      //
      //                              page.jsonPreview().getText().then(function (value) {
      //                                var afterJson = JSON.parse(value);
      //                                expect(_.isEqual(beforeJson, afterJson)).toBe(true);
      //                              });
      //                            });
      //                          });
      //                        });
      //                      });
      //                    });
      //                  });
      //                });
      //              });
      //            });
      //          });
      //        });
      //      });
      //    });
      //  });
      //});
      //
      //
      //// github issue #404 Part 4 of 4:  Verify that save button is present and active,
      //xit("should have save button present", function () {
      //
      //  page.createTemplate().then(function () {
      //    page.isReady(page.createSaveTemplateButton()).then(function () {
      //    });
      //  });
      //});
      //
      //
      //
      //xit("Should not set maxItems if maxItems is N", function () {
      //  element(by.css("#element-name")).sendKeys("1 - N text field");
      //  element(by.css("#element-description")).sendKeys("Text field was created via Selenium");
      //  page.addTextField.then(function () {
      //    element(by.css(".checkbox-cardinality input[type='checkbox']")).click().then(function () {
      //      element(by.css("#cardinality-options .max-items-option .filter-option")).click().then(function () {
      //        element(by.css("#cardinality-options .max-items-option .dropdown-menu li:nth-child(9) a")).click().then(function () {
      //          element(by.css("#cardinality-options .max-items-option .filter-option")).getText().then(function (text) {
      //            expect(text).toBe("N")
      //          });
      //        });
      //      });
      //      element(by.css("#form-item-config-section .field-title-definition")).sendKeys("Text field title");
      //      element(by.css("#form-item-config-section .field-description-definition")).sendKeys("Simple text field created via Selenium");
      //      browser.waitForAngular().then(function () {
      //        element(by.css(".save-options .add")).click().then(function () {
      //          element.all(by.css("form.form-preview input[type='text']")).then(function (items) {
      //            expect(items.length).toBe(1);
      //          });
      //          expect(element(by.css(".more-input-buttons .add")).isPresent()).toBe(true);
      //          element(by.css(".clear-save .btn-save")).click().then(function () {
      //            browser.waitForAngular().then(function () {
      //              page.getJsonPreviewText.then(function (value) {
      //                var json = JSON.parse(value);
      //                expect(json.properties.textFieldTitle && json.properties.textFieldTitle.minItems == 1).toBe(true);
      //                expect(json.properties.textFieldTitle && json.properties.textFieldTitle.maxItems == undefined).toBe(true);
      //              });
      //            });
      //          });
      //        });
      //      });
      //    });
      //  });
      //});
      //
      //
      //xit("Should not set minItems & maxItems if cardinality is 1 - 1", function () {
      //  element(by.css("#element-name")).sendKeys("1 - 1 text field");
      //  element(by.css("#element-description")).sendKeys("Text field was created via Selenium");
      //  page.addTextField.then(function () {
      //    element(by.css(".checkbox-cardinality input[type='checkbox']")).click().then(function () {
      //      element(by.css("#cardinality-options .min-items-option .filter-option")).getText().then(function (text) {
      //        expect(text).toBe("1");
      //      });
      //      element(by.css("#cardinality-options .max-items-option .filter-option")).getText().then(function (text) {
      //        expect(text).toBe("1")
      //      });
      //      element(by.css("#form-item-config-section .field-title-definition")).sendKeys("Text field title");
      //      element(by.css("#form-item-config-section .field-description-definition")).sendKeys("Simple text field created via Selenium");
      //      browser.waitForAngular().then(function () {
      //        element(by.css(".save-options .add")).click().then(function () {
      //          element.all(by.css("form.form-preview input[type='text']")).then(function (items) {
      //            expect(items.length).toBe(1);
      //          });
      //          expect(element(by.css(".more-input-buttons .add")).isPresent()).toBe(false);
      //          element(by.css(".clear-save .btn-save")).click().then(function () {
      //            browser.waitForAngular().then(function () {
      //              page.getJsonPreviewText.then(function (value) {
      //                var json = JSON.parse(value);
      //                expect(json.properties.textFieldTitle && json.properties.textFieldTitle.minItems == undefined).toBe(true);
      //                expect(json.properties.textFieldTitle && json.properties.textFieldTitle.maxItems == undefined).toBe(true);
      //              });
      //            });
      //          });
      //        });
      //      });
      //    });
      //  });
      //
      //
      //});


      it("should delete the sample template from the workspace, ", function () {
        workspacePage.deleteResourceNew(sampleTitle, 'template');
      });

    })
    (j);
  }
})
; 
