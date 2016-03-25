'use strict';

var createElementUrl = 'https://cedar.metadatacenter.orgx/elements/create';

// var EC = protractor.ExpectedConditions;
// var urlChanged = function() {
//   return browser.getCurrentUrl().then(function(url) {
//     return url == createElementUrl;
//   });
// };

var CreateElementPage = function () {
  browser.get(createElementUrl);
  // wait until loaded - should use EC for this
  browser.sleep(5000);
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
