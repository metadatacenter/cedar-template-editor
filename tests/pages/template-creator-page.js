'use strict';

require('../pages/dashboard-page.js');

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
  this.createSearchButton = element(by.id('search-browse-modal')).element(by.css('.do-search'));
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
  var visibilitySwitchButton = element(by.css('.element-root  .visibilitySwitch'));


  this.createToastyConfirmationPopup = element(by.id('toasty')).element(by.css('.toast'));
  this.toastyMessageText = element(by.id('toasty')).element(by.css('.toast')).element(by.css('.toast-msg'));
  this.createConfirmationDialog = element(by.css('.sweet-alert'));
  this.sweetAlertCancelAttribute = 'data-has-cancel-button';
  this.sweetAlertConfirmAttribute = 'data-has-confirm-button';
  this.createSweetAlertCancelButton = element(by.css('.sweet-alert')).element(by.css('.sa-button-container')).element(by.css('.cancel'));
  this.createSweetAlertConfirmButton = element(by.css('.sweet-alert')).element(by.css('.sa-button-container')).element(by.css('.confirm'));
  this.templateJSON = element(by.id('templateJSON'));
  this.topNavigation = element(by.id('top-navigation'));
  this.topNavBackArrow = element(by.id('top-navigation')).element(by.css('.navbar-header')).element(by.css('.back-arrow-click'));
  this.topNavButtons = element.all(by.css('.controls-bar .list-inline li button'));


  this.testTitle = 'test title';
  this.testDescription = 'test description';
  // make the element title short to avoid problems with sendKeys when searching
  this.sampleElementTitle = 's';
  this.sampleElementDescription = 's';
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
  this.template = 'template';
  this.dashboard = 'dashboard';
  this.element = 'element';
  var cssNavDashboard = '.navbar.dashboard';
  this.cssElementNamelabel = '.element-name-label';
  var cssDetailOptions = '.detail-options';

  // element creator
  this.elementTitle = element(by.id('element-name-container')).element(by.model('element._ui.title'));
  this.elementDescription = element(by.id('element-description-container')).element(by.model('element._ui.description'));
  this.elementTitleForm = element(by.id('element-name-container')).element(by.tagName('form'));
  this.elementDescriptionForm = element(by.id('element-description-container')).element(by.tagName('form'));
  this.createSaveElementButton = element(by.id('button-save-element'));
  this.createCancelElementButton = element(by.id('button-cancel-element'));
  this.createClearElementButton = element(by.id('button-clear-element'));
  this.cssElementRoot = ".element-root";
  this.cssElementSortableIcon = ".element-root .sortable-icon";
  var cssCollapseButton = '.visibilitySwitch:nth-child(0)';
  var cssOpenButton = '.visibilitySwitch:nth-child(1)';


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


  // element creator
  this.elementTitle = element(by.id('element-name-container')).element(by.model('element._ui.title'));
  this.elementDescription = element(by.id('element-description-container')).element(by.model('element._ui.description'));
  this.elementTitleForm = element(by.id('element-name-container')).element(by.tagName('form'));
  this.elementDescriptionForm = element(by.id('element-description-container')).element(by.tagName('form'));
  this.createSaveElementButton = element(by.id('button-save-element'));
  this.createCancelElementButton = element(by.id('button-cancel-element'));
  this.createClearElementButton = element(by.id('button-clear-element'));
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


  // are we on the dashboard page?
  this.isDashboard = function() {
    return element(by.css(cssNavDashboard)).isDisplayed();
  };
  // template creator
  this.clickBackArrow = function () {
    this.topNavBackArrow.click();
  };
  this.get = function () {
    browser.get(url);
// wait until loaded 
// TODO: should use EC for this 
    browser.sleep(1000);
  };

  // json preview
  this.getJsonPreviewText = function () {
    this.showJsonLink.click();
    return this.jsonPreview.getText();
  };
  this.clickJsonPreview = function () {
    this.showJsonLink.click();
  };


  this.addSearchElements = function () {
    createSearchElement.click();
  };
  this.addSearch = function (keys) {
    this.createSearchInput.sendKeys(keys).then(function () {
      this.createSearchButton.click();
    });
  };
  this.addSearchButton = function (keys) {
    this.createSearchButton.click();
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

  // element creator
  this.clickSaveElement = function () {
    this.createSaveElementButton.click();
  };
  this.clickCancelElement = function () {
    this.createCancelElementButton.click();
    return require('./dashboard-page.js');
  };
  this.clickClearElement = function () {
    this.createClearElementButton.click();
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
    expect(this.elementTitle.isDisplayed()).toBe(true);
    browser.actions().doubleClick(this.elementTitle).perform();
    this.elementTitle.sendKeys(text);
    this.elementTitleForm.submit();

  };
  this.setElementDescription = function (text) {

    // should have an editable element title
    expect(this.elementDescription.isDisplayed()).toBe(true);
    browser.actions().doubleClick(this.elementDescription).perform();
    this.elementDescription.sendKeys(text);
    this.elementDescriptionForm.submit();

  };

  // sweet alerts
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
    browser.sleep(1000);

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
    this.createSearchInput.sendKeys(title).sendKeys(protractor.Key.ENTER).then(function () {

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


  // delete the element in the workspace
  this.deleteElement = function (title) {
    var deferred = protractor.promise.defer();
    var EC = protractor.ExpectedConditions;


    var searchInput = element(by.id('search'));
    searchInput.sendKeys(title).sendKeys(protractor.Key.ENTER).then(function () {

      browser.wait(EC.textToBePresentInElementValue($('#search'), title), 10000);

      // click the search submit icon
      element(by.css('.do-search')).click().then(function () {

        var firstElement = element.all(by.css('.form-box .element')).first();
        browser.wait(EC.visibilityOf(firstElement), 10000);

        // the search browse modal should show some results
        expect(firstElement.isPresent()).toBe(true);

        // get the first element in the list of search results
        firstElement.click().then(function () {
          browser.sleep(3000);

          // top nav buttons
          var deleteButton = element(by.id('delete-selection-button'));

          browser.sleep(3000);

          browser.wait(EC.visibilityOf(deleteButton), 10000);
          expect(deleteButton.isPresent()).toBe(true);

          console.log('got delete button');

          deleteButton.getAttribute('tooltip').then(function (value) {

            console.log('with tooltip' + value);

            browser.sleep(3000);

            // make sure it really is delete
            expect(_.isEqual(value, 'delete selection')).toBe(true);
            deleteButton.click();

            // TODO not sure why i need this sleep here
            browser.sleep(1000);

            var sweetAlert = element(by.css('.sweet-alert'));
            browser.wait(EC.visibilityOf(sweetAlert), 10000);
            expect(sweetAlert.isDisplayed()).toBe(true);
            expect(sweetAlert.getAttribute('data-has-cancel-button')).toBe('true');
            expect(sweetAlert.getAttribute('data-has-confirm-button')).toBe('true');

            browser.sleep(3000);

            // click confirm to delete the element
            sweetAlert.click();
            browser.sleep(1000);

            var toasty = element(by.id('toasty')).element(by.css('.toast'));
            browser.wait(EC.visibilityOf(toasty), 10000);
            expect(toasty.isDisplayed()).toBe(true);

            browser.sleep(3000);

            var message = toasty.element(by.css('.toast')).element(by.css('.toast-msg'));
            message.getText().then(function (value) {

              browser.sleep(3000);
              expect(value.indexOf('The template element has been deleted.') !== -1).toBe(true);

              deferred.fulfill(true);
            });

          });
        });
      });
    });

    return deferred.promise;
  };
};

  module.exports = new TemplateCreatorPage(); 
