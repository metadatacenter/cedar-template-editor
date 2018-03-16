'use strict';

var CopyModal = function () {
  var EC = protractor.ExpectedConditions;

  var copyToModal = element(by.id('copy-modal'));
  var copyButton = element(by.css('#copy-modal .confirm'));

  var copyToBody = copyToModal.element(by.css('div > div > div.modal-body'));
  var copyToModalHeader = element(by.id('copyModalHeader'));
  var backToParentButton = copyToModalHeader.element(by.css('.back-to-parent'));
  var openFolderArrowButton = copyToBody.element(by.css('div.box-row.row.ng-scope.selected > div.arrow-click'));


  this.copyToDestination = function(title) {
    var folder = copyToModal.element(by.linkText(title));
    browser.wait(EC.elementToBeClickable(folder));
    folder.click();

    this.clickCopyButton();
  };


  this.copyToUserFolder = function(userName, title) {
    browser.wait(EC.visibilityOf(backToParentButton));
    browser.wait(EC.elementToBeClickable(backToParentButton));
    browser.actions().doubleClick(backToParentButton).perform();

    // click user folder
    var user = copyToModal.element(by.linkText(userName));
    browser.wait(EC.elementToBeClickable(user));
    user.click();

    // open user folder
    browser.wait(EC.elementToBeClickable(openFolderArrowButton));
    openFolderArrowButton.click();

    // select destination folder
    var folder = copyToModal.element(by.linkText(title));
    browser.wait(EC.elementToBeClickable(folder));
    folder.click();

    this.clickCopyButton();
  };


  this.clickCopyButton = function () {
    browser.wait(EC.elementToBeClickable(copyButton));
    copyButton.click();
  };




};
module.exports = new CopyModal(); 
