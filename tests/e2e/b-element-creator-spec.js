'use strict';
var TemplateCreatorPage = require('../pages/template-creator-page.js');
var WorkspacePage = require('../pages/workspace-page.js');

var _ = require('../libs/lodash.min.js');


describe('element-creator', function () {
  var EC = protractor.ExpectedConditions;
  var page;
  var workspacePage;
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
  var sampleElementUrl;
  var sampleElementJson;


  // before each test, load a new page and create a template
  // maximize the window area for clicking
  beforeEach(function () {
    page = TemplateCreatorPage;
    workspacePage = WorkspacePage;
    page.get();
    browser.driver.manage().window().maximize();
  });

  for (var j = 0; j < 1; j++) {
    (function () {

      // Verify that save button is present and active,
      it("should create the sample element", function () {

        sampleTitle = "element" + page.getRandomInt(1, 9999999999);
        sampleElementUrl = null;

        page.createElement().then(function () {

          page.setElementTitle(sampleTitle).then(function () {

            page.isReady(page.createSaveElementButton()).then(function () {
              page.createSaveElementButton().click().then(function () {

                page.isReady(page.createToastyConfirmationPopup()).then(function () {

                  page.getToastyMessageText().then(function (value) {

                    expect(value.indexOf(page.hasBeenCreated) !== -1).toBe(true);

                    // get the url of this element
                    browser.getCurrentUrl().then(function (value) {
                      sampleElementUrl = value;
                    });
                  });
                });
              });
            });
          });
        });
      });


      describe('with sample element', function () {

        describe('with template editor, ', function () {

          // check each field type by adding it to the sample element
          for (var i = 0; i < fieldTypes.length; i++) {
            (function (fieldType) {

              // github issue #406 part 1 of 2: Verify that surround, field icon, and field name are present, Verify that the X icon is present on an field in the template and element editors and deletes the field
              it("should create, edit, and delete a " + fieldType.cedarType, function () {

                page.isReady(page.createPageName()).then(function () {
                  browser.get(sampleElementUrl).then(function () {
                    page.isReady(page.createElementPage()).then(function () {

                      page.isReady(page.createSaveElementButton()).then(function () {

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
                  browser.get(sampleElementUrl).then(function () {
                    page.isReady(page.createElementPage()).then(function () {

                      page.isReady(page.createSaveElementButton()).then(function () {

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
          it("should hang on to the sample element json", function () {

            page.isReady(page.createPageName()).then(function () {
              browser.get(sampleElementUrl).then(function () {
                page.isReady(page.createElementPage()).then(function () {


                  page.isReady(page.showJsonLink()).then(function () {
                    page.showJsonLink().click().then(function () {

                      page.isReady(page.templateJSON()).then(function () {
                        expect(page.templateJSON().isDisplayed()).toBe(true);

                        // get the dirty template
                        page.isReady(page.jsonPreview()).then(function () {
                          page.jsonPreview().getText().then(function (value) {
                            sampleElementJson = JSON.parse(value);

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
              browser.get(sampleElementUrl).then(function () {
                page.isReady(page.createElementPage()).then(function () {

                  page.addField(fieldType.cedarType).then(function () {
                    page.addField(fieldType.cedarType).then(function () {

                      page.isReady(page.createClearElementButton()).then(function () {
                        page.createClearElementButton().click().then(function () {

                          page.isReady(page.createConfirmationDialog()).then(function () {

                            expect(page.createConfirmationDialog().getAttribute(page.sweetAlertCancelAttribute())).toBe('true');
                            expect(page.createConfirmationDialog().getAttribute(page.sweetAlertConfirmAttribute())).toBe('true');

                            // expect confirm to clear the template,
                            page.isReady(page.createSweetAlertConfirmButton()).then(function () {
                              page.createSweetAlertConfirmButton().click().then(function () {

                                page.isReady(page.showJsonLink()).then(function () {
                                  page.showJsonLink().click().then(function () {

                                    page.isReady(page.templateJSON()).then(function () {
                                      expect(page.templateJSON().isDisplayed()).toBe(true);

                                      // get the dirty template
                                      page.isReady(page.jsonPreview()).then(function () {
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
              });
            });
          });

          // Verify that JSON preview button shows template JSON; verify that this JSON is same as underlying JSON, Verify that clicking in JSON preview button hides visible JSON preview area
          it("should show and hide the JSON preview ", function () {

            page.createElement().then(function () {

              expect(page.templateJSON().isDisplayed()).toBe(false);

              // show
              page.isReady(page.showJsonLink()).then(function () {
                page.showJsonLink().click().then(function () {

                  page.isReady(page.templateJSON()).then(function () {
                    expect(page.templateJSON().isDisplayed()).toBe(true);

                    // hide
                    page.isReady(page.showJsonLink()).then(function () {
                      page.showJsonLink().click().then(function () {
                        expect(page.templateJSON().isDisplayed()).toBe(false);
                      });
                    });
                  });
                });
              });
            });
          });

          // set the clean json
          it("should see the json preview", function () {

            page.createElement().then(function () {
              expect(page.templateJSON().isDisplayed()).toBe(false);

              page.isReady(page.showJsonLink()).then(function () {
                page.showJsonLink().click().then(function () {

                  page.isReady(page.jsonPreview()).then(function () {
                    page.jsonPreview().getText().then(function (value) {

                      // hang on to this json for use later
                      cleanJson = JSON.parse(value);

                      expect(_.isEqual(cleanJson, page.emptyElementJson)).toBe(true);
                    });
                  });
                });
              });
            });
          });

          // should get the clean json
          it("should have valid json for a clean element", function () {

            page.createElement().then(function () {

              page.addField(fieldType.cedarType).then(function () {
                page.addField(fieldType.cedarType).then(function () {

                  page.isReady(page.showJsonLink()).then(function () {
                    page.showJsonLink().click().then(function () {

                      page.isReady(page.jsonPreview()).then(function () {


                        // get the dirty template
                        page.jsonPreview().getText().then(function (value) {

                          dirtyJson = JSON.parse(value);
                          expect(_.isEqual(page.emptyElementJson, dirtyJson)).toBe(false);

                        });
                      });
                    });
                  });
                });
              });
            });
          });

          // Verify that Clear button is present for dirty template
          it("should have clear displayed if template is dirty", function () {

            page.createElement().then(function () {

              page.addField(fieldType.cedarType).then(function () {
                page.addField(fieldType.cedarType).then(function () {

                  page.isReady(page.createClearElementButton()).then(function () {
                    expect(page.createClearElementButton().isDisplayed()).toBe(true);
                  });
                });
              });
            });
          });

          // Verify that Clear button is present and active, expect clear to clear the element
          it("should change the json preview text when the element changes", function () {

            page.createElement().then(function () {

              page.addField(fieldType.cedarType).then(function () {
                page.addField(fieldType.cedarType).then(function () {

                  page.isReady(page.showJsonLink()).then(function () {
                    page.showJsonLink().click().then(function () {

                      page.isReady(page.jsonPreview()).then(function () {

                        // get the dirty template
                        page.jsonPreview().getText().then(function (value) {

                          dirtyJson = JSON.parse(value);
                          expect(_.isEqual(page.emptyElementJson, dirtyJson)).toBe(false);

                        });
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

            page.createElement().then(function () {
              page.isReady(page.topNavigation()).then(function () {
                expect(page.hasClass(page.topNavigation(), page.elementType())).toBe(true);
              });
            });

          });

          // github issue #403:  Verify that the header is present and displays back button, name, description, title, JSON preview
          it("should have editable title", function () {

            page.createElement().then(function () {
              page.setElementTitle('whatever title').then(function () {
                page.elementTitle().getAttribute('value').then(function (value) {
                  expect(_.isEqual(value, 'whatever title')).toBe(true);
                });
              });
            });
          });

          // github issue #403:  Verify that the header is present and displays back button, name, description, title, JSON preview
          it("should have editable description", function () {

            page.createElement().then(function () {
              page.setElementDescription('whatever description').then(function () {
                page.elementDescription().getAttribute('value').then(function (value) {
                  expect(_.isEqual(value, 'whatever description')).toBe(true);
                });
              });
            });
          });

          // github issue #404 Part 3 of 4:  Verify that Cancel button is present and active,
          it("should have Cancel button present and active", function () {

            page.createElement().then(function () {

              // make the template dirty
              page.addField(fieldTypes[0].cedarType).then(function () {
                page.addField(fieldTypes[0].cedarType).then(function () {

                  // clicking the cancel should cancel edits
                  page.clickCancel(page.createCancelElementButton()).then(function () {

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

            page.createElement().then(function () {
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

            page.createElement().then(function () {
              expect(page.createClearElementButton().isDisplayed()).toBe(false);
            });
          });

          // click backarrow and go back to dashboard
          it("should go to dashboard when back arrow clicked", function () {

            page.createElement().then(function () {
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

            page.createElement().then(function () {

              page.addField(fieldType.cedarType).then(function () {
                page.addField(fieldType.cedarType).then(function () {

                  page.isReady(page.showJsonLink()).then(function () {
                    page.showJsonLink().click().then(function () {

                      page.isReady(page.jsonPreview()).then(function () {

                        // get the dirty template
                        page.jsonPreview().getText().then(function (value) {
                          var beforeJson = JSON.parse(value);


                          page.isReady(page.createClearElementButton()).then(function () {
                            page.createClearElementButton().click().then(function () {

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


          // github issue #404 Part 4 of 4:  Verify that save button is present and active,
          it("should have save button present", function () {

            page.createElement().then(function () {
              page.isReady(page.createSaveElementButton()).then(function () {
              });
            });
          });
        });

        // add element to an element
        describe('with second element, ', function () {

          var secondTitle;
          var secondElementUrl;

          it("should create the second element", function () {

            secondTitle = "element" + page.getRandomInt(1, 9999999999);


            page.createElement().then(function () {
              page.setElementTitle(secondTitle).then(function () {

                page.isReady(page.createSaveElementButton()).then(function () {
                  page.createSaveElementButton().click().then(function () {

                    page.isReady(page.createToastyConfirmationPopup()).then(function () {
                      page.getToastyMessageText().then(function (value) {

                        expect(value.indexOf(page.hasBeenCreated) !== -1).toBe(true);

                        // get the url of this element
                        browser.getCurrentUrl().then(function (value) {
                          secondElementUrl = value;
                        });
                      });
                    });
                  });
                });
              });
            });
          });

          it("should add an element to an element", function () {

            page.isReady(page.createPageName()).then(function () {
              browser.get(sampleElementUrl).then(function () {
                page.isReady(page.createElementPage()).then(function () {

                  page.addElement(secondTitle).then(function () {

                    // the element should include the sample element name
                    var items = element.all(by.css('.element-root .element-name-label'));

                    items.get(1).getText().then(function (text) {

                      // and the name should be sampleElement
                      expect(text === secondTitle).toBe(true);

                    });
                  });
                });
              });
            });
          });

          xit("should delete an element in a element", function () {

            browser.get(sampleElementUrl).then(function () {
              page.isReady(element(by.css('#top-navigation.element'))).then(function () {

                page.addElement(secondTitle).then(function () {

                  // remove the element from the template
                  page.isReady(page.removeElementButton()).then(function () {

                    page.removeElementButton().click().then(function () {

                      expect(element(by.css('.element-root .element-name-label')).isPresent()).toBe(false);
                    });
                  });
                });
              });
            });
          });

          xit("should select and deselect the sample element", function () {

            browser.get(sampleElementUrl).then(function () {
              page.isReady(element(by.css('#top-navigation.element'))).then(function () {

                page.addField(fieldType.cedarType).then(function () {

                  // add the second element
                  page.addElement(secondTitle).then(function () {

                    // the template should include the element name
                    var names = element.all(by.css('.element-root .element-name-label'));
                    var sampleElementName = names.get(2);
                    sampleElementName.getText().then(function (text) {

                      // and the name should be sampleElement
                      expect(text === secondTitle).toBe(true);

                      // do we have three items, the element, its nested filed, and the field
                      var items = element.all(by.css(page.cssItemRoot));


                      var fieldItem = items.get(1);
                      var elementItem = items.get(2);

                      // is the element selected and not the field
                      expect(page.isSelected(fieldItem)).toBe(false);
                      expect(page.isSelected(elementItem)).toBe(true);

                      // scroll to top
                      browser.driver.executeScript('window.scrollTo(0,0);').then(function () {

                        // and select the field item
                        fieldItem.click().then(function () {

                          // is the field selected and not the element
                          expect(page.isSelected(fieldItem)).toBe(true);
                          expect(page.isSelected(elementItem)).toBe(false);

                          // and select the element item
                          elementItem.click().then(function () {

                            // is the field selected and not the element
                            expect(page.isSelected(fieldItem)).toBe(false);
                            expect(page.isSelected(elementItem)).toBe(true);
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });

          it("should delete the second element, ", function () {

            page.isReady(page.createPageName()).then(function () {

              workspacePage.isDashboard().then(function () {
                workspacePage.deleteResource(secondTitle, page.elementType());

              });
            });
          });
        });


// TODO this feature does not work in the element creator page
        xit("should collapse and reopen the sample element", function () {

          page.addElement(page.sampleElementTitle()).then(function () {

            var itemRoots = element.all(by.css(page.cssItemRoot));
            //expect(itemRoots.count()).toBe(3);
            var sampleElement = itemRoots.get(1);

            // there should be a nested item inside the sample element
            var fieldItem = sampleElement.element(by.css(page.cssFieldRoot));

            // the element should be open
            expect(fieldItem.isDisplayed()).toBe(true);

            // collapse the element
            page.collapseElement(sampleElement);
            expect(fieldItem.isDisplayed()).toBe(false);

            // open the element
            page.openElement(sampleElement);
            expect(fieldItem.isDisplayed()).toBe(true);

          });
        });

// github issue #405 part 2 of 2:  Verify that an element can be reordered
// TODO this fails because elements don't have domIds on their fields and elements
        xit("should reorder an element and field in the element", function () {

          // add a field
          var fieldType = fieldTypes[0];
          page.addField(fieldType.cedarType).then(function () {

            // add the sample element
            page.addElement(page.sampleElementTitle()).then(function () {

              // find the roots of all fields and elements,
              // three items expected because two are in the element and one is in the field
              var itemRoots = element.all(by.css(page.cssItemRoot));
              //expect(itemRoots.count()).toBe(4);

              // get the field
              itemRoots.get(1).element(by.css('element-name-label')).getText().then(function (attr) {
                var firstId = attr;

                // get the element
                itemRoots.get(2).element(by.css('element-name-label')).getText().then(function (attr) {
                  var secondId = attr;


                  // get the item sort handlers, should only be two
                  var itemSortHandlers = element.all(by.css(page.cssItemSortableIcon));
                  expect(itemSortHandlers.count()).toBe(2);

                  // drop the second sort handler on top of the first one to recorder
                  var firstSortHandler = itemSortHandlers.first();
                  var lastSortHandler = itemSortHandlers.last();
                  browser.actions().mouseDown(lastSortHandler).perform();
                  browser.actions().mouseMove(firstSortHandler, {x: 0, y: 0}).perform();
                  browser.actions().mouseUp().perform();


                  // now get the item roots again
                  itemRoots = element.all(by.css(page.cssItemRoot));
                  expect(itemRoots.count()).toBe(4);

                  // get the element
                  itemRoots.get(1).element(by.css('element-name-label')).getText().then(function (attr) {
                    var newFirstId = attr;

                    // get the field
                    itemRoots.get(3).element(by.css('element-name-label')).getText().then(function (attr) {
                      var newLastId = attr;

                      console.log('ids');
                      console.log(newFirstId);
                      console.log(newLastId);

                      // expect the order to be reversed
                      expect(newFirstId === secondId).toBe(true);
                      expect(newLastId === firstId).toBe(true);
                    });
                  });

                });
              });
            });
          });
        });

// github issue #405 part 1 of 2:  Verify that fields and elements can be reordered
// TODO this fails because element creator is not putting dom ids on fields and elements
        xit("should reorder fields in the element", function () {

          var fieldType = fieldTypes[0];

          // add two fields
          page.addField(fieldType.cedarType).then(function () {
            page.addField(fieldType.cedarType).then(function () {

              // should have two field roots
              var fieldRoots = element.all(by.css(page.cssFieldRoot));
              expect(fieldRoots.count()).toBe(2);

              fieldRoots.first().getAttribute('id').then(function (attr) {
                var firstId = attr;

                fieldRoots.last().getAttribute('id').then(function (attr) {
                  var lastId = attr;

                  // get the fields by their sort handlers and drag last over first
                  var fields = element.all(by.css(page.cssFieldSortableIcon)).then(function () {
                    expect(fields.count()).toBe(2);

                    var firstField = fields.first();
                    var lastField = fields.last();
                    browser.actions().mouseDown(lastField).perform();
                    browser.actions().mouseMove(firstField, {x: 0, y: 0}).perform();
                    browser.actions().mouseUp().perform();

                    // now get the field roots again
                    fieldRoots = element.all(by.css(page.cssFieldRoot));
                    expect(fieldRoots.count()).toBe(2);

                    fieldRoots.first().getAttribute('id').then(function (attr) {
                      var newFirstId = attr;

                      fieldRoots.last().getAttribute('id').then(function (attr) {
                        var newLastId = attr;

                        expect(newFirstId === lastId).toBe(true);
                        expect(newLastId === firstId).toBe(true);
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });

      it("should delete the sample element from the workspace, ", function () {

        page.isReady(page.createPageName()).then(function () {
          workspacePage.isDashboard().then(function () {
            workspacePage.deleteResource(sampleTitle, page.elementType()).then(function () {
            });
          });
        });
      });


    })
    (j);
  }

});



