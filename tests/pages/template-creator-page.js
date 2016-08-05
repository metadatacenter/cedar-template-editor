'use strict';

require ('../pages/dashboard-page.js');

var TemplateCreatorPage = function () {
  var url = 'https://cedar.metadatacenter.orgx/dashboard';
  this.showJsonLink = element(by.id('top-navigation')).element(by.css('.navbar-header')).element(by.id('show-json-link'));
  this.jsonPreview = element(by.id('form-json-preview'));
  var createButton = element(by.id('button-create'));
  var createTemplateButton = element(by.id('button-create-template'));
  var createTextFieldButton = element(by.id('button-add-field-textfield'));
  var createTextAreaButton = element(by.id('button-add-field-textarea'));
  var createRadioButton = element(by.id('button-add-field-radio'));
  var createCheckboxButton = element(by.id('button-add-field-checkbox'));
  var createMore = element(by.id('button-add-more'));


  var createSearchElement = element(by.id('button-search-element'));
  this.createSearchInput = element(by.id('search-browse-modal')).element(by.id('search'));
  var createSearchButton = element(by.id('search-browse-modal')).element(by.css('.do-search'));
  var createSearchForm =   element(by.css('.nav-search')).element(by.tagName('form'));
  var searchBrowseModalDialog = element(by.id("search-browse-modal"));
  var createSearchBreadcrumb =  element(by.css('.breadcrumbs-sb  span'));
  var createSearchSubmitButton = element(by.css(".footer-buttons")).element(by.css('.subm'));
  var createSearchBreadcrumbText = element(by.id("search-browse-modal")).element(by.css('.controls-bar .as-modal')).element(by.css('.breadcrumbs-sb')).element(by.tagName('p')).element(by.tagName('span'));

  var createDateButton = element(by.id('button-add-field-date'));
  var createEmailButton = element(by.id('button-add-field-email'));
  var createListButton = element(by.id('button-add-field-list'));
  var createNumericButton = element(by.id('button-add-field-numeric'));
  var createPhoneNumberButton = element(by.id('button-add-field-phone-number'));
  var createSectionBreakButton = element(by.id('button-add-field-section-break'));
  var createRichTextButton = element(by.id('button-add-field-richtext'));
  var createImageButton = element(by.id('button-add-field-image'));
  var createVideoButton = element(by.id('button-add-field-youtube'));
  var removeButton = element(by.css('.field-root  .remove'));

  this.createToastyConfirmationPopup =  element(by.id('toasty')).element(by.css('.toast'));
  this.toastyMessageText = element(by.id('toasty')).element(by.css('.toast')).element(by.css('.toast-msg'));
  this.createConfirmationDialog = element(by.css('.sweet-alert'));
  this.sweetAlertCancelAttribute = 'data-has-cancel-button';
  this.sweetAlertConfirmAttribute = 'data-has-confirm-button';
  this.createSweetAlertCancelButton = element(by.css('.sweet-alert')).element(by.css('.sa-button-container')).element(by.css('.cancel'));
  this.createSweetAlertConfirmButton = element(by.css('.sweet-alert')).element(by.css('.sa-button-container')).element(by.css('.confirm'));
  this.templateJSON = element(by.id('templateJSON'));
  this.topNavigation = element(by.id('top-navigation'));
  this.topNavBackArrow = element(by.id('top-navigation')).element(by.css('.navbar-header')).element(by.css('.back-arrow-click'));

  this.testTitle = 'test title';
  this.testDescription = 'test description';
  this.cssFieldRoot = ".field-root";
  this.cssFieldSortableIcon = ".field-root .sortable-icon";
  this.cssFieldContainer = ".field-root .elementTotalContent";
  this.modelFieldTitle = '$root.schemaOf(field)._ui.title';
  this.modelFieldDescription = '$root.schemaOf(field)._ui.description';
  this.hasBeenCreated = 'has been created';
  this.template = 'template';
  this.dashboard = 'dashboard';
  this.element = 'element';

  // element creator
  this.elementTitle = element(by.id('element-name-container')).element(by.model('element._ui.title'));
  this.elementDescription = element(by.id('element-description-container')).element(by.model('element._ui.description'));
  this.elementTitleForm = element(by.id('element-name-container')).element(by.tagName('form'));
  this.elementDescriptionForm = element(by.id('element-description-container')).element(by.tagName('form'));
  this.createSaveElementButton = element(by.id('button-save-element'));
  this.createCancelElementButton = element(by.id('button-cancel-element'));
  this.createClearElementButton = element(by.id('button-clear-element'));

  // template creator
  this.templateTitle = element(by.id('template-header')).element(by.model('form._ui.title'));
  this.templateDescription = element(by.id('template-header')).element(by.model('form._ui.description'));
  this.templateForm = element(by.id('element-name-container')).element(by.tagName('form'));
  this.createSaveTemplateButton = element(by.id('button-save-template'));
  this.createCancelTemplateButton = element(by.id('button-cancel-template'));
  this.createClearTemplateButton = element(by.id('button-clear-template'));
  this.emptyTemplateJson = {
    "$schema"             : "http://json-schema.org/draft-04/schema#",
    "@id"                 : null,
    "@type"               : "https://schema.metadatacenter.org/core/Template",
    "@context"            : {
      "pav"   : "http://purl.org/pav/",
      "cedar" : "https://schema.metadatacenter.org/core/",
      "_value": "https://schema.org/value"
    },
    "type"                : "object",
    "title"               : "Untitled template schema",
    "description"         : "Untitled template schema autogenerated by the CEDAR Template Editor",
    "_ui"                 : {
      "title"      : "Untitled",
      "description": "Description",
      "pages"      : []
    },
    "properties"          : {
      "@context"           : {
        "properties"          : {
          "_value": {
            "enum": [
              "https://schema.org/value"
            ]
          },
          "pav"   : {
            "enum": [
              "http://purl.org/pav/"
            ]
          },
          "cedar" : {
            "enum": [
              "https://schema.metadatacenter.org/core/"
            ]
          }
        },
        "required"            : [
          "_value"
        ],
        "additionalProperties": false
      },
      "@id"                : {
        "type"  : "string",
        "format": "uri"
      },
      "@type"              : {
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
      "_templateId"        : {
        "type"  : "string",
        "format": "uri"
      },
      "pav:createdOn"      : {
        "type"  : "string",
        "format": "date-time"
      },
      "pav:createdBy"      : {
        "type"  : "string",
        "format": "uri"
      },
      "pav:lastUpdatedOn"  : {
        "type"  : "string",
        "format": "date-time"
      },
      "cedar:lastUpdatedBy": {
        "type"  : "string",
        "format": "uri"
      }
    },
    "required"            : [
      "@id",
      "_templateId"
    ],
    "pav:createdOn"       : null,
    "pav:createdBy"       : null,
    "pav:lastUpdatedOn"   : null,
    "cedar:lastUpdatedBy" : null,
    "additionalProperties": false
  };


  this.test = function() {
    console.log('template creator page test');
  };

  this.get = function () {
    browser.get(url);
// wait until loaded 
// TODO: should use EC for this 
    browser.sleep(1000);
  };
  this.getJsonPreviewText = function () {
    this.showJsonLink.click();
    return this.jsonPreview.getText();
  };
  this.clickJsonPreview = function () {
    this.showJsonLink.click();
  };
  this.cssField = function (iconClass) {
    return this.cssFieldContainer + ' .' + iconClass;
  };
  this.addTextField = function () {
    createTextFieldButton.click();
  };
  this.addTextArea = function () {
    createTextAreaButton.click();
  };
  this.addRadio = function () {
    createRadioButton.click();
  };
  this.addCheckbox = function () {
    createCheckboxButton.click();
  };
  this.addMore = function () {
    createMore.click();
  };
  this.addSearchElements = function () {
   createSearchElement.click();
  };
  this.addSearch = function(keys) {
    this.createSearchInput.sendKeys(keys).then(function() {
      createSearchButton.click();
    });
  };
  this.addSearchButton = function(keys) {
    createSearchButton.click();
  };
  this.getSearchBreadcrumbText = function() {
    return createSearchBreadcrumb.getText();
  };
  this.getFirstElement = function() {
    var firstElement = element.all(by.css('.form-box .element')).first();
    return firstElement;

  };
  this.findSearchSubmit = function() {

    var elm = element.all(by.css('.subm')).get(0);
    browser.executeScript("arguments[0].scrollIntoView();", elm.getWebElement());
    browser.sleep(3000);
    return elm;

    // elm.click();

  };
  this.addDateField = function () {
    createDateButton.click();
  };
  this.addEmailField = function () {
    createEmailButton.click();
  };
  this.addListField = function () {
    createListButton.click();
  };
  this.addNumericField = function () {
    createNumericButton.click();
  };
  this.addPhoneNumberField = function () {
    createPhoneNumberButton.click();
  };
  this.addSectionBreakField = function () {
    createSectionBreakButton.click();
  };
  this.addRichTextField = function () {
    createRichTextButton.click();
  };
  this.addImageField = function () {
    createImageButton.click();
  };
  this.addVideoField = function () {
    createVideoButton.click();
  };
  this.removeField = function () {
    removeButton.click();
  };

  // template creator
  this.clickSaveTemplate = function () {
    this.createSaveTemplateButton.click();
  };
  this.clickCancelTemplate = function () {
    this.createCancelTemplateButton.click();
    return require('./dashboard-page.js');
  };
  this.clickClearTemplate = function () {
    this.createClearTemplateButton.click();
  };
  this.createTemplate = function () {
    browser.actions().mouseMove(createButton).perform();
    createTemplateButton.click();
  };


  this.clickSweetAlertCancelButton = function () {
    this.createSweetAlertCancelButton.click();
    browser.sleep(1000);
  };
  this.clickSweetAlertConfirmButton = function () {
    this.createSweetAlertConfirmButton.click();
    browser.sleep(1000);
  };
  this.getToastyMessageText = function () {
    return this.toastyMessageText.getText();
  };
  this.hasClass = function (element, cls) {
    return element.getAttribute('class').then(function (classes) {
      return classes.split(' ').indexOf(cls) !== -1;
    });
  };
  this.addField = function (cedarType) {
    switch (cedarType) {
      case "textfield":
        this.addTextField();
        break;
      case "textarea":
        this.addTextArea();
        break;
      case "radio":
        this.addRadio();
        break;
      case "checkbox":
        this.addCheckbox();
        break;
      case "date":
        this.addMore();
        this.addDateField();
        break;
      case "email":
        this.addMore();
        this.addEmailField();
        break;
      case "list":
        this.addMore();
        this.addListField();
        break;
      case "numeric":
        this.addMore();
        this.addNumericField();
        break;
      case "phone-number":
        this.addMore();
        this.addPhoneNumberField();
        break;
      case "section-break":
        this.addMore();
        this.addSectionBreakField();
        break;
      case "richtext":
        this.addMore();
        this.addRichTextField();
        break;
      case "image":
        this.addMore();
        this.addImageField();
        break;
      case "youtube":
        this.addMore();
        this.addVideoField();
        break;
    }
    // needs to sleep to let the toolbar scroll back into the view
    // also move the mouse off the toolbar button so the tooltip is hidden
    browser.sleep(1000);
  }
};
module.exports = new TemplateCreatorPage(); 
