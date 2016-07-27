'use strict';

var CreateElementPage = function () {

  var url = 'https://cedar.metadatacenter.orgx/elements/create';
  var showJsonLink = element(by.id('show-json-link'));
  var jsonPreview = element(by.id('form-json-preview'));

  this.get = function() {
    browser.get(url);
    // wait until loaded
    // TODO: should use EC for this
    browser.sleep(1000);
  }

  this.getJsonPreviewText = function() {
    showJsonLink.click();
    return jsonPreview.getText();
  }

  this.addTextField = function() {
    return element(by.css(".fields-list .item:first-child a")).click();
  }

};

module.exports = CreateElementPage;
