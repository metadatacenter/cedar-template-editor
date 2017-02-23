'use strict';

var WorkspacePage = require('../pages/workspace-new-page.js');

var ShareModal = function () {
  var EC = protractor.ExpectedConditions;

  var shareModal = element(by.id('share-modal'));
  var shareModalBody = shareModal.element(by.css('div > div > div.modal-body '));
  var shareWithGroupRow = shareModalBody.element(by.css('div > div > div.col-sm-6.ng-scope > div:nth-child(2)'));
  var shareWithUserRow = shareModalBody.element(by.css('div > div > div.col-sm-6.ng-scope > div:nth-child(5)'));
  var shareModalUserName = shareWithUserRow.element(by.css('div.col-sm-7.typeaheadDropUp > input'));
  var shareModalGroupName = shareWithGroupRow.element(by.css('div.col-sm-7 > input'));
  var sharedModalUserPermissionsList = shareWithUserRow.element(by.css('div.btn-group.bootstrap-select.dropdown.col-sm-4.select-picker.ng-pristine.ng-untouched.ng-valid.ng-isolate-scope.ng-not-empty'));
  var sharedModalGroupPermissionsList = shareWithGroupRow.element(by.css('div.btn-group.bootstrap-select.col-sm-4.select-picker.ng-pristine.ng-untouched.ng-valid.ng-isolate-scope.ng-not-empty'));
  var shareModalUserPermissions = sharedModalUserPermissionsList.element(by.css('button'));
  var shareModalGroupPermissions = sharedModalGroupPermissionsList.element(by.css('button'));
  var shareModalUserReadPermission = sharedModalUserPermissionsList.element(by.css('div > ul > li:nth-child(1) > a'));
  var shareModalGroupReadPermission = sharedModalGroupPermissionsList.element(by.css('div > ul > li:nth-child(1) > a'));
  var shareModalUserWritePermission = sharedModalUserPermissionsList.element(by.css('div > ul > li:nth-child(2) > a'));
  var shareModalGroupWritePermission = sharedModalGroupPermissionsList.element(by.css('div > ul > li:nth-child(2) > a'));
  var shareModalUserOwnerPermission = sharedModalUserPermissionsList.element(by.css('div > ul > li:nth-child(3) > a'));
  var shareModalGroupOwnerPermission = sharedModalGroupPermissionsList.element(by.css('div > ul > li:nth-child(3) > a'));
  var shareModalAddUserButton = shareWithUserRow.element(by.css('div.col-sm-1.pull-right > button'));
  var shareModalAddGroupButton = shareWithGroupRow.element(by.css('div.col-sm-1.pull-right > button'));
  var shareModalDoneButton = shareModal.element(by.css('div > div > div.modal-footer.actions > div > button'));


  this.createShareModal = function () {
    return shareModal;
  };

  this.createShareModalBody = function () {
    return shareModalBody;
  };

  this.createShareModalUserName = function () {
    return shareModalUserName;
  };

  this.createShareModalGroupName = function () {
    return shareModalGroupName;
  };

  this.createShareModalDoneButton = function () {
    return shareModalDoneButton;
  };

  this.createShareModalAddUserButton = function () {
    return shareModalAddUserButton;
  };

  this.createShareModalAddGroupButton = function () {
    return shareModalAddGroupButton;
  };

  this.createShareModalUserPermissions = function () {
    return shareModalUserPermissions;
  };

  this.createShareModalGroupPermissions = function () {
    return shareModalGroupPermissions;
  };

  this.createShareModalUserReadPermission = function () {
    return shareModalUserReadPermission;
  };

  this.createShareModalUserWritePermission = function () {
    return shareModalUserWritePermission;
  };

  this.createShareModalUserOwnerPermission = function () {
    return shareModalUserOwnerPermission;
  };

  this.createShareModalGroupReadPermission = function () {
    return shareModalGroupReadPermission;
  };

  this.createShareModalGroupWritePermission = function () {
    return shareModalGroupWritePermission;
  };

  this.createShareModalGroupOwnerPermission = function () {
    return shareModalGroupOwnerPermission;
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
    WorkspacePage.rightClickResource(name, type);
    var shareMenuItem = WorkspacePage.createRightClickShareMenuItem();
    browser.wait(EC.visibilityOf(shareMenuItem));
    browser.wait(EC.elementToBeClickable(shareMenuItem));
    shareMenuItem.click();
  };


  this.shareResource = function(name, type, username, canWrite, isOwner) {
    this.openDialogViaRightClick(name, type);
    this.shareWithUser(username, canWrite, isOwner);
    browser.wait(EC.stalenessOf(shareModalBody));
  };


  this.shareResourceWithGroup = function(name, type, groupname, canWrite, isOwner) {
    this.openDialogViaRightClick(name, type);
    this.shareWithGroup(groupname, canWrite, isOwner);
    browser.wait(EC.stalenessOf(shareModalBody));
  };


  this.shareWithUser = function (username, canWrite, isOwner) {
    var usernameField = this.createShareModalUserName();
    browser.wait(EC.visibilityOf(usernameField));
    usernameField.sendKeys(username);
    browser.actions().sendKeys(protractor.Key.ENTER).perform();

    var permissionsList = this.createShareModalUserPermissions();
    browser.wait(EC.elementToBeClickable(permissionsList));
    permissionsList.click();

    if (canWrite) {
      browser.wait(EC.elementToBeClickable(this.createShareModalUserWritePermission()));
      this.createShareModalUserWritePermission().click();
    }
    else if (isOwner) {
      browser.wait(EC.elementToBeClickable(this.createShareModalUserOwnerPermission()));
      this.createShareModalUserOwnerPermission().click();
    }
    else {
      browser.wait(EC.elementToBeClickable(this.createShareModalUserReadPermission()));
      this.createShareModalUserReadPermission().click();
    }

    var addButton = this.createShareModalAddUserButton();
    browser.wait(EC.elementToBeClickable(addButton));
    addButton.click();

    this.clickDone();
  };


  this.shareWithGroup = function(groupName, canWrite, isOwner) {
    var groupnameField = this.createShareModalGroupName();
    browser.wait(EC.visibilityOf(groupnameField));
    groupnameField.sendKeys(groupName);
    browser.actions().sendKeys(protractor.Key.ENTER).perform();

    var permissionsList = this.createShareModalGroupPermissions();
    browser.wait(EC.elementToBeClickable(permissionsList));
    permissionsList.click();

    if (canWrite) {
      browser.wait(EC.elementToBeClickable(this.createShareModalGroupWritePermission()));
      this.createShareModalGroupWritePermission().click();
    }
    else if (isOwner) {
      browser.wait(EC.elementToBeClickable(this.createShareModalGroupOwnerPermission()));
      this.createShareModalGroupOwnerPermission().click();
    }
    else {
      browser.wait(EC.elementToBeClickable(this.createShareModalGroupReadPermission()));
      this.createShareModalGroupReadPermission().click();
    }

    var addButton = this.createShareModalAddGroupButton();
    browser.wait(EC.elementToBeClickable(addButton));
    addButton.click();

    this.clickDone();
  };


  // checks whether the current user can share the selected item
  this.canShare = function() {
    var usernameField = this.createShareModalUserName();
    return usernameField.isPresent();
  };


  // checks whether the current user can change ownership of the selected item
  this.canChangeOwnership = function () {
    var permissionsList = this.createShareModalUserPermissions();
    if(!permissionsList.isPresent()) {
      return false;
    }
    browser.wait(EC.elementToBeClickable(permissionsList));
    permissionsList.click();
    browser.wait(EC.elementToBeClickable(this.createShareModalUserReadPermission()));
    var ownerPermission = this.createShareModalUserOwnerPermission();
    return ownerPermission.isDisplayed();
  };


  this.clickDone = function() {
    var doneButton = this.createShareModalDoneButton();
    doneButton.click();
    browser.wait(EC.stalenessOf(doneButton));
  }


};
module.exports = new ShareModal(); 
