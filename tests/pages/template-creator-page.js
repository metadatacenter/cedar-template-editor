'use strict';

require('../pages/workspace-page.js');
require('../modals/finder-modal.js');

var TemplateCreatorPage = function () {

      var EC = protractor.ExpectedConditions;

      var testConfig = require('../config/test-env.js');
      var url = testConfig.baseUrl + '/dashboard';
      var showJsonLink = element(by.id('top-navigation')).element(by.css('.navbar-header')).element(by.id('show-json-link'));
      var jsonPreview = element(by.id('form-json-preview'));
      var createButton = element(by.id('button-create'));
      var createTemplateButton = element(by.id('button-create-template'));
      var createTemplatePage = element(by.css('#top-navigation.template'));
      var createTextFieldButton = element(by.id('button-add-field-textfield'));
      var createTextAreaButton = element(by.id('button-add-field-textarea'));
      var createRadioButton = element(by.id('button-add-field-radio'));
      var createCheckboxButton = element(by.id('button-add-field-checkbox'));
      var createMore = element(by.id('button-add-more'));
      var createFinder = element(by.id('finder-modal'));
      var createPageName = element(by.css('#top-navigation.dashboard'));


      var createSearchElement = element(by.id('button-search-element'));
      var createSearchInput = element(by.id('search-browse-modal')).element(by.id('search'));
      var createSearchButton = element(by.id('search-browse-modal')).element(by.css('.do-search'));
      var createSearchResult = element(by.id('search-browse-modal')).element(by.css('.search-result'));
      var createFirstElement = element.all(by.css('.form-box .element')).first();
      var createElementButton = element(by.id('button-create-element'));
      var createElementPage = element(by.css('#top-navigation.element'));
      var createSearchForm = element(by.css('.nav-search')).element(by.tagName('form'));
      var searchBrowseModalDialog = element(by.id("search-browse-modal"));
      var createSearchBreadcrumb = element(by.css('.breadcrumbs-sb  span'));
      var createSearchSubmitButton = element(by.css(".footer-buttons")).element(by.css('.subm'));
      var createSearchBreadcrumbText = element(by.id("search-browse-modal")).element(by.css('.controls-bar .as-modal')).element(by.css('.breadcrumbs-sb')).element(by.tagName('p')).element(by.tagName('span'));
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
      var removeFieldButton = element(by.css('.field-root  .remove'));
      var removeElementButton = element(by.css('.element-root  .remove'));
      var createToolbar = element(by.id('toolbar'));
      var createFieldTitle = element(by.css('.field-title-definition'));
      var createFieldDescription = element(by.css('.field-description-definition'));

      var createToastyConfirmationPopup = element(by.id('toasty')).element(by.css('.toasty-type-success'));
      var toastyMessageText = element(by.id('toasty')).element(by.css('.toast')).element(by.css('.toast-msg'));
      var createConfirmationDialog = element(by.css('.sweet-alert'));
      var sweetAlertCancelAttribute = 'data-has-cancel-button';
      var sweetAlertConfirmAttribute = 'data-has-confirm-button';
      var createSweetAlertCancelButton = element(by.css('.sweet-alert')).element(by.css('.sa-button-container')).element(by.css('button.cancel'));
      var createSweetAlertConfirmButton = element(by.css('.sweet-alert')).element(by.css('.sa-button-container')).element(by.css('button.confirm'));
      var templateJSON = element(by.id('templateJSON'));
      var templateJSONHidden = element(by.css('#templateJSON.ng-hide'));
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
      var metadataType = 'metadata';
      var dashboardType = 'dashboard';
      var cssDetailOptions = '.detail-options';


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
          "pav"   : "http://purl.org/pav/",
          "oslc"  : "http://open-services.net/ns/core#",
          "schema": "http://schema.org/"
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
          "@context"          : {
            "type"                : "object",
            "properties"          : {
              "pav"   : {
                "type"  : "string",
                "format": "uri",
                "enum"  : [
                  "http://purl.org/pav/"
                ]
              },
              "schema": {
                "type"  : "string",
                "format": "uri",
                "enum"  : [
                  "http://schema.org/"
                ]
              },
              "oslc"  : {
                "type"  : "string",
                "format": "uri",
                "enum"  : [
                  "http://open-services.net/ns/core#"
                ]
              }
            },
            "patternProperties"   : {
              "^(?!pav)(?!schema)(?!oslc)[a-zA-Z][a-zA-Z0-9]*$": {
                "type"  : "string",
                "format": "uri"
              }
            },
            "required"            : [
              "pav",
              "schema",
              "oslc"
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
        "additionalProperties": false
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
          "pav" : "http://purl.org/pav/",
          "oslc": "http://open-services.net/ns/core#"
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
          "@context"         : {
            "type"                : "object",
            "properties"          : {
              "pav" : {
                "type"  : "string",
                "format": "uri",
                "enum"  : [
                  "http://purl.org/pav/"
                ]
              },
              "oslc": {
                "type"  : "string",
                "format": "uri",
                "enum"  : [
                  "http://open-services.net/ns/core#"
                ]
              }
            },
            "patternProperties"   : {
              "^(?!pav)(?!schema)(?!oslc)[a-zA-Z][a-zA-Z0-9]*$": {
                "type"  : "string",
                "format": "uri"
              }
            },
            "required"            : [],
            "additionalProperties": false
          },
          "@id"              : {
            "type"  : [
              "string",
              "null"
            ],
            "format": "uri"
          },
          "@type"            : {
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
          "pav:createdOn"    : {
            "type"  : [
              "string",
              "null"
            ],
            "format": "date-time"
          },
          "pav:createdBy"    : {
            "type"  : [
              "string",
              "null"
            ],
            "format": "uri"
          },
          "pav:lastUpdatedOn": {
            "type"  : [
              "string",
              "null"
            ],
            "format": "date-time"
          },
          "oslc:modifiedBy"  : {
            "type"  : [
              "string",
              "null"
            ],
            "format": "uri"
          }
        },
        "required"            : [],
        "pav:createdOn"       : null,
        "pav:createdBy"       : null,
        "pav:lastUpdatedOn"   : null,
        "oslc:modifiedBy"     : null,
        "additionalProperties": false
      };

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
          "primaryField"      : false,
          "allowedInElement"  : true,
          "hasControlledTerms": true,
          "staticField"       : false
        },
        {
          "cedarType"         : "checkbox",
          "iconClass"         : "cedar-svg-checkbox",
          "label"             : "Checkbox",
          "primaryField"      : false,
          "allowedInElement"  : true,
          "hasControlledTerms": true,
          "staticField"       : false
        },
        {
          "cedarType"         : "date",
          "iconClass"         : "cedar-svg-calendar",
          "label"             : "Date",
          "primaryField"      : true,
          "allowedInElement"  : true,
          "hasControlledTerms": false,
          "staticField"       : false
        },
        {
          "cedarType"         : "email",
          "iconClass"         : "cedar-svg-at",
          "primaryField"      : false,
          "label"             : "Email",
          "allowedInElement"  : true,
          "hasControlledTerms": false,
          "staticField"       : false
        },
        {
          "cedarType"         : "list",
          "iconClass"         : "cedar-svg-list",
          "allowedInElement"  : true,
          "primaryField"      : false,
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
          "primaryField"      : false,
          "label"             : "Phone Number",
          "hasControlledTerms": false,
          "staticField"       : false
        },
        {
          "cedarType"         : "section-break",
          "iconClass"         : "cedar-svg-section-break",
          "allowedInElement"  : true,
          "primaryField"      : false,
          "label"             : "Section Break",
          "hasControlledTerms": false,
          "staticField"       : true
        },
        {
          "cedarType"         : "richtext",
          "iconClass"         : "cedar-svg-rich-text",
          "allowedInElement"  : true,
          "primaryField"      : false,
          "label"             : "Rich Text",
          "hasControlledTerms": false,
          "staticField"       : true
        },
        {
          "cedarType"         : "image",
          "iconClass"         : "cedar-svg-image",
          "allowedInElement"  : true,
          "primaryField"      : false,
          "label"             : "Image",
          "hasControlledTerms": false,
          "staticField"       : true
        },
        {
          "cedarType"         : "youtube",
          "iconClass"         : "cedar-svg-youtube",
          "allowedInElement"  : true,
          "primaryField"      : false,
          "label"             : "YouTube Video",
          "hasControlledTerms": false,
          "staticField"       : true
        }
      ];

      this.isWorkspace = function() {
        browser.wait(EC.presenceOf(element(by.css('.navbar.dashboard'))));
      };


      this.createPage = function (type, title, description) {

        browser.actions().mouseMove(createButton).perform();

        if (type === 'template') {

          browser.wait(EC.elementToBeClickable(createTemplateButton));
          createTemplateButton.click();

          if (title) {
            browser.wait(EC.elementToBeClickable(templateTitle));
            browser.actions().doubleClick(templateTitle).perform();
            templateTitle.sendKeys(title);
            templateTitleForm.submit();
          }
          if (description) {
            browser.wait(EC.elementToBeClickable(templateDescription));
            browser.actions().doubleClick(templateDescription).perform();
            templateDescription.sendKeys(description);
            templateDescriptionForm.submit();
          }

          browser.wait(EC.presenceOf(createSaveTemplateButton));
          browser.wait(EC.presenceOf(element(by.model('form._ui.title'))));
          browser.wait(EC.presenceOf(element(by.model('form._ui.description'))));

        } else {
          browser.wait(EC.elementToBeClickable(createElementButton));
          createElementButton.click();

          if (title) {
            browser.wait(EC.elementToBeClickable(elementTitle));
            browser.actions().doubleClick(elementTitle).perform();
            elementTitle.sendKeys(title);
            elementTitleForm.submit();
          }
          if (description) {
            browser.wait(EC.elementToBeClickable(elementDescription));
            browser.actions().doubleClick(elementDescription).perform();
            elementDescription.sendKeys(description);
            elementDescriptionForm.submit();
          }

          browser.wait(EC.presenceOf(createSaveElementButton));
          browser.wait(EC.presenceOf(element(by.model('element._ui.title'))));
          browser.wait(EC.presenceOf(element(by.model('element._ui.description'))));
        }
      };

      this.showJson = function() {

        expect(templateJSON.isDisplayed()).toBe(false);
        browser.wait(EC.visibilityOf(showJsonLink));
        browser.wait(EC.elementToBeClickable(showJsonLink));
        showJsonLink.click();
        browser.wait(EC.visibilityOf(templateJSON));
      };

      this.hideJson = function() {

        expect(templateJSON.isDisplayed()).toBe(true);
        browser.wait(EC.visibilityOf(showJsonLink));
        browser.wait(EC.elementToBeClickable(showJsonLink));
        showJsonLink.click();
        browser.wait(EC.invisibilityOf(templateJSON));
      };


      this.clickSave = function (type) {
        var button = (type === 'template') ? createSaveTemplateButton : createSaveElementButton;

        browser.wait(EC.elementToBeClickable(button));
        button.click().then(function () {

          browser.sleep(500);
          browser.ignoreSynchronization = true;

          var toastyClose = element(by.css('#toasty .toast .close-button'));
          toastyClose.click();

          browser.sleep(500);
          browser.ignoreSynchronization = false;
        });


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
        if (type === 'template') {
          browser.wait(EC.elementToBeClickable(createClearTemplateButton));
          createClearTemplateButton.click();
        } else {
          browser.wait(EC.elementToBeClickable(createClearElementButton));
          createClearElementButton.click();
        }
      };

      this.clickCancel = function (type) {
        if (type === 'template') {
          browser.wait(EC.elementToBeClickable(createCancelTemplateButton));
          createCancelTemplateButton.click();
        } else {
          browser.wait(EC.elementToBeClickable(createCancelElementButton));
          createCancelElementButton.click();
        }
      };

      this.setTitle = function (type, text) {
        if (type === 'template') {
          browser.actions().doubleClick(templateTitle).perform();
          templateTitle.sendKeys(text);
          templateTitle.submit();
          templateTitle.getAttribute('value').then(function (value) {
            expect(value === text).toBe(true);
          });
        } else {
          browser.actions().doubleClick(elementTitle).perform();
          elementTitle.sendKeys(text);
          elementTitle.submit();
          elementTitle.getAttribute('value').then(function (value) {
            expect(value === text).toBe(true);
          });
        }
      };

      this.isTitle = function (type, text) {
        if (type === 'template') {
          //browser.actions().doubleClick(templateTitle).perform();
          templateTitle.getAttribute('value').then(function (value) {
            expect(value === text).toBe(true);
          });
        } else {
          //browser.actions().doubleClick(elementTitle).perform();
          elementTitle.getAttribute('value').then(function (value) {
            expect(value === text).toBe(true);
          });
        }
      };

      this.setDescription = function (type, text) {
        if (type === 'template') {
          browser.actions().doubleClick(templateDescription).perform();
          templateDescription.sendKeys(text);
          templateDescription.submit();
          templateDescription.getAttribute('value').then(function (value) {
            expect(value === text).toBe(true);
          });
        } else {
          browser.actions().doubleClick(elementDescription).perform();
          elementDescription.sendKeys(text);
          elementDescription.submit();
          elementDescription.getAttribute('value').then(function (value) {
            expect(value === text).toBe(true);
          });
        }
      };

      this.isDescription = function (type, text) {
        if (type === 'template') {
          browser.actions().doubleClick(templateDescription).perform();
          templateDescription.getAttribute('value').then(function (value) {
            expect(value === text).toBe(true);
          });
        } else {
          browser.actions().doubleClick(elementDescription).perform();
          elementDescription.getAttribute('value').then(function (value) {
            expect(value === text).toBe(true);
          });
        }
      };

      this.fieldType = function (index) {
        return fieldTypes[index];
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
      this.templateJSONHidden = function () {
        return templateJSONHidden;
      };

      this.clickBackArrow = function () {
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

      this.createElement = function () {

        var deferred = protractor.promise.defer();

        isReady(createButton).then(function () {
          browser.actions().mouseMove(createButton).perform().then(function () {
            isReady(createElementButton).then(function () {
              createElementButton.click().then(function () {
                isReady(createElementPage).then(function () {
                  deferred.fulfill(true);

                });
              });
            });
          });
        });
        return deferred.promise;
      };

      this.setElementTitle = function (text) {

        var deferred = protractor.promise.defer();

        // should have an editable element title
        isReady(elementTitle).then(function () {

          browser.actions().doubleClick(elementTitle).perform().then(function () {
            elementTitle.sendKeys(text).then(function () {
              elementTitleForm.submit().then(function () {
                deferred.fulfill(true);
              });
            });
          });

        });
        return deferred.promise;
      };

      this.setElementDescription = function (text) {

        var deferred = protractor.promise.defer();

        // should have an editable element description
        isReady(elementDescription).then(function () {

          browser.actions().doubleClick(elementDescription).perform().then(function () {
            elementDescription.sendKeys(text).then(function () {
              elementDescriptionForm.submit();
              deferred.fulfill(true);
            });
          });
        });

        return deferred.promise;

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


      this.addField = function (cedarType, isMore, title, description) {
        if (isMore) {
          browser.wait(EC.visibilityOf(createMore));
          browser.wait(EC.elementToBeClickable(createMore));
          createMore.click();
        }
        switch (cedarType) {
          case "textfield":
            browser.wait(EC.elementToBeClickable(createTextFieldButton));
            createTextFieldButton.click();
            break;
          case "textarea":
            browser.wait(EC.elementToBeClickable(createTextAreaButton));
            createTextAreaButton.click();
            break;
          case "radio":
            browser.wait(EC.elementToBeClickable(createRadioButton));
            createRadioButton.click();
            break;
          case "checkbox":
            browser.wait(EC.elementToBeClickable(createCheckboxButton));
            createCheckboxButton.click();
            break;
          case "date":
            browser.wait(EC.elementToBeClickable(createDateButton));
            createDateButton.click();
            break;
          case "email":
            browser.wait(EC.elementToBeClickable(createEmailButton));
            createEmailButton.click();
            break;
          case "list":
            browser.wait(EC.elementToBeClickable(createListButton));
            createListButton.click();
            break;
          case"numeric":
            browser.wait(EC.elementToBeClickable(createNumericButton));
            createNumericButton.click();
            break;
          case "phone-number":
            browser.wait(EC.elementToBeClickable(createPhoneNumberButton));
            createPhoneNumberButton.click();
            break;
          case"section-break":
            //browser.wait(EC.elementToBeClickable(createSectionBreakButton));
            createSectionBreakButton.click();
            break;
          case"richtext":
            browser.wait(EC.elementToBeClickable(createRichTextButton));
            createRichTextButton.click();
            break;
          case "image":
            browser.wait(EC.elementToBeClickable(createImageButton));
            createImageButton.click();
            break;
          case "youtube":
            browser.wait(EC.elementToBeClickable(createVideoButton));
            createVideoButton.click();
            break;
        }
        if (cedarType != "youtube") {

          // enter the name and description
          browser.wait(EC.elementToBeClickable(createFieldTitle));
          createFieldTitle.click().sendKeys(title).sendKeys(protractor.Key.ENTER);
          browser.wait(EC.elementToBeClickable(createFieldDescription));
          createFieldDescription.click().sendKeys(description).sendKeys(protractor.Key.ENTER);
        }


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
        browser.sleep(1000);
      };
      this.openElement = function (item) {
        var switches = item.all(By.css('.visibilitySwitch'));
        expect(switches.count()).toBe(2);
        switches.get(1).click();
        browser.sleep(1000);
      };

      this.openFinder = function () {
        createSearchElement.click();
        return require('../modals/finder-modal.js');
      };

      this.addElement = function (title) {
        var EC = protractor.ExpectedConditions;
        var deferred = protractor.promise.defer();

        // add an element
        var finderPage = this.openFinder();

        isReady(finderPage.createFinder()).then(function () {
          isReady(finderPage.createSearchInput()).then(function () {

            // search for the element
            finderPage.createSearchInput().sendKeys(title).sendKeys(protractor.Key.ENTER).then(function () {

              //browser.wait(EC.textToBePresentInElementValue($('#finder-search-input'), title)).then(function () {


              isReady(finderPage.createDoSearch()).then(function () {
                finderPage.createDoSearch().click().then(function () {
                  browser.sleep(2000);
                  isReady(finderPage.createSearchResult()).then(function () {

                    finderPage.createListView().isPresent().then(function (isList) {

                      if (isList) {

                        isReady(finderPage.createFirstElementListView()).then(function () {
                          finderPage.createFirstElementListView().click().then(function () {
                            isReady(finderPage.createFirstSelectedElementListView()).then(function () {

                              isReady(finderPage.createOpenButton()).then(function () {
                                finderPage.createOpenButton().click().then(function () {
                                  isReady(createToolbar).then(function () {

                                    browser.sleep(1000);  // add time for animation
                                    deferred.fulfill(true);
                                  });
                                });
                              });
                            });
                          });
                        });


                      } else {

                        var first = finderPage.createFirstElementGridView();
                        isReady(first).then(function () {
                          isReady(finderPage.createFirstElementGridView()).then(function () {

                            finderPage.createFirstElementGridView().click();
                            isReady(finderPage.createFirstSelectedElementGridView()).then(function () {

                              browser.sleep(1000);
                              isReady(finderPage.createOpenButton()).then(function () {

                                browser.wait(finderPage.createOpenButton().isEnabled()).then(function () {
                                  finderPage.createOpenButton().click().then(function () {

                                    isReady(createToolbar).then(function () {

                                      browser.sleep(1000);  // add time for animation
                                      deferred.fulfill(true);
                                    });
                                  });
                                });
                              });
                            });
                          });
                        });
                      }
                    });
                  });
                  //});
                });
              });
            });
          });
        });

        return deferred.promise;
      };


      this.getRandomInt = function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
      };

      var isReady = function (elm) {
        var deferred = protractor.promise.defer();

        browser.wait(elm.isPresent()).then(function () {
          browser.wait(elm.isDisplayed()).then(function () {
            deferred.fulfill(true);
          });
        });

        return deferred.promise;
      };

      this.isReady = function (elm) {
        var deferred = protractor.promise.defer();

        browser.wait(elm.isPresent()).then(function () {
          browser.wait(elm.isDisplayed()).then(function () {
            deferred.fulfill(true);
          });
        });

        return deferred.promise;
      };


    }
    ;

module.exports = new TemplateCreatorPage(); 
