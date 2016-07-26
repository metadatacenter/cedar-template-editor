'use strict';

var CreateMetadataPage = function () {

    var url = 'https://cedar.metadatacenter.orgx/dashboard';
    var showJsonLink = element(by.id('show-json-link'));
    var jsonPreview = element(by.id('form-json-preview'));
    var createTemplateButton = element(by.id('button-create-template'));
    var createTextFieldButton = element(by.id('button-add-field-textfield'));
    var createTextAreaButton = element(by.id('button-add-field-textarea'));
    var createRadioButton = element(by.id('button-add-field-radio'));
    var createCheckboxButton = element(by.id('button-add-field-checkbox'));
    var createMore = element(by.id('button-add-more'));
    var createDateButton = element(by.id('button-add-field-date'));
    var createEmailButton = element(by.id('button-add-field-email'));
    var createListButton = element(by.id('button-add-field-list'));
    var createNumericButton = element(by.id('button-add-field-numeric'));
    var createPhoneNumberButton = element(by.id('button-add-field-phone-number'));
    var createSectionBreakButton = element(by.id('button-add-field-section-break'));
    var createRichTextButton = element(by.id('button-add-field-richtext'));
    var createImageButton = element(by.id('button-add-field-image'));
    var createVideoButton = element(by.id('button-add-field-youtube'));
    var removeButton = element(by.css('.configuration-actions .save-options .remove'));

    this.get = function() {
        browser.get(url);
        // wait until loaded
        // TODO: should use EC for this
        browser.sleep(5000);
    };

    this.createTemplate = function() {
        createTemplateButton.click();
    };

    this.getJsonPreviewText = function() {
        showJsonLink.click();
        return jsonPreview.getText();
    };

    this.addTextField = function() {
        createTextFieldButton.click();
    };

    this.addTextArea = function() {
        createTextAreaButton.click();
    };

    this.addRadio = function() {
        createRadioButton.click();
    };

    this.addCheckbox = function() {
        createCheckboxButton.click();
    };

    this.addMore = function() {
        createMore.click();
    };

    this.addDateField = function() {
        createDateButton.click();
    };

    this.addEmailField = function() {
        createEmailButton.click();
    };

    this.addListField = function() {
        createListButton.click();
    };

    this.addNumericField = function() {
        createNumericButton.click();
    };

    this.addPhoneNumberField = function() {
        createPhoneNumberButton.click();
    };

    this.addSectionBreakField = function() {
        createSectionBreakButton.click();
    };

    this.addRichTextField = function() {
        createRichTextButton.click();
    };

    this.addImageField = function() {
        createImageButton.click();
    };

    this.addVideoField = function() {
        createVideoButton.click();
    };

    this.removeField = function() {
        removeButton.click();
    };

};

module.exports = CreateMetadataPage;
