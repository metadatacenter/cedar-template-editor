'use strict';
var TemplateCreatorPage = require('../pages/template-creator-page.js');


var _ = require('../libs/lodash.min.js');


describe('template-creator', function () {
  var EC = protractor.ExpectedConditions;
  //var flow = browser.controlFlow();
  var page;
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


  // before each test, load a new page and create a template
  // maximize the window area for clicking
  beforeEach(function () {
    page = TemplateCreatorPage;
    page.get();
    page.createTemplate();
    browser.driver.manage().window().maximize();
  });

  // github issue #397:  Verify that the header is present and displays back button, name, description, title, JSON preview
  it("should show template editor header, title, description, and json preview", function () {

    // should have a top navigation element
    expect(page.topNavigation.isDisplayed()).toBe(true);
    // should have a template editor top nav
    expect(page.hasClass(page.topNavigation, page.template)).toBe(true);
    // should have a back arrow in the header
    expect(page.topNavBackArrow.isDisplayed()).toBe(true);
    // should have a json preview in the header
    expect(page.showJsonLink.isDisplayed()).toBe(true);


    // should have an editable template title
    expect(page.templateTitle.isDisplayed()).toBe(true);
    browser.actions().doubleClick(page.templateTitle).perform();
    page.templateTitle.sendKeys(page.testTitle);

    // should have an editable description
    expect(page.templateDescription.isDisplayed()).toBe(true);
    browser.actions().doubleClick(page.templateDescription).perform();
    page.templateDescription.sendKeys(page.testDescription);

    // submit the form and check our edits
    page.templateForm.submit();
    page.templateTitle.getAttribute('value').then(function (value) {
      expect(_.isEqual(value, page.testTitle)).toBe(true);
    });
    page.templateDescription.getAttribute('value').then(function (value) {
      expect(_.isEqual(value, page.testDescription)).toBe(true);
    });
  });

  // github issue #398 Part 1 of 4:  Verify that Clear button is present and active, expect clear to clear the template
  // TODO this fails because _ui.order and the created element id is still in properties and required
  xit("should should restore the template when clear is clicked and confirmed", function () {

    var cleanJson;
    var dirtyJson;
    var fieldType = fieldTypes[0];

    // should have clear not displayed
    expect(page.createClearTemplateButton.isDisplayed()).toBe(false);

    // save a copy of the clean template
    page.getJsonPreviewText().then(function (value) {
      var cleanJson = JSON.parse(value);
      page.clickJsonPreview();

      // should have a clear button if the template is dirty
      page.addField(fieldType.cedarType);
      expect(page.createClearTemplateButton.isDisplayed()).toBe(true);

      // save the dirty template
      page.getJsonPreviewText().then(function (value) {
        var dirtyJson = JSON.parse(value);
        page.clickJsonPreview();
        expect(_.isEqual(cleanJson, dirtyJson)).toBe(false);

        // clicking the clear should bring up confirmation dialog which has a confirm and cancel button
        page.clickClearTemplate();
        expect(page.createConfirmationDialog.isDisplayed()).toBe(true);
        expect(page.createConfirmationDialog.getAttribute(page.sweetAlertCancelAttribute)).toBe('true');
        expect(page.createConfirmationDialog.getAttribute(page.sweetAlertConfirmAttribute)).toBe('true');

        // expect confirm to clear the template,
        page.clickSweetAlertConfirmButton();
        page.getJsonPreviewText().then(function (value) {
          var currentJson = JSON.parse(value);
          page.clickJsonPreview();
          expect(_.isEqual(currentJson, cleanJson)).toBe(true);
        });
      });
    });
  });

  // github issue #398 Part 2 of 4:  Verify that Clear button is present and active, expect cancelling the clear to not modify the template
  it("should not change the template when clear clicked but then cancelled", function () {

    var cleanJson;
    var dirtyJson;
    var fieldType = fieldTypes[0];

    // should have clear not displayed
    expect(page.createClearTemplateButton.isDisplayed()).toBe(false);

    // save a copy of the clean template
    page.getJsonPreviewText().then(function (value) {
      var cleanJson = JSON.parse(value);
      page.clickJsonPreview();

      // should have a clear button if the template is dirty
      page.addField(fieldType.cedarType);
      expect(page.createClearTemplateButton.isDisplayed()).toBe(true);

      // save the dirty template
      page.getJsonPreviewText().then(function (value) {
        var dirtyJson = JSON.parse(value);
        page.clickJsonPreview();
        expect(_.isEqual(cleanJson, dirtyJson)).toBe(false);

        // clicking the clear should bring up confirmation dialog which has a confirm and cancel button
        page.clickClearTemplate();
        expect(page.createConfirmationDialog.isDisplayed()).toBe(true);
        expect(page.createConfirmationDialog.getAttribute(page.sweetAlertCancelAttribute)).toBe('true');
        expect(page.createConfirmationDialog.getAttribute(page.sweetAlertConfirmAttribute)).toBe('true');

        // expect confirm to clear the template,
        page.clickSweetAlertCancelButton();
        page.getJsonPreviewText().then(function (value) {
          var currentJson = JSON.parse(value);
          page.clickJsonPreview();
          expect(_.isEqual(currentJson, dirtyJson)).toBe(true);
        });
      });
    });
  });

  // github issue #398 Part 3 of 4:  Verify that Cancel button is present and active,
  it("should have Cancel button present and active", function () {

    var fieldType = fieldTypes[0];

    // should have save and cancel displayed
    expect(page.createCancelTemplateButton.isDisplayed()).toBe(true);

    // make the template dirty
    page.addField(fieldType.cedarType);

    // clicking the cancel should cancel edits
    page.clickCancelTemplate();

    // should be back to dashboard
    expect(page.hasClass(page.topNavigation, page.dashboard)).toBe(true);
  });

  // github issue #398 Part 4 of 4:  Verify that save button is present and active,
  it("should have Save button present and active", function () {

    var cleanJson;
    var dirtyJson;
    var fieldType = fieldTypes[0];

    // should have save and cancel displayed
    expect(page.createSaveTemplateButton.isDisplayed()).toBe(true);

    // save the clean template
    page.getJsonPreviewText().then(function (value) {
      var cleanJson = JSON.parse(value);
      page.clickJsonPreview();

      // save a dirty template
      page.addField(fieldType.cedarType);
      page.getJsonPreviewText().then(function (value) {
        var dirtyJson = JSON.parse(value);
        page.clickJsonPreview();
        expect(_.isEqual(cleanJson, dirtyJson)).toBe(false);

        page.clickSaveTemplate();
        expect(page.createToastyConfirmationPopup.isDisplayed()).toBe(true);
        page.getToastyMessageText().then(function (value) {
          expect(value.indexOf(page.hasBeenCreated) !== -1).toBe(true);
        });
      });
    });
  });

  // github issue #399:  Verify that fields and elements can be reordered
  it("should reorder fields and elements in the template", function () {

    var fieldType = fieldTypes[0];

    // add two fields
    page.addField(fieldType.cedarType);
    page.addField(fieldType.cedarType);

    // should have two field roots
    var fieldRoots = element.all(by.css(page.cssFieldRoot));
    expect(fieldRoots.count()).toBe(2);

    fieldRoots.first().getAttribute('id').then(function (attr) {
      var firstId = attr;

      fieldRoots.last().getAttribute('id').then(function (attr) {
        var lastId = attr;

        // get the fields by their sort handlers and drag last over first
        var fields = element.all(by.css(page.cssFieldSortableIcon));
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


  // github issue #400
  describe('should add an element to the template, ', function () {




    // github issue #400: part 1 of 3
    it("should create a sample element, ", function () {

      var dashboardPage = page.clickCancelTemplate();
      var elementPage = dashboardPage.createElement();

      // create an element and add a text field to it
      elementPage.addTextField();
      elementPage.setElementTitle(page.sampleElementTitle);
      elementPage.setElementDescription(page.sampleElementDescription);
      elementPage.clickSaveElement();

    });

    // github issue #400: part 2 of 3
    it("should add it to template", function () {

      page.addMore();
      page.addSearchElements();

      // search for the sampleElement
      page.createSearchInput.sendKeys(page.sampleElementTitle).sendKeys(protractor.Key.ENTER).then(function () {

        browser.wait(EC.textToBePresentInElementValue($('#search'), page.sampleElementTitle), 10000);

        // click the search submit icon
        page.createSearchButton.click().then(function () {

          browser.wait(EC.visibilityOf(page.getFirstElement()), 10000);

          // the search browse modal should show some results
          expect(page.getFirstElement().isPresent()).toBe(true);

          // get the first element in the list of search results
          page.getFirstElement().click().then(function () {

            // select the first element in the list and click to submit the search browser modal
            page.findSearchSubmit().click().then(function () {

              // wait till the template is visible again
              // this gives a warning if it finds more than one element in the form
              browser.wait(EC.visibilityOf($('.element-name-label')), 10000);

              // the template should include the element name
              element.all(by.css('.element-name-label')).first().getText().then(function (text) {

                // and the name should be sampleElement
                expect(_.isEqual(text, page.sampleElementTitle)).toBe(true);
              });
            });
          });
        });
      });
    });

    // github issue #400: part 3 of 3
    it("should delete the sample element, ", function () {

      var dashboardPage = page.clickCancelTemplate();

      var searchInput = element(by.id('search'));

      searchInput.sendKeys(page.sampleElementTitle).sendKeys(protractor.Key.ENTER).then(function () {

        browser.wait(EC.textToBePresentInElementValue($('#search'), page.sampleElementTitle), 10000);


        // click the search submit icon
        element(by.css('.do-search')).click().then(function () {

          browser.wait(EC.visibilityOf(page.getFirstElement()), 10000);

          // the search browse modal should show some results
          expect(page.getFirstElement().isPresent()).toBe(true);

          // get the first element in the list of search results
          page.getFirstElement().click().then(function () {

            var buttons = page.topNavButtons;
            expect(buttons.count()).toBe(6);

            var deleteButton = buttons.first();
            browser.wait(EC.visibilityOf(deleteButton), 10000);
            deleteButton.getAttribute('tooltip').then(function (value) {

              // make sure it really is delete
              expect(_.isEqual(value, page.deleteButtonTooltip)).toBe(true);
              deleteButton.click();

              // TODO not sure why i need this sleep here
              browser.sleep(1000);

              browser.wait(EC.visibilityOf(page.createConfirmationDialog), 10000);
              expect(page.createConfirmationDialog.isDisplayed()).toBe(true);
              expect(page.createConfirmationDialog.getAttribute(page.sweetAlertCancelAttribute)).toBe('true');
              expect(page.createConfirmationDialog.getAttribute(page.sweetAlertConfirmAttribute)).toBe('true');

              // click confirm to delete the element
              page.clickSweetAlertConfirmButton();

              browser.wait(EC.visibilityOf(page.createToastyConfirmationPopup), 10000);
              expect(page.createToastyConfirmationPopup.isDisplayed()).toBe(true);
              page.getToastyMessageText().then(function (value) {
                expect(value.indexOf(page.deleteElementMessage) !== -1).toBe(true);
              });

            });
          });
        });
      });
    });
  });


  // github issue #401
  for (var i =0; i < fieldTypes.length; i++) {

    (function (fieldType) {

      // github issue #401 part 1 of 2: Verify that surround, field icon, and field name are present, Verify that the X icon is present on an field in the template and element editors and deletes the field
      it("should create, edit, and delete a " + fieldType.cedarType, function () {

        // css path for this field type
        var cssField = page.cssField(fieldType.iconClass);

        page.addField(fieldType.cedarType);
        // is the field there?
        var field = element(by.css(cssField));
        expect(field.isPresent()).toBe(true);
        // does it have a title and in edit mode?
        expect(element(by.model(page.modelFieldTitle)).isPresent()).toBe(true);
        // does it have the help text field in edit mode?
        expect(element(by.model(page.modelFieldDescription)).isPresent()).toBe(true);

        // move the mouse away from the toolbar so the tooltip is hidden
        // before trying to remove the field
        // otherwise the textarea fails
        browser.actions().mouseMove(field).perform();
        browser.sleep(1000);
        page.removeField();
        // is it removed?
        expect(element(by.css(cssField)).isPresent()).toBe(false);

      });


      // github issue #401 part 2 of 2:  Verify that clicking on an field  puts it in edit mode, Verify that clicking outside a field  takes it out of edit mode
      it("should select and deselect a " + fieldType.cedarType, function () {

        var firstField;
        var lastField;

        // add two fields
        page.addField(fieldType.cedarType);
        page.addField(fieldType.cedarType);

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

        // scroll to top
        browser.driver.executeScript('window.scrollTo(0,0);').then(function () {

          // and select the first field
          firstField.click();

          // is the first selected and not the second
          expect(firstField.element(by.model(page.modelFieldTitle)).isPresent()).toBe(true);
          expect(lastField.element(by.model(page.modelFieldTitle)).isPresent()).toBe(false);

        });
      });

    })(fieldTypes[i]);

  }

// github issue #402:  Verify that JSON preview button shows template JSON; verify that this JSON is same as underlying JSON, Verify that clicking in JSON preview button hides visible JSON preview area
  it("clicking JSON preview button shows and hides template JSON", function () {

    expect(page.templateJSON.isDisplayed()).toBe(false);

    page.getJsonPreviewText().then(function (value) {
      var json = JSON.parse(value);
      expect(_.isEqual(json, page.emptyTemplateJson)).toBe(true);
    });

    expect(page.templateJSON.isDisplayed()).toBe(true);
    page.clickJsonPreview();
    expect(page.templateJSON.isDisplayed()).toBe(false);

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
})
; 
