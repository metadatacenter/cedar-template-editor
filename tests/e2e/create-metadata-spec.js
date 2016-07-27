'use strict';

var CreateMetadataPage = require('../pages/create-metadata-page.js');
var _ = require('../libs/lodash.min.js')

describe('create-metadata', function () {

  var page;

  beforeEach(function () {
    page = new CreateMetadataPage();
    page.get();
    page.createTemplate();
  });

  it("should open the dialog to create more field types", function () {
    page.addMore();
    expect(element(by.id("dialog-add-more")).isPresent()).toBe(true);
  });


  it("should add a text field", function () {
    page.addTextField();
    expect(element(by.css(".field-root .elementTotalContent ")).isPresent()).toBe(true);

  });

  it("should create and remove a text field", function () {
    page.addTextField();
    expect(element(by.css(".field-root .elementTotalContent")).isPresent()).toBe(true);
    page.removeField();
    expect(element(by.css(".field-root .elementTotalContent")).isPresent()).toBe(false);
  });

  it("should create and remove a text area", function () {
    page.addTextArea();
    expect(element(by.css(".field-root .elementTotalContent ")).isPresent()).toBe(true);
    page.removeField();
    expect(element(by.css(".field-root .elementTotalContent ")).isPresent()).toBe(false);
  });

  it("should create a radio", function () {
    page.addRadio();
    expect(element(by.css(".field-root .elementTotalContent ")).isPresent()).toBe(true);
  });

  it("should create and delete a radio", function () {
    page.addRadio();
    expect(element(by.css(".field-root .elementTotalContent ")).isPresent()).toBe(true);
    page.removeField();
    expect(element(by.css(".field-root .elementTotalContent ")).isPresent()).toBe(false);
  });

  it("should create a checkbox", function () {
    page.addCheckbox();
    expect(element(by.css(".field-root .elementTotalContent ")).isPresent()).toBe(true);
    page.removeField();
    expect(element(by.css(".field-root .elementTotalContent ")).isPresent()).toBe(false);
  });


  it("should create a date", function () {
    page.addMore();
    expect(element(by.css("#dialog-add-more")).isPresent()).toBe(true);
    page.addDateField();
    expect(element(by.css(".field-root .elementTotalContent ")).isPresent()).toBe(true);
    page.removeField();
    expect(element(by.css(".field-root .elementTotalContent ")).isPresent()).toBe(false);
  });

  it("should create an email", function () {
    page.addMore();
    expect(element(by.css("#dialog-add-more")).isPresent()).toBe(true);
    page.addEmailField();
    expect(element(by.css(".field-root .elementTotalContent ")).isPresent()).toBe(true);
    page.removeField();
    expect(element(by.css(".field-root .elementTotalContent ")).isPresent()).toBe(false);
  });

  it("should create a list", function () {
    page.addMore();
    expect(element(by.css("#dialog-add-more")).isPresent()).toBe(true);
    page.addListField();
    expect(element(by.css(".field-root .elementTotalContent ")).isPresent()).toBe(true);
    page.removeField();
    expect(element(by.css(".field-root .elementTotalContent ")).isPresent()).toBe(false);
  });

  it("should create a numeric", function () {
    page.addMore();
    expect(element(by.css("#dialog-add-more")).isPresent()).toBe(true);
    page.addNumericField();
    expect(element(by.css(".field-root .elementTotalContent ")).isPresent()).toBe(true);
    page.removeField();
    expect(element(by.css(".field-root .elementTotalContent ")).isPresent()).toBe(false);
  });

  it("should create a phone number", function () {
    page.addMore();
    expect(element(by.css("#dialog-add-more")).isPresent()).toBe(true);
    page.addPhoneNumberField();
    expect(element(by.css(".field-root .elementTotalContent ")).isPresent()).toBe(true);
    page.removeField();
    expect(element(by.css(".field-root .elementTotalContent ")).isPresent()).toBe(false);
  });

  it("should create a section break", function () {
    page.addMore();
    expect(element(by.css("#dialog-add-more")).isPresent()).toBe(true);
    page.addSectionBreakField();
    expect(element(by.css(".field-root .elementTotalContent ")).isPresent()).toBe(true);
    page.removeField();
    expect(element(by.css(".field-root .elementTotalContent ")).isPresent()).toBe(false);
  });

  it("should create a rich text field", function () {
    page.addMore();
    expect(element(by.css("#dialog-add-more")).isPresent()).toBe(true);
    page.addRichTextField();
    expect(element(by.css(".field-root .elementTotalContent ")).isPresent()).toBe(true);
    page.removeField();
    expect(element(by.css(".field-root .elementTotalContent ")).isPresent()).toBe(false);
  });

  it("should create an image field", function () {
    page.addMore();
    expect(element(by.css("#dialog-add-more")).isPresent()).toBe(true);
    page.addImageField();
    expect(element(by.css(".field-root .elementTotalContent ")).isPresent()).toBe(true);
    page.removeField();
    expect(element(by.css(".field-root .elementTotalContent ")).isPresent()).toBe(false);
  });

  it("should create a video field", function () {
    page.addMore();
    expect(element(by.css("#dialog-add-more")).isPresent()).toBe(true);
    page.addVideoField();
    expect(element(by.css(".field-root .elementTotalContent ")).isPresent()).toBe(true);
    page.removeField();
    expect(element(by.css(".field-root .elementTotalContent ")).isPresent()).toBe(false);
  });

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
});
