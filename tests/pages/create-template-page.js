'use strict';
var CreateTemplatePage = function () {
  //var url = 'https://cedar.metadatacenter.orgx/templates/create';
  var testConfig = require('../config/test-env.js');
  var url = testConfig.baseUrl + '/create';
  this.get = function () {
    return browser.get(url);
  };
  this.getJsonPreviewText = function () {
    var deferred = protractor.promise.defer();
    this.scrollPageToTop().then(function () {
      element(by.id('show-json-link')).click().then(function () {
        browser.sleep(100).then(function () {
          element(by.id('form-json-preview')).getText().then(function (text) {
            deferred.fulfill(text);
          });
        });
      });
    });
    return deferred.promise;
  };
  this.addTextInput = function () {
    var deferred = protractor.promise.defer();
    var page = this;
    page.composeTemplateFieldsDropdownToggle().click().then(function () {
      page.composeTemplateAllAvailableFields().then(function (fields) {
        fields[0].click().then(function () {
          deferred.fulfill(true);
        });
      });
    });
    return deferred.promise;
  };
  this.setTemplateTitle = function (text) {
    var el = element(by.css("#template-name"));
    var deferred = protractor.promise.defer();
    return el.clear().then(function () {
      el.sendKeys(text).then(function () {
        deferred.fulfill();
      });
    });
    return deferred.promise;
  };
  this.setTemplateDescription = function (text) {
    var el = element(by.css("#template-description"));
    var deferred = protractor.promise.defer();
    el.clear().then(function () {
      el.sendKeys(text).then(function () {
        deferred.fulfill();
      });
    });
    return deferred.promise;
  };
  this.editingFieldTitleInput = function () {
    return element(by.css("form.runtime .field-root.editing-field .field-title-definition"));
  };
  this.editingFieldDescriptionInput = function () {
    return element(by.css("form.runtime .field-root.editing-field .field-description-definition"));
  };
  this.editingFieldCardinalityCheckbox = function () {
    return element(by.css(".field-root.editing-field .checkbox-cardinality input[type='checkbox']"));
  };
  this.editingFieldRequiredCheckbox = function () {
    return element(by.css(".field-root.editing-field .checkbox-required input[type='checkbox']"));
  };
  this.editingFieldCardinalityWrapper = function () {
    return element(by.css(".field-root.editing-field .checkbox-cardinality"));
  };
  this.editingFieldCardinalitySelectedMinItemsEl = function () {
    return element(by.css(".field-root.editing-field .cardinality-options .min-items-option .filter-option"));
  };
  this.editingFieldCardinalityMinItemsToggle = function () {
    return element(by.css(".field-root.editing-field .cardinality-options .min-items-option .btn-select-picker"));
  };
  this.editingFieldCardinalitySelectedMaxItemsEl = function () {
    return element(by.css(".field-root.editing-field .cardinality-options .max-items-option .filter-option"));
  };
  this.editingFieldCardinalityMaxItemsToggle = function () {
    return element(by.css(".field-root.editing-field .cardinality-options .max-items-option .btn-select-picker"));
  };
  this.editingFieldCardinalityMinItemsOptionsAt = function (nth) {
    return element(by.css(".field-root.editing-field .cardinality-options .min-items-option .dropdown-menu li:nth-child(" + nth + ") a"));
  };
  this.editingFieldCardinalityMaxItemsOptionsAt = function (nth) {
    return element(by.css(".field-root.editing-field .cardinality-options .max-items-option .dropdown-menu li:nth-child(" + nth + ") a"));
  }
  this.editingFieldAddButton = function () {
    return element(by.css(".field-root.editing-field .save-options .add"));
  }
  this.editingFieldRemoveButton = function () {
    return element(by.css(".field-root.editing-field .save-options .remove"));
  }
  this.renderedFormAllTextFields = function () {
    return element.all(by.css("form.runtime input[type='text']"));
  }
  this.composeTemplateSaveButton = function () {
    return element(by.css(".clear-save .btn-save"));
  }
  this.composeTemplateClearButton = function () {
    return element(by.css(".clear-save .btn-clear"));
  }
  this.composeTemplateTitleInput = function () {
    return element(by.css("#template-name"));
  }
  this.composeTemplateDescriptionInput = function () {
    return element(by.css("#template-description"));
  }
  this.renderedFormAllRenderedFields = function () {
    return element.all(by.css(".field-root"));
  }
  this.renderedFormAllRenderedTextInputs = function () {
    return element.all(by.css(".field-root .form-control"));
  }
  this.addTextField = function (options) {
    options = options || {};
    var page = this;
    var dontSaveField = options.dontSaveField || false;
    var deferred = protractor.promise.defer();
    var minItems = options.minItems || 1;
    var maxItems = options.maxItems || 1;
    if (maxItems == "N" || maxItems > 9) {
      maxItems = 9;
    }
    page.addTextInput().then(function () {
      page.editingFieldTitleInput().sendKeys(options.fieldTitle || "Simple text field");
      page.editingFieldDescriptionInput().sendKeys(options.fieldDescription || "A simple text field that is added by Selenium");
      if (maxItems != 1 && minItems != 1) {
        page.editingFieldCardinalityCheckbox().click().then(function () {
          browser.sleep(1000).then(function () {
            page.editingFieldCardinalityMinItemsToggle().click().then(function () {
              browser.sleep(50).then(function () {
                page.editingFieldCardinalityMinItemsOptionsAt(minItems + 2).click();
              });
            });
            page.editingFieldCardinalityMaxItemsToggle().click().then(function () {
              browser.sleep(50).then(function () {
                page.editingFieldCardinalityMaxItemsOptionsAt(maxItems + 1).click();
              });
            });
          });
        })
      }
      browser.waitForAngular().then(function () {
        if (dontSaveField) {
          deferred.fulfill(true);
        } else {
          page.editingFieldAddButton().click().then(function () {
            deferred.fulfill(true);
          });
        }
      });
    });
    return deferred.promise;
  }
  this.editingElementFirstFieldSortIcon = function () {
    return element(by.css(".field-root.editing-field .sortable-icon"));
  }
  this.composeTemplateFieldsDropdownToggle = function () {
    return element(by.css(".left-sidebar .more-items .btn-more-items"));
  }
  this.composeTemplateAllAvailableElements = function () {
    return element.all(by.css(".left-sidebar .elements-list .item a"));
  }
  this.composeTemplateAllAvailableFields = function () {
    return element.all(by.css(".left-sidebar .fields-list .item a"));
  }
  this.editingElementSaveButton = function () {
    return element(by.css(".editing .save-options .add"));
  }
  this.editingElementRemoveButton = function () {
    return element(by.css(".editing .save-options .remove"));
  }
  this.renderedFormAllAddedElements = function () {
    return element.all(by.css(".element-root.rendering"));
  }
  this.renderedFormEditingField = function () {
    return element(by.css(".field-root.editing-field"));
  }
  this.renderedFormEditingElement = function () {
    return element(by.css(".element-root.editing"));
  }
  this.renderedFormAllEditingElements = function () {
    return element.all(by.css(".element-root.editing"));
  }
  this.editingElementCardinalityCheckbox = function () {
    return element(by.css(".element-root.editing .checkbox-cardinality input[type='checkbox']"));
  }
  this.editingElementCardinalityMinItemsSelectedEl = function () {
    return element(by.css(".element-root.editing .min-items-option .filter-option"));
  }
  this.editingElementCardinalityMinItemsToggle = function () {
    return element(by.css(".element-root.editing .min-items-option .btn-select-picker"));
  }
  this.editingElementCardinalityMaxItemsSelectedEl = function () {
    return element(by.css(".element-root.editing .max-items-option .filter-option"));
  }
  this.editingElementCardinalityMaxItemsToggle = function () {
    return element(by.css(".element-root.editing .max-items-option .btn-select-picker"));
  }
  this.editingElementCardinalityMinItemsOptionsAt = function (nth) {
    return element(by.css(".element-root.editing .min-items-option .dropdown-menu li:nth-child(" + nth + ") a"));
  }
  this.editingElementCardinalityMaxItemsOptionsAt = function (nth) {
    return element(by.css(".element-root.editing .max-items-option .dropdown-menu li:nth-child(" + nth + ") a"));
  }
  this.composeTemplateAddElement = function (elementTitle) {
    var page = this;
    var retDeferred = protractor.promise.defer();
    page.composeTemplateAllAvailableElements().then(function (els) {
      expect(els.length > 0).toBe(true);
      var promises = [];
      for (var i = 0; i < els.length; i++) {
        (function (index) {
          var deferred = protractor.promise.defer();
          promises.push(deferred.promise);
          els[index].getText().then(function (text) {
            if (text.toUpperCase() == elementTitle.toUpperCase()) {
              deferred.fulfill(true);
              els[index].click().then(function () {
                retDeferred.fulfill(true);
              });
            } else {
              deferred.fulfill(false);
            }
          });
        })(i);
      }
      protractor.promise.all(promises).then(function (results) {
        var matched = false;
        for (var i = 0; i < results.length; i++) {
          matched = matched || results[i];
        }
        if (!matched) {
          retDeferred.reject(false);
        }
        expect(!!matched).toBe(true);
      });
    });
    return retDeferred.promise;
  }
  this.scrollPageToTop = function () {
    return browser.executeScript('window.scrollTo(0, 0)');
  }
  this.scrollPageToBottom = function () {
    return browser.executeScript('window.scrollTo(0, document.body.scrollHeight)');
  }
  this.errorMessageContainer = function () {
    return element(by.css(".right-body .alert-danger p"));
  }
  this.errorMessageContainers = function () {
    return element.all(by.css(".right-body .alert-danger p"));
  }
  this.errorMessageTexts = function () {
    var deferred = protractor.promise.defer();
    this.errorMessageContainers().then(function (containers) {
      if (containers.length > 0) {
        var promises = [];
        for (var i = 0; i < containers.length; i++) {
          promises.push(containers[i].getText());
        }
        protractor.promise.all(promises).then(function (texts) {
          deferred.fulfill(texts);
        });
      } else {
        deferred.fulfill();
      }
    });
    return deferred.promise;
  }
  this.errorElementsContainer = function () {
    return element(by.css(".right-body .alert-danger ul"));
  }
  this.sweetAlert = function () {
    return element(by.css(".sweet-alert"));
  }
  this.sweetAlertConfirmButton = function () {
    return element(by.css(".sweet-alert button.confirm"));
  }
  this.createTemplate = function (options) {
    options = options || {};
  }
};
module.exports = CreateTemplatePage; 
