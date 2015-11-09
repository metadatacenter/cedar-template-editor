'use strict';

var CreateElementPage = function () {
  browser.get('http://localhost:4200/#/elements/create');
};

CreateElementPage.prototype = Object.create({}, {

  getJsonPreviewText: {
    get: function() {
      element(by.id('show-json-link')).click();
      return element(by.id('form-json-preview')).getText();
    }
  },

  addTextField: {
    get: function() {
      return element(by.css(".fields-list .item:first-child a")).click();
    }
  }

});

module.exports = CreateElementPage;
