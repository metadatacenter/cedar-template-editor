'use strict';


var WorkspacePage = function () {

  var testConfig = require('../config/test-env.js');
  var url = testConfig.baseUrl + '/dashboard';
  var EC = protractor.ExpectedConditions;

  // page header
  var createTopNavigation = element(by.id('top-navigation'));
  var createLogo = createTopNavigation.element(by.css('.navbar-brand'));
  var createPageName = element(by.css('#top-navigation.dashboard'));
  var createMetadataPage = element(by.css('#top-navigation.metadata'));

  // search navigation
  var createSearchNav = element(by.css('#top-navigation  .nav-search'));
  var createSearchNavForm = element(by.css('#top-navigation  .nav-search form'));
  var createSearchNavInput = element(by.model('hc.searchTerm'));
  var createSearchNavSearchButton = element(by.css('#top-navigation .nav-search form a.do-search'));
  var createSearchNavClearButton = element(by.css('#top-navigation .nav-search form a.clear-search'));
  var createTopNavWorkspace = element(by.css('.navbar.metadata'));
  var createFirstSelected = element(by.css('.form-box-container.selected'));

  // resources
  var createFirstFolder = element.all(by.css('.center-panel .grid-view .form-box .folder')).first();
  var createFirstElement = element.all(by.css('.center-panel .grid-view .form-box .element')).first();
  var createFirstTemplate = element.all(by.css('.center-panel .grid-view .form-box .template')).first();
  var createFirstCss = '.center-panel .grid-view .form-box .';
  var folderType = 'folder';
  var templateType = 'template';
  var elementType = 'element';
  var metadataType = 'metadata';

  // toolbar
  var createToolbar = element(by.id('workspace-toolbar'));
  var createTrashButton = createToolbar.element(by.css('#delete-tool button[tooltip="delete selection"]'));
  var createMoreOptionsButton = createToolbar.element(by.css('#more-options-tool > div > button'));
  var createPopulateResourceButton = createToolbar.element(by.css('#more-options-tool [ng-click="dc.launchInstance()"]'));
  var createEditResourceButton = createToolbar.element(by.css('#more-options-tool [ng-click="dc.editResource()"]'));
  var createMoveToResourceButton = createToolbar.element(by.css('#more-options-tool [ng-click="dc.showMoveModal(resource)"]'));
  var createOpenResourceButton = createToolbar.element(by.css('#more-options-tool [ng-click="dc.goToResource()"]'));
  var createDeleteResourceButton = createToolbar.element(by.css('#more-options-tool [ng-click="dc.deleteResource(resource)"]'));
  var createGridViewButton = createToolbar.element(by.css('#grid-view-tool [tooltip="view as grid"]'));
  var createListViewButton = createToolbar.element(by.css('#list-view-tool [tooltip="view as list"]'));
  var createViewDetailsButton = createToolbar.element(by.css('#details-view-tool [ng-click="dc.toggleInfoPanel()" tooltip="view details"]'));
  var createHideDetailsButton = createToolbar.element(by.css('#details-hide-tool [ng-click="dc.toggleInfoPanel()" tooltip="hide details"]'));
  var createDetailsPanel = element(by.id('sidebar-right'));
  var createSortDropdownButton = createToolbar.element(by.css('#workspace-sort-tool [ng-click="dc.deleteResource()"]'));
  var createSortByNameMenuItem = createToolbar.element(by.css('#workspace-sort-tool [ng-click="dc.setSortOption(\\042name\\042)"]'));
  var createSortByCreatedMenuItem = createToolbar.element(by.css('#workspace-sort-tool [ng-click="dc.setSortOption(\\042createdOnTS\\042)"]'));
  var createSortByUpdatedMenuItem = createToolbar.element(by.css('#workspace-sort-tool [ng-click="dc.setSortOption(\\042lastUpdatedOnTS\\042)"]'));
  var createUserDropdownButton = createToolbar.element(by.css('#user-tool > div > button'));
  var createProfileMenuItem = createToolbar.element(by.css('#user-tool #user-profile-tool a'));
  var createLogoutMenuItem = createToolbar.element(by.css('#user-tool #user-logout-tool a'));
  var createShareMenuItem = createToolbar.element(by.css('#more-options-tool > div > ul > li > a[ng-click="dc.showShareModal(resource)"]'));
  var trashTooltip = 'delete selection';
  var createListView = element(by.css('.center-panel .list-view'));
  var createGridView = element(by.css('.center-panel .grid-view'));

  // breadcrumbs
  var createBreadcrumb = element(by.css('.breadcrumbs-sb'));
  var createBreadcrumbFolders = element(by.css('.breadcrumbs-sb')).all(by.repeater('folder in dc.pathInfo'));
  var createBreadcrumbSearch = element(by.css('.breadcrumbs-sb .search-result'));
  var createBreadcrumbUsersLink = createBreadcrumb.element(by.linkText("Users"));

  // create new buttons
  var createButton = element(by.id('button-create'));
  var createTemplateButton = element(by.id('button-create-template'));
  var createElementButton = element(by.id('button-create-element '));
  var createFolderButton = element(by.id('button-create-folder'));
  var createResourceButtons = {
    "template": createTemplateButton,
    "element" : createElementButton,
    "folder"  : createFolderButton
  };


  // create folder modal
  var createFolderModal = element(by.id('new-folder-modal'));
  var createFolderName = createFolderModal.element(by.model('folder.folder.name'));
  var createFolderSubmitButton = createFolderModal.element(by.css('div.modal-footer button.confirm'));

  // share modal
  var createShareModal = element(by.id('share-modal'));
  var shareWithUserRow = createShareModal.element(by.css('div > div > div.modal-body > div > div > div.col-sm-6.ng-scope > div:nth-child(5)'));
  var createShareModalUserName =
    shareWithUserRow.element(by.css('div.col-sm-7.typeaheadDropUp > input'));
  var permissionsList = shareWithUserRow.element(by.css('div.btn-group.bootstrap-select.dropdown.col-sm-4.select-picker.ng-pristine.ng-untouched.ng-valid.ng-isolate-scope.ng-not-empty'));
  var createShareModalPermissions = permissionsList.element(by.css('button'));
  var createShareModalWritePermission = permissionsList.element(by.css('div > ul > li:nth-child(2) > a'));
  var createShareModalAddUserButton = shareWithUserRow.element(by.css('div.col-sm-1.pull-right > button'));
  var createShareModalDoneButton = createShareModal.element(by.css('div > div > div.modal-footer.actions > div > button'));

  // access to locators
  this.createPageName = function () {
    return createPageName;
  };
  this.createMoreOptionsButton = function () {
    return createMoreOptionsButton;
  };
  this.createFirstSelected = function () {
    return createFirstSelected;
  };
  this.folderType = function () {
    return folderType;
  };
  this.templateType = function () {
    return templateType;
  };
  this.elementType = function () {
    return elementType;
  };
  this.metadataType = function () {
    return metadataType;
  };
  this.createLogo = function () {
    return createLogo;
  };
  this.createSearchNav = function () {
    return createSearchNav;
  };
  this.createSearchNavInput = function () {
    return createSearchNavInput;
  };
  this.createSearchNavText = function () {
    return createSearchNavInput.getText();
  };
  this.createBreadcrumbSearch = function () {
    return createBreadcrumbSearch;
  };
  this.createBreadcrumbUsers = function () {
    return createBreadcrumbUsersLink;
  };
  this.createToolbar = function () {
    return createToolbar;
  };
  this.createTrashButton = function () {
    return createTrashButton;
  };
  this.createBreadcrumb = function () {
    return createBreadcrumb;
  };
  this.createButton = function () {
    return createButton;
  };
  this.createTemplateButton = function () {
    return createTemplateButton;
  };
  this.createBreadcrumbFolders = function () {
    return createBreadcrumbFolders;
  };
  this.createFirstTemplate = function () {
    return createFirstTemplate;
  };
  this.createFirstElement = function () {
    return createFirstElement;
  };
  this.createFirstFolder = function () {
    return createFirstFolder;
  };
  this.createUserDropdownButton = function () {
    return createUserDropdownButton;
  };
  this.createLogoutMenuItem = function () {
    return createLogoutMenuItem;
  };
  this.createShareMenuItem = function () {
    return createShareMenuItem;
  };
  this.createShareModal = function () {
    return createShareModal;
  };
  this.createShareModalUserName = function () {
    return createShareModalUserName;
  };
  this.createShareModalDoneButton = function () {
    return createShareModalDoneButton;
  };
  this.createShareModalAddUserButton = function () {
    return createShareModalAddUserButton;
  };
  this.createShareModalPermissions = function () {
    return createShareModalPermissions;
  };
  this.createShareModalWritePermission = function () {
    return createShareModalWritePermission;
  };


  // page load
  this.get = function () {
    browser.get(url);
    browser.sleep(1000);
  };


  // create resources
  var getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  };
  this.createTitle = function (type) {
    return type + getRandomInt(1, 9999999999);
  };
  this.createDescription = function (type) {
    return type + ' description';
  };

  // create a resource
  this.createResource = function (type, title) {

    browser.wait(EC.visibilityOf(createButton));
    browser.wait(EC.elementToBeClickable(createButton));
    browser.actions().mouseMove(createButton).perform();

    var button = createResourceButtons[type];
    browser.wait(EC.elementToBeClickable(button));
    button.click();

    if (type === 'folder') {
      browser.wait(EC.visibilityOf(createFolderModal));
      if (title) {
        createFolderName.sendKeys(title);
      }
      browser.wait(EC.elementToBeClickable(createFolderSubmitButton));
      createFolderSubmitButton.click();
    }
  };

  // delete a resource
  this.deleteResource = function (name, type) {

    // find the resource
    createSearchNavInput.sendKeys(name + protractor.Key.ENTER);
    var result = "Search Results For: '" + name + "'";
    var searchResult = element(by.css('.search-result'));
    browser.wait(EC.textToBePresentInElement(searchResult, result));

    // select the first result
    var createFirst = element.all(by.css(createFirstCss + type)).first();
    browser.wait(EC.visibilityOf(createFirst));
    browser.wait(EC.elementToBeClickable(createFirst));
    createFirst.click();

    // delete it
    browser.wait(EC.visibilityOf(createTrashButton));
    browser.wait(EC.elementToBeClickable(createTrashButton));
    createTrashButton.click();

  };

  // populate a template resource
  this.populateResource = function (name, type) {

    // find the resource
    createSearchNavInput.sendKeys(name + protractor.Key.ENTER);
    var createFirst = element.all(by.css(createFirstCss + type)).first();
    browser.wait(EC.visibilityOf(createFirst));
    browser.wait(EC.elementToBeClickable(createFirst));
    createFirst.click();

    // create more on the toolbar
    browser.wait(EC.visibilityOf(createMoreOptionsButton));
    browser.wait(EC.elementToBeClickable(createMoreOptionsButton));
    createMoreOptionsButton.click();

    // populate menu item
    browser.wait(EC.visibilityOf(createPopulateResourceButton));
    browser.wait(EC.elementToBeClickable(createPopulateResourceButton));
    createPopulateResourceButton.click();

  };

  // edit a resource
  this.editResource = function (name, type) {

    // search for the resource
    createSearchNavInput.sendKeys(name + protractor.Key.ENTER);
    var createFirst = element.all(by.css(createFirstCss + type)).first();
    browser.wait(EC.visibilityOf(createFirst));
    browser.wait(EC.elementToBeClickable(createFirst));
    createFirst.click();

    // create more on the toolbar
    browser.wait(EC.visibilityOf(createMoreOptionsButton));
    browser.wait(EC.elementToBeClickable(createMoreOptionsButton));
    createMoreOptionsButton.click();

    // edit menu item
    browser.wait(EC.visibilityOf(createEditResourceButton));
    browser.wait(EC.elementToBeClickable(createEditResourceButton));
    createEditResourceButton.click();

  };

  // move a resource
  this.moveResource = function (name, type) {

    // search for the resource
    createSearchNavInput.sendKeys(name + protractor.Key.ENTER);
    var createFirst = element.all(by.css(createFirstCss + type)).first();
    browser.wait(EC.visibilityOf(createFirst));
    browser.wait(EC.elementToBeClickable(createFirst));
    createFirst.click();

    // create more on the toolbar
    browser.wait(EC.visibilityOf(createMoreOptionsButton));
    browser.wait(EC.elementToBeClickable(createMoreOptionsButton));
    createMoreOptionsButton.click();

    // move menu item
    browser.wait(EC.visibilityOf(createMoveToResourceButton));
    browser.wait(EC.elementToBeClickable(createMoveToResourceButton));
    createMoveToResourceButton.click();



  };

  this.selectResource = function (name, type) {

    // search for the resource
    createSearchNavInput.sendKeys(name + protractor.Key.ENTER);
    var result = "Search Results For: '" + name + "'";
    var searchResult = element(by.css('.search-result'));
    browser.wait(EC.textToBePresentInElement(searchResult, result));

    // single click on the first result
    var createFirst = element.all(by.css(createFirstCss + type)).first();
    browser.wait(EC.visibilityOf(createFirst));
    browser.wait(EC.elementToBeClickable(createFirst));
    createFirst.click();


  };


  // double click the resource
  this.doubleClickResource = function (name, type) {

    // search for the resource
    createSearchNavInput.sendKeys(name + protractor.Key.ENTER);
    var result = "Search Results For: '" + name + "'";
    var searchResult = element(by.css('.search-result'));
    browser.wait(EC.textToBePresentInElement(searchResult, result));

    // double click on the first result
    var createFirst = element.all(by.css(createFirstCss + type)).first();
    browser.wait(EC.visibilityOf(createFirst));
    browser.wait(EC.elementToBeClickable(createFirst));
    browser.actions().doubleClick(createFirst).perform();

    // is this the metadata editor?
    browser.wait(EC.presenceOf(element(by.css('.navbar.metadata'))));

  };

  // click on the item at index in the breadcrumb
  this.clickBreadcrumb = function (index) {

    browser.wait(EC.visibilityOf(createBreadcrumb));
    var folders = createBreadcrumbFolders;
    var folder = folders.get(index);
    var link = folder.element(by.tagName('a'));
    browser.wait(EC.elementToBeClickable(link));
    link.click();
    browser.sleep(3000);

  };

  this.clickLogo = function () {

    createLogo.click();
  };


  this.logout = function () {
    var createUserDropdownButton = this.createUserDropdownButton();
    browser.wait(EC.visibilityOf(createUserDropdownButton));
    browser.wait(EC.elementToBeClickable(createUserDropdownButton));
    createUserDropdownButton.click();
    var logoutMenuItem = this.createLogoutMenuItem();
    browser.wait(EC.elementToBeClickable(logoutMenuItem));
    logoutMenuItem.click();
  };


  this.login = function (username, password) {
    browser.driver.findElement(by.id('username')).sendKeys(username).then(function () {
      browser.driver.findElement(by.id('password')).sendKeys(password).then(function () {
        browser.driver.findElement(by.id('kc-login')).click().then(function () {
          browser.driver.wait(browser.driver.isElementPresent(by.id('top-navigation')));
          browser.driver.wait(browser.driver.isElementPresent(by.className('ng-app')));
        });
      });
    });
  };


  this.shareResource = function (name, type, username, canWrite) {
    this.selectResource(name, type);
    this.createMoreOptionsButton().click();
    var shareMenuItem = this.createShareMenuItem();
    browser.wait(EC.elementToBeClickable(shareMenuItem));
    shareMenuItem.click();

    var usernameField = this.createShareModalUserName();
    usernameField.sendKeys(username);
    browser.actions().sendKeys(protractor.Key.ENTER).perform();

    if (canWrite) {
      var permissionsList = this.createShareModalPermissions();
      permissionsList.click();
      this.createShareModalWritePermission().click();
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


  this.deleteResource = function (name, type) {
    this.selectResource(name, type);
    this.createTrashButton().click();
    sweetAlertModal.confirm();
    toastyModal.isSuccess();
    browser.sleep(1000);
    this.clickLogo();
  };


  this.navigateToUserFolder = function (username) {
    this.clickBreadcrumb(1);
    var centerPanel = element(by.id('center-panel'));
    var userFolder = centerPanel.element(by.cssContainingText('.folderTitle.ng-binding', username));
    browser.actions().doubleClick(userFolder).perform();
  };


};

module.exports = new WorkspacePage();
