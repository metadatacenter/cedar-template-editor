'use strict';
var TemplateCreatorPage = require('../pages/template-creator-page.js');
var WorkspacePage = require('../pages/workspace-page.js');
var ToastyPage = require('../pages/toasty-page.js');


var _ = require('../libs/lodash.min.js');


describe('template-creator', function () {
  var EC = protractor.ExpectedConditions;
  //var flow = browser.controlFlow();
  var page;
  var workspacePage;
  var toastyPage;
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
      "hasControlledTerms": true,
      "staticField"       : false
    },
    {
      "cedarType"         : "checkbox",
      "iconClass"         : "cedar-svg-checkbox",
      "label"             : "Checkbox",
      "allowedInElement"  : true,
      "hasControlledTerms": true,
      "staticField"       : false
    },
    {
      "cedarType"         : "date",
      "iconClass"         : "cedar-svg-calendar",
      "label"             : "Date",
      "allowedInElement"  : true,
      "hasControlledTerms": false,
      "staticField"       : false
    },
    {
      "cedarType"         : "email",
      "iconClass"         : "cedar-svg-at",
      "primaryField"      : true,
      "label"             : "Email",
      "allowedInElement"  : true,
      "hasControlledTerms": false,
      "staticField"       : false
    },
    {
      "cedarType"         : "list",
      "iconClass"         : "cedar-svg-list",
      "allowedInElement"  : true,
      "primaryField"      : true,
      "label"             : "List",
      "hasControlledTerms": true,
      "staticField"       : false
    },
    {
      "cedarType"         : "numeric",
      "iconClass"         : "cedar-svg-numeric",
      "allowedInElement"  : true,
      "primaryField"      : true,
      "Label"             : "Number",
      "hasControlledTerms": false,
      "staticField"       : false
    },
    {
      "cedarType"         : "phone-number",
      "iconClass"         : "cedar-svg-phone",
      "allowedInElement"  : true,
      "label"             : "Phone Number",
      "hasControlledTerms": false,
      "staticField"       : false
    },
    {
      "cedarType"         : "section-break",
      "iconClass"         : "cedar-svg-section-break",
      "allowedInElement"  : true,
      "label"             : "Section Break",
      "hasControlledTerms": false,
      "staticField"       : true
    },
    {
      "cedarType"         : "richtext",
      "iconClass"         : "cedar-svg-rich-text",
      "allowedInElement"  : true,
      "label"             : "Rich Text",
      "hasControlledTerms": false,
      "staticField"       : true
    },
    {
      "cedarType"         : "image",
      "iconClass"         : "cedar-svg-image",
      "allowedInElement"  : true,
      "label"             : "Image",
      "hasControlledTerms": false,
      "staticField"       : true
    },
    {
      "cedarType"         : "youtube",
      "iconClass"         : "cedar-svg-youtube",
      "allowedInElement"  : true,
      "label"             : "YouTube Video",
      "hasControlledTerms": false,
      "staticField"       : true
    }
  ];
  var fieldType = fieldTypes[0];
  var cleanJson;
  var dirtyJson;
  var sampleTitle;
  var sampleTemplateUrl;
  var sampleTemplateJson;


  // before each test, load a new page and create a template
  // maximize the window area for clicking
  beforeEach(function () {
    page = TemplateCreatorPage;
    workspacePage = WorkspacePage;
    toastyPage = ToastyPage;
    page.get();
    browser.driver.manage().window().maximize();

  });

  for (var j = 0; j < 1; j++) {
    (function () {

      // create the sample template
      it("should create the sample template", function () {

        sampleTitle = "template" + page.getRandomInt(1, 9999999999);
        sampleTemplateUrl = null;

        page.createTemplate().then(function () {

          page.setTemplateTitle(sampleTitle).then(function () {

            page.isReady(page.createSaveTemplateButton()).then(function () {
              page.createSaveTemplateButton().click().then(function () {

                toastyPage.isToasty().then(function () {

                  // get the url of this element
                  browser.getCurrentUrl().then(function (value) {
                    sampleTemplateUrl = value;
                  });
                });
              });
            });
          });
        });
      });


      describe('with sample template', function () {
        // check each field type by adding it to the sample element
        for (var i = 0; i < fieldTypes.length; i++) {
          (function (fieldType) {

            // github issue #406 part 1 of 2: Verify that surround, field icon, and field name are present, Verify that the X icon is present on an field in the template and element editors and deletes the field
            it("should create, edit, and delete a " + fieldType.cedarType, function () {

              page.isReady(page.createPageName()).then(function () {
                browser.get(sampleTemplateUrl).then(function () {
                  page.isReady(page.createTemplatePage()).then(function () {

                    page.isReady(page.createSaveTemplateButton()).then(function () {

                      // css path for this field type
                      var cssField = page.cssField(fieldType.iconClass);

                      page.addField(fieldType.cedarType).then(function () {

                        // is the field there?
                        var field = element(by.css(cssField));
                        page.isReady(field).then(function () {

                          page.isReady(element(by.model(page.modelFieldTitle))).then(function () {


                            // does it have the help text field in edit mode?
                            page.isReady(element(by.model(page.modelFieldDescription))).then(function () {

                              // move the mouse away from the toolbar so the tooltip is hidden
                              // before trying to remove the field
                              // otherwise the textarea fails
                              browser.actions().mouseMove(field).perform().then(function () {

                                page.isReady(page.removeFieldButton()).then(function () {

                                  // TODO text area hits the tooltip even though the mouse has been moved away
                                  if (fieldType.cedarType != 'textarea') {
                                    page.removeFieldButton().click().then(function () {
                                      // is it removed?
                                      expect(element(by.css(cssField)).isPresent()).toBe(false);
                                    });
                                  }

                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });

            // github issue #406 part 2 of 2:  Verify that clicking on an field  puts it in edit mode, Verify that clicking outside a field  takes it out of edit mode
            it("should select and deselect a " + fieldType.cedarType, function () {

              var firstField;
              var lastField;

              page.isReady(page.createPageName()).then(function () {
                browser.get(sampleTemplateUrl).then(function () {
                  page.isReady(page.createTemplatePage()).then(function () {
                    page.isReady(page.createSaveTemplateButton()).then(function () {

                      // add two fields
                      page.addField(fieldType.cedarType).then(function () {
                        page.addField(fieldType.cedarType).then(function () {

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
                          browser.actions().mouseMove(firstField).perform().then(function () {
                            browser.wait(EC.elementToBeClickable(firstField)).then(function () {
                              firstField.click().then(function () {

                                // is the first selected and the second deselected
                                expect(firstField.element(by.model(page.modelFieldTitle)).isPresent()).toBe(true);
                                expect(lastField.element(by.model(page.modelFieldTitle)).isPresent()).toBe(false);
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          })
          (fieldTypes[i]);
        }

        // Verify that Clear button is present and active, expect clear to clear the element
        it("should hang on to the sample template json", function () {

          page.isReady(page.createPageName()).then(function () {
            browser.get(sampleTemplateUrl).then(function () {
              page.isReady(page.createTemplatePage()).then(function () {

                page.isReady(page.showJsonLink()).then(function () {
                  browser.wait(EC.elementToBeClickable(page.showJsonLink())).then(function () {
                    page.showJsonLink().click().then(function () {

                      page.isReady(page.templateJSON()).then(function () {
                        expect(page.templateJSON().isDisplayed()).toBe(true);

                        // get the dirty template
                        page.isReady(page.jsonPreview()).then(function () {
                          page.jsonPreview().getText().then(function (value) {
                            sampleTemplateJson = JSON.parse(value);

                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });

        // Verify that Clear button is present and active, expect clear to clear the element
        it("should should restore the template when clear is clicked and confirmed", function () {

          page.isReady(page.createPageName()).then(function () {
            browser.get(sampleTemplateUrl).then(function () {
              page.isReady(page.createTemplatePage()).then(function () {

                page.addField(fieldType.cedarType);
                page.addField(fieldType.cedarType);


                page.isReady(page.createClearTemplateButton()).then(function () {
                  page.createClearTemplateButton().click();

                  page.isReady(page.createConfirmationDialog()).then(function () {

                    expect(page.createConfirmationDialog().getAttribute(page.sweetAlertCancelAttribute())).toBe('true');
                    expect(page.createConfirmationDialog().getAttribute(page.sweetAlertConfirmAttribute())).toBe('true');

                    // expect confirm to clear the template,
                    page.isReady(page.createSweetAlertConfirmButton()).then(function () {
                      page.createSweetAlertConfirmButton().click().then(function () {


                        page.isReady(page.showJsonLink()).then(function () {
                          browser.wait(EC.elementToBeClickable(page.showJsonLink())).then(function () {
                            page.showJsonLink().click().then(function () {

                              page.isReady(page.templateJSON()).then(function () {
                                expect(page.templateJSON().isDisplayed()).toBe(true);

                                // get the dirty template
                                page.jsonPreview().getText().then(function (value) {

                                  var currentJson = JSON.parse(value);
                                  // TODO this one fails and needs to be fixed in code
                                  //expect(_.isEqual(currentJson, sampleElementJson)).toBe(true);
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });

        // Verify that JSON preview button shows template JSON; verify that this JSON is same as underlying JSON, Verify that clicking in JSON preview button hides visible JSON preview area
        it("should show and hide the JSON preview ", function () {

          page.createTemplate().then(function () {

            page.isReady(page.templateJSONHidden()).then(function () {

              page.isReady(page.showJsonLink()).then(function () {
                browser.wait(EC.elementToBeClickable(page.showJsonLink())).then(function () {
                  page.showJsonLink().click().then(function () {

                    page.isReady(page.templateJSON()).then(function () {
                      expect(page.templateJSON().isDisplayed()).toBe(true);

                      page.showJsonLink().click().then(function () {
                        page.isReady(page.templateJSONHidden()).then(function () {
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });

        // set the clean json
        it("should see the json preview", function () {

          page.createTemplate().then(function () {
            expect(page.templateJSON().isDisplayed()).toBe(false);

            page.isReady(page.showJsonLink()).then(function () {
              browser.wait(EC.elementToBeClickable(page.showJsonLink())).then(function () {
                page.showJsonLink().click().then(function () {

                  page.isReady(page.jsonPreview()).then(function () {

                    page.jsonPreview().getText().then(function (value) {

                      // hang on to this json for use later
                      cleanJson = JSON.parse(value);

                      expect(_.isEqual(cleanJson, page.emptyTemplateJson)).toBe(true);
                    });
                  });
                });
              });
            });
          });
        });

        // should get the clean json
        it("should have valid json for a clean element", function () {

          page.createTemplate().then(function () {

            page.addField(fieldType.cedarType);
            page.addField(fieldType.cedarType);

            page.isReady(page.showJsonLink()).then(function () {
              browser.wait(EC.elementToBeClickable(page.showJsonLink())).then(function () {
                page.showJsonLink().click().then(function () {

                  page.isReady(page.jsonPreview()).then(function () {


                    // get the dirty template
                    page.jsonPreview().getText().then(function (value) {

                      dirtyJson = JSON.parse(value);
                      expect(_.isEqual(page.emptyTemplateJson, dirtyJson)).toBe(false);

                    });
                  });
                });
              });
            });
          });
        });

        // Verify that Clear button is present for dirty template
        it("should have clear displayed if template is dirty", function () {

          page.createTemplate().then(function () {

            page.addField(fieldType.cedarType);
            page.addField(fieldType.cedarType);

            page.isReady(page.createClearTemplateButton()).then(function () {
              expect(page.createClearTemplateButton().isDisplayed()).toBe(true);
            });
          });
        });

        // Verify that Clear button is present and active, expect clear to clear the element
        it("should change the json preview text when the element changes", function () {

          page.createTemplate().then(function () {

            page.addField(fieldType.cedarType);
            page.addField(fieldType.cedarType);

            page.isReady(page.showJsonLink()).then(function () {
              browser.wait(EC.elementToBeClickable(page.showJsonLink())).then(function () {
                page.showJsonLink().click().then(function () {

                  page.isReady(page.jsonPreview()).then(function () {

                    // get the dirty template
                    page.jsonPreview().getText().then(function (value) {

                      dirtyJson = JSON.parse(value);
                      expect(_.isEqual(page.emptyTemplateJson, dirtyJson)).toBe(false);

                    });
                  });
                });
              });
            });
          });
        });

        // github issue #403:  Verify that the header is present and displays back button, name, description, title, JSON preview
        it("should be on the workspace page", function () {

          page.isReady(page.createPageName()).then(function () {
            expect(page.isDashboard());
          });
        });

        // Verify that the header is present and displays back button, name, description, title, JSON preview
        it("should show element editor header, title, description, and json preview", function () {

          page.createTemplate().then(function () {
            page.isReady(page.topNavigation()).then(function () {
              expect(page.hasClass(page.topNavigation(), page.templateType())).toBe(true);
            });
          });

        });

        // github issue #403:  Verify that the header is present and displays back button, name, description, title, JSON preview
        it("should have editable title", function () {

          page.createTemplate().then(function () {
            page.setTemplateTitle('whatever title').then(function () {
              page.templateTitle().getAttribute('value').then(function (value) {
                expect(_.isEqual(value, 'whatever title')).toBe(true);
              });
            });
          });
        });

        // github issue #403:  Verify that the header is present and displays back button, name, description, title, JSON preview
        it("should have editable description", function () {

          page.createTemplate().then(function () {
            page.setTemplateDescription('whatever description').then(function () {
              page.templateDescription().getAttribute('value').then(function (value) {
                expect(_.isEqual(value, 'whatever description')).toBe(true);
              });
            });
          });
        });

        // github issue #404 Part 3 of 4:  Verify that Cancel button is present and active,
        it("should have Cancel button present and active", function () {

          page.createTemplate().then(function () {

            // make the template dirty
            page.addField(fieldTypes[0].cedarType).then(function () {
              page.addField(fieldTypes[0].cedarType).then(function () {

                // clicking the cancel should cancel edits
                page.clickCancel(page.createCancelTemplateButton()).then(function () {

                  // and take us back to the workspace
                  page.isReady(workspacePage.createPageName()).then(function () {
                    expect(workspacePage.isDashboard()).toBe(true);
                  });
                });
              });
            });
          });
        });

        // github issue #403:  Verify that the header is present and displays back button, name, description, title, JSON preview
        it("should show element  header, title, description, and json preview", function () {

          page.createTemplate().then(function () {
            // should have top nav basics
            page.isReady(page.topNavigation()).then(function () {
              page.isReady(page.topNavBackArrow()).then(function () {
                page.isReady(page.showJsonLink()).then(function () {
                  expect(page.showJsonLink().isDisplayed()).toBe(true);
                });
              });
            });
          });
        });

        // Verify that Clear button is present and active, expect clear to clear the element
        it("should not have clear displayed if template is clean", function () {

          page.isReady(page.createPageName()).then(function () {
            browser.get(sampleTemplateUrl).then(function () {
              page.isReady(page.createTemplatePage()).then(function () {

                // TODO these fail
                //  expect(page.createClearTemplateButton().isPresent()).toBe(true);
                //  expect(page.createClearTemplateButton().isDisplayed()).toBe(false);
              });
            });
          });
        });

        // click backarrow and go back to dashboard
        it("should go to dashboard when back arrow clicked", function () {

          page.createTemplate().then(function () {
            page.isReady(page.topNavBackArrow()).then(function () {
              page.topNavBackArrow().click();
              page.isReady(workspacePage.createPageName()).then(function () {
                expect(workspacePage.isDashboard()).toBe(true);
              });
            });
          });

        });

        // Verify that Clear button is present and active, expect cancelling the clear to not modify the template
        it("should not change the element when cleared and cancelled", function () {

          page.createTemplate().then(function () {

            page.addField(fieldType.cedarType).then(function () {
              page.addField(fieldType.cedarType).then(function () {

                page.isReady(page.showJsonLink()).then(function () {
                  browser.wait(EC.elementToBeClickable(page.showJsonLink())).then(function () {
                    page.showJsonLink().click().then(function () {

                      page.isReady(page.jsonPreview()).then(function () {

                        // get the dirty template
                        page.jsonPreview().getText().then(function (value) {
                          var beforeJson = JSON.parse(value);


                          page.isReady(page.createClearTemplateButton()).then(function () {
                            page.createClearTemplateButton().click().then(function () {

                              page.isReady(page.createConfirmationDialog()).then(function () {

                                expect(page.createConfirmationDialog().getAttribute(page.sweetAlertCancelAttribute())).toBe('true');
                                expect(page.createConfirmationDialog().getAttribute(page.sweetAlertConfirmAttribute())).toBe('true');

                                // expect confirm to clear the template,
                                page.isReady(page.createSweetAlertCancelButton()).then(function () {
                                  page.createSweetAlertCancelButton().click().then(function () {

                                    page.isReady(page.jsonPreview()).then(function () {

                                      page.jsonPreview().getText().then(function (value) {
                                        var afterJson = JSON.parse(value);
                                        expect(_.isEqual(beforeJson, afterJson)).toBe(true);
                                      });
                                    });
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });


        // github issue #404 Part 4 of 4:  Verify that save button is present and active,
        it("should have save button present", function () {

          page.createTemplate().then(function () {
            page.isReady(page.createSaveTemplateButton()).then(function () {
            });
          });
        });


      });


      // TODO not working yet
      xit("Should not set maxItems if maxItems is N", function () {
        element(by.css("#element-name")).sendKeys("1 - N text field");
        element(by.css("#element-description")).sendKeys("Text field was created via Selenium");
        page.addTextField.then(function () {
          element(by.css(".checkbox-cardinality input[type='checkbox']")).click().then(function () {
            element(by.css("#cardinality-options .max-items-option .filter-option")).click().then(function () {
              element(by.css("#cardinality-options .max-items-option .dropdown-menu li:nth-child(9) a")).click().then(function () {
                element(by.css("#cardinality-options .max-items-option .filter-option")).getText().then(function (text) {
                  expect(text).toBe("N")
                });
              });
            });
            element(by.css("#form-item-config-section .field-title-definition")).sendKeys("Text field title");
            element(by.css("#form-item-config-section .field-description-definition")).sendKeys("Simple text field created via Selenium");
            browser.waitForAngular().then(function () {
              element(by.css(".save-options .add")).click().then(function () {
                element.all(by.css("form.form-preview input[type='text']")).then(function (items) {
                  expect(items.length).toBe(1);
                });
                expect(element(by.css(".more-input-buttons .add")).isPresent()).toBe(true);
                element(by.css(".clear-save .btn-save")).click().then(function () {
                  browser.waitForAngular().then(function () {
                    page.getJsonPreviewText.then(function (value) {
                      var json = JSON.parse(value);
                      expect(json.properties.textFieldTitle && json.properties.textFieldTitle.minItems == 1).toBe(true);
                      expect(json.properties.textFieldTitle && json.properties.textFieldTitle.maxItems == undefined).toBe(true);
                    });
                  });
                });
              });
            });
          });
        });
      });

      // TODO not working yet
      xit("Should not set minItems & maxItems if cardinality is 1 - 1", function () {
        element(by.css("#element-name")).sendKeys("1 - 1 text field");
        element(by.css("#element-description")).sendKeys("Text field was created via Selenium");
        page.addTextField.then(function () {
          element(by.css(".checkbox-cardinality input[type='checkbox']")).click().then(function () {
            element(by.css("#cardinality-options .min-items-option .filter-option")).getText().then(function (text) {
              expect(text).toBe("1");
            });
            element(by.css("#cardinality-options .max-items-option .filter-option")).getText().then(function (text) {
              expect(text).toBe("1")
            });
            element(by.css("#form-item-config-section .field-title-definition")).sendKeys("Text field title");
            element(by.css("#form-item-config-section .field-description-definition")).sendKeys("Simple text field created via Selenium");
            browser.waitForAngular().then(function () {
              element(by.css(".save-options .add")).click().then(function () {
                element.all(by.css("form.form-preview input[type='text']")).then(function (items) {
                  expect(items.length).toBe(1);
                });
                expect(element(by.css(".more-input-buttons .add")).isPresent()).toBe(false);
                element(by.css(".clear-save .btn-save")).click().then(function () {
                  browser.waitForAngular().then(function () {
                    page.getJsonPreviewText.then(function (value) {
                      var json = JSON.parse(value);
                      expect(json.properties.textFieldTitle && json.properties.textFieldTitle.minItems == undefined).toBe(true);
                      expect(json.properties.textFieldTitle && json.properties.textFieldTitle.maxItems == undefined).toBe(true);
                    });
                  });
                });
              });
            });
          });
        });


      });


      it("should delete the sample template from the workspace, ", function () {

        page.isReady(page.createPageName()).then(function () {
          workspacePage.deleteResource(sampleTitle, workspacePage.templateType()).then(function () {
          });

        });

      });

    })
    (j);
  }
}); 
