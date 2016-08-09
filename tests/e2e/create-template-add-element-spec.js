'use strict';
var CreateTemplatePage = require('../pages/create-template-page.js');
var CreateElementPage = require('../pages/create-element-page.js');
var _ = require('../libs/lodash.min.js')
xdescribe('create-template-add-element', function () {
  var page, elementPage;
  beforeEach(function () {
    page = new CreateTemplatePage();
    elementPage = new CreateElementPage();
// page.get(); 
    browser.driver.manage().window().maximize();
  });
  xit("Should allow to add element without cardinality", function () {
    var options = {};
    options.elementTitle = "Created at " + (new Date()).getTime();
    options.elementDescription = "Created by script";
    options.fieldsOptions = [{}];
    options.fieldsOptions[0].fieldTitle = "Simple field";
    elementPage.createElement(options).then(function () {
      browser.sleep(1000).then(function () {
        page.get();
        browser.sleep(1000).then(function () {
          page.composeTemplateAddElement(options.elementTitle).then(function () {
            page.renderedFormAllEditingElements().then(function (elements) {
              expect(elements.length).toBe(1);
              var element = elements[0];
              expect(element.element(by.css("input[type='text']")).isPresent()).toBe(true);
              element.element(by.css(".floating-label")).getText().then(function (text) {
                expect(text).toBe(options.fieldsOptions[0].fieldTitle);
              });
            });
            page.editingElementSaveButton().click().then(function () {
              browser.sleep(1000).then(function () {
                page.renderedFormAllAddedElements().then(function (elements) {
                  expect(elements.length).toBe(1);
                });
              });
            });
          });
        });
      });
    });
  });
  xit("Should allow to add element with cardinality", function () {
    var options = {};
    options.elementTitle = "Created at " + (new Date()).getTime();
    options.elementDescription = "Created by script";
    options.fieldsOptions = [{}];
    options.fieldsOptions[0].fieldTitle = "Simple field";
    options.fieldsOptions[0].minItems = 2;
    options.fieldsOptions[0].maxItems = 2;
    elementPage.createElement(options).then(function () {
      browser.sleep(1000).then(function () {
        page.get();
        browser.sleep(1000).then(function () {
          page.composeTemplateAddElement(options.elementTitle).then(function () {
            browser.sleep(1000).then(function () {
              page.renderedFormAllEditingElements().then(function (elements) {
                expect(elements.length).toBe(1);
                var element = elements[0];
                expect(element.element(by.css("input[type='text']")).isPresent()).toBe(true);
                element.element(by.css(".floating-label")).getText().then(function (text) {
                  expect(text).toBe(options.fieldsOptions[0].fieldTitle);
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
                  browser.sleep(50);
                  page.editingElementCardinalityMaxItemsOptionsAt(elementMaxItems + 1).click().then(function () {
                    page.editingElementCardinalityMaxItemsSelectedEl().getText(function (text) {
                      expect(text).toBe("" + elementMaxItems);
                    });
                  });
                });
                browser.sleep(1000).then(function () {
                  page.editingElementSaveButton().click().then(function () {
                    browser.sleep(1000).then(function () {
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
      });
    });
  });
  xit("Should not allow to create template with an editing element", function () {
    var options = {};
    options.elementTitle = "Created at " + (new Date()).getTime();
    options.elementDescription = "Created by script";
    options.fieldsOptions = [{}];
    options.fieldsOptions[0].fieldTitle = "Simple field";
    options.fieldsOptions[0].minItems = 2;
    options.fieldsOptions[0].maxItems = 2;
    elementPage.createElement(options).then(function () {
      browser.sleep(1000).then(function () {
        page.get();
        browser.sleep(1000).then(function () {
          page.composeTemplateAddElement(options.elementTitle).then(function () {
            page.setTemplateTitle("Another element");
            page.setTemplateDescription("Created by a script");
            page.composeTemplateSaveButton().click().then(function () {
              page.errorMessageTexts().then(function (texts) {
                expect(texts.length).toBe(1);
                expect(texts[0]).toMatch(/The following element(?:s?) are still not finished editing/i)
              });
              page.errorElementsContainer().getText().then(function (text) {
                expect(text.indexOf(options.elementTitle) >= 0).toBe(true);
              });
            });
          });
        });
      });
    });
  });
// FIXME: Weird stale element error 
  xit("Should not allow to save template with an editing element", function () {
    var options = {};
    options.elementTitle = "Created at " + (new Date()).getTime();
    options.elementDescription = "Created by script";
    options.fieldsOptions = [{}];
    options.fieldsOptions[0].fieldTitle = "Simple field";
    options.fieldsOptions[0].minItems = 2;
    options.fieldsOptions[0].maxItems = 2;
    elementPage.createElement(options).then(function () {
      browser.sleep(1000).then(function () {
        page.get();
        browser.sleep(1000).then(function () {
          page.composeTemplateAddElement(options.elementTitle).then(function () {
            page.setTemplateTitle("Another element");
            page.setTemplateDescription("This element contains another element");
            page.editingElementSaveButton().click().then(function () {
              browser.sleep(1000).then(function () {
                page.composeTemplateSaveButton().click().then(function () {
                  browser.sleep(1000).then(function () {
                    browser.getCurrentUrl().then(function (url) {
                      expect(url.indexOf("/templates/edit") >= 0).toBe(true);
                    });
                    page.renderedFormAllAddedElements().then(function (elements) {
                      expect(elements.length).toBe(1);
                      var element = elements[0];
                      element.element(by.css(".element-header .edit")).click().then(function () {
                        browser.sleep(1000).then(function () {
                          page.composeTemplateSaveButton().click().then(function () {
                            page.errorMessageTexts().then(function (texts) {
                              expect(texts.length).toBe(1);
                              expect(texts[0]).toMatch(/The following element(?:s?) are still not finished editing/i)
                            });
                            page.errorElementsContainer().getText().then(function (text) {
                              expect(text.indexOf(options.elementTitle) >= 0).toBe(true);
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
  xit("Should allow to re-arrange field in nested element", function () {
    var elementTitle = "Created at " + (new Date()).getTime();
    var elementDescription = "Created by protractor";
    elementPage.get();
    elementPage.setElementTitle(elementTitle);
    elementPage.setElementDescription(elementDescription);
    elementPage.addTextField({fieldTitle: "Text 1"}).then(function () {
      elementPage.addTextField({fieldTitle: "Text 2"}).then(function () {
        elementPage.composeElementSaveButton().click().then(function () {
          page.get();
          browser.sleep(1000).then(function () {
            page.composeTemplateAddElement(elementTitle).then(function (text) {
              page.editingElementSaveButton().click().then(function () {
                browser.sleep(1000).then(function () {
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
    elementPage.get();
    browser.sleep(1000).then(function () {
      elementPage.setElementTitle(nestedElement1Title);
      elementPage.setElementDescription(nestedElement1Description);
      elementPage.addTextField({fieldTitle: "Nested Text1"}).then(function () {
        elementPage.composeElementSaveButton().click().then(function () {
          elementPage.get();
          browser.sleep(1000).then(function () {
            elementPage.setElementTitle(nestedElement2Title);
            elementPage.setElementDescription(nestedElement2Description);
            elementPage.addTextField({fieldTile: "Nested Text2"}).then(function () {
              elementPage.composeElementSaveButton().click().then(function () {
                elementPage.get();
                browser.sleep(1000).then(function () {
                  elementPage.setElementTitle(elementTitle);
                  elementPage.setElementDescription(elementDescription);
                  elementPage.composeElementAddElement({
                    elementTitle: nestedElement1Title,
                    dontSave    : true
                  }).then(function () {
                    browser.sleep(10).then(function () {
                      elementPage.editingElementSaveButton().click().then(function () {
                        elementPage.composeElementAddElement({
                          elementTitle: nestedElement2Title,
                          dontSave    : true
                        }).then(function () {
                          browser.sleep(10).then(function () {
                            elementPage.editingElementSaveButton().click().then(function () {
                              elementPage.composeElementSaveButton().click().then(function () {
                                browser.sleep(1000).then(function () {
                                  page.get();
                                  browser.sleep(1000).then(function () {
                                    page.composeTemplateAddElement(elementTitle).then(function () {
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
          });
        });
      });
    });
  }, 60000);
  xit("Should allow to remove element without adding to the template", function () {
    var options = {};
    options.elementTitle = "Created at " + (new Date()).getTime();
    options.elementDescription = "Created by script";
    options.fieldsOptions = [{}];
    options.fieldsOptions[0].fieldTitle = "Simple field";
    options.fieldsOptions[0].minItems = 2;
    options.fieldsOptions[0].maxItems = 2;
    elementPage.createElement(options).then(function () {
      browser.sleep(1000).then(function () {
        page.get();
        browser.sleep(1000).then(function () {
          page.setTemplateTitle("Simple page");
          page.setTemplateDescription("Just a demo template");
          page.composeTemplateAddElement(options.elementTitle).then(function () {
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
  });
  xit("Should allow to remove element after added to the element", function () {
    var options = {};
    options.elementTitle = "Created at " + (new Date()).getTime();
    options.elementDescription = "Created by script";
    options.fieldsOptions = [{}];
    options.fieldsOptions[0].fieldTitle = "Simple field";
    options.fieldsOptions[0].minItems = 2;
    options.fieldsOptions[0].maxItems = 2;
    elementPage.createElement(options).then(function () {
      browser.sleep(1000).then(function () {
        page.get();
        browser.sleep(1000).then(function () {
          page.composeTemplateAddElement(options.elementTitle).then(function () {
            browser.sleep(1000).then(function () {
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
    });
  });
  xit("Should not allow to add element while there is an editing field", function () {
    var options = {};
    options.elementTitle = "Created at " + ("" + (new Date()).getTime()).substr(-8);
    options.elementDescription = "Created by script";
    options.fieldsOptions = [{}];
    options.fieldsOptions[0].fieldTitle = "Simple field";
    options.fieldsOptions[0].minItems = 2;
    options.fieldsOptions[0].maxItems = 2;
    elementPage.createElement(options).then(function () {
      browser.sleep(1000).then(function () {
        page.get();
        browser.sleep(1000).then(function () {
          var editingFieldTitle = "Text2";
          page.addTextField({fieldTitle: editingFieldTitle, dontSaveField: true}).then(function () {
            page.composeTemplateAddElement(options.elementTitle).then(function () {
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
  });
  xit("Should not allow to add another element while there is an editing element", function () {
    var timestamp = ("" + (new Date()).getTime()).substr(-8);
    var element1Title = "Element " + timestamp + "_1";
    var element1Description = "Element 1 - Created by protractor";
    var element2Title = "Element " + timestamp + "_2";
    var element2Description = "Element 2 - Created by protractor";
    elementPage.createElement({elementTitle: element1Title, elementDescription: element1Description}).then(function () {
      browser.sleep(1000).then(function () {
        elementPage.createElement({
          elementTitle      : element2Title,
          elementDescription: element2Description
        }).then(function () {
          browser.sleep(1000).then(function () {
            page.get();
            browser.sleep(1000).then(function () {
              page.composeTemplateAddElement(element1Title).then(function () {
                browser.sleep(1000).then(function () {
                  page.composeTemplateAddElement(element2Title).then(function () {
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
    });
  });
  xit("Should allow element to be collapsible", function () {
    var options = {};
    options.elementTitle = "Created at " + ("" + (new Date()).getTime()).substr(-8);
    options.elementDescription = "Created by script";
    options.fieldsOptions = [{}];
    options.fieldsOptions[0].fieldTitle = "Simple field";
    elementPage.createElement(options).then(function () {
      browser.sleep(1000).then(function () {
        page.get();
        browser.sleep(1000).then(function () {
          page.composeTemplateAddElement(options.elementTitle).then(function () {
            browser.sleep(1000).then(function () {
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
                      browser.sleep(1000).then(function () {
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
      });
    });
  });
  xit("Should allow to clear adding element", function () {
    var options = {};
    options.elementTitle = "Created at " + (new Date()).getTime();
    options.elementDescription = "Created by script";
    options.fieldsOptions = [{}];
    options.fieldsOptions[0].fieldTitle = "Simple field";
    elementPage.createElement(options).then(function () {
      browser.sleep(1000).then(function () {
        page.get();
        browser.sleep(1000).then(function () {
          page.composeTemplateAddElement(options.elementTitle).then(function () {
            expect(page.composeTemplateClearButton().isPresent()).toBe(true);
            expect(page.renderedFormEditingElement().isPresent()).toBe(true);
            page.composeTemplateClearButton().click().then(function () {
              browser.sleep(1000).then(function () {
                page.sweetAlertConfirmButton().click().then(function () {
                  browser.sleep(1000).then(function () {
                    expect(page.renderedFormEditingElement().isPresent()).toBe(false);
                  });
                });
              });
            });
          });
        });
      });
    });
  });
  xit("Should allow to clear added element", function () {
    var options = {};
    options.elementTitle = "Created at " + (new Date()).getTime();
    options.elementDescription = "Created by script";
    options.fieldsOptions = [{}];
    options.fieldsOptions[0].fieldTitle = "Simple field";
    elementPage.createElement(options).then(function () {
      browser.sleep(1000).then(function () {
        page.get();
        browser.sleep(1000).then(function () {
          page.composeTemplateAddElement(options.elementTitle).then(function () {
            page.editingElementSaveButton().click().then(function () {
              browser.sleep(1000).then(function () {
                expect(page.composeTemplateClearButton().isPresent()).toBe(true);
                expect(page.renderedFormEditingElement().isPresent()).toBe(false);
                page.renderedFormAllAddedElements().then(function (elements) {
                  expect(elements.length).toBe(1);
                  page.composeTemplateClearButton().click().then(function () {
                    browser.sleep(1000).then(function () {
                      page.sweetAlertConfirmButton().click().then(function () {
                        browser.sleep(1000).then(function () {
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
      });
    });
  });
}); 
