'use strict';

require('../pages/workspace-page.js');

var TemplateCreatorPage = function () {
  var url = 'https://cedar.metadatacenter.orgx/dashboard';
  var showJsonLink = element(by.id('top-navigation')).element(by.css('.navbar-header')).element(by.id('show-json-link'));
  var jsonPreview = element(by.id('form-json-preview'));
  var createButton = element(by.id('button-create'));
  var createTemplateButton = element(by.id('button-create-template'));
  var createTextFieldButton = element(by.id('button-add-field-textfield'));
  var createTextAreaButton = element(by.id('button-add-field-textarea'));
  var createRadioButton = element(by.id('button-add-field-radio'));
  var createCheckboxButton = element(by.id('button-add-field-checkbox'));
  var createMore = element(by.id('button-add-more'));


  var createSearchElement = element(by.id('button-search-element'));
  var createSearchInput = element(by.id('search-browse-modal')).element(by.id('search'));
  var createSearchButton = element(by.id('search-browse-modal')).element(by.css('.do-search'));
  var createElementButton = element(by.id('button-create-element'));
  var createSearchForm = element(by.css('.nav-search')).element(by.tagName('form'));
  var searchBrowseModalDialog = element(by.id("search-browse-modal"));
  var createSearchBreadcrumb = element(by.css('.breadcrumbs-sb  span'));
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
  var removeFieldButton = element(by.css('.field-root  .remove'));
  var removeElementButton = element(by.css('.element-root  .remove'));
  var createToolbar = element(by.id('toolbar'));


  var createToastyConfirmationPopup = element(by.id('toasty')).element(by.css('.toast'));
  var toastyMessageText = element(by.id('toasty')).element(by.css('.toast')).element(by.css('.toast-msg'));
  var createConfirmationDialog = element(by.css('.sweet-alert'));
  var sweetAlertCancelAttribute = 'data-has-cancel-button';
  var sweetAlertConfirmAttribute = 'data-has-confirm-button';
  var createSweetAlertCancelButton = element(by.css('.sweet-alert')).element(by.css('.sa-button-container')).element(by.css('.cancel'));
  var createSweetAlertConfirmButton = element(by.css('.sweet-alert')).element(by.css('.sa-button-container')).element(by.css('.confirm'));
  var templateJSON = element(by.id('templateJSON'));
  var topNavigation = element(by.id('top-navigation'));
  var topNavBackArrow = element(by.id('top-navigation')).element(by.css('.navbar-header')).element(by.css('.back-arrow-click'));
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
  this.modelFieldTitle = '$root.schemaOf(field)._ui.title';
  this.modelFieldDescription = '$root.schemaOf(field)._ui.description';
  this.hasBeenCreated = 'has been created';
  this.deleteButtonTooltip = 'delete selection';
  this.deleteElementMessage = 'The template element has been deleted.';
  var templateType = 'template';
  var elementType = 'element';
  var folderType = 'folder';
  var dashboardType = 'dashboard';
  var cssNavDashboard = '.navbar.dashboard';
  var cssDetailOptions = '.detail-options';

  // template creator
  var templateTitle = element(by.id('template-header')).element(by.model('form._ui.title'));
  var templateDescription = element(by.id('template-header')).element(by.model('form._ui.description'));
  var templateForm = element(by.id('element-name-container')).element(by.tagName('form'));

  var createSaveTemplateButton = element(by.id('button-save-template'));
  var createCancelTemplateButton = element(by.id('button-cancel-template'));
  var createClearTemplateButton = element(by.id('button-clear-template'));
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


  // element creator
  var elementTitle = element(by.id('element-name-container')).element(by.model('element._ui.title'));
  var elementDescription = element(by.id('element-description-container')).element(by.model('element._ui.description'));
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
      "pav"  : "http://purl.org/pav/",
      "cedar": "https://schema.metadatacenter.org/core/"
    },
    "type"                : "object",
    "title"               : "Untitled element schema",
    "description"         : "Untitled element schema autogenerated by the CEDAR Template Editor",
    "_ui"                 : {
      "title"      : "Untitled",
      "description": "Description",
      "order"      : []
    },
    "properties"          : {
      "@context"           : {
        "properties"          : {},
        "required"            : [
          "_value"
        ],
        "additionalProperties": false
      },
      "@id"                : {
        "format": "uri",
        "type"  : "string"
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
      "@id"
    ],
    "pav:createdOn"       : null,
    "pav:createdBy"       : null,
    "pav:lastUpdatedOn"   : null,
    "cedar:lastUpdatedBy" : null,
    "additionalProperties": false
  };


  this.test = function () {
    console.log('template creator  page test');
  };

  // are we on the dashboard page?
  this.isDashboard = function () {
    return element(by.css(cssNavDashboard)).isDisplayed();
  };
  // template creator

  this.templateJSON = function () {
    return templateJSON;
  };
  this.clickBackArrow = function () {
    topNavBackArrow.click();
  };
  this.toolbar = function () {
    return toolbar;
  };
  this.get = function () {
    browser.get(url);
// wait until loaded 
// TODO: should use EC for this 
    browser.sleep(1000);
  };

  this.topNavigation = function () {
    return topNavigation;
  };
  this.topNavBackArrow = function () {
    return topNavBackArrow;
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
    showJsonLink.click();
  };

  // toasty
  this.createToastyConfirmationPopup = function () {
    return createToastyConfirmationPopup;
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
    var firstElement = element.all(by.css('.form-box .element')).first();
    return firstElement;

  };
  this.findSearchSubmit = function () {

    var elm = element.all(by.css('.subm')).get(0);
    browser.executeScript("arguments[0].scrollIntoView();", elm.getWebElement());
    browser.sleep(3000);
    return elm;

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
    createSaveTemplateButton.click();
  };
  this.clickCancelTemplate = function () {
    createCancelTemplateButton.click();
    return require('./workspace-page.js');
  };
  this.clickClearTemplate = function () {
    createClearTemplateButton.click();
  };
  this.createTemplate = function () {
    browser.actions().mouseMove(createButton).perform();
    createTemplateButton.click();
  };

  this.setTemplateTitle = function (text) {

    // should have an editable element title
    var title = element(by.id('template-name'));
    expect(title.isDisplayed()).toBe(true);
    browser.actions().doubleClick(title).perform();
    browser.sleep(3000);
    title.sendKeys(text);
    browser.sleep(3000);
    element(by.css('.template-header form')).submit();
  };

  this.setTemplateDescription = function (text) {

    // should have an editable element title
    expect(elementDescription.isDisplayed()).toBe(true);
    browser.actions().doubleClick(elementDescription).perform();
    elementDescription.sendKeys(text);
    elementDescriptionForm.submit();
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
  this.clickCancelElement = function () {
    createCancelElementButton.click();
    return require('./workspace-page.js');
  };
  this.clickClearElement = function () {
    createClearElementButton.click();
  };
  this.createElement = function () {
    browser.actions().mouseMove(createButton).perform();
    createElementButton.click();
  };
  this.createElement = function () {
    browser.actions().mouseMove(createButton).perform();
    createElementButton.click();
  };
  this.setElementTitle = function (text) {

    // should have an editable element title
    expect(elementTitle.isDisplayed()).toBe(true);
    browser.actions().doubleClick(elementTitle).perform();
    elementTitle.sendKeys(text);
    elementTitleForm.submit();

  };
  this.setElementDescription = function (text) {

    // should have an editable element title
    expect(elementDescription.isDisplayed()).toBe(true);
    browser.actions().doubleClick(elementDescription).perform();
    elementDescription.sendKeys(text);
    elementDescriptionForm.submit();

  };

  // sweet alerts
  this.clickSweetAlertCancelButton = function () {
    createSweetAlertCancelButton.click();
    browser.sleep(1000);
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
  this.isSelected = function (item) {
    return item.element(by.css(cssDetailOptions)).isPresent();
  }
  this.removeField = function () {
    removeFieldButton.click();
  };
  this.addField = function (cedarType) {
    var deferred = protractor.promise.defer();
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
    browser.wait(createToolbar.isDisplayed());
    browser.sleep(1000);  // add time for animation

    deferred.fulfill(true);
    return deferred.promise;

  };

  this.removeElement = function () {
    removeElementButton.click();
    browser.sleep(1000);
  };
  this.collapseElement = function (item) {
    var switches = item.all(By.css('.visibilitySwitch'));
    expect(switches.count()).toBe(2);
    switches.get(0).click();
    browser.sleep(1000);
  };
  this.openElement = function (item) {
    var switches = item.all(By.css('.visibilitySwitch'));
    expect(switches.count()).toBe(2);
    switches.get(1).click();
    browser.sleep(1000);
  };
  this.addElement = function (title) {
    var deferred = protractor.promise.defer();
    var EC = protractor.ExpectedConditions;

    // add an element
    this.addMore();
    this.addSearchElements();

    // search for the sampleElement
    createSearchInput.sendKeys(title).sendKeys(protractor.Key.ENTER).then(function () {

      browser.wait(EC.textToBePresentInElementValue($('#search'), title), 10000);

      // click the search submit icon
      var searchButton = element(by.id('search-browse-modal')).element(by.css('.do-search'));
      searchButton.click().then(function () {

        var firstElement = element.all(by.css('.form-box .element')).first();
        browser.wait(EC.visibilityOf(firstElement), 10000);

        // the search browse modal should show some results
        expect(firstElement.isPresent()).toBe(true);

        // get the first element in the list of search results
        firstElement.click().then(function () {

          // select the first element in the list and click to submit the search browser modal
          var searchSubmit = element.all(by.css('.subm')).get(0);
          browser.executeScript("arguments[0].scrollIntoView();", searchSubmit.getWebElement());
          browser.sleep(3000);

          searchSubmit.click().then(function () {
            deferred.fulfill(true);
          });
        });
      });
    });
    return deferred.promise;
  };

};

module.exports = new TemplateCreatorPage(); 
