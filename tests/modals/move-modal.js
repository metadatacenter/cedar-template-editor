'use strict';

var WorkspacePage = require('../pages/workspace-page.js');

var MoveModal = function () {
  var EC = protractor.ExpectedConditions;

  var createMoveToModal = element(by.id('move-modal'));
  var createMoveToModalOpen = element(by.css('#move-modal .in'));
  var createMoveButton = element(by.css('#move-modal .confirm'));

  var createMoveToBody = createMoveToModal.element(by.css('div > div > div.modal-body'));
  var createMoveToModalHeader = element(by.id('moveModalHeader'));
  var createBackToParentButton = createMoveToModalHeader.element(by.css('.back-to-parent'));
  var createOpenFolderArrowButton = createMoveToBody.element(by.css('div.box-row.row.ng-scope.selected > div.arrow-click'));


  // is it open?
  this.isOpen = function () {
    expect(createMoveToModalOpen.isPresent()).toBe(true);
  };


  this.moveToDestination = function(title) {
    var folder = createMoveToModal.element(by.linkText(title));
    browser.wait(EC.visibilityOf(folder));
    browser.wait(EC.elementToBeClickable(folder));
    folder.click();

    this.clickMoveButton();
  };


  this.moveToUserFolder = function(userName, title) {
    browser.wait(EC.visibilityOf(createBackToParentButton));
    browser.wait(EC.elementToBeClickable(createBackToParentButton));
    browser.actions().doubleClick(createBackToParentButton).perform();

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
  };

  this.moveDisabledViaRightClick = function (name, type) {
    WorkspacePage.rightClickResource(name, type);
    var moveMenuItem = WorkspacePage.createMoveDisabled();
    browser.wait(EC.visibilityOf(moveMenuItem),10000);
  };

  this.moveEnabledViaRightClick = function (name, type) {
    WorkspacePage.rightClickResource(name, type);
    var moveMenuItem = WorkspacePage.createRightClickMoveToMenuItem();
    browser.wait(EC.visibilityOf(moveMenuItem),10000);
  };




};
module.exports = new MoveModal(); 
