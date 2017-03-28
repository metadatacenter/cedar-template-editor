'use strict';


var MoveModal = function () {

  var EC = protractor.ExpectedConditions;


  var createMoveToModal = element(by.id('move-modal'));
  var createMoveToModalOpen = element(by.css('#move-modal .in'));
  var createMoveButton = element(by.css('#move-modal .confirm'));

  var createMoveToBody = createMoveToModal.element(by.css('div > div > div.modal-body'));
  var createMoveToModalHeader = element(by.id('moveModalHeader'));
  var createBackToParentButon = createMoveToModalHeader.element(by.css('div:nth-child(1) > h4 > span'));
  var createOpenFolderArrowButton = createMoveToBody.element(by.css('div.box-row.row.ng-scope.selected > div.col-sm-1.arrow-click > i'));


  // is it a open?
  this.isOpen = function () {

    expect(createMoveToModalOpen.isPresent()).toBe(true);
  };


  this.moveToDestination = function(title) {
    var folder = createMoveToModal.element(by.linkText(title));
    browser.wait(EC.elementToBeClickable(folder));
    folder.click();

    this.clickMoveButton();
  };


  this.moveToUserFolder = function(userName, title) {
    browser.wait(EC.visibilityOf(createBackToParentButon));
    browser.wait(EC.elementToBeClickable(createBackToParentButon));
    browser.actions().doubleClick(createBackToParentButon).perform();

    // click user folder
    var user = createMoveToModal.element(by.linkText(userName));
    browser.wait(EC.elementToBeClickable(user));
    user.click();

    // open user folder
    browser.wait(EC.elementToBeClickable(createOpenFolderArrowButton));
    createOpenFolderArrowButton.click();

    // select destination folder
    var folder = createMoveToModal.element(by.linkText(title));
    browser.wait(EC.elementToBeClickable(folder));
    folder.click();

    this.clickMoveButton();
  };


  this.clickMoveButton = function () {
    browser.wait(EC.elementToBeClickable(createMoveButton));
    createMoveButton.click();
  }

};
module.exports = new MoveModal(); 
