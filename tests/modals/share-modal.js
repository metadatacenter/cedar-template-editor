'use strict';

var WorkspacePage = require('../pages/workspace-page.js');

var ShareModal = function () {
  var EC = protractor.ExpectedConditions;

  var shareModal = element(by.id('share-modal'));
  var shareModalBody = shareModal.element(by.css('div > div > div.modal-body '));
  var shareColumn = shareModalBody.element(by.css('div [ng-show="!share.showGroups"] > div > div.col-sm-6.ng-scope'));

  var shareWithUserRow = element(by.css('#share-people > div.row'));
  var shareModalUserName = shareWithUserRow.element(by.css('div.col-sm-8 > input'));
  var shareModalUserPermissions = shareWithUserRow.element(by.css('div.btn-group.bootstrap-select.select-picker'));
  var shareModalUserOwnerPermission = shareModalUserPermissions.element(by.css('div > ul > li:nth-child(3) > a'));
  var shareModalUserWritePermission = shareModalUserPermissions.element(by.css('div > ul > li:nth-child(2) > a'));
  var shareModalUserReadPermission = shareModalUserPermissions.element(by.css('div > ul > li:nth-child(1) > a'));


  var shareWithGroupRow = element(by.css('#share-group > div.row'));
  var shareModalGroupName = shareWithGroupRow.element(by.css('div.col-sm-8 > input'));
  var shareModalGroupPermissions = shareWithGroupRow.element(by.css('div.btn-group.bootstrap-select.select-picker'));
  var shareModalGroupReadPermission = shareModalGroupPermissions.element(by.css('div > ul > li:nth-child(1) > a'));
  var shareModalGroupWritePermission = shareModalGroupPermissions.element(by.css('div > ul > li:nth-child(2) > a'));
  var shareModalGroupOwnerPermission = shareModalGroupPermissions.element(by.css('div > ul > li:nth-child(3) > a'));

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


  // open the share dialog of the given resource via the more-options button
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

  // open the share dialog of the given resource via the right-click menu item
  this.moveDisabledCopyEnabled = function (name, type) {
    WorkspacePage.rightClickResource(name, type);
    var moveMenuItem = WorkspacePage.createMoveDisabled();
    browser.wait(EC.visibilityOf(moveMenuItem));
    var copyMenuItem = WorkspacePage.createRightClickCopyToMenuItem();
    browser.wait(EC.visibilityOf(copyMenuItem));
  };

  // open the share dialog of the given resource via the right-click menu item
  this.shareAndDeleteDisabled = function (name, type) {
    WorkspacePage.rightClickResource(name, type);
    var shareMenuItem = WorkspacePage.createShareDisabled();
    browser.wait(EC.visibilityOf(shareMenuItem));
    var deleteMenuItem = WorkspacePage.createDeleteDisabled();
    browser.wait(EC.visibilityOf(deleteMenuItem));
  };

  // open the share dialog of the given resource via the right-click menu item
  this.moveShareDeleteDisabled = function (name, type) {
    WorkspacePage.rightClickResource(name, type);
    var shareMenuItem = WorkspacePage.createShareDisabled();
    browser.wait(EC.visibilityOf(shareMenuItem));
    var deleteMenuItem = WorkspacePage.createDeleteDisabled();
    browser.wait(EC.visibilityOf(deleteMenuItem));
    var moveMenuItem = WorkspacePage.createMoveDisabled();
    browser.wait(EC.visibilityOf(moveMenuItem));
  };


  // open the share dialog of the given resource via the right-click menu item
  this.shareAndDeleteEnabled = function (name, type) {
    WorkspacePage.rightClickResource(name, type);
    var shareMenuItem = WorkspacePage.createRightClickShareMenuItem();
    browser.wait(EC.visibilityOf(shareMenuItem));
    var deleteMenuItem = WorkspacePage.createRightClickDeleteMenuItem();
    browser.wait(EC.visibilityOf(deleteMenuItem));
  };

  // open the share dialog of the given resource via the right-click menu item
  this.shareDisabledViaRightClick = function (name, type) {
    WorkspacePage.rightClickResource(name, type);
    var shareMenuItem = WorkspacePage.createShareDisabled();
    browser.wait(EC.visibilityOf(shareMenuItem));
  };

  // open the share dialog of the given resource via the right-click menu item
  this.shareEnabledViaRightClick = function (name, type) {
    WorkspacePage.rightClickResource(name, type);
    var shareMenuItem = WorkspacePage.createRightClickShareMenuItem();
    browser.wait(EC.visibilityOf(shareMenuItem));
  };


  // share the given resource with the specified user name with or without write and ownership permissions
  this.shareResource = function (name, type, username, permission) {
    // dialog is open
    this.shareWithUser(username, permission);
  };


  // // share the given resource with the specified group name with or without write and ownership permissions
  // this.shareResourceWithGroup = function (name, type, groupname, canWrite, isOwner) {
  //   this.openDialogViaMoreOptions(name, type);
  //   this.shareWithGroup(groupname, canWrite, isOwner);
  //   //browser.wait(EC.stalenessOf(shareModalBody), 1500);
  // };


  // share with a user given a user name, whether user has write permissions, and whether user is owner
  this.shareWithUser = function (username, permission) {

    var dialog = element(by.css('#share-modal'));
    var row = element(by.css('#share-people > div.row'));
    var name = row.element(by.css('div.col-sm-8 > input'));
    var perms = row.element(by.css('div.btn-group.bootstrap-select.select-picker'));
    var permElements = {
      "read": perms.element(by.css('div > ul > li:nth-child(1) > a')),
      "write": perms.element(by.css('div > ul > li:nth-child(2) > a')),
      "owner" : perms.element(by.css('div > ul > li:nth-child(3) > a'))
    };
    var perm =  permElements[permission];
    var confirm = element(by.css('#share-people  div.confirmation'));
    var add = element(by.css('#share-people div.confirmation button.btn-save'));
    var done = dialog.element(by.css('div.modal-footer.actions  button.btn-save.confirm'));

    browser.wait(EC.visibilityOf(dialog));
    browser.wait(EC.visibilityOf(name));
    name.sendKeys(username);
    browser.wait(EC.visibilityOf(confirm));
    browser.wait(EC.elementToBeClickable(perms));
    perms.click();
    browser.wait(EC.elementToBeClickable(perm));
    perm.click();
    browser.wait(EC.visibilityOf(add));
    browser.wait(EC.elementToBeClickable(add));
    add.click();
    browser.wait(EC.elementToBeClickable(done));
    done.click();
    browser.wait(EC.stalenessOf(done))
  };

  // share with a user given a user name, whether user has write permissions, and whether user is owner
  this.shareWithGroup = function (groupName, permission) {

    var dialog = element(by.css('#share-modal'));
    var share = element(by.css('#share-group'));
    var row = share.element(by.css('div.row.first'));
    var group = row.element(by.css('div.col-sm-8 > input'));
    var perms = row.element(by.css('div.btn-group.bootstrap-select.select-picker'));
    var permElements = {
      "read": perms.element(by.css('div > ul > li:nth-child(1) > a')),
      "write": perms.element(by.css('div > ul > li:nth-child(2) > a')),
      "owner" : perms.element(by.css('div > ul > li:nth-child(3) > a'))
    };
    var perm =  permElements[permission];
    var confirm = share.element(by.css('div.confirmation.first'));
    var add = confirm.element(by.css('button.btn.btn-save'));
    var done = dialog.element(by.css('div.modal-footer.actions  button.btn-save.confirm'));

    browser.wait(EC.visibilityOf(dialog));
    browser.wait(EC.visibilityOf(group));
    group.sendKeys(groupName);
    browser.wait(EC.visibilityOf(confirm));
    browser.wait(EC.elementToBeClickable(perms));
    perms.click();
    browser.wait(EC.elementToBeClickable(perm));
    perm.click();
    browser.wait(EC.visibilityOf(add));
    browser.wait(EC.elementToBeClickable(add));
    add.click();
    browser.wait(EC.elementToBeClickable(done));
    done.click();
    browser.wait(EC.stalenessOf(done))
  };


  // checks whether the current user can share the selected item
  this.canShare = function () {
    return shareColumn.isPresent();
  };


  // checks whether the current user can change ownership of the selected item
  this.canChangeOwnership = function () {
    var permissionsList = this.createShareModalUserPermissions();
    if (!permissionsList.isPresent()) {
      return false;
    }
    browser.wait(EC.elementToBeClickable(permissionsList));
    permissionsList.click();
    browser.wait(EC.elementToBeClickable(this.createShareModalUserReadPermission()));
    var ownerPermission = this.createShareModalUserOwnerPermission();
    return ownerPermission.isDisplayed();
  };


  // click on the done button of the share dialog
  this.clickDone = function () {
    var doneButton = this.createShareModalDoneButton();
    browser.wait(EC.elementToBeClickable(doneButton));
    doneButton.click();
    browser.wait(EC.stalenessOf(doneButton));
  }


};
module.exports = new ShareModal(); 
