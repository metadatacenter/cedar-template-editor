'use strict';

var CreateElementPage = require('../pages/create-element-page.js');
var _ = require('../libs/lodash.min.js')

describe('create-element-add-text-field', function() {

  var page;

  beforeEach(function() {
    page = new CreateElementPage();
    page.get();
    browser.driver.manage().window().maximize();
  });

  it('should start out with valid JSON Schema', function() {
    var validInitialSchema = {
      '$schema': 'http://json-schema.org/draft-04/schema#',
      '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
      '@context': {
        pav: 'http://purl.org/pav/',
        cedar: 'https://schema.metadatacenter.org/core/'
      },
      type: 'object',
      title: '',
      description: '',
      _ui: { order: [] },
      properties: {
        '@context': {
          properties: {},
          required: [
            '_value'
          ],
          additionalProperties: false
        },
        '@id': { format: 'uri', type: 'string' },
        '@type': { oneOf: [
          {'type':'string','format':'uri'},
          {'type':'array','minItems':1,'items':{'type':'string','format':'uri'},'uniqueItems':true}
        ] },
        _ui: { title: '', description: '' }
      },
      required: [ '@id' ],
      additionalProperties: false
    };

    page.getJsonPreviewText().then(function(value) {
      var formJson = JSON.parse(value);

      // the @id field is a GUID which is always random
      // remove it before testing for equality
      delete formJson['@id'];
      expect(_.isEqual(formJson, validInitialSchema)).toBe(true);
    });
  });

  it("Should show errors if create element without title or description", function() {
    var options = {};
    options.fieldTitle = "Simple text field";

    page.addTextField(options).then(function() {
      page.composeElementSaveButton().click().then(function() {
        page.errorMessageTexts().then(function(texts) {
          expect(texts.length).toBe(2);
          expect(texts[0].indexOf("Element Name input cannot be left empty.") >= 0).toBe(true);
          expect(texts[1].indexOf("Element Description input cannot be left empty.") >= 0).toBe(true);

          page.setElementTitle("Element 1");

          page.composeElementSaveButton().click().then(function() {
            page.errorMessageTexts().then(function(texts) {
              expect(texts.length).toBe(1);
              expect(texts[0].indexOf("Element Description input cannot be left empty.") >= 0).toBe(true)
            });
          });
        });
      });
    });
  });

  it("Should show errors if save element without title or description", function() {
    var options = {};
    options.fieldTitle = "Simple text field";

    page.setElementTitle("Simple element");
    page.setElementDescription("A simple element");
    page.addTextField(options).then(function() {
      page.composeElementSaveButton().click().then(function() {
        browser.getCurrentUrl().then(function(url) {
          expect(url.indexOf("/elements/edit") > 0).toBe(true);

          page.setElementTitle("");
          page.setElementDescription();

          browser.waitForAngular().then(function() {
            page.composeElementSaveButton().click().then(function() {
              page.errorMessageTexts().then(function(texts) {
                expect(texts.length).toBe(2);
                expect(texts[0].indexOf("Element Name input cannot be left empty.") >= 0).toBe(true);
                expect(texts[1].indexOf("Element Description input cannot be left empty.") >= 0).toBe(true)
              });
            });
          });
        });
      });
    });
  });

  it("Should show errors if create element without unsaved field", function() {
    var options = {};
    options.fieldTitle = "Simple text field";
    options.dontSaveField = true;

    page.setElementTitle("Simple element");
    page.setElementDescription("Just a simple text field");
    page.addTextField(options).then(function() {
      page.composeElementSaveButton().click().then(function() {
        page.errorMessageTexts().then(function(texts) {
          expect(texts.length).toBe(1);
          expect(texts[0]).toMatch(/The following field(?:s?) are still not finished editing/i);
        });

        page.errorElementsContainer().getText().then(function(text) {
          expect(text.indexOf(options.fieldTitle) >= 0).toBe(true);
        });
      });
    });
  });

  it("Should show errors if save element with unsaved field", function() {
    var options = {};
    options.fieldTitle = "Simple text field";

    page.setElementTitle("Simple element");
    page.setElementDescription("A simple element");
    page.addTextField(options).then(function() {
      page.composeElementSaveButton().click().then(function() {
        browser.getCurrentUrl().then(function(url) {
          expect(url.indexOf("/elements/edit") > 0).toBe(true);

          page.renderedFormAllRenderedFields().then(function(fields) {
            expect(fields.length).toBe(1);
            var field = fields[0];
            field.element(by.css(".element-preview-actions .edit")).click().then(function() {
              page.composeElementSaveButton().click().then(function() {
                page.errorMessageTexts().then(function(texts) {
                  expect(texts.length).toBe(1);
                  expect(texts[0]).toMatch(/The following field(?:s?) are still not finished editing/i);
                });

                page.errorElementsContainer().getText().then(function(text) {
                  expect(text.indexOf(options.fieldTitle) >= 0).toBe(true);
                });
              });
            });
          });
        });
      });
    });
  });

  it("Should allow to add text field without cardinality", function() {
    page.setElementTitle("Text field element without cardinality");
    page.setElementDescription("Text field without cardinality");

    page.addTextInput().then(function() {
      expect(page.editingFieldTitleInput().isPresent()).toBe(true);
      expect(page.editingFieldDescriptionInput().isPresent()).toBe(true);
      expect(page.editingFieldCardinalityCheckbox().isPresent()).toBe(true);

      page.editingFieldTitleInput().sendKeys("Simple text field");
      page.editingFieldDescriptionInput().sendKeys("A simple text field that is added by Selenium");

      browser.waitForAngular().then(function() {
        page.editingFieldAddButton().click().then(function() {
          page.renderedFormAllTextFields().then(function(items) {
            expect(items.length).toBe(1);
          });

          page.composeElementSaveButton().click().then(function() {
            browser.waitForAngular().then(function() {
              page.getJsonPreviewText().then(function(value) {
                var json = JSON.parse(value);
                expect(json.properties.simpleTextField && json.properties.simpleTextField.minItems === undefined).toBe(true);
                expect(json.properties.simpleTextField && json.properties.simpleTextField.maxItems === undefined).toBe(true);
              });
            });
          });
        });
      });
    });
  });

  xit("Should allow to clear title, description and added field", function() {
    page.setElementTitle("Test element");
    page.setElementDescription("Just a simple text field");

    page.addTextField().then(function() {
      expect(page.composeElementClearButton().isPresent()).toBe(true);

      browser.waitForAngular().then(function() {
        page.editingFieldAddButton().click().then(function() {
          page.renderedFormAllTextFields().then(function(items) {
            expect(items.length).toBe(1);
          });

          page.composeElementClearButton().click().then(function() {
            browser.sleep(1000).then(function() {
              page.sweetAlertConfirmButton().click().then(function() {
                browser.sleep(1000).then(function() {
                  browser.waitForAngular().then(function() {
                    page.renderedFormAllRenderedFields().then(function(fields) {
                      expect(fields.length).toBe(0);
                    });

                    page.composeElementTitleInput().getAttribute("value").then(function(text) {
                      expect(text).toBe("");
                    });

                    page.composeElementDescriptionInput().getAttribute("value").then(function(text) {
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
    page.setElementTitle("Test element");
    page.setElementDescription("Just a simple text field");

    page.addTextField().then(function() {
      expect(page.composeElementClearButton().isPresent()).toBe(true);

      browser.waitForAngular().then(function() {
        expect(page.renderedFormEditingField().isPresent()).toBe(true);

        page.composeElementClearButton().click().then(function() {
          browser.sleep(1000).then(function() {
            page.sweetAlertConfirmButton().click().then(function() {
              browser.sleep(1000).then(function() {
                expect(page.renderedFormEditingField().isPresent()).toBe(false);
              });
            });
          });
        });
      });
    });
  });

  it("Should allow to mark field as required", function() {
    page.setElementTitle("Simple Text Field");
    page.setElementDescription("Text field that is required");

    page.addTextInput().then(function() {
      expect(page.editingFieldRequiredCheckbox().isPresent()).toBe(true);

      page.editingFieldTitleInput().sendKeys("Simple text field");
      page.editingFieldDescriptionInput().sendKeys("A simple text field that is added by Selenium");
      page.editingFieldRequiredCheckbox().click().then(function() {
        browser.waitForAngular().then(function() {
          page.editingFieldAddButton().click().then(function() {
            page.renderedFormAllRenderedFields().then(function(fields) {
              expect(fields.length).toBe(1);
              expect(fields[0].element(by.css("input.form-control.required")).isPresent()).toBe(true);

              page.composeElementSaveButton().click().then(function() {
                browser.waitForAngular().then(function() {
                  page.getJsonPreviewText().then(function(value) {
                    var json = JSON.parse(value);
                    expect(json.properties.simpleTextField && json.properties.simpleTextField.required.indexOf("_value") >= 0).toBe(true);
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  it("Should allow mark cardinality field as required", function() {
    var options = {};
    options.fieldTitle = "Simple Text Field";
    options.minItems = 2;
    options.maxItems = 3;
    options.dontSaveField = true;

    page.setElementTitle("Cardinality Text Field");
    page.setElementDescription("Text field that is required and is cardinal");

    page.addTextField(options).then(function() {
      expect(page.editingFieldRequiredCheckbox().isPresent()).toBe(true);

      page.editingFieldRequiredCheckbox().click().then(function() {
        browser.waitForAngular().then(function() {
          page.editingFieldAddButton().click().then(function() {
            page.renderedFormAllRenderedFields().then(function(fields) {
              expect(fields.length).toBe(1);
              fields[0].all(by.css("input.form-control.required")).then(function(inputs) {
                expect(inputs.length).toBe(options.minItems);
              });

              page.composeElementSaveButton().click().then(function() {
                browser.waitForAngular().then(function() {
                  page.getJsonPreviewText().then(function(value) {
                    var json = JSON.parse(value);
                    expect(json.properties.simpleTextField && json.properties.simpleTextField.items.required.indexOf("_value") >= 0).toBe(true);
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  it("Should allow to set cardinality for text field", function() {
    page.setElementTitle("2 - 3 Text field element");
    page.setElementDescription("Text field with 2 - 3 cardinality");

    page.addTextInput().then(function() {
      expect(page.editingFieldTitleInput().isPresent()).toBe(true);
      expect(page.editingFieldDescriptionInput().isPresent()).toBe(true);
      expect(page.editingFieldCardinalityCheckbox().isPresent()).toBe(true);

      page.editingFieldCardinalityWrapper().getText().then(function(text) {
        expect(text).toBe("Cardinality");
      });

      page.editingFieldCardinalityCheckbox().click().then(function() {
        page.editingFieldCardinalitySelectedMinItemsEl().getText().then(function(text) {
          expect(text).toBe("");
        });
        page.editingFieldCardinalitySelectedMaxItemsEl().getText().then(function(text) {
          expect(text).toBe("");
        });

        page.editingFieldCardinalityMinItemsToggle().click().then(function() {
          browser.sleep(50).then(function() {
            page.editingFieldCardinalityMinItemsOptionsAt(4).click().then(function() {
              page.editingFieldCardinalitySelectedMinItemsEl().getText().then(function(text) {
                expect(text).toBe("2");
              });
            });
          });
        });

        page.editingFieldCardinalityMaxItemsToggle().click().then(function() {
          browser.sleep(50).then(function() {
            page.editingFieldCardinalityMaxItemsOptionsAt(4).click().then(function() {
              page.editingFieldCardinalitySelectedMaxItemsEl().getText().then(function(text) {
                expect(text).toBe("3");
              });
            });
          });
        });

        page.editingFieldTitleInput().sendKeys("Simple text field");
        page.editingFieldDescriptionInput().sendKeys("A simple text field that is added by Selenium");

        browser.waitForAngular().then(function() {
          page.editingFieldAddButton().click().then(function() {
            page.renderedFormAllTextFields().then(function(items) {
              expect(items.length).toBe(2);
            });
            // expect(element(by.css(".more-input-buttons .add")).isPresent()).toBe(true);

            page.composeElementSaveButton().click().then(function() {
              browser.waitForAngular().then(function() {
                page.getJsonPreviewText().then(function(value) {
                  var json = JSON.parse(value);
                  expect(json.properties.simpleTextField && json.properties.simpleTextField.minItems == 2).toBe(true);
                  expect(json.properties.simpleTextField && json.properties.simpleTextField.maxItems == 3).toBe(true);
                });
              });
            });
          });
        });
      });
    });
  });

  it("Should not allow add field that min cardinality greater than max cardinality", function() {
    page.setElementTitle("3 - 2 Text field element");
    page.setElementDescription("Text field with 3 - 2 cardinality");

    page.addTextInput().then(function() {
      page.editingFieldCardinalityCheckbox().click().then(function() {
        page.editingFieldCardinalityMinItemsToggle().click().then(function() {
          browser.sleep(100).then(function() {
            page.editingFieldCardinalityMinItemsOptionsAt(5).click().then(function() {
              page.editingFieldCardinalitySelectedMinItemsEl().getText().then(function(text) {
                expect(text).toBe("3");
              });
            });
          });
        });

        page.editingFieldCardinalityMaxItemsToggle().click().then(function() {
          browser.sleep(100).then(function() {
            page.editingFieldCardinalityMaxItemsOptionsAt(3).click().then(function() {
              page.editingFieldCardinalitySelectedMaxItemsEl().getText().then(function(text) {
                expect(text).toBe("2");
              });
            });
          });
        });

        page.editingFieldTitleInput().sendKeys("Simple text field");
        page.editingFieldDescriptionInput().sendKeys("A simple text field that is added by Selenium");

        browser.waitForAngular().then(function() {
          page.editingFieldAddButton().click().then(function() {
            page.errorMessageTexts().then(function(texts) {
              expect(texts.length).toBe(1);
              expect(texts[0]).toBe("Min cannot be greater than Max.");
            });
          });
        });
      });
    });
  });

  // Not sure why maxItems is not set in this test
  xit("Should not set maxItems if maxItems is N", function() {
    page.setElementTitle("1 - N text field");
    page.setElementDescription("Text field was created via Selenium");

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
            page.renderedFormAllTextFields().then(function(items) {
              expect(items.length).toBe(1);
            });

            page.composeElementSaveButton().click().then(function() {
              browser.waitForAngular().then(function() {
                page.getJsonPreviewText().then(function(value) {
                  browser.sleep(10000).then(function() {
                    var json = JSON.parse(value);
                    console.log("Line 250 ", json.properties.textFieldTitle.maxItems);
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

  it("Should not set minItems & maxItems if cardinality is 1 - 1", function() {
    page.setElementTitle("1 - 1 text field");
    page.setElementDescription("Text field was created via Selenium");

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
            page.renderedFormAllTextFields().then(function(items) {
              expect(items.length).toBe(1);
            });

            page.composeElementSaveButton().click().then(function() {
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
    });
  });

  it("Should allow to add more than 1 field", function() {
    page.addTextField().then(function() {
      page.addTextField().then(function() {
        page.renderedFormAllRenderedFields().then(function(fields) {
          expect(fields.length).toBe(2);
        });
      });
    });
  });

  it("Should render added text field like in run time 'mode' but is disabled", function() {
    var fieldTitle = "Text 1";
    var minItems = 2;
    page.addTextField({minItems: minItems, maxItems: 3, fieldTitle: fieldTitle}).then(function() {
      page.renderedFormAllRenderedFields().then(function(fields) {
        expect(fields.length).toBe(1);
        for (var i = 0; i < fields.length; i++) {
          var field = fields[i];
          field.all(by.css("input[type='text']")).then(function(inputs) {
            expect(inputs.length).toBe(minItems);
            for (var j = 0; j < inputs.length; j++) {
              inputs[j].getAttribute("disabled").then(function(attrVal) {
                expect(attrVal != null).toBe(true);
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
                expect(attrVal != null).toBe(true);
              });
            }
          });
        }
      });
    });
  });

  it("Should render added text field with additional things specific to 'edit' mode", function() {
    var fieldTitle = "Text 2";
    var minItems = 2;
    page.addTextField({minItems: minItems, maxItems: 3, fieldTitle: fieldTitle}).then(function() {
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

  it("Should allow to sort added fields", function() {
    page.addTextField({fieldTitle: "Text 1"}).then(function() {
      page.addTextField({fieldTitle: "Text 2"}).then(function() {
        page.renderedFormAllRenderedFields().then(function(fields) {
          var promises = [];
          for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            promises.push(field.element(by.css(".form-group .floating-label")).getText())
          }

          protractor.promise.all(promises).then(function(texts) {
            var firstField = page.editingElementFirstFieldSortIcon();
            browser.actions().dragAndDrop(firstField, {x: 0, y: 200}).perform().then(function() {
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

  it("Should allow to edit added field", function() {
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
            expect(1*text).toBe(options.minItems);
          });

          page.editingFieldCardinalitySelectedMaxItemsEl().getText().then(function(text) {
            expect(1*text).toBe(options.maxItems);
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
                  expect(1*text).toBe(newOptions.minItems);
                });
              });
            });
          });

          page.editingFieldCardinalityMaxItemsToggle().click().then(function() {
            browser.sleep(50).then(function() {
              page.editingFieldCardinalityMaxItemsOptionsAt(newOptions.maxItems).click().then(function() {
                page.editingFieldCardinalitySelectedMaxItemsEl().getText().then(function(text) {
                  expect(1*text).toBe(newOptions.maxItems);
                });
              });
            });
          });

          page.editingFieldAddButton().click().then(function() {
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
                        expect(attrVal != null).toBe(true);
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

  it("Should allow to remove field without adding to element", function() {
    page.addTextField({minItems: 1, maxItems: 2, dontSaveField: true}).then(function() {
      page.editingFieldRemoveButton().click().then(function() {
        page.renderedFormAllRenderedFields().then(function(fields) {
          expect(fields.length).toBe(0);
        });
      });
    });
  });

  it("Should allow to remove field after added to element", function() {
    page.addTextField({minItems: 1, maxItems: 2}).then(function() {
      page.renderedFormAllRenderedFields().then(function(fields) {
        expect(fields.length).toBe(1);
        var field = fields[0];
        field.element(by.css(".element-preview-actions .remove")).click().then(function() {
          page.renderedFormAllRenderedFields().then(function(fields) {
            expect(fields.length).toBe(0);
          });
        });
      });
    });
  });

  it("Should display ontologies when clicking on ontology icon", function() {
    page.addTextInput().then(function() {
      expect(page.editingFieldOntologyButton().isDisplayed()).toBe(true);
      page.editingFieldOntologyButton().click().then(function() {
        expect(page.editingFieldControlledTermsModal().isPresent()).toBe(true);
      });
    });
  });

  // Ontologies
  xit("Should allow to enter ontologies by searching", function() {
    page.addTextInput().then(function() {
      page.editingFieldOntologyButton().click().then(function() {
        browser.sleep(1000).then(function() {
          expect(page.controlledTermsModalFieldButton().isDisplayed()).toBe(true);

          page.controlledTermsModalFieldButton().click().then(function() {
            expect(page.controlledTermsModalSearchFieldInput().isDisplayed()).toBe(true);
            expect(page.controlledTermsModalBrowseFieldInput().isDisplayed()).toBe(true);
            expect(page.controlledTermsModalCreateClassInput().isDisplayed()).toBe(true);

            page.controlledTermsModalSearchFieldInput().sendKeys("Design").then(function() {
              browser.sleep(1000).then(function() {
                page.controlledTermsModalSearchFieldButton().click().then(function() {
                  browser.waitForAngular().then(function() {
                    page.controlledTermsModalSearchResultsRows().then(function(rows) {
                      expect(rows.length > 0).toBe(true);
                      rows[0].click().then(function() {
                        browser.waitForAngular().then(function() {
                          expect(page.controlledTermsModalTreeView().isDisplayed()).toBe(true);
                          expect(page.controlledTermsModalClassDetailsView().isDisplayed()).toBe(true);

                          page.controlledTermsModalOntologyDetailsTab().click().then(function() {
                            expect(page.controlledTermsModalOntologyDetailsView().isDisplayed()).toBe(true);
                          });

                          expect(page.controlledTermsModalAddTermButton().isDisplayed()).toBe(true);
                          page.controlledTermsModalSelectedOntologyTitle().getText().then(function(title) {
                            page.controlledTermsModalAddTermButton().click().then(function() {
                              page.controlledTermsModalAddedFieldRows().then(function(fields) {
                                expect(fields.length).toBe(1);
                                fields[0].element(by.css(".ontology-name")).getText().then(function(text) {
                                  expect(text.trim().toUpperCase().indexOf(title.trim().toUpperCase()) == 0).toBe(true);
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

  xit("Should allow to enter ontologies by browsing", function() {
    page.addTextInput().then(function() {
      page.editingFieldOntologyButton().click().then(function() {
        browser.sleep(1000).then(function() {
          expect(page.controlledTermsModalFieldButton().isDisplayed()).toBe(true);

          page.controlledTermsModalFieldButton().click().then(function() {
            expect(page.controlledTermsModalBrowseFieldInput().isDisplayed()).toBe(true);

            page.controlledTermsModalBrowseFieldInput().click().then(function() {
              browser.sleep(1000).then(function() {
                browser.waitForAngular().then(function() {
                  page.controlledTermsModalBrowseResultsRows().then(function(rows) {
                    expect(rows.length > 0).toBe(true);
                    rows[0].click().then(function() {
                      browser.waitForAngular().then(function() {
                        expect(page.controlledTermsModalTreeView().isDisplayed()).toBe(true);
                        expect(page.controlledTermsModalClassDetailsView().isDisplayed()).toBe(true);

                        page.controlledTermsModalOntologyDetailsTab().click().then(function() {
                          expect(page.controlledTermsModalOntologyDetailsView().isDisplayed()).toBe(true);
                        });

                        expect(page.controlledTermsModalAddTermButton().isPresent()).toBe(false);
                        page.controlledTermsModalTreeFirstRootEl().click().then(function() {
                          expect(page.controlledTermsModalAddTermButton().isDisplayed()).toBe(true);

                          page.controlledTermsModalSelectedOntologyTitle().getText().then(function(title) {
                            page.controlledTermsModalAddTermButton().click().then(function() {
                              page.controlledTermsModalAddedFieldRows().then(function(fields) {
                                expect(fields.length).toBe(1);
                                fields[0].element(by.css(".ontology-name")).getText().then(function(text) {
                                  expect(text.trim().toUpperCase().indexOf(title.trim().toUpperCase()) == 0).toBe(true);
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

  xit("Should allow to start over after clicking 'Field' button", function() {
    page.addTextInput().then(function() {
      page.editingFieldOntologyButton().click().then(function() {
        browser.sleep(1000).then(function() {
          expect(page.controlledTermsModalFieldButton().isDisplayed()).toBe(true);
          expect(page.controlledTermsModalValuesButton().isDisplayed()).toBe(true);

          page.controlledTermsModalFieldButton().click().then(function() {
            expect(page.controlledTermsModalFieldButton().isPresent()).toBe(false);
            expect(page.controlledTermsModalValuesButton().isPresent()).toBe(false);

            expect(page.controlledTermsModalSearchFieldInput().isDisplayed()).toBe(true);
            expect(page.controlledTermsModalBrowseFieldInput().isDisplayed()).toBe(true);
            expect(page.controlledTermsModalCreateClassInput().isDisplayed()).toBe(true);
            expect(page.controlledTermsModalStartOverLink().isDisplayed()).toBe(true);

            page.controlledTermsModalStartOverLink().click().then(function() {
              expect(page.controlledTermsModalFieldButton().isDisplayed()).toBe(true);
              expect(page.controlledTermsModalValuesButton().isDisplayed()).toBe(true);

              expect(page.controlledTermsModalSearchFieldInput().isPresent()).toBe(false);
              expect(page.controlledTermsModalBrowseFieldInput().isPresent()).toBe(false);
              expect(page.controlledTermsModalCreateClassInput().isPresent()).toBe(false);
              expect(page.controlledTermsModalStartOverLink().isPresent()).toBe(false);
            });
          });
        });
      });
    });
  });

  xit("Should allow to start over after searching field", function() {
    page.addTextInput().then(function() {
      page.editingFieldOntologyButton().click().then(function() {
        browser.sleep(1000).then(function() {
          expect(page.controlledTermsModalFieldButton().isDisplayed()).toBe(true);
          expect(page.controlledTermsModalValuesButton().isDisplayed()).toBe(true);

          page.controlledTermsModalFieldButton().click().then(function() {
            page.controlledTermsModalSearchFieldInput().sendKeys("Design").then(function() {
              browser.sleep(1000).then(function() {
                page.controlledTermsModalSearchFieldButton().click().then(function() {
                  expect(page.controlledTermsModalFieldButton().isPresent()).toBe(false);
                  expect(page.controlledTermsModalValuesButton().isPresent()).toBe(false);
                  expect(page.controlledTermsModalStartOverLink().isDisplayed()).toBe(true);

                  page.controlledTermsModalStartOverLink().click().then(function() {
                    expect(page.controlledTermsModalFieldButton().isDisplayed()).toBe(true);
                    expect(page.controlledTermsModalValuesButton().isDisplayed()).toBe(true);
                    expect(page.controlledTermsModalStartOverLink().isPresent()).toBe(false);
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  xit("Should allow to start over after browsing", function() {
    page.addTextInput().then(function() {
      page.editingFieldOntologyButton().click().then(function() {
        browser.sleep(1000).then(function() {
          expect(page.controlledTermsModalFieldButton().isDisplayed()).toBe(true);
          expect(page.controlledTermsModalValuesButton().isDisplayed()).toBe(true);

          page.controlledTermsModalFieldButton().click().then(function() {
            expect(page.controlledTermsModalFieldButton().isPresent()).toBe(false);
            expect(page.controlledTermsModalValuesButton().isPresent()).toBe(false);

            expect(page.controlledTermsModalSearchFieldInput().isDisplayed()).toBe(true);
            expect(page.controlledTermsModalBrowseFieldInput().isDisplayed()).toBe(true);
            expect(page.controlledTermsModalCreateClassInput().isDisplayed()).toBe(true);
            expect(page.controlledTermsModalStartOverLink().isDisplayed()).toBe(true);

            page.controlledTermsModalBrowseFieldInput().click().then(function() {
              browser.sleep(1000).then(function() {
                browser.waitForAngular().then(function() {
                  page.controlledTermsModalStartOverLink().click().then(function() {
                    expect(page.controlledTermsModalFieldButton().isDisplayed()).toBe(true);
                    expect(page.controlledTermsModalValuesButton().isDisplayed()).toBe(true);

                    expect(page.controlledTermsModalSearchFieldInput().isPresent()).toBe(false);
                    expect(page.controlledTermsModalBrowseFieldInput().isPresent()).toBe(false);
                    expect(page.controlledTermsModalCreateClassInput().isPresent()).toBe(false);
                    expect(page.controlledTermsModalStartOverLink().isPresent()).toBe(false);
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  xit("Should allow to start over after selected a field", function() {
    page.addTextInput().then(function() {
      page.editingFieldOntologyButton().click().then(function() {
        browser.sleep(1000).then(function() {
          expect(page.controlledTermsModalFieldButton().isDisplayed()).toBe(true);
          expect(page.controlledTermsModalValuesButton().isDisplayed()).toBe(true);

          page.controlledTermsModalFieldButton().click().then(function() {
            page.controlledTermsModalBrowseFieldInput().click().then(function() {
              browser.sleep(1000).then(function() {
                browser.waitForAngular().then(function() {
                  page.controlledTermsModalBrowseResultsRows().then(function(rows) {
                    rows[0].click().then(function() {
                      browser.waitForAngular().then(function() {
                        expect(page.controlledTermsModalFieldButton().isPresent()).toBe(false);
                        expect(page.controlledTermsModalValuesButton().isPresent()).toBe(false);
                        expect(page.controlledTermsModalStartOverLink().isDisplayed()).toBe(true);

                        page.controlledTermsModalStartOverLink().click().then(function() {
                          expect(page.controlledTermsModalFieldButton().isDisplayed()).toBe(true);
                          expect(page.controlledTermsModalValuesButton().isDisplayed()).toBe(true);
                          expect(page.controlledTermsModalStartOverLink().isPresent()).toBe(false);
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
