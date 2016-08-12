'use strict';
var CreateElementPage = function () {
  //var url = 'https://cedar.metadatacenter.orgx/elements/create';
  var testConfig = require('../config/test-env.js');
  var url = testConfig.baseUrl + '/create';
  var showJsonLink = element(by.id('show-json-link'));
  var jsonPreview = element(by.id('form-json-preview'));
  this.get = function () {
    browser.get(url);
// wait until loaded 
// TODO: should use EC for this 
    browser.sleep(1000);
  }
  this.getJsonPreviewText = function () {
    showJsonLink.click();
    return jsonPreview.getText();
  }
  this.addTextInput = function () {
    return element(by.css(".fields-list .item:first-child a")).click();
  }
  this.addInput = function (inputType) {
    var order;
    if (inputType == "paragraph" || inputType == "textarea") {
      order = 2;
    } else if (inputType == "radio" || inputType == "multiple choice") {
      order = 3;
    } else if (inputType == "checkbox") {
      order = 4;
    } else if (inputType == "date") {
      order = 5;
    } else if (inputType == "email") {
      order = 6;
    } else if (inputType == "select" || inputType == "pick from a list") {
      order = 7;
    } else if (inputType == "number") {
      order = 8;
    } else if (inputType == "phone") {
      order = 9;
    } else if (inputType == "section" || inputType == "section break") {
      order = 10;
    } else if (inputType == "wysiwyg" || inputType == "rich text") {
      order = 11;
    } else if (inputType == "image") {
      order = 12;
    } else if (inputType == "youtube") {
      order = 13;
    } else {
      order = 1;
    }
    return element(by.css(".fields-list .item:nth-child(" + order + ") a")).click();
  }
  this.setElementTitle = function (text) {
    var el = element(by.css("#element-name"));
    var deferred = protractor.promise.defer();
    return el.clear().then(function () {
      el.sendKeys(text).then(function () {
        deferred.fulfill();
      });
    });
    return deferred.promise;
  }
  this.setElementDescription = function (text) {
    var el = element(by.css("#element-description"));
    var deferred = protractor.promise.defer();
    el.clear().then(function () {
      el.sendKeys(text).then(function () {
        deferred.fulfill();
      });
    });
    return deferred.promise;
  }
  this.editingFieldTitleInput = function () {
    return element(by.css("form.runtime .field-title-definition"));
  }
  this.editingFieldDescriptionInput = function () {
    return element(by.css("form.runtime .field-description-definition"));
  }
  this.editingFieldAllOptionInputs = function () {
    return element.all(by.css(".field-root.editing-field .radio input.form-control"));
  }
  this.editingFieldLastOptionInput = function () {
    return this.editingFieldAllOptionInputs().last();
  }
  this.editingFieldAddAnotherOptionButton = function () {
    return element(by.css(".field-root.editing-field .options-wrapper .add-another"));
  }
  this.editingFieldCardinalityCheckbox = function () {
    return element(by.css(".field-root .checkbox-cardinality input[type='checkbox']"));
  }
  this.editingFieldRequiredCheckbox = function () {
    return element(by.css(".field-root .checkbox-required input[type='checkbox']"));
  }
  this.editingFieldCardinalityWrapper = function () {
    return element(by.css(".field-root .checkbox-cardinality"));
  }
  this.editingFieldCardinalitySelectedMinItemsEl = function () {
    return element(by.css(".field-root .cardinality-options .min-items-option .filter-option"));
  }
  this.editingFieldCardinalityMinItemsToggle = function () {
    return element(by.css(".field-root .cardinality-options .min-items-option .btn-select-picker"));
  }
  this.editingFieldCardinalitySelectedMaxItemsEl = function () {
    return element(by.css(".field-root .cardinality-options .max-items-option .filter-option"));
  }
  this.editingFieldCardinalityMaxItemsToggle = function () {
    return element(by.css(".field-root .cardinality-options .max-items-option .btn-select-picker"));
  }
  this.editingFieldCardinalityMinItemsOptionsAt = function (nth) {
    return element(by.css(".field-root .cardinality-options .min-items-option .dropdown-menu li:nth-child(" + nth + ") a"));
  }
  this.editingFieldCardinalityMaxItemsOptionsAt = function (nth) {
    return element(by.css(".field-root .cardinality-options .max-items-option .dropdown-menu li:nth-child(" + nth + ") a"));
  }
  this.editingFieldAddButton = function () {
    return element(by.css(".field-root .save-options .add"));
  }
  this.editingFieldRemoveButton = function () {
    return element(by.css(".field-root .save-options .remove"));
  }
  this.renderedFormAllTextFields = function () {
    return element.all(by.css("form.runtime input[type='text']"));
  }
  this.renderedFormAllTextareaFields = function () {
    return element.all(by.css("form.runtime textarea"));
  }
  this.renderedFormAllRadioFields = function () {
    return element.all(by.css("form.runtime .fields-option > .form-group"))
  }
  this.composeElementSaveButton = function () {
    return element(by.css(".clear-save .btn-save"));
  }
  this.composeElementClearButton = function () {
    return element(by.css(".clear-save .btn-clear"));
  }
  this.composeElementTitleInput = function () {
    return element(by.css("#element-name"));
  }
  this.composeElementDescriptionInput = function () {
    return element(by.css("#element-description"));
  }
  this.renderedFormAllRenderedFields = function () {
    return element.all(by.css(".field-root"));
  }
  this.renderedFormAllRenderedFieldsItems = function () {
    return element.all(by.css(".fields > .form-group"));
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
              browser.sleep(1000).then(function () {
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
  this.addField = function (options) {
    options = options || {};
    var page = this;
    var dontSaveField = options.dontSaveField || false;
    var inputType = options.inputType || "text";
    var deferred = protractor.promise.defer();
    var minItems = options.minItems || 1;
    var maxItems = options.maxItems || 1;
    if (maxItems == "N" || maxItems > 9) {
      maxItems = 9;
    }
    var fieldTitle = options.fieldTitle;
    var fieldDescription = options.fieldDescription;
    var radioOptions = options.options;
    page.addInput(inputType).then(function () {
      page.editingFieldTitleInput().sendKeys(fieldTitle || "Simple " + inputType + " field");
      page.editingFieldDescriptionInput().sendKeys(fieldDescription || "A simple " + inputType + " field that is added by Selenium");
      if (maxItems != 1 && minItems != 1) {
        page.editingFieldCardinalityCheckbox().click().then(function () {
          browser.sleep(100).then(function () {
            page.editingFieldCardinalityMinItemsToggle().click().then(function () {
              browser.sleep(100).then(function () {
                page.editingFieldCardinalityMinItemsOptionsAt(minItems + 2).click();
              });
            });
            page.editingFieldCardinalityMaxItemsToggle().click().then(function () {
              browser.sleep(100).then(function () {
                page.editingFieldCardinalityMaxItemsOptionsAt(maxItems + 1).click();
              });
            });
          });
        })
      }
      if (inputType == "radio" || inputType == "multiple choice") {
// var options = options.options; 
        var promises = [];
        var firstOption = radioOptions[0];
        page.editingFieldLastOptionInput().sendKeys(firstOption.value);
        for (var i = 1; i < radioOptions.length; i++) {
          (function (index) {
            page.editingFieldAddAnotherOptionButton().click().then(function () {
              page.editingFieldLastOptionInput().sendKeys(radioOptions[index].value);
            });
          })(i);
        }
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
    return element(by.css(".field-root .sortable-icon"));
  }
  this.editingFieldElementsDropdownToggle = function () {
    return element(by.css(".left-sidebar .more-items .btn-more-items"));
  }
  this.editingFieldOntologyButton = function () {
    return element(by.css(".field-root.editing-field .toggle-controlled-term .cedar-svg-controll-term"));
  }
  this.editingFieldControlledTermsModal = function () {
    return element(by.css(".field-root .controlled-terms-modal"));
  }
  this.displayedControlledTermsModal = function () {
    return element(by.css(".controlled-terms-modal.in"));
  }
  this.controlledTermsModalFieldButton = function () {
    return this.displayedControlledTermsModal().element(by.css(".btn-field"));
  }
  this.controlledTermsModalValuesButton = function () {
    return this.displayedControlledTermsModal().element(by.css(".btn-values"));
  }
  this.controlledTermsModalSearchFieldInput = function () {
    return this.displayedControlledTermsModal().element(by.css(".field-search-form-control"));
  }
  this.controlledTermsModalBrowseFieldInput = function () {
    return this.displayedControlledTermsModal().element(by.css(".btn-field-browse"));
  }
  this.controlledTermsModalCreateClassInput = function () {
    return this.displayedControlledTermsModal().element(by.css(".btn-create-class button"));
  }
  this.controlledTermsModalSearchFieldButton = function () {
    return this.displayedControlledTermsModal().element(by.css(".field-search .input-group-addon"));
  }
  this.controlledTermsModalSearchResultsRows = function () {
    return this.displayedControlledTermsModal().all(by.css(".search-results-table tbody tr"));
  }
  this.controlledTermsModalBrowseResultsRows = function () {
    return this.displayedControlledTermsModal().all(by.css(".browse-results-table tbody tr"));
  }
  this.controlledTermsModalClassDetailsView = function () {
    return this.displayedControlledTermsModal().element(by.css("#class-details"));
  }
  this.controlledTermsModalOntologyDetailsView = function () {
    return this.displayedControlledTermsModal().element(by.css("#ontology-details"));
  }
  this.controlledTermsModalTreeView = function () {
    return this.displayedControlledTermsModal().element(by.css(".ontology-tree .tree-view"));
  }
  this.controlledTermsModalTreeFirstRootEl = function () {
    return this.controlledTermsModalTreeView().element(by.css("li.level-1 a:first-child"));
  }
  this.controlledTermsModalOntologyDetailsTab = function () {
    return this.displayedControlledTermsModal().element(by.css(".ontology-details-tab"));
  }
  this.controlledTermsModalClassDetailsTab = function () {
    return this.displayedControlledTermsModal().element(by.css(".class-details-tab"));
  }
  this.controlledTermsModalAddTermButton = function () {
    return this.displayedControlledTermsModal().element(by.css(".btn-add-term"));
  }
  this.controlledTermsModalSelectedOntologyTitle = function () {
    return this.displayedControlledTermsModal().element(by.css(".ontology-tree-header"));
  }
  this.controlledTermsModalAddedFieldRows = function () {
    return this.displayedControlledTermsModal().all(by.css(".added-field-classes .class-list-table tr"));
  }
  this.controlledTermsModalStartOverLink = function () {
    return this.displayedControlledTermsModal().element(by.css(".btn-start-over"));
  }
  this.composeElementAllAvailableElements = function () {
    return element.all(by.css(".left-sidebar .more-items .item a"));
  }
  this.editingElementSaveButton = function () {
    return element(by.css(".nested-element .editing .save-options .add"));
  }
  this.editingElementRemoveButton = function () {
    return element(by.css(".nested-element .editing .save-options .remove"));
  }
  this.renderedFormAllAddedElements = function () {
    return element.all(by.css(".nested-element .element-root.rendering"));
  }
  this.renderedFormEditingField = function () {
    return element(by.css(".field-root.editing-field"));
  }
  this.renderedFormEditingElement = function () {
    return element(by.css(".nested-element .element-root.editing"));
  }
  this.renderedFormAllEditingElements = function () {
    return element.all(by.css(".nested-element .element-root.editing"));
  }
  this.editingElementCardinalityCheckbox = function () {
    return element(by.css(".nested-element .element-root.editing .checkbox-cardinality input[type='checkbox']"));
  }
  this.editingElementCardinalityMinItemsSelectedEl = function () {
    return element(by.css(".nested-element .element-root.editing .min-items-option .filter-option"));
  }
  this.editingElementCardinalityMinItemsToggle = function () {
    return element(by.css(".nested-element .element-root.editing .min-items-option .btn-select-picker"));
  }
  this.editingElementCardinalityMaxItemsSelectedEl = function () {
    return element(by.css(".nested-element .element-root.editing .max-items-option .filter-option"));
  }
  this.editingElementCardinalityMaxItemsToggle = function () {
    return element(by.css(".nested-element .element-root.editing .max-items-option .btn-select-picker"));
  }
  this.editingElementCardinalityMinItemsOptionsAt = function (nth) {
    return element(by.css(".nested-element .element-root.editing .min-items-option .dropdown-menu li:nth-child(" + nth + ") a"));
  }
  this.editingElementCardinalityMaxItemsOptionsAt = function (nth) {
    return element(by.css(".nested-element .element-root.editing .max-items-option .dropdown-menu li:nth-child(" + nth + ") a"));
  }
  this.composeElementAddElement = function (options) {
    var page = this;
    var retDeferred = protractor.promise.defer();
    var dontSave = options.dontSave || false;
    var minItems = options.minItems || 1;
    var maxItems = options.maxItems || 1;
    page.editingFieldElementsDropdownToggle().click().then(function () {
      browser.sleep(1000).then(function () {
        page.composeElementAllAvailableElements().then(function (els) {
          expect(els.length > 0).toBe(true);
          var promises = [];
          for (var i = 0; i < els.length; i++) {
            (function (index) {
              var deferred = protractor.promise.defer();
              promises.push(deferred.promise);
              els[index].getText().then(function (text) {
                if (text.toUpperCase() == options.elementTitle.toUpperCase()) {
                  deferred.fulfill(true);
                  els[index].click().then(function () {
                    if (maxItems == 1 && minItems == 1) {
                      if (dontSave) {
                        retDeferred.fulfill(true);
                      } else {
                        page.editingElementSaveButton().click().then(function () {
                          retDeferred.fulfill(true);
                        });
                      }
                    } else {
                      page.editingElementCardinalityCheckbox().click().then(function () {
                        page.editingElementCardinalityMinItemsToggle().click().then(function () {
                          page.editingElementCardinalityMinItemsOptionsAt(minItems + 2).click();
                        });
                        page.editingElementCardinalityMaxItemsToggle().click().then(function () {
                          page.editingElementCardinalityMaxItemsOptionsAt(maxItems + 1).click();
                        });
                        browser.waitForAngular().then(function () {
                          if (dontSave) {
                            retDeferred.fulfill(true);
                          } else {
                            page.editingElementSaveButton().click().then(function () {
                              retDeferred.fulfill(true);
                            });
                          }
                        });
                      });
                    }
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
    return element.all(by.css(".right-body .alert-danger"));
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
  this.createElement = function (options) {
    options = options || {};
    var page = this;
    var deferred = protractor.promise.defer();
    var childrenOptions = options.childrenOptions || [{}];
    for (var i = 0; i < childrenOptions.length; i++) {
      var childOptions = childrenOptions[i];
      childOptions.childType = childOptions.childType || "text";
      childOptions.numberOfInstances = childOptions.numberOfInstances || 1;
    }
    page.get();
    browser.sleep(1000).then(function () {
      page.setElementTitle(options.elementTitle || "Simple element");
      page.setElementDescription(options.elementDescription || "Created by script");
      var promises = [];
      for (var i = 0; i < childrenOptions.length; i++) {
        var childOptions = childrenOptions[i];
        for (var j = 0; j < childOptions.numberOfInstances; j++) {
          if (childOptions.childType == "element") {
            promises.push(page.composeElementAddElement(childOptions));
          } else {
            promises.push(page.addField(childOptions));
          }
        }
      }
      protractor.promise.all(promises, function () {
        page.composeElementSaveButton().click().then(function () {
          deferred.fulfill(true);
        });
      });
    });
    return deferred.promise;
  }
  this.sweetAlert = function () {
    return element(by.css(".sweet-alert"));
  }
  this.sweetAlertConfirmButton = function () {
    return element(by.css(".sweet-alert button.confirm"));
  }
};
module.exports = CreateElementPage; 
