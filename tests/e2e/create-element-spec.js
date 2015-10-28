'use strict';

var CreateElementPage = require('../pages/create-element-page.js');
var _ = require('../libs/lodash.min.js');

describe('create-element', function() {

  var page;

  beforeEach(function() {
    page = new CreateElementPage();
  });

  it('should start out with valid JSON Schema', function() {
    var formJson;
    var validInitialSchema = {
      "$schema": "http://json-schema.org/draft-04/schema#",
      "title": "",
      "description": "",
      "order": [],
      "type": "object",
      "properties": {
        "@context": {
          "properties": {
            "value": {
              "enum": [
                "https://schema.org/value"
              ]
            }
          },
          "required": [
            "value"
          ],
          "additionalProperties": false
        },
        "@type": {
          "oneOf": [
            {
              "type": "string",
              "format": "uri"
            },
            {
              "type": "array",
              "minItems": 1,
              "items": {
                "type": "string",
                "format": "uri"
              },
              "uniqueItems": true
            }
          ]
        },
        "info": {
          "title": "",
          "description": ""
        }
      },
      "additionalProperties": false
    };

    page.getJsonPreviewText.then(function(value) {
      formJson = JSON.parse(value);
      // the @id field is a GUID which is always random
      // remove it before testing for equality
      delete formJson['@id'];
      expect(_.isEqual(formJson, validInitialSchema)).toBe(true);
    });
    
  });

});
