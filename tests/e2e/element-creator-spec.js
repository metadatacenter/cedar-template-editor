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


  // before each test, load a new page and create a template
  // maximize the window area for clicking
  beforeEach(function () {
    page = TemplateCreatorPage;
    workspacePage = WorkspacePage;
    page.get();
    page.createElement();
    browser.driver.manage().window().maximize();
  });

  // github issue #403:  Verify that the header is present and displays back button, name, description, title, JSON preview
  it("should show element editor header, title, description, and json preview", function () {

    // should have a top navigation element
    expect(page.topNavigation().isDisplayed()).toBe(true);
    // should have a template editor top nav
    expect(page.hasClass(page.topNavigation(), page.elementType())).toBe(true);
    // should have a back arrow in the header
    expect(page.topNavBackArrow().isDisplayed()).toBe(true);
    // should have a json preview in the header
    expect(page.showJsonLink().isDisplayed()).toBe(true);

    // should have an editable template title
    expect(page.elementTitle().isDisplayed()).toBe(true);
    browser.actions().doubleClick(page.elementTitle()).perform();
    page.elementTitle().sendKeys(page.testTitle());

    // should have an editable description
    expect(page.elementDescription().isDisplayed()).toBe(true);
    browser.actions().doubleClick(page.elementDescription()).perform();
    page.elementDescription().sendKeys(page.testDescription());

    // submit the form and check our edits
    page.elementDescriptionForm().submit();

    page.elementTitle().getAttribute('value').then(function (value) {
      expect(_.isEqual(value, page.testTitle())).toBe(true);
    });
    page.elementDescription().getAttribute('value').then(function (value) {
      expect(_.isEqual(value, page.testDescription())).toBe(true);
    });
  });

  // github issue #403:  click backarrow and go back to dashboard
  it("should go to dashboard when back arrow clicked", function () {

    // click the back arrow to return to workspace
    page.clickBackArrow();

    browser.wait(EC.visibilityOf($('.navbar-brand')), 10000);
    expect(page.isDashboard()).toBe(true);

  });

  // github issue #404 Part 1 of 4:  Verify that Clear button is present and active, expect clear to clear the element
  it("should should restore the template when clear is clicked and confirmed", function () {

    var cleanJson;
    var dirtyJson;
    var fieldType = fieldTypes[0];

    // should have clear not displayed
    expect(page.createClearElementButton().isDisplayed()).toBe(false);

    // save a copy of the clean template
    page.getJsonPreviewText().then(function (value) {
      var cleanJson = JSON.parse(value);
      page.clickJsonPreview();

      // should have a clear button if the template is dirty
      page.addField(fieldType.cedarType);
      expect(page.createClearElementButton().isDisplayed()).toBe(true);

      // save the dirty template
      page.getJsonPreviewText().then(function (value) {
        var dirtyJson = JSON.parse(value);
        page.clickJsonPreview();
        expect(_.isEqual(cleanJson, dirtyJson)).toBe(false);

        // clicking the clear should bring up confirmation dialog which has a confirm and cancel button
        page.clickClearElement();
        expect(page.createConfirmationDialog().isDisplayed()).toBe(true);
        expect(page.createConfirmationDialog().getAttribute(page.sweetAlertCancelAttribute())).toBe('true');
        expect(page.createConfirmationDialog().getAttribute(page.sweetAlertConfirmAttribute())).toBe('true');

        // expect confirm to clear the template,
        page.clickSweetAlertConfirmButton();
        page.getJsonPreviewText().then(function (value) {
          var currentJson = JSON.parse(value);
          page.clickJsonPreview();

          // TODO this fails because _ui.order and the created element id is still in properties and required
          // expect(_.isEqual(currentJson, cleanJson)).toBe(true);
        });
      });
    });
  });

  // github issue #404 Part 2 of 4:  Verify that Clear button is present and active, expect cancelling the clear to not modify the template
  it("should not change the element when clear clicked but then cancelled", function () {

    var cleanJson;
    var dirtyJson;
    var fieldType = fieldTypes[0];

    // should have clear not displayed
    expect(page.createClearElementButton().isDisplayed()).toBe(false);

    // save a copy of the clean template
    page.getJsonPreviewText().then(function (value) {
      var cleanJson = JSON.parse(value);
      page.clickJsonPreview();

      // should have a clear button if the template is dirty
      page.addField(fieldType.cedarType);
      expect(page.createClearElementButton().isDisplayed()).toBe(true);

      // save the dirty template
      page.getJsonPreviewText().then(function (value) {
        var dirtyJson = JSON.parse(value);
        page.clickJsonPreview();
        expect(_.isEqual(cleanJson, dirtyJson)).toBe(false);

        // clicking the clear should bring up confirmation dialog which has a confirm and cancel button
        page.clickClearElement();
        expect(page.createConfirmationDialog().isDisplayed()).toBe(true);
        expect(page.createConfirmationDialog().getAttribute(page.sweetAlertCancelAttribute())).toBe('true');
        expect(page.createConfirmationDialog().getAttribute(page.sweetAlertConfirmAttribute())).toBe('true');

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

  // github issue #404 Part 3 of 4:  Verify that Cancel button is present and active,
  it("should have Cancel button present and active", function () {

    // should have save and cancel displayed
    expect(page.createCancelElementButton().isDisplayed()).toBe(true);

    // make the template dirty
    page.addField(fieldTypes[0].cedarType);

    // clicking the cancel should cancel edits
    page.clickCancelElement();

    // should be back to dashboard
    expect(page.isDashboard()).toBe(true);
  });

  // github issue #404 Part 4 of 4:  Verify that save button is present and active,
  it("should have Save button present and active", function () {

    var cleanJson;
    var dirtyJson;
    var fieldType = fieldTypes[0];

    // should have save and cancel displayed
    expect(page.createSaveElementButton().isDisplayed()).toBe(true);

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

        page.clickSaveElement();
        expect(page.createToastyConfirmationPopup().isDisplayed()).toBe(true);
        page.getToastyMessageText().then(function (value) {
          expect(value.indexOf(page.hasBeenCreated) !== -1).toBe(true);
        });
      });
    });
  });

  it("should delete untitled element the workspace, ", function () {

    // element left over from prior test
    page.clickCancelElement();
    workspacePage.deleteResource('Untitled', workspacePage.elementType());

  });

  // github issue #405 part 1 of 2:  Verify that fields and elements can be reordered
  // TODO this fails because element creator is not putting dom ids on fields and elements
  xit("should reorder fields in the element", function () {

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

  // github issue #405 part 2:  add element to an element
  describe('should add an element to the element, ', function () {

    it("should create a sample element in the workspace, ", function () {

      // create an element and add a text field to it
      page.addTextField();
      page.setElementTitle(page.sampleElementTitle());
      page.setElementDescription(page.sampleElementDescription());
      browser.sleep(3000);
      page.clickSaveElement();

    });

    it("should add and delete the sample element in a element", function () {

      page.addElement(page.sampleElementTitle()).then(function () {

        // the element should include the sample element name
        var items = element.all(by.css('.element-root .element-name-label'));

        // three names expected, and the sample is second in the list
        //expect(items.count()).toBe(3);
        items.get(1).getText().then(function (text) {

          // and the name should be sampleElement
          expect(text === page.sampleElementTitle()).toBe(true);

          // remove the element from the template
          page.removeElement();

          expect(element(by.css('.element-root .element-name-label')).isPresent()).toBe(false);

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

    it("should select and deselect the sample element", function () {

      // add a field
      var fieldType = fieldTypes[0];
      page.addField(fieldType.cedarType).then(function () {

        // add the sample element
        page.addElement(page.sampleElementTitle()).then(function () {

          // the template should include the element name
          var names = element.all(by.css('.element-root .element-name-label'));
          var sampleElementName = names.get(2);
          sampleElementName.getText().then(function (text) {

            // and the name should be sampleElement
            expect(text === page.sampleElementTitle()).toBe(true);

            // do we have three items, the element, its nested filed, and the field
            var items = element.all(by.css(page.cssItemRoot));
           // expect(items.count()).toBe(3);

            var fieldItem = items.get(1);
            var elementItem = items.get(2);

            // is the element selected and not the field
            expect(page.isSelected(fieldItem)).toBe(false);
            expect(page.isSelected(elementItem)).toBe(true);

            // scroll to top
            browser.driver.executeScript('window.scrollTo(0,0);').then(function () {

              // and select the field item
              fieldItem.click();

              // is the field selected and not the element
              expect(page.isSelected(fieldItem)).toBe(true);
              expect(page.isSelected(elementItem)).toBe(false);

              // and select the element item
              elementItem.click();

              // is the field selected and not the element
              expect(page.isSelected(fieldItem)).toBe(false);
              expect(page.isSelected(elementItem)).toBe(true);

            });
          });
        });
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

    // github issue #400
    it("should delete the sample element from the workspace, ", function () {

      page.clickCancelElement();
      workspacePage.deleteResource(page.sampleElementTitle(), workspacePage.elementType());

    });

  });

  // github issue #406
  for (var i = 1; i < fieldTypes.length; i++) {
    (function (fieldType) {

      // github issue #406 part 1 of 2: Verify that surround, field icon, and field name are present, Verify that the X icon is present on an field in the template and element editors and deletes the field
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
        browser.sleep(1000);  // for animation of tooltip
        page.removeField();

        // is it removed?
        expect(element(by.css(cssField)).isPresent()).toBe(false);

      });

      // github issue #406 part 2 of 2:  Verify that clicking on an field  puts it in edit mode, Verify that clicking outside a field  takes it out of edit mode
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

        // click on the first field
        browser.actions().mouseMove(firstField).perform();
        firstField.click();

        // is the first selected and the second deselected
        expect(firstField.element(by.model(page.modelFieldTitle)).isPresent()).toBe(true);
        expect(lastField.element(by.model(page.modelFieldTitle)).isPresent()).toBe(false);
      });

    })(fieldTypes[i]);
  }

  // github issue #407:  Verify that JSON preview button shows template JSON; verify that this JSON is same as underlying JSON, Verify that clicking in JSON preview button hides visible JSON preview area
  it("clicking JSON preview button shows and hides element JSON", function () {

    expect(page.templateJSON().isDisplayed()).toBe(false);

    page.getJsonPreviewText().then(function (value) {
      var json = JSON.parse(value);
      expect(_.isEqual(json, page.emptyElementJson)).toBe(true);
    });

    expect(page.templateJSON().isDisplayed()).toBe(true);
    page.clickJsonPreview();
    expect(page.templateJSON().isDisplayed()).toBe(false);

  });

}); 
