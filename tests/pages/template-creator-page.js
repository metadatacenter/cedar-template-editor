'use strict';

//require('../pages/workspace-page.js');
//require('../modals/finder-modal.js');
var testConfig = require('../config/test-env.js');

var TemplateCreatorPage = function () {

  var EC = protractor.ExpectedConditions;
  // var toastyModal = require('../modals/toasty-modal.js');
  // var finderModal = require('../modals/finder-modal.js');

  var testConfig = require('../config/test-env.js');
  var url = testConfig.baseUrl + '/dashboard';


  var createTemplatePage = element(by.css('#top-navigation.template'));
  var createTextFieldButton = element(by.id('button-add-field-textfield'));
  var createTextAreaButton = element(by.id('button-add-field-textarea'));
  var createRadioButton = element(by.id('button-add-field-radio'));
  var createCheckboxButton = element(by.id('button-add-field-checkbox'));
  var createMore = element(by.id('button-add-more'));
  var createFinder = element(by.id('finder-modal'));
  var createPageName = element(by.css('#top-navigation.dashboard'));

  var dirtyIcon = element(by.id('top-navigation')).element(by.css('.feedback-form .fa-circle-o'));
  var lockIcon = element(by.id('top-navigation')).element(by.css('.feedback-form .fa-lock'));
  var invalidIcon = element(by.id('headerCtrl')).element(by.css('i.fa.fa-exclamation-triangle'));
  var validIcon = element(by.id('headerCtrl')).element(by.css('i.fa.fa-check'));


  var showJsonLink = element(by.css('.accordion-toggle'));
  var jsonPreview = element(by.id('form-json-preview'));
  var jsonPreviewHidden = element(by.css('#form-json-preview.ng-hide'));

  var createSearchElement = element(by.id('button-search-element'));
  var createSearchInput = element(by.id('search-browse-modal')).element(by.id('search'));
  var createSearchButton = element(by.id('search-browse-modal')).element(by.css('.do-search'));
  var createSearchResult = element(by.id('search-browse-modal')).element(by.css('.search-result'));
  var createFirstElement = element.all(by.css('.form-box .element')).first();

  var createElementPage = element(by.css('#top-navigation.element'));
  var createSearchForm = element(by.css('.nav-search')).element(by.tagName('form'));
  var searchBrowseModalDialog = element(by.id("search-browse-modal"));
  var createSearchBreadcrumb = element(by.css('.breadcrumbs-sb  span'));
  var createSearchSubmitButton = element(by.css(".footer-buttons")).element(by.css('.subm'));
  var createSearchBreadcrumbText = element(by.id("search-browse-modal")).element(
      by.css('.controls-bar .as-modal')).element(by.css('.breadcrumbs-sb')).element(by.tagName('p')).element(
      by.tagName('span'));
  var createFirstSelected = element(by.css('.form-box-container.selected'));
  var createTopNavWorkspace = element(by.css('.navbar.dashboard'));

  var createDateButton = element(by.id('button-add-field-date'));
  var createEmailButton = element(by.id('button-add-field-email'));
  var createListButton = element(by.id('button-add-field-list'));
  var createNumericButton = element(by.id('button-add-field-numeric'));
  var createPhoneNumberButton = element(by.id('button-add-field-phone-number'));
  var createSectionBreakButton = element(by.id('button-add-field-section-break'));
  var createRichTextButton = element(by.id('button-add-field-richtext'));
  var createImageButton = element(by.id('button-add-field-image'));
  var createVideoButton = element(by.id('button-add-field-youtube'));
  var removeFieldButton = element(by.css('.field-root  .trash'));
  var removeElementButton = element(by.css('.element-root  .remove'));
  var createToolbar = element(by.id('toolbar'));
  var createFieldTitle = element(by.css('.field-title-definition'));
  var createFieldDescription = element(by.css('.field-description-definition'));
  var createFieldContent = element(by.model('$root.schemaOf(field)._ui._content'));

  var createQuestion = element(by.css('.question .title'));
  var createQuestions = element.all(by.css('.question .title'));
  var createImage = element(by.css(".image figure img"));
  var createRichtext = element(by.css(".richtext"));
  var createYoutube = element(by.css(".youtube figure img"));

  var createToastyConfirmationPopup = element(by.id('toasty')).element(by.css('.toasty-type-success'));
  var toastyMessageText = element(by.id('toasty')).element(by.css('.toast')).element(by.css('.toast-msg'));
  var createConfirmationDialog = element(by.css('.sweet-alert'));
  var sweetAlertCancelAttribute = 'data-has-cancel-button';
  var sweetAlertConfirmAttribute = 'data-has-confirm-button';
  var createSweetAlertCancelButton = element(by.css('.sweet-alert')).element(by.css('.sa-button-container')).element(
      by.css('button.cancel'));
  var createSweetAlertConfirmButton = element(by.css('.sweet-alert')).element(by.css('.sa-button-container')).element(
      by.css('button.confirm'));

  var topNavigation = element(by.id('top-navigation'));
  var topNavBackArrow = element(by.css('.back-arrow-click'));

  var topNavButtons = element.all(by.css('.controls-bar .list-inline li button'));

  var testTitle = 'test title';
  var testDescription = 'test description';
  // make the element title short to avoid problems with sendKeys when searching
  var sampleElementTitle = 's';
  var sampleElementDescription = 's';
  this.cssFieldRoot = ".field-root";
  this.cssItemRoot = ".item-root";
  this.cssFieldSortableIcon = ".field-root .sortable-icon";
  this.cssItemSortableIcon = ".item-root .sortable-icon";
  this.cssSortableIcon = ".sortable-icon";
  this.cssFieldContainer = ".field-root .elementTotalContent";
  this.modelFieldTitle = "fieldLabel[fieldLabelKey]";
  this.hasBeenCreated = 'has been created';
  this.deleteButtonTooltip = 'delete selection';
  this.deleteElementMessage = 'The template element has been deleted.';
  var templateType = 'template';
  var elementType = 'element';
  var folderType = 'folder';
  var metadataType = 'metadata';
  var dashboardType = 'dashboard';
  var cssDetailOptions = '.detail-options';

  var fieldTypes = [
    {
      "cedarType"                : "textfield",
      "iconClass"                : "fa-font",
      "label"                    : "Text",
      "allowedInElement"         : true,
      "primaryField"             : true,
      "hasControlledTerms"       : true,
      "staticField"              : false,
      "allowsMultiple"           : true,
      "allowsValueRecommendation": true
    },
    {
      "cedarType"                : "date",
      "iconClass"                : "fa-calendar",
      "label"                    : "Date",
      "allowedInElement"         : true,
      "primaryField"             : true,
      "hasControlledTerms"       : false,
      "staticField"              : false,
      "allowsMultiple"           : true,
      "allowsValueRecommendation": false
    },
    {
      "cedarType"                : "email",
      "iconClass"                : "fa-envelope",
      "label"                    : "Email",
      "allowedInElement"         : true,
      "primaryField"             : true,
      "hasControlledTerms"       : false,
      "staticField"              : false,
      "allowsMultiple"           : true,
      "allowsValueRecommendation": false
    },
    {
      "cedarType"                : "numeric",
      "iconClass"                : "fa-hashtag",
      "allowedInElement"         : true,
      "primaryField"             : true,
      "label"                    : "Number",
      "hasControlledTerms"       : false,
      "staticField"              : false,
      "allowsMultiple"           : true,
      "allowsValueRecommendation": false
    },
    {
      "cedarType"                : "textarea",
      "iconClass"                : "fa-paragraph",
      "label"                    : "Text Area",
      "allowedInElement"         : true,
      "primaryField"             : false,
      "hasControlledTerms"       : false,
      "staticField"              : false,
      "allowsMultiple"           : true,
      "allowsValueRecommendation": false
    },
    {
      "cedarType"                : "radio",
      "iconClass"                : "fa-dot-circle-o",
      "label"                    : "Multiple Choice",
      "allowedInElement"         : true,
      "primaryField"             : false,
      "hasControlledTerms"       : false,
      "staticField"              : false,
      "allowsMultiple"           : false,
      "allowsValueRecommendation": false
    },
    {
      "cedarType"                : "checkbox",
      "iconClass"                : "fa-check-square-o",
      "label"                    : "Checkbox",
      "allowedInElement"         : true,
      "primaryField"             : false,
      "hasControlledTerms"       : false,
      "staticField"              : false,
      "allowsMultiple"           : false,
      "allowsValueRecommendation": false
    },

    {
      "cedarType"                : "list",
      "iconClass"                : "fa-list",
      "allowedInElement"         : true,
      "primaryField"             : false,
      "label"                    : "List",
      "hasControlledTerms"       : false,
      "staticField"              : false,
      "allowsMultiple"           : false,
      "allowsValueRecommendation": false
    }
  ];
  this.fieldTypes = fieldTypes;

  var pageTypes = ['template', 'element'];
  this.pageTypes = pageTypes;

  // template creator
  var templateTitle = element(by.id('template-name'));
  var templateTitleForm = element(by.id('element-name-container')).element(by.tagName('form'));
  var templateDescription = element(by.id('template-description'));
  var templateDescriptionForm = element(by.id('element-description-container')).element(by.tagName('form'));
  var templateForm = element(by.id('element-name-container')).element(by.tagName('form'));

  var createSaveTemplateButton = element(by.id('button-save-template'));
  var createCancelTemplateButton = element(by.id('button-cancel-template'));
  var createClearTemplateButton = element(by.id('button-clear-template'));
  this.emptyTemplateJson = {
    "$schema"             : "http://json-schema.org/draft-04/schema#",
    "@id"                 : null,
    "@type"               : "https://schema.metadatacenter.org/core/Template",
    "@context"            : {
      "xsd"              : "http://www.w3.org/2001/XMLSchema#",
      "pav"              : "http://purl.org/pav/",
      "bibo"             : "http://purl.org/ontology/bibo/",
      "oslc"             : "http://open-services.net/ns/core#",
      "schema"           : "http://schema.org/",
      "pav:createdOn"    : {
        "@type": "xsd:dateTime"
      },
      "pav:createdBy"    : {
        "@type": "@id"
      },
      "pav:lastUpdatedOn": {
        "@type": "xsd:dateTime"
      },
      "oslc:modifiedBy"  : {
        "@type": "@id"
      }
    },
    "type"                : "object",
    "title"               : "Untitled template schema",
    "description"         : "Untitled template schema generated by the CEDAR Template Editor 1.4.2",
    "_ui"                 : {
      "title"         : "Untitled",
      "description"   : "Description",
      "pages"         : [],
      "order"         : [],
      "propertyLabels": {}
    },
    "properties"          : {
      "@context"          : {
        "type"                : "object",
        "properties"          : {
          "rdfs"              : {
            "type"  : "string",
            "format": "uri",
            "enum"  : [
              "http://www.w3.org/2000/01/rdf-schema#"
            ]
          },
          "xsd"               : {
            "type"  : "string",
            "format": "uri",
            "enum"  : [
              "http://www.w3.org/2001/XMLSchema#"
            ]
          },
          "pav"               : {
            "type"  : "string",
            "format": "uri",
            "enum"  : [
              "http://purl.org/pav/"
            ]
          },
          "schema"            : {
            "type"  : "string",
            "format": "uri",
            "enum"  : [
              "http://schema.org/"
            ]
          },
          "oslc"              : {
            "type"  : "string",
            "format": "uri",
            "enum"  : [
              "http://open-services.net/ns/core#"
            ]
          },
          "rdfs:label"        : {
            "type"      : "object",
            "properties": {
              "@type": {
                "type": "string",
                "enum": [
                  "xsd:string"
                ]
              }
            }
          },
          "schema:isBasedOn"  : {
            "type"      : "object",
            "properties": {
              "@type": {
                "type": "string",
                "enum": [
                  "@id"
                ]
              }
            }
          },
          "schema:name"       : {
            "type"      : "object",
            "properties": {
              "@type": {
                "type": "string",
                "enum": [
                  "xsd:string"
                ]
              }
            }
          },
          "schema:description": {
            "type"      : "object",
            "properties": {
              "@type": {
                "type": "string",
                "enum": [
                  "xsd:string"
                ]
              }
            }
          },
          "pav:createdOn"     : {
            "type"      : "object",
            "properties": {
              "@type": {
                "type": "string",
                "enum": [
                  "xsd:dateTime"
                ]
              }
            }
          },
          "pav:createdBy"     : {
            "type"      : "object",
            "properties": {
              "@type": {
                "type": "string",
                "enum": [
                  "@id"
                ]
              }
            }
          },
          "pav:lastUpdatedOn" : {
            "type"      : "object",
            "properties": {
              "@type": {
                "type": "string",
                "enum": [
                  "xsd:dateTime"
                ]
              }
            }
          },
          "oslc:modifiedBy"   : {
            "type"      : "object",
            "properties": {
              "@type": {
                "type": "string",
                "enum": [
                  "@id"
                ]
              }
            }
          }
        },
        "required"            : [
          "xsd",
          "pav",
          "schema",
          "oslc",
          "schema:isBasedOn",
          "schema:name",
          "schema:description",
          "pav:createdOn",
          "pav:createdBy",
          "pav:lastUpdatedOn",
          "oslc:modifiedBy"
        ],
        "additionalProperties": false
      },
      "@id"               : {
        "type"  : [
          "string",
          "null"
        ],
        "format": "uri"
      },
      "@type"             : {
        "oneOf": [
          {
            "type"  : "string",
            "format": "uri"
          },
          {
            "type"       : "array",
            "minItems"   : 1,
            "items"      : {
              "type"  : "string",
              "format": "uri"
            },
            "uniqueItems": true
          }
        ]
      },
      "schema:isBasedOn"  : {
        "type"  : "string",
        "format": "uri"
      },
      "schema:name"       : {
        "type"     : "string",
        "minLength": 1
      },
      "schema:description": {
        "type": "string"
      },
      "pav:createdOn"     : {
        "type"  : [
          "string",
          "null"
        ],
        "format": "date-time"
      },
      "pav:createdBy"     : {
        "type"  : [
          "string",
          "null"
        ],
        "format": "uri"
      },
      "pav:lastUpdatedOn" : {
        "type"  : [
          "string",
          "null"
        ],
        "format": "date-time"
      },
      "oslc:modifiedBy"   : {
        "type"  : [
          "string",
          "null"
        ],
        "format": "uri"
      }
    },
    "required"            : [
      "@context",
      "@id",
      "schema:isBasedOn",
      "schema:name",
      "schema:description",
      "pav:createdOn",
      "pav:createdBy",
      "pav:lastUpdatedOn",
      "oslc:modifiedBy"
    ],
    "pav:createdOn"       : null,
    "pav:createdBy"       : null,
    "pav:lastUpdatedOn"   : null,
    "oslc:modifiedBy"     : null,
    "schema:schemaVersion": "1.1.0",
    "additionalProperties": false,
    "pav:version"         : "0.0.1",
    "bibo:status"         : "bibo:draft"
  };

  // element creator
  var elementTitle = element(by.id('element-name'));
  var elementDescription = element(by.id('element-description'));
  var elementTitleForm = element(by.id('element-name-container')).element(by.tagName('form'));
  var elementDescriptionForm = element(by.id('element-description-container')).element(by.tagName('form'));
  var createSaveElementButton = element(by.id('button-save-element'));
  var createCancelElementButton = element(by.id('button-cancel-element'));
  var createClearElementButton = element(by.id('button-clear-element'));
  var cssElementRoot = ".element-root";
  var cssCollapseButton = '.visibilitySwitch:nth-child(0)';
  var cssOpenButton = '.visibilitySwitch:nth-child(1)';
  this.emptyElementJson = {
    "$schema"             : "http://json-schema.org/draft-04/schema#",
    "@id"                 : null,
    "@type"               : "https://schema.metadatacenter.org/core/TemplateElement",
    "@context"            : {
      "xsd"              : "http://www.w3.org/2001/XMLSchema#",
      "pav"              : "http://purl.org/pav/",
      "bibo"             : "http://purl.org/ontology/bibo/",
      "oslc"             : "http://open-services.net/ns/core#",
      "schema"           : "http://schema.org/",
      "pav:createdOn"    : {
        "@type": "xsd:dateTime"
      },
      "pav:createdBy"    : {
        "@type": "@id"
      },
      "pav:lastUpdatedOn": {
        "@type": "xsd:dateTime"
      },
      "oslc:modifiedBy"  : {
        "@type": "@id"
      }
    },
    "type"                : "object",
    "title"               : "Untitled element schema",
    "description"         : "Untitled element schema generated by the CEDAR Template Editor 1.4.3-SNAPSHOT",
    "_ui"                 : {
      "title"         : "",
      "description"   : "",
      "order"         : [],
      "propertyLabels": {}
    },
    "properties"          : {
      "@context": {
        "type"                : "object",
        "properties"          : {},
        "additionalProperties": false
      },
      "@id"     : {
        "type"  : [
          "string",
          "null"
        ],
        "format": "uri"
      },
      "@type"   : {
        "oneOf": [
          {
            "type"  : "string",
            "format": "uri"
          },
          {
            "type"       : "array",
            "minItems"   : 1,
            "items"      : {
              "type"  : "string",
              "format": "uri"
            },
            "uniqueItems": true
          }
        ]
      }
    },
    "required"            : [
      "@context",
      "@id"
    ],
    "pav:createdOn"       : null,
    "pav:createdBy"       : null,
    "pav:lastUpdatedOn"   : null,
    "oslc:modifiedBy"     : null,
    "schema:schemaVersion": "1.1.0",
    "additionalProperties": false,
    "schema:name"         : "Untitled",
    "schema:description"  : "Description",
    "pav:version"         : "0.0.1",
    "bibo:status"         : "bibo:draft"
  };

  this.isWorkspace = function () {
    browser.wait(EC.presenceOf(element(by.css('.navbar.dashboard'))));
  };

  this.createQuestion = function () {
    return createQuestion;
  };

  this.createQuestions = function () {
    return createQuestions;
  };

  this.createImage = function () {
    return createImage;
  };

  this.createRichtext = function () {
    return createRichtext;
  };

  this.createYoutube = function () {
    return createYoutube;
  };

  this.setTitle = function (type, text) {
    var title = getTitle(type);
    browser.wait(EC.visibilityOf(title));
    browser.wait(EC.elementToBeClickable(title));
    browser.actions().doubleClick(title).perform();
    title.sendKeys(text);
    title.submit();
  };

  this.setDescription = function (type, text) {
    var description = getDescription(type);
    browser.wait(EC.visibilityOf(description));
    browser.wait(EC.elementToBeClickable(description));
    browser.actions().doubleClick(description).perform();
    description.sendKeys(text);
    description.submit();
  };

  this.isHiddenJson = function () {
    return EC.presenceOf(element(by.css('#form-json-preview.preview-closed')));
  };

  this.showJson = function () {
    var closed = EC.presenceOf(element(by.css('#form-json-preview.preview-closed')));
    if (closed) {
      var openLink = element(by.css('.accordion-toggle'));
      browser.wait(EC.visibilityOf(openLink));
      browser.wait(EC.elementToBeClickable(openLink));
      openLink.click();
      browser.wait(EC.presenceOf(element(by.css('#form-json-preview.preview-open'))));
    }

  };

  this.hideJson = function () {
    var open = EC.presenceOf(element(by.css('#form-json-preview.preview-open')));
    if (open) {
      var closeLink = element(by.css('.accordion-toggle'));
      browser.wait(EC.visibilityOf(closeLink));
      browser.wait(EC.elementToBeClickable(closeLink));
      closeLink.click();
      browser.wait(EC.presenceOf(element(by.css('#form-json-preview.preview-closed'))));
    }
  };


  this.isLocked = function () {
    var lock = element(by.css('#headerCtrl .feedback-form i.fa-lock'));
    browser.wait(EC.visibilityOf(lock));
  };

  this.isUnlocked = function () {
    var unlock = element(by.css('#headerCtrl .feedback-form i.fa-unlock'));
    browser.wait(EC.visibilityOf(unlock));
  };

  this.isDirty = function () {
    var dirty = element(by.css('#headerCtrl .feedback-form i.fa-circle-o'));
    browser.wait(EC.visibilityOf(dirty));
  };

  this.isClean = function () {
    var clean = element(by.css('#headerCtrl .feedback-form i.fa-circle'));
    browser.wait(EC.visibilityOf(clean));
  };

  this.isValid = function () {
    var valid = element(by.css('#headerCtrl .feedback-form i.fa-check'));
    browser.wait(EC.visibilityOf(valid));
  };

  this.isInvalid = function () {
    var invalid = element(by.css('#headerCtrl .feedback-form i.fa-exclamation-triangle'));
    browser.wait(EC.visibilityOf(invalid));
  };


  this.clickSave = function (type) {
    var button = (type === 'template') ? createSaveTemplateButton : createSaveElementButton;
    browser.executeScript("arguments[0].scrollIntoView();", button.getWebElement());
    browser.wait(EC.elementToBeClickable(button));
    button.click();
  };

  this.confirmCancel = function (type) {

    if (type === 'template') {
      browser.wait(EC.elementToBeClickable(createCancelTemplateButton));
      createCancelTemplateButton.click();
    } else {
      browser.wait(EC.elementToBeClickable(createCancelElementButton));
      createCancelElementButton.click();
    }

    browser.wait(EC.visibilityOf(createConfirmationDialog));
    var confirm = createSweetAlertConfirmButton;
    browser.wait(EC.elementToBeClickable(confirm));
    confirm.click();
  };

  this.clickClear = function (type) {
    var btn = type === 'template' ? createClearTemplateButton : createClearElementButton;
    browser.wait(EC.visibilityOf(btn));
    browser.wait(EC.elementToBeClickable(btn));
    btn.click();
  };

  this.clickCancel = function (type) {
    var btn = type === 'template' ? createCancelTemplateButton : createCancelElementButton;
    browser.wait(EC.visibilityOf(btn));
    browser.wait(EC.elementToBeClickable(btn));
    btn.click();
  };

  var getTitle = function (type) {
    var btn;
    switch (type) {
      case "template":
        btn = templateTitle;
        break;
      case "element":
        btn = elementTitle;
        break;
    }
    return btn;
  };

  var getDescription = function (type) {
    var btn;
    switch (type) {
      case "template":
        btn = templateDescription;
        break;
      case "element":
        btn = elementDescription;
        break;
    }
    return btn;
  };


  this.isTitle = function (type, text) {
    var title = getTitle(type);
    title.getAttribute('value').then(function (value) {
      expect(value === text).toBe(true);
    });
  };

  this.isDescription = function (type, text) {
    var description = getDescription(type);
    //browser.actions().doubleClick(description).perform();
    description.getAttribute('value').then(function (value) {
      expect(value === text).toBe(true);
    });
  };

  // are we on the dashboard page?
  this.isDashboard = function () {
    return createTopNavWorkspace.isDisplayed();
  };

  this.createPageName = function () {
    return createPageName;
  };

  this.createElementPage = function () {
    return createElementPage;
  };

  this.templateJSON = function () {
    return templateJSON;
  };


  this.clickBackArrow = function () {
    // browser.wait(EC.visibilityOf(topNavBackArrow));
    // browser.wait(EC.elementToBeClickable(topNavBackArrow));
    topNavBackArrow.click();
  };
  this.createToolbar = function () {
    return createToolbar;
  };
  this.get = function () {
    browser.get(url);
  };

  this.topNavigation = function () {
    return topNavigation;
  };

  this.templateTitle = function () {
    return templateTitle;
  };

  this.templateDescription = function () {
    return templateDescription;
  };

  this.templateForm = function () {
    return templateForm;
  };

  this.testTitle = function () {
    return testTitle;
  };

  this.testDescription = function () {
    return testDescription;
  };

  this.sampleElementTitle = function () {
    return sampleElementTitle;
  };

  this.sampleElementDescription = function () {
    return sampleElementDescription;
  };
  this.templateType = function () {
    return templateType;
  };
  this.elementType = function () {
    return elementType;
  };
  this.folderType = function () {
    return folderType;
  };
  this.metadataType = function () {
    return metadataType;
  };

  this.dashboardType = function () {
    return dashboardType;
  };

  // json preview
  this.showJsonLink = function () {
    return showJsonLink;
  };

  this.jsonPreview = function () {
    return jsonPreview;
  };

  this.getJsonPreviewText = function () {
    showJsonLink.click();
    return jsonPreview.getText();
  };

  this.clickJsonPreview = function () {
    browser.executeScript("arguments[0].scrollIntoView();", showJsonLink.getWebElement());
    // browser.wait(EC.visibilityOf(showJsonLink));
    // browser.wait(EC.elementToBeClickable(showJsonLink));
    showJsonLink.click();
  };

  // toasty
  this.createToastyConfirmationPopup = function () {
    return createToastyConfirmationPopup;
  };

  this.toastyMessageText = function () {
    return toastyMessageText;
  };

  // sweet
  this.createConfirmationDialog = function () {
    return createConfirmationDialog;
  };

  this.sweetAlertCancelAttribute = function () {
    return sweetAlertCancelAttribute;
  };
  this.sweetAlertConfirmAttribute = function () {
    return sweetAlertConfirmAttribute;
  };

  this.clickConfirm = function () {
    element(by.css(confirmAttribute)).click();
  };

  this.addSearchElements = function () {
    createSearchElement.click();
  };

  this.addSearch = function (keys) {
    createSearchInput.sendKeys(keys).then(function () {
      createSearchButton.click();
    });
  };

  this.addSearchButton = function (keys) {
    createSearchButton.click();
  };

  this.getSearchBreadcrumbText = function () {
    return createSearchBreadcrumb.getText();
  };

  this.getFirstElement = function () {
    //var firstElement = element.all(by.css('.form-box .element')).first();
    return createFirstElement;

  };

  // template creator
  this.createSaveTemplateButton = function () {
    return createSaveTemplateButton;
  };

  this.createClearTemplateButton = function () {
    return createClearTemplateButton.getText();
  };
  this.createCancelTemplateButton = function () {
    return createCancelTemplateButton;
  };
  this.clickSaveTemplate = function () {
    browser.wait(createSaveTemplateButton.isPresent());
    browser.wait(createSaveTemplateButton.isDisplayed());
    createSaveTemplateButton.click();
  };


  this.clickClearTemplate = function () {
    createClearTemplateButton.click();
  };
  this.createTemplatePage = function () {
    return createTemplatePage;
  };


  // element creator
  this.elementTitle = function () {
    return elementTitle;
  };
  this.elementDescription = function () {
    return elementDescription;
  };
  this.elementTitleForm = function () {
    return elementTitleForm;
  };
  this.elementDescriptionForm = function () {
    return elementDescriptionForm;
  };
  this.createSaveElementButton = function () {
    return createSaveElementButton;
  };
  this.createCancelElementButton = function () {
    return createCancelElementButton;
  };
  this.createClearElementButton = function () {
    return createClearElementButton;
  };
  this.cssOpenButton = function () {
    return cssOpenButton;
  };
  this.cssCollapseButton = function () {
    return cssCollapseButton;
  };
  this.cssElementRoot = function () {
    return cssElementRoot;
  };
  this.clickSaveElement = function () {
    createSaveElementButton.click();
  };

  this.clickClearElement = function () {
    createClearElementButton.click();
  };


// sweet alerts
  this.clickSweetAlertCancelButton = function () {
    createSweetAlertCancelButton.click();
    browser.sleep(1000);
  };

  this.createSweetAlertCancelButton = function () {
    return createSweetAlertCancelButton;
  };

  this.createSweetAlertConfirmButton = function () {
    return createSweetAlertConfirmButton;
  };

  this.clickSweetAlertConfirmButton = function () {
    createSweetAlertConfirmButton.click();
    browser.sleep(1000);
  };

// toasty
  this.getToastyMessageText = function () {
    return toastyMessageText.getText();
  };

// utilities
  this.hasClass = function (element, cls) {
    return element.getAttribute('class').then(function (classes) {
      return classes.split(' ').indexOf(cls) !== -1;
    });
  };

// fields
  this.cssField = function (iconClass) {
    return this.cssFieldContainer + ' .' + iconClass;
  };

  this.isSelected = function (item) {
    return item.element(by.css(cssDetailOptions)).isPresent();
  };
  this.removeFieldButton = function () {
    return removeFieldButton;
  };

  this.addFieldType = function (fieldType, title, description, pageType, content) {
    var btn;

    if (!fieldType.primaryField) {
      browser.wait(EC.visibilityOf(createMore));
      browser.wait(EC.elementToBeClickable(createMore));
      createMore.click();
    }
    switch (fieldType.cedarType) {
      case "textfield":
        btn = createTextFieldButton;
        break;
      case "textarea":
        btn = createTextAreaButton;
        break;
      case "radio":
        btn = createRadioButton;
        break;
      case "checkbox":
        btn = createCheckboxButton;
        break;
      case "date":
        btn = createDateButton;
        break;
      case "email":
        btn = createEmailButton;
        break;
      case "list":
        btn = createListButton;
        break;
      case"numeric":
        btn = createNumericButton;
        break;
      case "phone-number":
        btn = createPhoneNumberButton;
        break;
      case "image":
        btn = createImageButton;
        break;
      case "richtext":
        btn = createRichTextButton;
        break;
    }

    if (btn) {
      browser.wait(EC.visibilityOf(btn));
      browser.wait(EC.elementToBeClickable(btn));
      btn.click();

      // enter the name and description
      browser.wait(EC.elementToBeClickable(createFieldTitle));
      createFieldTitle.click().sendKeys(title).sendKeys(protractor.Key.ENTER);
      browser.wait(EC.elementToBeClickable(createFieldDescription));
      createFieldDescription.click().sendKeys(description).sendKeys(protractor.Key.ENTER);
    }

    switch (fieldType.cedarType) {
      case "image":
        browser.wait(EC.elementToBeClickable(createFieldContent));
        createFieldContent.click().sendKeys(content).sendKeys(protractor.Key.ENTER);
        break;
        // case "richtext":
        //   var richTextContent = element(by.css('div.cke_contents.cke_reset'));
        //   browser.wait(EC.elementToBeClickable(richTextContent));
        //   richTextContent.click().sendKeys(content).sendKeys(protractor.Key.ENTER);
        //   break;
    }

    // wait for field to appear
    var root = pageType == 'template' ? 'field' : 'element';
    var field = element(by.css('.' + root + '-root .' + fieldType.iconClass));
    browser.wait(EC.visibilityOf(field));
  };


  this.addField = function (cedarType, isMore, title, description, content) {
    var btn;
    var found = true;

    if (isMore) {
      browser.wait(EC.visibilityOf(createMore));
      browser.wait(EC.elementToBeClickable(createMore));
      createMore.click();
    }
    switch (cedarType) {
      case "textfield":
        btn = createTextFieldButton;
        break;
      case "textarea":
        btn = createTextAreaButton;
        break;
      case "radio":
        btn = createRadioButton;
        break;
      case "checkbox":
        btn = createCheckboxButton;
        break;
      case "date":
        btn = createDateButton;
        break;
      case "email":
        btn = createEmailButton;
        break;
      case "list":
        btn = createListButton;
        break;
      case"numeric":
        btn = createNumericButton;
        break;
      case "phone-number":
        btn = createPhoneNumberButton;
        break;
      case "image":
        btn = createImageButton;
        break;
      case "richtext":
        btn = createRichTextButton;
        break;
      default:
        found = false;
        break;
    }

    if (found) {
      browser.wait(EC.visibilityOf(btn));
      browser.wait(EC.elementToBeClickable(btn));
      btn.click();

      // enter the name and description
      browser.wait(EC.elementToBeClickable(createFieldTitle));
      createFieldTitle.click().sendKeys(title).sendKeys(protractor.Key.ENTER);
      browser.wait(EC.elementToBeClickable(createFieldDescription));
      createFieldDescription.click().sendKeys(description).sendKeys(protractor.Key.ENTER);
    }

    switch (cedarType) {
      case "image":
        browser.wait(EC.elementToBeClickable(createFieldContent));
        createFieldContent.click().sendKeys(content).sendKeys(protractor.Key.ENTER);
        break;
        // case "richtext":
        //   var richTextContent = element(by.css('div.cke_contents.cke_reset'));
        //   browser.wait(EC.elementToBeClickable(richTextContent));
        //   richTextContent.click().sendKeys(content).sendKeys(protractor.Key.ENTER);
        //   break;
    }

    // var field = element(by.css('.field-root .' + fieldType.iconClass));
    // browser.wait(EC.visibilityOf(field));
  };

  this.removeElementButton = function () {
    return removeElementButton;
  };

  this.removeElement = function () {
    removeElementButton.click();
  };
  this.collapseElement = function (item) {
    var switches = item.all(By.css('.visibilitySwitch'));
    expect(switches.count()).toBe(2);
    switches.get(0).click();
    //browser.sleep(1000);
  };
  this.openElement = function (item) {
    var switches = item.all(By.css('.visibilitySwitch'));
    expect(switches.count()).toBe(2);
    switches.get(1).click();
    //browser.sleep(1000);
  };


  this.openFinder = function () {
    createSearchElement.click();
  };

  this.getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  };

  // set multiple to min 0 max unlimited which is generally the more difficult case
  this.setMultiple = function () {
    var multiple = element(by.css('div.detail-options div.element-toggle.cardinality-tab'));
    browser.executeScript("arguments[0].scrollIntoView();", multiple.getWebElement());
    browser.wait(EC.visibilityOf(multiple));
    browser.wait(EC.elementToBeClickable(multiple));
    multiple.click();

    var yesOption = element(by.css('.d-option.set-value'));
    browser.wait(EC.visibilityOf(yesOption));
    browser.wait(EC.elementToBeClickable(yesOption));
    yesOption.click();

    var dropdownToggle = element(by.css('.cardinality-selectors .min .cardinality-selector  button.dropdown-toggle'));
    browser.wait(EC.visibilityOf(dropdownToggle));
    browser.wait(EC.elementToBeClickable(dropdownToggle));
    dropdownToggle.click();

    var noneOption = element(by.css('.dropdown-selector.ng-binding.none'));
    browser.wait(EC.visibilityOf(noneOption));
    browser.wait(EC.elementToBeClickable(noneOption));
    noneOption.click();

  }


};

module.exports = new TemplateCreatorPage(); 
