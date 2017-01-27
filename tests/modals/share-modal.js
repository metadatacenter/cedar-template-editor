'use strict';

var WorkspacePage = require('../pages/workspace-new-page.js');

var ShareModal = function () {
  var EC = protractor.ExpectedConditions;

  var shareModal = element(by.id('share-modal'));
  var shareWithUserRow = shareModal.element(by.css('div > div > div.modal-body > div > div > div.col-sm-6.ng-scope > div:nth-child(5)'));
  var shareModalUserName = shareWithUserRow.element(by.css('div.col-sm-7.typeaheadDropUp > input'));
  var sharedModalPermissionsList = shareWithUserRow.element(by.css('div.btn-group.bootstrap-select.dropdown.col-sm-4.select-picker.ng-pristine.ng-untouched.ng-valid.ng-isolate-scope.ng-not-empty'));
  var shareModalPermissions = sharedModalPermissionsList.element(by.css('button'));
  var shareModalReadPermission = sharedModalPermissionsList.element(by.css('div > ul > li:nth-child(1) > a'));
  var shareModalWritePermission = sharedModalPermissionsList.element(by.css('div > ul > li:nth-child(2) > a'));
  var shareModalOwnerPermission = sharedModalPermissionsList.element(by.css('div > ul > li:nth-child(3) > a'));
  var shareModalAddUserButton = shareWithUserRow.element(by.css('div.col-sm-1.pull-right > button'));
  var shareModalDoneButton = shareModal.element(by.css('div > div > div.modal-footer.actions > div > button'));


  this.createShareModal = function () {
    return shareModal;
  };

  this.createShareModalUserName = function () {
    return shareModalUserName;
  };

  this.createShareModalDoneButton = function () {
    return shareModalDoneButton;
  };

  this.createShareModalAddUserButton = function () {
    return shareModalAddUserButton;
  };

  this.createShareModalPermissions = function () {
    return shareModalPermissions;
  };

  this.createShareModalReadPermission = function () {
    return shareModalReadPermission;
  };

  this.createShareModalWritePermission = function () {
    return shareModalWritePermission;
  };

  this.createShareModalOwnerPermission = function () {
    return shareModalOwnerPermission;
  };


  this.openDialogViaMoreOptions = function (name, type) {
    WorkspacePage.selectResource(name, type);

    var optionsButton = WorkspacePage.createMoreOptionsButton();
    browser.wait(EC.visibilityOf(optionsButton));
    browser.wait(EC.elementToBeClickable(optionsButton));
    optionsButton.click();

    var shareMenuItem = WorkspacePage.createShareMenuItem();
    browser.wait(EC.visibilityOf(shareMenuItem));
    browser.wait(EC.elementToBeClickable(shareMenuItem));
    shareMenuItem.click();
  };


  this.openDialogViaRightClick = function (name, type) {
    // TODO
    var element = WorkspacePage.selectResource(name, type);
    browser.actions().mouseMove(element).perform();
    browser.actions().click(protractor.Button.RIGHT).perform();

  };


  this.shareResource = function(name, type, username, canWrite, isOwner) {
    this.openDialogViaMoreOptions(name, type);
    this.shareWith(username, canWrite, isOwner);
  };


  this.shareWith = function (username, canWrite, isOwner) {
    var usernameField = this.createShareModalUserName();
    browser.wait(EC.visibilityOf(usernameField));
    usernameField.sendKeys(username);
    browser.actions().sendKeys(protractor.Key.ENTER).perform();

    if (canWrite || isOwner) {
      var permissionsList = this.createShareModalPermissions();
      browser.wait(EC.elementToBeClickable(permissionsList));
      permissionsList.click();

      if(canWrite) {
        browser.wait(EC.elementToBeClickable(this.createShareModalWritePermission()));
        this.createShareModalWritePermission().click();
      }
      else if(isOwner) {
        browser.wait(EC.elementToBeClickable(this.createShareModalOwnerPermission()));
        this.createShareModalOwnerPermission().click();
      }
    }

    var addButton = this.createShareModalAddUserButton();
    browser.wait(EC.elementToBeClickable(addButton)).then(function () {
      addButton.click();
    });

    var doneButton = this.createShareModalDoneButton();
    browser.wait(EC.visibilityOf(doneButton));
    browser.actions().mouseMove(doneButton).perform();
    browser.wait(EC.elementToBeClickable(doneButton)).then(function () {
      doneButton.click();
    });
  };


};
module.exports = new ShareModal(); 
