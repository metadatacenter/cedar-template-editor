'use strict';
var CreateElementPage = require('../pages/create-element-page.js');
var _ = require('../libs/lodash.min.js')
xdescribe('create-element-add-element', function () {
  var page;
  beforeEach(function () {
    page = new CreateElementPage();
    page.get();
    browser.driver.manage().window().maximize();
  });
  xit("Should allow to add element without cardinality", function () {
    var elementTitle = "Created at " + (new Date()).getTime();
    var elementDescription = "Created by protractor";
    var options = {};
    options.fieldTitle = "Text 1";
    page.setElementTitle(elementTitle);
    page.setElementDescription(elementDescription);
    page.addTextField(options).then(function () {
      page.composeElementSaveButton().click().then(function () {
        page.get();
        page.composeElementAddElement({elementTitle: elementTitle, dontSave: true}).then(function () {
          page.renderedFormAllEditingElements().then(function (elements) {
            expect(elements.length).toBe(1);
            var element = elements[0];
            expect(element.element(by.css("input[type='text']")).isPresent()).toBe(true);
            element.element(by.css(".floating-label")).getText().then(function (text) {
              expect(text).toBe(options.fieldTitle);
            });
          });
          page.editingElementSaveButton().click().then(function () {
            page.renderedFormAllAddedElements().then(function (elements) {
              expect(elements.length).toBe(1);
            });
          });
        });
      });
    });
  });
  xit("Should allow to add element with cardinality", function () {
    var elementTitle = "Created at " + (new Date()).getTime();
    var elementDescription = "Created by protractor";
    var options = {};
    options.fieldTitle = "Text 1";
    options.minItems = 2;
    options.maxItems = 2;
    page.setElementTitle(elementTitle);
    page.setElementDescription(elementDescription);
    page.addTextField(options).then(function () {
      page.composeElementSaveButton().click().then(function () {
        page.get();
        page.composeElementAddElement({elementTitle: elementTitle, dontSave: true}).then(function () {
          page.renderedFormAllEditingElements().then(function (elements) {
            expect(elements.length).toBe(1);
            var element = elements[0];
            expect(element.element(by.css("input[type='text']")).isPresent()).toBe(true);
            element.element(by.css(".floating-label")).getText().then(function (text) {
              expect(text).toBe(options.fieldTitle);
            });
          });
          page.editingElementCardinalityCheckbox().click().then(function () {
            page.editingElementCardinalityMinItemsSelectedEl().getText().then(function (text) {
              expect(text).toBe("");
            });
            page.editingElementCardinalityMaxItemsSelectedEl().getText().then(function (text) {
              expect(text).toBe("");
            });
            var elementMinItems = 2;
            var elementMaxItems = 3;
            page.editingElementCardinalityMinItemsToggle().click().then(function () {
              browser.sleep(50).then(function () {
                page.editingElementCardinalityMinItemsOptionsAt(elementMinItems + 2).click().then(function () {
                  page.editingElementCardinalityMinItemsSelectedEl().getText(function (text) {
                    expect(text).toBe("" + elementMinItems);
                  });
                });
              });
            });
            page.editingElementCardinalityMaxItemsToggle().click().then(function () {
              browser.sleep(50).then(function () {
                page.editingElementCardinalityMaxItemsOptionsAt(elementMaxItems + 1).click().then(function () {
                  page.editingElementCardinalityMaxItemsSelectedEl().getText(function (text) {
                    expect(text).toBe("" + elementMaxItems);
                  });
                });
              });
            });
            browser.waitForAngular().then(function () {
              page.editingElementSaveButton().click().then(function () {
                page.renderedFormAllAddedElements().then(function (elements) {
                  expect(elements.length).toBe(1);
                  var element = elements[0];
                  element.element(by.css(".element-header .multiple-instance-cardinality")).getText().then(function (text) {
                    expect(text).toBe("" + elementMinItems + " .. " + elementMaxItems);
                  });
                });
              });
            });
          });
        });
      });
    });
  });
// FIXME: This does not display error message. 
  xit("Should not allow to add element that min cardinality greater than max cardinality", function () {
    var elementTitle = "Created at " + (new Date()).getTime();
    var elementDescription = "Created by protractor";
    var options = {};
    options.fieldTitle = "Text 1";
    options.minItems = 2;
    options.maxItems = 2;
    page.setElementTitle(elementTitle);
    page.setElementDescription(elementDescription);
    page.addTextField(options).then(function () {
      page.composeElementSaveButton().click().then(function () {
        page.get();
        page.composeElementAddElement({elementTitle: elementTitle, dontSave: true}).then(function () {
          page.editingElementCardinalityCheckbox().click().then(function () {
            var elementMinItems = 3;
            var elementMaxItems = 2;
            page.editingElementCardinalityMinItemsToggle().click().then(function () {
              browser.sleep(50).then(function () {
                page.editingElementCardinalityMinItemsOptionsAt(elementMinItems + 2).click().then(function () {
                  page.editingElementCardinalityMinItemsSelectedEl().getText(function (text) {
                    expect(text).toBe("" + elementMinItems);
                  });
                });
              });
            });
            page.editingElementCardinalityMaxItemsToggle().click().then(function () {
              browser.sleep(50).then(function () {
                page.editingElementCardinalityMaxItemsOptionsAt(elementMaxItems + 1).click().then(function () {
                  page.editingElementCardinalityMaxItemsSelectedEl().getText(function (text) {
                    expect(text).toBe("" + elementMaxItems);
                  });
                });
              });
            });
            browser.sleep(1000).then(function () {
              page.editingElementSaveButton().click().then(function () {
                page.errorMessageTexts().then(function (texts) {
                  expect(texts.length).toBe(1);
                  expect(texts[0]).toBe("Min cannot be greater than Max.");
                });
              });
            });
          });
        });
      });
    });
  });
  xit("Should not allow to create element with an editing element", function () {
    var elementTitle = "Created at " + (new Date()).getTime();
    var elementDescription = "Created by protractor";
    var options = {};
    options.fieldTitle = "Text 1";
    options.minItems = 2;
    options.maxItems = 2;
    page.setElementTitle(elementTitle);
    page.setElementDescription(elementDescription);
    page.addTextField(options).then(function () {
      page.composeElementSaveButton().click().then(function () {
        page.get();
        page.composeElementAddElement({elementTitle: elementTitle, dontSave: true}).then(function () {
          page.setElementTitle("Another element");
          page.setElementDescription("This element contains another element");
          page.composeElementSaveButton().click().then(function () {
            page.errorMessageTexts().then(function (texts) {
              expect(texts.length).toBe(1);
              expect(texts[0]).toMatch(/The following element(?:s?) are still not finished editing/i)
            });
            page.errorElementsContainer().getText().then(function (text) {
              expect(text.indexOf(elementTitle) >= 0).toBe(true);
            });
          });
        });
      });
    });
  });
  xit("Should not allow to save element with an editing element", function () {
    var elementTitle = "Created at " + (new Date()).getTime();
    var elementDescription = "Created by protractor";
    var options = {};
    options.fieldTitle = "Text 1";
    options.minItems = 2;
    options.maxItems = 2;
    page.setElementTitle(elementTitle);
    page.setElementDescription(elementDescription);
    page.addTextField(options).then(function () {
      page.composeElementSaveButton().click().then(function () {
        page.get();
        page.composeElementAddElement({elementTitle: elementTitle, dontSave: true}).then(function () {
          page.setElementTitle("Another element");
          page.setElementDescription("This element contains another element");
          page.editingElementSaveButton().click().then(function () {
            page.composeElementSaveButton().click().then(function () {
              browser.sleep(1000).then(function () {
                browser.getCurrentUrl().then(function (url) {
                  expect(url.indexOf("/elements/edit") >= 0).toBe(true);
                });
                page.renderedFormAllAddedElements().then(function (elements) {
                  expect(elements.length).toBe(1);
                  var element = elements[0];
                  element.element(by.css(".element-header .edit")).click().then(function () {
                    page.composeElementSaveButton().click().then(function () {
                      page.errorMessageTexts().then(function (texts) {
                        expect(texts.length).toBe(1);
                        expect(texts[0]).toMatch(/The following element(?:s?) are still not finished editing/i)
                      });
                      page.errorElementsContainer().getText().then(function (text) {
                        expect(text.indexOf(elementTitle) >= 0).toBe(true);
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
  xit("Should allow to re-arrange field in nested element", function () {
    var elementTitle = "Created at " + (new Date()).getTime();
    var elementDescription = "Created by protractor";
    page.setElementTitle(elementTitle);
    page.setElementDescription(elementDescription);
    page.addTextField({fieldTitle: "Text 1"}).then(function () {
      page.addTextField({fieldTitle: "Text 2"}).then(function () {
        page.composeElementSaveButton().click().then(function () {
          page.get();
          page.composeElementAddElement({elementTitle: elementTitle, dontSave: true}).then(function (text) {
            page.editingElementSaveButton().click().then(function () {
              page.renderedFormAllAddedElements().then(function (elements) {
                expect(elements.length).toBe(1);
                var element = elements[0];
                element.all(by.css(".field-root")).then(function (fields) {
                  expect(fields.length).toBe(2);
                  var promises = [];
                  for (var i = 0; i < fields.length; i++) {
                    promises.push(fields[i].element(by.css(".form-group .floating-label")).getText());
                  }
                  protractor.promise.all(promises).then(function (texts) {
                    var firstFieldSortIcon = fields[0].element(by.css(".sortable-icon"));
                    var lastFieldSortIcon = fields[1].element(by.css(".sortable-icon"));
                    browser.actions().dragAndDrop(firstFieldSortIcon, {x: 0, y: 140}).perform().then(function () {
                      browser.sleep(1000).then(function () {
                        element.all(by.css(".field-root")).then(function (fields) {
                          expect(fields.length).toBe(2);
                          var promises = [];
                          for (var i = 0; i < fields.length; i++) {
                            promises.push(fields[i].element(by.css(".form-group .floating-label")).getText());
                          }
                          protractor.promise.all(promises).then(function (arrangedTexts) {
                            expect(texts[0]).toBe(arrangedTexts[1]);
                            expect(texts[1]).toBe(arrangedTexts[0]);
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
// FIXME: Weird "stale element reference: element is not attached to the page document" error 
  xit("Should allow to re-arrange nested elements", function () {
    var timestamp = ("" + (new Date()).getTime()).substr(-8);
    var elementTitle = "Created at " + timestamp;
    var elementDescription = "Created by protractor";
    var nestedElement1Title = "Nested " + timestamp + "_1";
    var nestedElement1Description = "Nested element 1 - Created by protractor";
    var nestedElement2Title = "Nested " + timestamp + "_2";
    var nestedElement2Description = "Nested element 2 - Created by protractor";
    page.setElementTitle(nestedElement1Title);
    page.setElementDescription(nestedElement1Description);
    page.addTextField({fieldTitle: "Nested Text1"}).then(function () {
      page.composeElementSaveButton().click().then(function () {
        page.get();
        page.setElementTitle(nestedElement2Title);
        page.setElementDescription(nestedElement2Description);
        page.addTextField({fieldTile: "Nested Text2"}).then(function () {
          page.composeElementSaveButton().click().then(function () {
            page.get();
            page.setElementTitle(elementTitle);
            page.setElementDescription(elementDescription);
            page.composeElementAddElement({elementTitle: nestedElement1Title, dontSave: true}).then(function () {
              browser.sleep(10).then(function () {
                page.editingElementSaveButton().click().then(function () {
                  page.composeElementAddElement({elementTitle: nestedElement2Title, dontSave: true}).then(function () {
                    browser.sleep(10).then(function () {
                      page.editingElementSaveButton().click().then(function () {
                        page.composeElementSaveButton().click().then(function () {
                          browser.sleep(1000).then(function () {
                            page.get();
                            page.composeElementAddElement({
                              elementTitle: elementTitle,
                              dontSave    : true
                            }).then(function () {
                              browser.sleep(1000).then(function () {
                                page.renderedFormAllEditingElements().then(function (elements) {
                                  expect(elements.length).toBe(1);
                                  var element = elements[0];
                                  element.all(by.css(".element-root")).then(function (nestedElements) {
                                    expect(nestedElements.length).toBe(2);
                                    var promises = [];
                                    for (var i = 0; i < nestedElements.length; i++) {
                                      promises.push(nestedElements[i].element(by.css(".element-header .element-name-label")).getText())
                                    }
                                    protractor.promise.all(promises).then(function (texts) {
                                      var firstNestedElement = nestedElements[0];
                                      var sortableIcon = firstNestedElement.element(by.css(".element-header .sortable-icon"));
                                      browser.actions().dragAndDrop(sortableIcon,
                                          {x: 0, y: 220}).perform().then(function () {
                                            browser.sleep(1000).then(function () {
                                              element.all(by.css(".element-root")).then(function (nestedElements) {
                                                expect(nestedElements.length).toBe(2);
                                                promises = [];
                                                for (var i = 0; i < nestedElements.length; i++) {
                                                  promises.push(nestedElements[i].element(by.css(".element-header .element-name-label")).getText())
                                                }
                                                protractor.promise.all(promises).then(function (arrangedTexts) {
                                                  expect(texts[0]).toBe(arrangedTexts[1]);
                                                  expect(texts[1]).toBe(arrangedTexts[0]);
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
            });
          });
        });
      });
    });
  }, 60000);
  xit("Should allow to remove nested element without adding to the element", function () {
    var elementTitle = "Created at " + (new Date()).getTime();
    var elementDescription = "Created by protractor";
    var options = {};
    options.fieldTitle = "Text 1";
    options.minItems = 2;
    options.maxItems = 2;
    page.setElementTitle(elementTitle);
    page.setElementDescription(elementDescription);
    page.addTextField(options).then(function () {
      page.composeElementSaveButton().click().then(function () {
        page.get();
        page.composeElementAddElement({elementTitle: elementTitle, dontSave: true}).then(function () {
          page.renderedFormAllEditingElements().then(function (elements) {
            expect(elements.length).toBe(1);
            var element = elements[0];
            element.element(by.css(".configuration-options .remove")).click().then(function () {
              page.renderedFormAllEditingElements().then(function (elements) {
                expect(elements.length).toBe(0);
              });
            });
          });
        });
      });
    });
  });
  xit("Should allow to remove nested element after added to the element", function () {
    var elementTitle = "Created at " + (new Date()).getTime();
    var elementDescription = "Created by protractor";
    var options = {};
    options.fieldTitle = "Text 1";
    options.minItems = 2;
    options.maxItems = 2;
    page.setElementTitle(elementTitle);
    page.setElementDescription(elementDescription);
    page.addTextField(options).then(function () {
      page.composeElementSaveButton().click().then(function () {
        page.get();
        page.composeElementAddElement({elementTitle: elementTitle, dontSave: true}).then(function () {
          page.renderedFormAllEditingElements().then(function (elements) {
            expect(elements.length).toBe(1);
            page.editingElementSaveButton().click().then(function () {
              page.renderedFormAllAddedElements().then(function (elements) {
                expect(elements.length).toBe(1);
                elements[0].element(by.css(".element-header .remove")).click().then(function () {
                  page.renderedFormAllAddedElements().then(function (elements) {
                    expect(elements.length).toBe(0);
                  });
                });
              });
            });
          });
        });
      });
    });
  });
  xit("Should not allow to add element while there is an editing field", function () {
    var timestamp = ("" + (new Date()).getTime()).substr(-8);
    var elementTitle = "Created at " + timestamp;
    var elementDescription = "Created by protractor";
    page.setElementTitle(elementTitle);
    page.setElementDescription(elementDescription);
    page.addTextField({fieldTitle: "Text1"}).then(function () {
      page.composeElementSaveButton().click().then(function () {
        page.get();
        var editingFieldTitle = "Text2";
        page.addTextField({fieldTitle: editingFieldTitle, dontSaveField: true}).then(function () {
          page.composeElementAddElement({elementTitle: elementTitle, dontSave: true}).then(function () {
            expect(page.errorMessageContainer().isPresent()).toBe(true);
            if (page.errorMessageContainer().isPresent()) {
              page.errorMessageContainer().getText().then(function (text) {
                expect(text).toMatch(/The following field(?:s?) are still not finished editing/i);
              });
              page.errorElementsContainer().getText().then(function (text) {
                expect(text.indexOf(editingFieldTitle) >= 0).toBe(true);
              });
            }
          });
        });
      });
    });
  });
  xit("Should not allow to add another element while there is an editing element", function () {
    var timestamp = ("" + (new Date()).getTime()).substr(-8);
    var element1Title = "Element " + timestamp + "_1";
    var element1Description = "Element 1 - Created by protractor";
    var element2Title = "Element " + timestamp + "_2";
    var element2Description = "Element 2 - Created by protractor";
    page.setElementTitle(element1Title);
    page.setElementDescription(element1Description);
    page.addTextField({fieldTitle: "Text1"}).then(function () {
      page.composeElementSaveButton().click().then(function () {
        page.get();
        page.setElementTitle(element2Title);
        page.setElementDescription(element2Description);
        page.addTextField({fieldTile: "Text2"}).then(function () {
          page.composeElementSaveButton().click().then(function () {
            page.get();
            page.composeElementAddElement({elementTitle: element1Title, dontSave: true}).then(function () {
              browser.sleep(1000);
              page.composeElementAddElement({elementTitle: element2Title, dontSave: true}).then(function () {
                expect(page.errorMessageContainer().isPresent()).toBe(true);
                if (page.errorMessageContainer().isPresent()) {
                  page.errorMessageContainer().getText().then(function (text) {
                    expect(text).toMatch(/The following element(?:s?) are still not finished editing/i);
                  });
                  page.errorElementsContainer().getText().then(function (text) {
                    expect(text.indexOf(element1Title) >= 0).toBe(true);
                  });
                }
              });
            });
          });
        });
      });
    });
  });
  xit("Should allow nested element to be collapsible", function () {
    var timestamp = ("" + (new Date()).getTime()).substr(-8);
    var elementTitle = "Created at " + timestamp;
    var elementDescription = "Created by protractor";
    page.setElementTitle(elementTitle);
    page.setElementDescription(elementDescription);
    page.addTextField({fieldTitle: "Text1"}).then(function () {
      page.composeElementSaveButton().click().then(function () {
        page.get();
        page.composeElementAddElement({elementTitle: elementTitle, dontSave: true}).then(function () {
          page.renderedFormAllEditingElements().then(function (elements) {
            expect(elements.length).toBe(1);
            var element = elements[0];
            expect(element.element(by.css(".element-header .visibilitySwitch .cedar-svg-collapse")).isDisplayed()).toBe(true);
            expect(element.element(by.css(".element-header .visibilitySwitch .cedar-svg-expand")).isDisplayed()).toBe(false);
            element.all(by.css("input[type='text']")).then(function (inputs) {
              for (var i = 0; i < inputs.length; i++) {
                expect(inputs[i].isDisplayed()).toBe(true);
              }
            });
            element.element(by.css(".element-header .visibilitySwitch")).click().then(function () {
              expect(element.element(by.css(".element-header .visibilitySwitch .cedar-svg-collapse")).isDisplayed()).toBe(false);
              expect(element.element(by.css(".element-header .visibilitySwitch .cedar-svg-expand")).isDisplayed()).toBe(true);
              element.all(by.css("input[type='text']")).then(function (inputs) {
                for (var i = 0; i < inputs.length; i++) {
                  expect(inputs[i].isDisplayed()).toBe(false);
                }
              });
              element.element(by.css(".element-header .visibilitySwitch .cedar-svg-expand")).click().then(function () {
                expect(element.element(by.css(".element-header .visibilitySwitch .cedar-svg-collapse")).isDisplayed()).toBe(true);
                expect(element.element(by.css(".element-header .visibilitySwitch .cedar-svg-expand")).isDisplayed()).toBe(false);
                element.all(by.css("input[type='text']")).then(function (inputs) {
                  for (var i = 0; i < inputs.length; i++) {
                    expect(inputs[i].isDisplayed()).toBe(true);
                  }
                });
                element.element(by.css(".save-options .add")).click().then(function () {
                  page.renderedFormAllAddedElements().then(function (elements) {
                    expect(elements.length).toBe(1);
                    element = elements[0];
                    expect(element.element(by.css(".element-header .visibilitySwitch .cedar-svg-collapse")).isDisplayed()).toBe(true);
                    expect(element.element(by.css(".element-header .visibilitySwitch .cedar-svg-expand")).isDisplayed()).toBe(false);
                    element.all(by.css("input[type='text']")).then(function (inputs) {
                      for (var i = 0; i < inputs.length; i++) {
                        expect(inputs[i].isDisplayed()).toBe(true);
                      }
                    });
                    element.element(by.css(".element-header .visibilitySwitch")).click().then(function () {
                      expect(element.element(by.css(".element-header .visibilitySwitch .cedar-svg-collapse")).isDisplayed()).toBe(false);
                      expect(element.element(by.css(".element-header .visibilitySwitch .cedar-svg-expand")).isDisplayed()).toBe(true);
                      element.all(by.css("input[type='text']")).then(function (inputs) {
                        for (var i = 0; i < inputs.length; i++) {
                          expect(inputs[i].isDisplayed()).toBe(false);
                        }
                      });
                      element.element(by.css(".element-header .visibilitySwitch .cedar-svg-expand")).click().then(function () {
                        expect(element.element(by.css(".element-header .visibilitySwitch .cedar-svg-collapse")).isDisplayed()).toBe(true);
                        expect(element.element(by.css(".element-header .visibilitySwitch .cedar-svg-expand")).isDisplayed()).toBe(false);
                        element.all(by.css("input[type='text']")).then(function (inputs) {
                          for (var i = 0; i < inputs.length; i++) {
                            expect(inputs[i].isDisplayed()).toBe(true);
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
  });
  xit("Should allow to clear adding element", function () {
    var elementTitle = "Created at " + (new Date()).getTime();
    page.setElementTitle(elementTitle);
    page.setElementDescription("Just a simple text field");
    page.addTextField().then(function () {
      page.editingFieldAddButton().click().then(function () {
        page.get();
        page.composeElementAddElement({elementTitle: elementTitle, dontSave: true}).then(function () {
          expect(page.composeElementClearButton().isPresent()).toBe(true);
          expect(page.renderedFormEditingElement().isPresent()).toBe(true);
          page.composeElementClearButton().click().then(function () {
            browser.waitForAngular().then(function () {
              expect(page.renderedFormEditingElement().isPresent()).toBe(false);
            });
          });
        });
      });
    });
  });
  xit("Should allow to clear added element", function () {
    var elementTitle = "Created at " + (new Date()).getTime();
    page.setElementTitle(elementTitle);
    page.setElementDescription("Just a simple text field");
    page.addTextField().then(function () {
      page.editingFieldAddButton().click().then(function () {
        page.get();
        page.composeElementAddElement({elementTitle: elementTitle, dontSave: true}).then(function () {
          page.editingElementSaveButton().click().then(function () {
            expect(page.composeElementClearButton().isPresent()).toBe(true);
            expect(page.renderedFormEditingElement().isPresent()).toBe(false);
            page.renderedFormAllAddedElements().then(function (elements) {
              expect(elements.length).toBe(1);
              page.composeElementClearButton().click().then(function () {
                browser.waitForAngular().then(function () {
                  page.renderedFormAllAddedElements().then(function (elements) {
                    expect(elements.length).toBe(0);
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