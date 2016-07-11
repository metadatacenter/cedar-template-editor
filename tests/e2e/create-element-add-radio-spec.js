'use strict';

var CreateElementPage = require('../pages/create-element-page.js');
var _ = require('../libs/lodash.min.js')

describe('create-element-add-radio-button', function() {

  var page;

  beforeEach(function() {
    page = new CreateElementPage();
    page.get();
    browser.driver.manage().window().maximize();
  });

  it("Should allow to add radio button without cardinality", function() {
    page.setElementTitle("Radio button element without cardinality");
    page.setElementDescription("Radio button without cardinality");

    page.addInput("radio").then(function() {
      expect(page.editingFieldTitleInput().isDisplayed()).toBe(true);
      expect(page.editingFieldDescriptionInput().isDisplayed()).toBe(true);
      expect(page.editingFieldCardinalityCheckbox().isPresent()).toBe(true);
      page.editingFieldAllOptionInputs().then(function(inputs) {
        expect(inputs.length).toBe(1);
      });
      expect(page.editingFieldAddAnotherOptionButton().isDisplayed()).toBe(true);

      page.editingFieldTitleInput().sendKeys("Simple radio button");
      page.editingFieldDescriptionInput().sendKeys("A simple radio button that is added by Selenium");

      page.editingFieldLastOptionInput().sendKeys("Option 1");
      page.editingFieldAddAnotherOptionButton().click().then(function() {
        page.editingFieldLastOptionInput().sendKeys("Option 2");
      });

      browser.waitForAngular().then(function() {
        page.editingFieldAddButton().click().then(function() {
          page.renderedFormAllRenderedFields().then(function(fields) {
            expect(fields.length).toBe(1);
            fields[0].all(by.css(".radio-item")).then(function(radioItems) {
              expect(radioItems.length).toBe(2);
              radioItems[0].getText().then(function(text) {
                expect(text).toBe("Option 1");
              });

              radioItems[1].getText().then(function(text) {
                expect(text).toBe("Option 2");
              });
            });
          });

          page.composeElementSaveButton().click().then(function() {
            browser.waitForAngular().then(function() {
              page.getJsonPreviewText().then(function(value) {
                var json = JSON.parse(value);
                expect(json.properties.simpleRadioButton && json.properties.simpleRadioButton.minItems === undefined).toBe(true);
                expect(json.properties.simpleRadioButton && json.properties.simpleRadioButton.maxItems === undefined).toBe(true);
              });
            });
          });
        });
      });
    });
  });

  it("Should allow to mark field as required", function() {
    page.setElementTitle("Simple Radio Button");
    page.setElementDescription("Radio button that is required");

    page.addInput("radio").then(function() {
      browser.waitForAngular().then(function() {
        expect(page.editingFieldRequiredCheckbox().isPresent()).toBe(true);

        page.editingFieldTitleInput().sendKeys("Simple radio button");
        page.editingFieldDescriptionInput().sendKeys("A simple radio button that is added by Selenium");
        page.editingFieldLastOptionInput().sendKeys("Option 1");
        page.editingFieldAddAnotherOptionButton().click().then(function() {
          page.editingFieldLastOptionInput().sendKeys("Option 2");
        });

        page.editingFieldRequiredCheckbox().click().then(function() {
          browser.waitForAngular().then(function() {
            page.editingFieldAddButton().click().then(function() {
              browser.waitForAngular().then(function(fields) {
                page.composeElementSaveButton().click().then(function() {
                  browser.waitForAngular().then(function() {
                    page.getJsonPreviewText().then(function(value) {
                      var json = JSON.parse(value);
                      expect(json.properties.simpleRadioButton && json.properties.simpleRadioButton.required.indexOf("_value") >= 0).toBe(true);
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

  it("Should allow mark cardinality field as required", function() {
    var options = {};
    options.inputType = "radio";
    options.fieldTitle = "Simple Radio Button";
    options.minItems = 2;
    options.maxItems = 3;
    options.dontSaveField = true;
    options.options = [];
    options.options.push({value: "Option 1"});
    options.options.push({value: "Option 2"});
    options.options.push({value: "Option 3"});

    page.setElementTitle("Cardinality Radio Button");
    page.setElementDescription("Radio button that is required and is cardinal");

    page.addField(options).then(function() {
      browser.waitForAngular().then(function() {
        expect(page.editingFieldRequiredCheckbox().isPresent()).toBe(true);

        page.editingFieldRequiredCheckbox().click().then(function() {
          browser.waitForAngular().then(function() {
            page.editingFieldAddButton().click().then(function() {
              page.renderedFormAllRenderedFieldsItems().then(function(items) {
                expect(items.length).toBe(options.minItems);
                page.composeElementSaveButton().click().then(function() {
                  browser.waitForAngular().then(function() {
                    page.getJsonPreviewText().then(function(value) {
                      var json = JSON.parse(value);
                      expect(json.properties.simpleRadioButton && json.properties.simpleRadioButton.items.required.indexOf("_value") >= 0).toBe(true);
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

  it("Should allow to set cardinality for radio button", function() {
    page.setElementTitle("2 - 3 Radio button element");
    page.setElementDescription("Radio button with 2 - 3 cardinality");

    page.addInput("radio").then(function() {
      expect(page.editingFieldTitleInput().isDisplayed()).toBe(true);
      expect(page.editingFieldDescriptionInput().isDisplayed()).toBe(true);
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
          browser.sleep(100).then(function() {
            page.editingFieldCardinalityMinItemsOptionsAt(4).click().then(function() {
              page.editingFieldCardinalitySelectedMinItemsEl().getText().then(function(text) {
                expect(text).toBe("2");
              });
            });
          });
        });

        page.editingFieldCardinalityMaxItemsToggle().click().then(function() {
          browser.sleep(100).then(function() {
            page.editingFieldCardinalityMaxItemsOptionsAt(4).click().then(function() {
              page.editingFieldCardinalitySelectedMaxItemsEl().getText().then(function(text) {
                expect(text).toBe("3");
              });
            });
          });
        });

        page.editingFieldTitleInput().sendKeys("Simple radio button");
        page.editingFieldDescriptionInput().sendKeys("A simple radio button that is added by Selenium");
        page.editingFieldLastOptionInput().sendKeys("Option 1");
        page.editingFieldAddAnotherOptionButton().click().then(function() {
          page.editingFieldLastOptionInput().sendKeys("Option 2");
        });

        browser.waitForAngular().then(function() {
          page.editingFieldAddButton().click().then(function() {
            browser.waitForAngular().then(function() {
              page.renderedFormAllRenderedFieldsItems().then(function(items) {
                expect(items.length).toBe(2);
              });

              page.composeElementSaveButton().click().then(function() {
                browser.waitForAngular().then(function() {
                  page.getJsonPreviewText().then(function(value) {
                    var json = JSON.parse(value);
                    expect(json.properties.simpleRadioButton && json.properties.simpleRadioButton.minItems == 2).toBe(true);
                    expect(json.properties.simpleRadioButton && json.properties.simpleRadioButton.maxItems == 3).toBe(true);
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
  xit("Should not set maxItems if maxItems is N", function() {
    page.setElementTitle("1 - N radio button");
    page.setElementDescription("Radio button was created via Selenium");

    page.addInput("radio").then(function() {
      page.editingFieldCardinalityCheckbox().click().then(function() {
        page.editingFieldCardinalityMaxItemsToggle().click().then(function() {
          browser.sleep(200).then(function() {
            page.editingFieldCardinalityMaxItemsOptionsAt(10).click().then(function() {
              page.editingFieldCardinalitySelectedMaxItemsEl().getText().then(function(text) {
                expect(text).toBe("N");
              });
            });
          });
        });

        page.editingFieldTitleInput().sendKeys("Radio button title");
        page.editingFieldDescriptionInput().sendKeys("Simple radio button created via Selenium");
        page.editingFieldLastOptionInput().sendKeys("Option 1");
        page.editingFieldAddAnotherOptionButton().click().then(function() {
          page.editingFieldLastOptionInput().sendKeys("Option 2");
        });

        browser.waitForAngular().then(function() {
          page.editingFieldAddButton().click().then(function() {
            browser.waitForAngular().then(function() {
              page.renderedFormAllRenderedFieldsItems().then(function(items) {
                expect(items.length).toBe(1);
              });

              page.composeElementSaveButton().click().then(function() {
                browser.waitForAngular().then(function() {
                  page.getJsonPreviewText().then(function(value) {
                    browser.sleep(1000).then(function() {
                      var json = JSON.parse(value);
                      expect(json.properties.radioButtonTitle && json.properties.radioButtonTitle.minItems).toBe(undefined);
                      expect(json.properties.radioButtonTitle && json.properties.radioButtonTitle.maxItems).toBe(0);
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

  it("Should not set minItems & maxItems if cardinality is 1 - 1", function() {
    page.setElementTitle("1 - 1 radio button");
    page.setElementDescription("Radio button was created via Selenium");

    page.addInput("radio").then(function() {
      page.editingFieldCardinalityCheckbox().click().then(function() {
        page.editingFieldCardinalityMinItemsToggle().click().then(function(text) {
          browser.sleep(100).then(function() {
            page.editingFieldCardinalityMinItemsOptionsAt(3).click().then(function() {
              page.editingFieldCardinalitySelectedMinItemsEl().getText().then(function(text) {
                expect(text).toBe("1");
              });
            });
          });
        });
        page.editingFieldCardinalityMaxItemsToggle().click().then(function(text) {
          browser.sleep(100).then(function() {
            page.editingFieldCardinalityMaxItemsOptionsAt(2).click().then(function() {
              page.editingFieldCardinalitySelectedMaxItemsEl().getText().then(function(text) {
                expect(text).toBe("1");
              });
            });
          });
        });

        page.editingFieldTitleInput().sendKeys("Radio button title");
        page.editingFieldDescriptionInput().sendKeys("Simple radio button created via Selenium");
        page.editingFieldLastOptionInput().sendKeys("Option 1");
        page.editingFieldAddAnotherOptionButton().click().then(function() {
          page.editingFieldLastOptionInput().sendKeys("Option 2");
        });

        browser.waitForAngular().then(function() {
          page.editingFieldAddButton().click().then(function() {
            page.renderedFormAllRenderedFieldsItems().then(function(items) {
              expect(items.length).toBe(1);
            });

            page.composeElementSaveButton().click().then(function() {
              browser.waitForAngular().then(function() {
                page.getJsonPreviewText().then(function(value) {
                  var json = JSON.parse(value);
                  expect(json.properties.radioButtonTitle && json.properties.radioButtonTitle.minItems == undefined).toBe(true);
                  expect(json.properties.radioButtonTitle && json.properties.radioButtonTitle.maxItems == undefined).toBe(true);
                });
              });
            });
          });
        });
      });
    });
  });

  it("Should allow to add more than 1 field", function() {
    var options = {};
    options.inputType = "radio";
    options.options = [{value: "Option 1"}, {value: "Option 2"}, {value: "Option 3"}];

    page.addField(options).then(function() {
      page.addField(options).then(function() {
        page.renderedFormAllRenderedFields().then(function(fields) {
          expect(fields.length).toBe(2);
        });
      });
    });
  });

  it("Should render added radio button like in run time 'mode' but is disabled", function() {
    var options = {};
    options.inputType = "radio";
    options.fieldTitle = "Radio 1";
    options.minItems = 2;
    options.maxItems = 3;
    options.options = [{value: "Option 1"}, {value: "Option 2"}, {value: "Option 3"}]

    page.addField(options).then(function() {
      page.renderedFormAllRenderedFields().then(function(fields) {
        expect(fields.length).toBe(1);
        for (var i = 0; i < fields.length; i++) {
          var field = fields[i];
          page.renderedFormAllRenderedFieldsItems().then(function(items) {
            expect(items.length).toBe(options.minItems);
            for (var i = 0; i < items.length; i++) {
              items[i].all(by.css(".radio-item")).then(function(its) {
                expect(its.length).toBe(options.options.length);
                for (var j = 0; j < its.length; its++) {
                  (function(idx) {
                    its[idx].getText().then(function(text) {
                      expect(text).toBe(options.options[idx].value);
                    });

                    its[idx].element(by.css("input[type='radio']")).getAttribute("disabled").then(function(attr) {
                      expect(!!attr).toBe(true);
                    });
                  })(j);
                }
              });

              items[i].element(by.css(".extra-label-context")).getText().then(function(label) {
                expect(label).toBe(options.fieldTitle);
              });
            }
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

  it("Should render added radio button with additional things specific to 'edit' mode", function() {
    var options = {};
    options.inputType = "radio";
    options.fieldTitle = "Radio 1";
    options.minItems = 2;
    options.maxItems = 3;
    options.options = [{value: "Option 1"}, {value: "Option 2"}, {value: "Option 3"}]

    page.addField(options).then(function() {
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
    var options = {};
    options.inputType = "radio";
    options.fieldTitle = "Radio 1";
    options.minItems = 2;
    options.maxItems = 3;
    options.options = [{value: "Option 1"}, {value: "Option 2"}, {value: "Option 3"}]

    page.addField(options).then(function() {
      options.fieldType = "Radio 2";
      page.addField(options).then(function() {
        page.renderedFormAllRenderedFields().then(function(fields) {
          var promises = [];
          for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            promises.push(field.element(by.css(".form-group .extra-label-context")).getText())
          }

          protractor.promise.all(promises).then(function(texts) {
            var firstField = page.editingElementFirstFieldSortIcon();
            browser.actions().dragAndDrop(firstField, {x: 0, y: 360}).perform().then(function() {
              page.renderedFormAllRenderedFields().then(function(fields) {
                promises = [];
                for (var i = 0; i < fields.length; i++) {
                  var field = fields[i];
                  promises.push(field.element(by.css(".form-group .extra-label-context")).getText())
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
    options.inputType = "radio";
    options.fieldTitle = "Radio 1";
    options.fieldDescription = "This is a short radio button";
    options.options = [{value: "Option 1"}, {value: "Option 2"}, {value: "Option 3"}];

    var newOptions = {};
    newOptions.minItems = 3;
    newOptions.maxItems = 4;
    newOptions.fieldTitle = "Edited radio 1";
    newOptions.fieldDescription = "Edited description of radio 1";
    newOptions.options = [{value: "Edited option 1"}, {value: "Edited option 2"}, {value: "Edited option 3"}];

    page.addField(options).then(function() {
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

          page.editingFieldAllOptionInputs().then(function(inputs) {
            for (var i = 0; i < inputs.length; i++) {
              (function(index) {
                inputs[index].getAttribute("value").then(function(text) {
                  expect(text).toBe(options.options[index].value);
                });
              })(i);
            }
          });

          page.editingFieldTitleInput().clear().then(function() {
            page.editingFieldTitleInput().sendKeys(newOptions.fieldTitle);
          });

          page.editingFieldDescriptionInput().clear().then(function() {
            page.editingFieldDescriptionInput().sendKeys(newOptions.fieldDescription);
          });

          page.editingFieldRequiredCheckbox().click();

          page.editingFieldCardinalityMinItemsToggle().click().then(function() {
            browser.sleep(100).then(function() {
              page.editingFieldCardinalityMinItemsOptionsAt(newOptions.minItems + 1).click().then(function() {
                page.editingFieldCardinalitySelectedMinItemsEl().getText().then(function(text) {
                  expect(text).toBe("" + newOptions.minItems);
                });
              });
            });
          });

          page.editingFieldCardinalityMaxItemsToggle().click().then(function() {
            browser.sleep(100).then(function() {
              page.editingFieldCardinalityMaxItemsOptionsAt(newOptions.maxItems).click().then(function() {
                page.editingFieldCardinalitySelectedMaxItemsEl().getText().then(function(text) {
                  expect(text).toBe("" + newOptions.maxItems);
                });
              });
            });
          });

          page.editingFieldAllOptionInputs().then(function(inputs) {
            for (var i = 0; i < inputs.length; i++) {
              (function(index) {
                inputs[index].getAttribute("value").then(function(text) {
                  expect(text).toBe(options.options[index].value);
                  inputs[index].clear().then(function() {
                    inputs[index].sendKeys(newOptions.options[index].value);
                  });
                });
              })(i);
            }
          });

          expect(page.editingFieldAddAnotherOptionButton().isDisplayed()).toBe(true);

          page.editingFieldAddButton().click().then(function() {
            page.renderedFormAllRenderedFields().then(function(fields) {
              expect(fields.length).toBe(1);
              for (var i = 0; i < fields.length; i++) {
                var field = fields[i];
                field.all(by.css(".fields > .form-group")).then(function(formGroups) {
                  expect(formGroups.length).toBe(newOptions.minItems);
                  for (var j = 0; j < formGroups.length; j++) {
                    (function(index) {
                      formGroups[index].all(by.css("input[type='radio']")).then(function(radios) {
                        expect(radios.length).toBe(newOptions.options.length);
                        for (var k = 0; k < radios.length; k++) {
                          (function(idx) {
                            radios[idx].getText(function(text) {
                              expect(text).toBe(newOptions.options[idx]);
                            });
                          })(k);
                        }
                      });
                    })(i);
                  }
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

  it("Should allow to remove field without adding to element", function() {
    var options = {};
    options.minItems = 2;
    options.maxItems = 3;
    options.inputType = "radio";
    options.fieldTitle = "Radio 1";
    options.fieldDescription = "This is a short radio button";
    options.options = [{value: "Option 1"}, {value: "Option 2"}, {value: "Option 3"}];
    options.dontSaveField = true;

    page.addField(options).then(function() {
      page.editingFieldRemoveButton().click().then(function() {
        page.renderedFormAllRenderedFields().then(function(fields) {
          expect(fields.length).toBe(0);
        });
      });
    });
  });

  it("Should allow to remove field after added to element", function() {
    var options = {};
    options.minItems = 2;
    options.maxItems = 3;
    options.inputType = "radio";
    options.fieldTitle = "Radio 1";
    options.fieldDescription = "This is a short radio button";
    options.options = [{value: "Option 1"}, {value: "Option 2"}, {value: "Option 3"}];

    page.addField(options).then(function() {
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
});
