'use strict';
var CreateElementPage = require('../pages/create-element-page.js');
var _ = require('../libs/lodash.min.js')
xdescribe('create-element-add-text-field', function () {
  var page;
  beforeEach(function () {
    page = new CreateElementPage();
    page.get();
    browser.driver.manage().window().maximize();
  });
  xit("Should allow to add paragraph field without cardinality", function () {
    page.setElementTitle("Text area element without cardinality");
    page.setElementDescription("Text area without cardinality");
    page.addInput("paragraph").then(function () {
      expect(page.editingFieldTitleInput().isDisplayed()).toBe(true);
      expect(page.editingFieldDescriptionInput().isDisplayed()).toBe(true);
      expect(page.editingFieldCardinalityCheckbox().isPresent()).toBe(true);
      page.editingFieldTitleInput().sendKeys("Simple text area");
      page.editingFieldDescriptionInput().sendKeys("A simple text area that is added by Selenium");
      browser.waitForAngular().then(function () {
        page.editingFieldAddButton().click().then(function () {
          page.renderedFormAllTextareaFields().then(function (items) {
            expect(items.length).toBe(1);
          });
          page.composeElementSaveButton().click().then(function () {
            browser.waitForAngular().then(function () {
              page.getJsonPreviewText().then(function (value) {
                var json = JSON.parse(value);
                expect(json.properties.simpleTextArea && json.properties.simpleTextArea.minItems === undefined).toBe(true);
                expect(json.properties.simpleTextArea && json.properties.simpleTextArea.maxItems === undefined).toBe(true);
              });
            });
          });
        });
      });
    });
  });
  xit("Should allow to mark field as required", function () {
    page.setElementTitle("Simple Text Area");
    page.setElementDescription("Text area that is required");
    page.addInput("paragraph").then(function () {
      browser.waitForAngular().then(function () {
        expect(page.editingFieldRequiredCheckbox().isPresent()).toBe(true);
        page.editingFieldTitleInput().sendKeys("Simple text area");
        page.editingFieldDescriptionInput().sendKeys("A simple text area that is added by Selenium");
        page.editingFieldRequiredCheckbox().click().then(function () {
          browser.waitForAngular().then(function () {
            page.editingFieldAddButton().click().then(function () {
              page.renderedFormAllRenderedFields().then(function (fields) {
                expect(fields.length).toBe(1);
                expect(fields[0].element(by.css("textarea.required")).isDisplayed()).toBe(true);
                page.composeElementSaveButton().click().then(function () {
                  browser.waitForAngular().then(function () {
                    page.getJsonPreviewText().then(function (value) {
                      var json = JSON.parse(value);
                      expect(json.properties.simpleTextArea && json.properties.simpleTextArea.required.indexOf("@value") >= 0).toBe(true);
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
  xit("Should allow mark cardinality field as required", function () {
    var options = {};
    options.inputType = "paragraph";
    options.fieldTitle = "Simple Text Area";
    options.minItems = 2;
    options.maxItems = 3;
    options.dontSaveField = true;
    page.setElementTitle("Cardinality Text Area");
    page.setElementDescription("Text area that is required and is cardinal");
    page.addField(options).then(function () {
      browser.waitForAngular().then(function () {
        expect(page.editingFieldRequiredCheckbox().isPresent()).toBe(true);
        page.editingFieldRequiredCheckbox().click().then(function () {
          browser.waitForAngular().then(function () {
            page.editingFieldAddButton().click().then(function () {
              page.renderedFormAllRenderedFields().then(function (fields) {
                expect(fields.length).toBe(1);
                fields[0].all(by.css("textarea.form-control.required")).then(function (inputs) {
                  expect(inputs.length).toBe(options.minItems);
                });
                page.composeElementSaveButton().click().then(function () {
                  browser.waitForAngular().then(function () {
                    page.getJsonPreviewText().then(function (value) {
                      var json = JSON.parse(value);
                      expect(json.properties.simpleTextArea && json.properties.simpleTextArea.items.required.indexOf("@value") >= 0).toBe(true);
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
  xit("Should allow to set cardinality for text area", function () {
    page.setElementTitle("2 - 3 Text area element");
    page.setElementDescription("Text area with 2 - 3 cardinality");
    page.addInput("paragraph").then(function () {
      expect(page.editingFieldTitleInput().isDisplayed()).toBe(true);
      expect(page.editingFieldDescriptionInput().isDisplayed()).toBe(true);
      expect(page.editingFieldCardinalityCheckbox().isPresent()).toBe(true);
      page.editingFieldCardinalityWrapper().getText().then(function (text) {
        expect(text).toBe("Cardinality");
      });
      page.editingFieldCardinalityCheckbox().click().then(function () {
        page.editingFieldCardinalitySelectedMinItemsEl().getText().then(function (text) {
          expect(text).toBe("");
        });
        page.editingFieldCardinalitySelectedMaxItemsEl().getText().then(function (text) {
          expect(text).toBe("");
        });
        page.editingFieldCardinalityMinItemsToggle().click().then(function () {
          browser.sleep(50).then(function () {
            page.editingFieldCardinalityMinItemsOptionsAt(4).click().then(function () {
              page.editingFieldCardinalitySelectedMinItemsEl().getText().then(function (text) {
                expect(text).toBe("2");
              });
            });
          });
        });
        page.editingFieldCardinalityMaxItemsToggle().click().then(function () {
          browser.sleep(50).then(function () {
            page.editingFieldCardinalityMaxItemsOptionsAt(4).click().then(function () {
              page.editingFieldCardinalitySelectedMaxItemsEl().getText().then(function (text) {
                expect(text).toBe("3");
              });
            });
          });
        });
        page.editingFieldTitleInput().sendKeys("Simple text area");
        page.editingFieldDescriptionInput().sendKeys("A simple text area that is added by Selenium");
        browser.waitForAngular().then(function () {
          page.editingFieldAddButton().click().then(function () {
            browser.waitForAngular().then(function () {
              page.renderedFormAllTextareaFields().then(function (items) {
                expect(items.length).toBe(2);
              });
              page.composeElementSaveButton().click().then(function () {
                browser.waitForAngular().then(function () {
                  page.getJsonPreviewText().then(function (value) {
                    var json = JSON.parse(value);
                    expect(json.properties.simpleTextArea && json.properties.simpleTextArea.minItems == 2).toBe(true);
                    expect(json.properties.simpleTextArea && json.properties.simpleTextArea.maxItems == 3).toBe(true);
                  });
                });
              });
            });
          });
        });
      });
    });
  });
// Not sure why maxItems is not set in this test 
  xit("Should not set maxItems if maxItems is N", function () {
    page.setElementTitle("1 - N text area");
    page.setElementDescription("Text area was created via Selenium");
    page.addInput("paragraph").then(function () {
      page.editingFieldCardinalityCheckbox().click().then(function () {
        page.editingFieldCardinalityMaxItemsToggle().click().then(function () {
          browser.sleep(50).then(function () {
            page.editingFieldCardinalityMaxItemsOptionsAt(10).click().then(function () {
              page.editingFieldCardinalitySelectedMaxItemsEl().getText().then(function (text) {
                expect(text).toBe("N");
              });
            });
          });
        });
        page.editingFieldTitleInput().sendKeys("Text area title");
        page.editingFieldDescriptionInput().sendKeys("Simple text area created via Selenium");
        browser.waitForAngular().then(function () {
          page.editingFieldAddButton().click().then(function () {
            browser.waitForAngular().then(function () {
              page.renderedFormAllTextareaFields().then(function (items) {
                expect(items.length).toBe(1);
              });
              page.composeElementSaveButton().click().then(function () {
                browser.waitForAngular().then(function () {
                  page.getJsonPreviewText().then(function (value) {
                    browser.sleep(10000).then(function () {
                      var json = JSON.parse(value);
                      expect(json.properties.textAreaTitle && json.properties.textAreaTitle.minItems).toBe(undefined);
                      expect(json.properties.textAreaTitle && json.properties.textAreaTitle.maxItems).toBe(0);
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
  xit("Should not set minItems & maxItems if cardinality is 1 - 1", function () {
    page.setElementTitle("1 - 1 text area");
    page.setElementDescription("Text area was created via Selenium");
    page.addInput("paragraph").then(function () {
      page.editingFieldCardinalityCheckbox().click().then(function () {
        page.editingFieldCardinalityMinItemsToggle().click().then(function (text) {
          browser.waitForAngular().then(function () {
            page.editingFieldCardinalityMinItemsOptionsAt(3).click().then(function () {
              page.editingFieldCardinalitySelectedMinItemsEl().getText().then(function (text) {
                expect(text).toBe("1");
              });
            });
          });
        });
        page.editingFieldCardinalityMaxItemsToggle().click().then(function (text) {
          browser.waitForAngular().then(function () {
            page.editingFieldCardinalityMaxItemsOptionsAt(2).click().then(function () {
              page.editingFieldCardinalitySelectedMaxItemsEl().getText().then(function (text) {
                expect(text).toBe("1");
              });
            });
          });
        });
        page.editingFieldTitleInput().sendKeys("Text area title");
        page.editingFieldDescriptionInput().sendKeys("Simple text area created via Selenium");
        browser.waitForAngular().then(function () {
          page.editingFieldAddButton().click().then(function () {
            page.renderedFormAllTextareaFields().then(function (items) {
              expect(items.length).toBe(1);
            });
            page.composeElementSaveButton().click().then(function () {
              browser.waitForAngular().then(function () {
                page.getJsonPreviewText().then(function (value) {
                  var json = JSON.parse(value);
                  expect(json.properties.textAreaTitle && json.properties.textAreaTitle.minItems == undefined).toBe(true);
                  expect(json.properties.textAreaTitle && json.properties.textAreaTitle.maxItems == undefined).toBe(true);
                });
              });
            });
          });
        });
      });
    });
  });
  xit("Should allow to add more than 1 field", function () {
    var options = {};
    options.inputType = "paragraph";
    page.addField(options).then(function () {
      page.addTextField(options).then(function () {
        page.renderedFormAllRenderedFields().then(function (fields) {
          expect(fields.length).toBe(2);
        });
      });
    });
  });
  xit("Should render added text area like in run time 'mode' but is disabled", function () {
    var fieldTitle = "Text 1";
    var minItems = 2;
    page.addField({inputType: "paragraph", minItems: minItems, maxItems: 3, fieldTitle: fieldTitle}).then(function () {
      page.renderedFormAllRenderedFields().then(function (fields) {
        expect(fields.length).toBe(1);
        for (var i = 0; i < fields.length; i++) {
          var field = fields[i];
          field.all(by.css("textarea")).then(function (inputs) {
            expect(inputs.length).toBe(minItems);
            for (var j = 0; j < inputs.length; j++) {
              inputs[j].getAttribute("disabled").then(function (attrVal) {
                expect(!!attrVal).toBe(true);
              });
            }
          });
          field.all(by.css(".form-group .floating-label")).then(function (labels) {
            expect(labels.length).toBe(minItems);
            for (var j = 0; j < labels.length; j++) {
              labels[j].getText().then(function (text) {
                expect(text).toBe(fieldTitle);
              });
            }
          });
          field.all(by.css(".form-group .input-indicator-icons")).then(function (indicators) {
            expect(indicators.length).toBe(minItems);
          });
          field.all(by.css(".more-input-buttons .add")).then(function (addButtons) {
            expect(addButtons.length > 0).toBe(true);
            for (var j = 0; j < addButtons.length; j++) {
              addButtons[j].getAttribute("disabled").then(function (attrVal) {
                expect(!!attrVal).toBe(true);
              });
            }
          });
        }
      });
    });
  });
  xit("Should render added text area with additional things specific to 'edit' mode", function () {
    var fieldTitle = "Text 2";
    var minItems = 2;
    page.addField({inputType: "paragraph", minItems: minItems, maxItems: 3, fieldTitle: fieldTitle}).then(function () {
      page.renderedFormAllRenderedFields().then(function (fields) {
        expect(fields.length).toBe(1);
        for (var i = 0; i < fields.length; i++) {
          var field = fields[i];
          field.all(by.css(".sortable-icon")).then(function (icons) {
            expect(icons.length > 0).toBe(true);
          });
          field.all(by.css(".element-preview-actions")).then(function (icons) {
            expect(icons.length > 0).toBe(true);
          });
        }
      });
    });
  });
  xit("Should allow to sort added fields", function () {
    page.addField({inputType: "paragraph", fieldTitle: "Paragraph 1"}).then(function () {
      page.addField({inputType: "paragraph", fieldTitle: "Paragraph 2"}).then(function () {
        page.renderedFormAllRenderedFields().then(function (fields) {
          var promises = [];
          for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            promises.push(field.element(by.css(".form-group .floating-label")).getText())
          }
          protractor.promise.all(promises).then(function (texts) {
            var firstField = page.editingElementFirstFieldSortIcon();
            browser.actions().dragAndDrop(firstField, {x: 0, y: 320}).perform().then(function () {
              page.renderedFormAllRenderedFields().then(function (fields) {
                promises = [];
                for (var i = 0; i < fields.length; i++) {
                  var field = fields[i];
                  promises.push(field.element(by.css(".form-group .floating-label")).getText())
                }
                protractor.promise.all(promises).then(function (resultTexts) {
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
  xit("Should allow to edit added field", function () {
    var options = {};
    options.minItems = 2;
    options.maxItems = 3;
    options.inputType = "paragraph";
    options.fieldTitle = "Text 1";
    options.fieldDescription = "This is a short text area";
    var newOptions = {};
    newOptions.minItems = 3;
    newOptions.maxItems = 4;
    newOptions.fieldTitle = "Edited paragraph 1";
    newOptions.fieldDescription = "Edited description of paragraph 1";
    page.addField(options).then(function () {
      page.renderedFormAllRenderedFields().then(function (fields) {
        var field = fields[0];
        field.element(by.css(".element-preview-actions .edit")).click().then(function () {
          page.editingFieldTitleInput().getAttribute("value").then(function (text) {
            expect(text).toBe(options.fieldTitle);
          });
          page.editingFieldDescriptionInput().getAttribute("value").then(function (text) {
            expect(text).toBe(options.fieldDescription);
          });
          page.editingFieldCardinalityCheckbox().getAttribute("checked").then(function (attr) {
            expect(!!attr).toBe(true);
          });
          page.editingFieldCardinalitySelectedMinItemsEl().getText().then(function (text) {
            expect(text).toBe("" + options.minItems);
          });
          page.editingFieldCardinalitySelectedMaxItemsEl().getText().then(function (text) {
            expect(text).toBe("" + options.maxItems);
          });
          page.editingFieldTitleInput().clear().then(function () {
            page.editingFieldTitleInput().sendKeys(newOptions.fieldTitle);
          });
          page.editingFieldDescriptionInput().clear().then(function () {
            page.editingFieldDescriptionInput().sendKeys(newOptions.fieldDescription);
          });
          page.editingFieldRequiredCheckbox().click();
          page.editingFieldCardinalityMinItemsToggle().click().then(function () {
            browser.sleep(50).then(function () {
              page.editingFieldCardinalityMinItemsOptionsAt(newOptions.minItems + 1).click().then(function () {
                page.editingFieldCardinalitySelectedMinItemsEl().getText().then(function (text) {
                  expect(text).toBe("" + newOptions.minItems);
                });
              });
            });
          });
          page.editingFieldCardinalityMaxItemsToggle().click().then(function () {
            browser.sleep(50).then(function () {
              page.editingFieldCardinalityMaxItemsOptionsAt(newOptions.maxItems).click().then(function () {
                page.editingFieldCardinalitySelectedMaxItemsEl().getText().then(function (text) {
                  expect(text).toBe("" + newOptions.maxItems);
                });
              });
            });
          });
          page.editingFieldAddButton().click().then(function () {
            page.renderedFormAllRenderedFields().then(function (fields) {
              expect(fields.length).toBe(1);
              for (var i = 0; i < fields.length; i++) {
                var field = fields[i];
                field.all(by.css("textarea.required")).then(function (inputs) {
                  expect(inputs.length).toBe(newOptions.minItems);
                  for (var j = 0; j < inputs.length; j++) {
                    inputs[j].getAttribute("disabled").then(function (attrVal) {
                      expect(!!attrVal).toBe(true);
                    });
                  }
                });
                field.all(by.css(".form-group .floating-label")).then(function (labels) {
                  expect(labels.length).toBe(newOptions.minItems);
                  for (var j = 0; j < labels.length; j++) {
                    labels[j].getText().then(function (text) {
                      expect(text).toBe(newOptions.fieldTitle);
                    });
                  }
                });
                field.all(by.css(".form-group .input-indicator-icons")).then(function (indicators) {
                  expect(indicators.length).toBe(newOptions.minItems);
                });
                browser.waitForAngular().then(function () {
                  field.all(by.css(".more-input-buttons .add")).then(function (addButtons) {
                    expect(addButtons.length > 0).toBe(true);
                    for (var j = 0; j < addButtons.length; j++) {
                      addButtons[j].getAttribute("disabled").then(function (attrVal) {
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
  xit("Should allow to remove field without adding to element", function () {
    page.addTextField({minItems: 1, maxItems: 2, dontSaveField: true}).then(function () {
      page.editingFieldRemoveButton().click().then(function () {
        page.renderedFormAllRenderedFields().then(function (fields) {
          expect(fields.length).toBe(0);
        });
      });
    });
  });
  xit("Should allow to remove field after added to element", function () {
    page.addField({inputType: "paragraph", minItems: 1, maxItems: 2}).then(function () {
      page.renderedFormAllRenderedFields().then(function (fields) {
        expect(fields.length).toBe(1);
        var field = fields[0];
        field.element(by.css(".element-preview-actions .remove")).click().then(function () {
          page.renderedFormAllRenderedFields().then(function (fields) {
            expect(fields.length).toBe(0);
          });
        });
      });
    });
  });
}); 
