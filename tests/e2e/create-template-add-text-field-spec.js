'use strict';

var CreateTemplatePage = require('../pages/create-template-page.js');
var CreateElementPage = require('../pages/create-element-page.js');
var _ = require('../libs/lodash.min.js')

xdescribe('create-template-add-text-field', function() {

  var page, elementPage;

  beforeEach(function() {
    page = new CreateTemplatePage();
    elementPage = new CreateElementPage();
    page.get();
    browser.driver.manage().window().maximize();
    browser.sleep(1000);
  });

  xit("Should allow to create template with 1 text field only", function() {
    var options = {};
    options.fieldTitle = "Simple text field";

    page.setTemplateTitle("Simple template");
    page.setTemplateDescription("A simple template");
    page.addTextField(options).then(function() {
      page.composeTemplateSaveButton().click().then(function() {
        browser.sleep(1000).then(function() {
          browser.getCurrentUrl().then(function(url) {
            expect(url.indexOf("/templates/edit") > 0).toBe(true);
          });
        });
      });
    });
  });

  xit("Should show errors if create template without title or description", function() {
    var options = {};
    options.fieldTitle = "Simple text field";

    page.addTextField(options).then(function() {
      page.composeTemplateSaveButton().click().then(function() {
        page.errorMessageTexts().then(function(texts) {
          expect(texts.length).toBe(2);
          expect(texts[0].indexOf("Template Name input cannot be left empty.") >= 0).toBe(true);
          expect(texts[1].indexOf("Template Description input cannot be left empty") >= 0).toBe(true);

          page.setTemplateTitle("Template 1");

          page.composeTemplateSaveButton().click().then(function() {
            page.errorMessageTexts().then(function(texts) {
              expect(texts.length).toBe(1);
              expect(texts[0].indexOf("Template Description input cannot be left empty.") >= 0).toBe(true)
            });
          });
        });
      });
    });
  });

  xit("Should show errors if save template without title or description", function() {
    var options = {};
    options.fieldTitle = "Simple text field";

    page.setTemplateTitle("Simple template");
    page.setTemplateDescription("A simple template");
    page.addTextField(options).then(function() {
      page.composeTemplateSaveButton().click().then(function() {
        browser.sleep(1000).then(function() {
          browser.getCurrentUrl().then(function(url) {
            expect(url.indexOf("/templates/edit") > 0).toBe(true);

            page.setTemplateTitle("");
            page.setTemplateDescription("");

            browser.waitForAngular().then(function() {
              page.composeTemplateSaveButton().click().then(function() {
                page.errorMessageTexts().then(function(texts) {
                  expect(texts.length).toBe(2);
                  expect(texts[0].indexOf("Template Name input cannot be left empty.") >= 0).toBe(true);
                  expect(texts[1].indexOf("Template Description input cannot be left empty.") >= 0).toBe(true)
                });
              });
            });
          });
        });
      });
    });
  });

  xit("Should allow to create template with 1 element", function() {
    var options = {};
    options.elementTitle = "Element at " + ((new Date()).getTime());
    elementPage.createElement(options).then(function() {
      page.get().then(function() {
        page.setTemplateTitle("Simple Template")
        page.setTemplateDescription("A Simple template");
        page.composeTemplateAddElement(options.elementTitle).then(function() {
          page.editingElementSaveButton().click().then(function() {
            page.composeTemplateSaveButton().click().then(function() {
              browser.sleep(1000).then(function() {
                browser.getCurrentUrl().then(function(url) {
                  expect(url.indexOf("/templates/edit") >= 0).toBe(true);
                });
              });
            });
          });
        });
      });
    });
  });

  // FIXME: This test fails because added field is not rendered correctly.
  xit("Should allow to add field with cardinality", function() {
    var minItems = 2;
    var maxItems = 4;

    page.setTemplateTitle("Simple template");
    page.setTemplateDescription("Just a simple text field");
    page.addTextInput().then(function() {
      expect(page.renderedFormEditingField().isPresent()).toBe(true);
      expect(page.editingFieldCardinalityCheckbox().isPresent()).toBe(true);

      page.editingFieldCardinalityCheckbox().click().then(function() {
        page.editingFieldCardinalitySelectedMinItemsEl().getText().then(function(text) {
          expect(text).toBe("");
        });

        page.editingFieldCardinalitySelectedMaxItemsEl().getText().then(function(text) {
          expect(text).toBe("");
        });

        page.editingFieldCardinalityMinItemsToggle().click().then(function() {
          page.editingFieldCardinalityMinItemsOptionsAt(minItems + 2).click().then(function() {
            page.editingFieldCardinalitySelectedMinItemsEl().getText().then(function(text) {
              expect(text).toBe("" + minItems);
            });
          });
        });

        page.editingFieldCardinalityMaxItemsToggle().click().then(function() {
          page.editingFieldCardinalityMaxItemsOptionsAt(maxItems + 1).click().then(function() {
            page.editingFieldCardinalitySelectedMaxItemsEl().getText().then(function(text) {
              expect(text).toBe("" + maxItems);
            });
          });
        });

        page.editingFieldTitleInput().sendKeys("Simple text field");
        page.editingFieldDescriptionInput().sendKeys("A simple text field that is added by Selenium");

        browser.waitForAngular().then(function() {
          page.editingFieldAddButton().click().then(function() {
            browser.sleep(1000).then(function() {
              page.renderedFormAllTextFields().then(function(items) {
                expect(items.length).toBe(minItems);
              });
            });
          });
        });
      });
    });
  });

  // FIXME: Title and description is not clear.
  xit("Should allow to clear title, description and added field", function() {
    page.setTemplateTitle("Test element");
    page.setTemplateDescription("Just a simple text field");

    page.addTextField().then(function() {
      expect(page.composeTemplateClearButton().isPresent()).toBe(true);

      browser.waitForAngular().then(function() {
        page.editingFieldAddButton().click().then(function() {
          browser.sleep(1000).then(function() {
            page.renderedFormAllTextFields().then(function(items) {
              expect(items.length).toBe(1);
            });

            page.composeTemplateClearButton().click().then(function() {
              browser.sleep(1000).then(function() {
                expect(page.sweetAlert().isDisplayed()).toBe(true);

                page.sweetAlertConfirmButton().click().then(function() {
                  browser.sleep(1000).then(function() {
                    page.renderedFormAllRenderedFields().then(function(fields) {
                      expect(fields.length).toBe(0);
                    });

                    page.composeTemplateTitleInput().getAttribute("value").then(function(text) {
                      expect(text).toBe("");
                    });

                    page.composeTemplateDescriptionInput().getAttribute("value").then(function(text) {
                      expect(text).toBe("");
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

  xit("Should allow to clear adding field", function() {
    page.setTemplateTitle("Test element");
    page.setTemplateDescription("Just a simple text field");

    page.addTextField().then(function() {
      expect(page.composeTemplateClearButton().isPresent()).toBe(true);
      browser.waitForAngular().then(function() {
        expect(page.renderedFormEditingField().isPresent()).toBe(true);

        page.composeTemplateClearButton().click().then(function() {
          browser.sleep(1000).then(function() {
            page.sweetAlertConfirmButton().click().then(function() {
              browser.sleep(1000).then(function() {
                browser.waitForAngular().then(function() {
                  expect(page.renderedFormEditingField().isPresent()).toBe(false);
                });
              });
            });
          });
        });
      });
    });
  });

  xit("Should allow to mark field as required", function() {
    page.setTemplateTitle("Simple Text Field");
    page.setTemplateDescription("Text field that is required");

    page.addTextInput().then(function() {
      expect(page.editingFieldRequiredCheckbox().isPresent()).toBe(true);

      page.editingFieldTitleInput().sendKeys("Simple text field");
      page.editingFieldDescriptionInput().sendKeys("A simple text field that is added by Selenium");
      page.editingFieldRequiredCheckbox().click().then(function() {
        browser.waitForAngular().then(function() {
          page.editingFieldAddButton().click().then(function() {
            browser.sleep(1000).then(function() {
              page.renderedFormAllRenderedFields().then(function(fields) {
                expect(fields.length).toBe(1);
                expect(fields[0].element(by.css("input.form-control.required")).isPresent()).toBe(true);
              });
            });
          });
        });
      });
    });
  });

  // FIXME: This test fails because added field is not rendered correctly.
  xit("Should allow mark cardinality field as required", function() {
    var options = {};
    options.fieldTitle = "Simple Text Field";
    options.minItems = 2;
    options.maxItems = 3;
    options.dontSaveField = true;

    page.setTemplateTitle("Cardinality Text Field");
    page.setTemplateDescription("Text field that is required and is cardinal");

    page.addTextField(options).then(function() {
      expect(page.editingFieldRequiredCheckbox().isPresent()).toBe(true);

      page.editingFieldRequiredCheckbox().click().then(function() {
        browser.waitForAngular().then(function() {
          page.editingFieldAddButton().click().then(function() {
            browser.sleep(1000).then(function() {
              page.renderedFormAllRenderedFields().then(function(fields) {
                expect(fields.length).toBe(1);
                fields[0].all(by.css("input.form-control.required")).then(function(inputs) {
                  expect(inputs.length).toBe(options.minItems);
                });
              });
            });
          });
        });
      });
    });
  });

  // FIXME: Not sure why maxItems is not set in this test
  xit("Should not set maxItems if maxItems is N", function() {
    page.setTemplateTitle("Template with 1 - N text field");
    page.setTemplateDescription("Template was created via Selenium");

    page.addTextInput().then(function() {
      page.editingFieldCardinalityCheckbox().click().then(function() {
        page.editingFieldCardinalityMaxItemsToggle().click().then(function() {
          browser.sleep(50).then(function() {
            page.editingFieldCardinalityMaxItemsOptionsAt(10).click().then(function() {
              page.editingFieldCardinalitySelectedMaxItemsEl().getText().then(function(text) {
                expect(text).toBe("N");
              });
            });
          });
        });

        page.editingFieldTitleInput().sendKeys("Text field title");
        page.editingFieldDescriptionInput().sendKeys("Simple text field created via Selenium");

        browser.waitForAngular().then(function() {
          page.editingFieldAddButton().click().then(function() {
            browser.sleep(1000).then(function() {
              page.renderedFormAllTextFields().then(function(items) {
                expect(items.length).toBe(1);
              });

              page.composeTemplateSaveButton().click().then(function() {
                browser.sleep(1000).then(function() {
                  page.getJsonPreviewText().then(function(value) {
                    browser.sleep(1000).then(function() {
                      var json = JSON.parse(value);
                      expect(json.properties.textFieldTitle && json.properties.textFieldTitle.minItems).toBe(undefined);
                      expect(json.properties.textFieldTitle && json.properties.textFieldTitle.maxItems).toBe(0);
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

  xit("Should not set minItems & maxItems if cardinality is 1 - 1", function() {
    page.setTemplateTitle("1 - 1 text field");
    page.setTemplateDescription("Text field was created via Selenium");

    page.addTextInput().then(function() {
      page.editingFieldCardinalityCheckbox().click().then(function() {
        page.editingFieldCardinalitySelectedMinItemsEl().getText().then(function(text) {
          expect(text).toBe("");
        });
        page.editingFieldCardinalitySelectedMaxItemsEl().getText().then(function(text) {
          expect(text).toBe("")
        });

        page.editingFieldTitleInput().sendKeys("Text field title");
        page.editingFieldDescriptionInput().sendKeys("Simple text field created via Selenium");

        browser.waitForAngular().then(function() {
          page.editingFieldAddButton().click().then(function() {
            browser.sleep(1000).then(function() {
              page.renderedFormAllTextFields().then(function(items) {
                expect(items.length).toBe(1);
              });
            });
          });
        });

        page.composeTemplateSaveButton().click().then(function() {
          browser.waitForAngular().then(function() {
            page.getJsonPreviewText().then(function(value) {
              var json = JSON.parse(value);
              expect(json.properties.textFieldTitle && json.properties.textFieldTitle.minItems == undefined).toBe(true);
              expect(json.properties.textFieldTitle && json.properties.textFieldTitle.maxItems == undefined).toBe(true);
            });
          });
        });
      });
    });
  });

  xit("Should allow to add more than 1 field", function() {
    page.addTextField().then(function() {
      page.addTextField().then(function() {
        browser.sleep(1000).then(function() {
          page.renderedFormAllRenderedFields().then(function(fields) {
            expect(fields.length).toBe(2);
          });
        });
      });
    });
  });

  // FIXME: This test fails because added field is not rendered correctly.
  xit("Should render added text field like in run time 'mode' but is disabled", function() {
    var fieldTitle = "Text 1";
    var minItems = 2;
    page.addTextField({minItems: minItems, maxItems: 3, fieldTitle: fieldTitle}).then(function() {
      browser.sleep(1000).then(function() {
        page.renderedFormAllRenderedFields().then(function(fields) {
          expect(fields.length).toBe(1);
          for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            field.all(by.css("input[type='text']")).then(function(inputs) {
              expect(inputs.length).toBe(minItems);
              for (var j = 0; j < inputs.length; j++) {
                inputs[j].getAttribute("disabled").then(function(attrVal) {
                  expect(!!attrVal).toBe(true);
                });
              }
            });

            field.all(by.css(".form-group .floating-label")).then(function(labels) {
              expect(labels.length).toBe(2*minItems);
              for (var j = 0; j < labels.length; j++) {
                labels[j].getText().then(function(text) {
                  expect(text).toBe(fieldTitle);
                });
              }
            });

            field.all(by.css(".form-group .input-indicator-icons")).then(function(indicators) {
              expect(indicators.length).toBe(minItems);
            });

            field.all(by.css(".more-input-buttons .add")).then(function(addButtons) {
              expect(addButtons.length > 0).toBe(true);

              for (var j = 0; j < addButtons.length; j++) {
                addButtons[j].getAttribute("disabled").then(function(attrVal) {
                  expect(!!attrVal).toBe(true);
                });
              }
            });
          }
        });
      });
    });
  });

  xit("Should render added text field with additional things specific to 'edit' mode", function() {
    var fieldTitle = "Text 2";
    var minItems = 2;
    page.addTextField({minItems: minItems, maxItems: 3, fieldTitle: fieldTitle}).then(function() {
      browser.sleep(1000).then(function() {
        page.renderedFormAllRenderedFields().then(function(fields) {
          expect(fields.length).toBe(1);
          for (var i = 0; i < fields.length; i++) {
            var field = fields[i];

            field.all(by.css(".sortable-icon")).then(function(icons) {
              expect(icons.length > 0).toBe(true);
            });
            field.all(by.css(".element-preview-actions")).then(function(icons) {
              expect(icons.length > 0).toBe(true);
            });
          }
        });
      });
    });
  });

  xit("Should allow to sort added fields", function() {
    page.addTextField({fieldTitle: "Text 1"}).then(function() {
      page.addTextField({fieldTitle: "Text 2"}).then(function() {
        page.scrollPageToTop().then(function() {
          browser.sleep(1000).then(function() {
            page.renderedFormAllRenderedFields().then(function(fields) {
              var promises = [];
              for (var i = 0; i < fields.length; i++) {
                var field = fields[i];
                promises.push(field.element(by.css(".form-group .floating-label")).getText())
              }

              protractor.promise.all(promises).then(function(texts) {
                var firstField = fields[0].element(by.css(".sortable-icon"));
                // IMPORTANT: Set the correct y value is important, 160, or 200 do not work
                browser.actions().dragAndDrop(firstField, {x: 0, y: 180}).perform().then(function() {
                  browser.sleep(1000).then(function() {
                    page.renderedFormAllRenderedFields().then(function(fields) {
                      promises = [];
                      for (var i = 0; i < fields.length; i++) {
                        var field = fields[i];
                        promises.push(field.element(by.css(".form-group .floating-label")).getText())
                      }

                      protractor.promise.all(promises).then(function(resultTexts) {
                        expect(texts[0] == resultTexts[1]).toBe(true);
                        expect(texts[1] == resultTexts[0]).toBe(true);
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

  // FIXME: This test fails because added field is not rendered correctly.
  xit("Should allow to edit added field", function() {
    var options = {};
    options.minItems = 2;
    options.maxItems = 3;
    options.fieldTitle = "Text 1";
    options.fieldDescription = "This is a short text field";

    var newOptions = {};
    newOptions.minItems = 3;
    newOptions.maxItems = 4;
    newOptions.fieldTitle = "Edited text 1";
    newOptions.fieldDescription = "Edited description of text 1";

    page.addTextField(options).then(function() {
      page.renderedFormAllRenderedFields().then(function(fields) {
        var field = fields[0];
        field.element(by.css(".element-preview-actions .edit")).click().then(function() {
          page.editingFieldTitleInput().getAttribute("value").then(function(text) {
            expect(text).toBe(options.fieldTitle);
          });

          page.editingFieldDescriptionInput().getAttribute("value").then(function(text) {
            expect(text).toBe(options.fieldDescription);
          });

          page.editingFieldCardinalityCheckbox().getAttribute("checked").then(function(attr) {
            expect(!!attr).toBe(true);
          });

          page.editingFieldCardinalitySelectedMinItemsEl().getText().then(function(text) {
            expect(text).toBe("" + options.minItems);
          });

          page.editingFieldCardinalitySelectedMaxItemsEl().getText().then(function(text) {
            expect(text).toBe("" + options.maxItems);
          });

          page.editingFieldTitleInput().clear().then(function() {
            page.editingFieldTitleInput().sendKeys(newOptions.fieldTitle);
          });

          page.editingFieldDescriptionInput().clear().then(function() {
            page.editingFieldDescriptionInput().sendKeys(newOptions.fieldDescription);
          });

          page.editingFieldRequiredCheckbox().click();

          page.editingFieldCardinalityMinItemsToggle().click().then(function() {
            browser.sleep(50).then(function() {
              page.editingFieldCardinalityMinItemsOptionsAt(newOptions.minItems + 1).click().then(function() {
                page.editingFieldCardinalitySelectedMinItemsEl().getText().then(function(text) {
                  expect(text).toBe("" + newOptions.minItems);
                });
              });
            });
          });

          page.editingFieldCardinalityMaxItemsToggle().click().then(function() {
            browser.sleep(50).then(function() {
              page.editingFieldCardinalityMaxItemsOptionsAt(newOptions.maxItems).click().then(function() {
                page.editingFieldCardinalitySelectedMaxItemsEl().getText().then(function(text) {
                  expect(text).toBe("" + newOptions.maxItems);
                });
              });
            });
          });

          page.editingFieldAddButton().click().then(function() {
            browser.sleep(500).then(function() {
              page.renderedFormAllRenderedFields().then(function(fields) {
                expect(fields.length).toBe(1);
                for (var i = 0; i < fields.length; i++) {
                  var field = fields[i];
                  field.all(by.css("input[type='text'].required")).then(function(inputs) {
                    expect(inputs.length).toBe(newOptions.minItems);
                    for (var j = 0; j < inputs.length; j++) {
                      inputs[j].getAttribute("disabled").then(function(attrVal) {
                        expect(!!attrVal).toBe(true);
                      });
                    }
                  });

                  field.all(by.css(".form-group .floating-label")).then(function(labels) {
                    expect(labels.length).toBe(2*newOptions.minItems);
                    for (var j = 0; j < labels.length; j++) {
                      labels[j].getText().then(function(text) {
                        expect(text).toBe(newOptions.fieldTitle);
                      });
                    }
                  });

                  field.all(by.css(".form-group .input-indicator-icons")).then(function(indicators) {
                    expect(indicators.length).toBe(newOptions.minItems);
                  });

                  browser.waitForAngular().then(function() {
                    field.all(by.css(".more-input-buttons .add")).then(function(addButtons) {
                      expect(addButtons.length > 0).toBe(true);

                      for (var j = 0; j < addButtons.length; j++) {
                        addButtons[j].getAttribute("disabled").then(function(attrVal) {
                          expect(!!attrVal).toBe(true);
                        });
                      }
                    });
                  });
                }
              });
            });
          });
        });
      });
    });
  });

  xit("Should allow to remove field without adding to template", function() {
    page.addTextField({minItems: 1, maxItems: 2, dontSaveField: true}).then(function() {
      page.editingFieldRemoveButton().click().then(function() {
        browser.sleep(500).then(function() {
          page.renderedFormAllRenderedFields().then(function(fields) {
            expect(fields.length).toBe(0);
          });
        });
      });
    });
  });

  xit("Should allow to remove field after added to element", function() {
    page.addTextField({minItems: 1, maxItems: 2}).then(function() {
      browser.sleep(1000).then(function() {
        page.renderedFormAllRenderedFields().then(function(fields) {
          expect(fields.length).toBe(1);
          var field = fields[0];
          field.element(by.css(".element-preview-actions .remove")).click().then(function() {
            browser.sleep(500).then(function() {
              page.renderedFormAllRenderedFields().then(function(fields) {
                expect(fields.length).toBe(0);
              });
            });
          });
        });
      });
    });
  });
});
