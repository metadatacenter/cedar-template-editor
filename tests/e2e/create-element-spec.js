'use strict';

var CreateElementPage = require('../pages/create-element-page.js');
var _ = require('../libs/lodash.min.js')

describe('create-element', function() {

  var page;

  beforeEach(function() {
    page = new CreateElementPage();
    page.get();
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

  xit("Should allow to set cardinality for text field", function() {
    element(by.css("#element-name")).sendKeys("2 - 3 Text field element");
    element(by.css("#element-description")).sendKeys("Text field with 2 - 3 cardinality");

    page.addTextField.then(function() {
      expect(element(by.css("#form-item-config-section .field-title-definition")).isPresent()).toBe(true);
      expect(element(by.css("#form-item-config-section .field-description-definition")).isPresent()).toBe(true);
      expect(element(by.css(".checkbox-cardinality input[type='checkbox']")).isPresent()).toBe(true);

      element(by.css(".checkbox-cardinality")).getText().then(function(text) {
        expect(text).toBe("Cardinality");
      });

      element(by.css(".checkbox-cardinality input[type='checkbox']")).click().then(function() {
        element(by.css("#cardinality-options .min-items-option .filter-option")).getText().then(function(text) {
          expect(text).toBe("1");
        });
        element(by.css("#cardinality-options .max-items-option .filter-option")).getText().then(function(text) {
          expect(text).toBe("1")
        });

        element(by.css("#cardinality-options .min-items-option .filter-option")).click().then(function() {
          element(by.css("#cardinality-options .min-items-option .dropdown-menu li:nth-child(2) a")).click().then(function() {
            element(by.css("#cardinality-options .min-items-option .filter-option")).getText().then(function(text) {
              expect(text).toBe("2")
            });
          });
        });

        element(by.css("#cardinality-options .max-items-option .filter-option")).click().then(function() {
          element(by.css("#cardinality-options .max-items-option .dropdown-menu li:nth-child(3) a")).click().then(function() {
            element(by.css("#cardinality-options .max-items-option .filter-option")).getText().then(function(text) {
              expect(text).toBe("3")
            });
          });
        });

        element(by.css("#form-item-config-section .field-title-definition")).sendKeys("Simple text field");
        element(by.css("#form-item-config-section .field-description-definition")).sendKeys("A simple text field that is added by Selenium");

        browser.waitForAngular().then(function() {
          element(by.css(".save-options .add")).click().then(function() {
            element.all(by.css("form.form-preview input[type='text']")).then(function(items) {
              expect(items.length).toBe(2);
            });
            expect(element(by.css(".more-input-buttons .add")).isPresent()).toBe(true);

            element(by.css(".clear-save .btn-save")).click().then(function() {
              browser.waitForAngular().then(function() {
                page.getJsonPreviewText.then(function(value) {
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

  xit("Should not set maxItems if maxItems is N", function() {
    element(by.css("#element-name")).sendKeys("1 - N text field");
    element(by.css("#element-description")).sendKeys("Text field was created via Selenium");

    page.addTextField.then(function() {
      element(by.css(".checkbox-cardinality input[type='checkbox']")).click().then(function() {
        element(by.css("#cardinality-options .max-items-option .filter-option")).click().then(function() {
          element(by.css("#cardinality-options .max-items-option .dropdown-menu li:nth-child(9) a")).click().then(function() {
            element(by.css("#cardinality-options .max-items-option .filter-option")).getText().then(function(text) {
              expect(text).toBe("N")
            });
          });
        });

        element(by.css("#form-item-config-section .field-title-definition")).sendKeys("Text field title");
        element(by.css("#form-item-config-section .field-description-definition")).sendKeys("Simple text field created via Selenium");

        browser.waitForAngular().then(function() {
          element(by.css(".save-options .add")).click().then(function() {
            element.all(by.css("form.form-preview input[type='text']")).then(function(items) {
              expect(items.length).toBe(1);
            });
            expect(element(by.css(".more-input-buttons .add")).isPresent()).toBe(true);

            element(by.css(".clear-save .btn-save")).click().then(function() {
              browser.waitForAngular().then(function() {
                page.getJsonPreviewText.then(function(value) {
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

  xit("Should not set minItems & maxItems if cardinality is 1 - 1", function() {
    element(by.css("#element-name")).sendKeys("1 - 1 text field");
    element(by.css("#element-description")).sendKeys("Text field was created via Selenium");

    page.addTextField.then(function() {
      element(by.css(".checkbox-cardinality input[type='checkbox']")).click().then(function() {
        element(by.css("#cardinality-options .min-items-option .filter-option")).getText().then(function(text) {
          expect(text).toBe("1");
        });
        element(by.css("#cardinality-options .max-items-option .filter-option")).getText().then(function(text) {
          expect(text).toBe("1")
        });


        element(by.css("#form-item-config-section .field-title-definition")).sendKeys("Text field title");
        element(by.css("#form-item-config-section .field-description-definition")).sendKeys("Simple text field created via Selenium");

        browser.waitForAngular().then(function() {
          element(by.css(".save-options .add")).click().then(function() {
            element.all(by.css("form.form-preview input[type='text']")).then(function(items) {
              expect(items.length).toBe(1);
            });
            expect(element(by.css(".more-input-buttons .add")).isPresent()).toBe(false);

            element(by.css(".clear-save .btn-save")).click().then(function() {
              browser.waitForAngular().then(function() {
                page.getJsonPreviewText.then(function(value) {
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
