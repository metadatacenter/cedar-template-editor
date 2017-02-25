'use strict';


var WorkspacePage = function () {

  var testConfig = require('../config/test-env.js');
  var toastyModal = require('../modals/toasty-modal.js');
  var sweetAlertModal = require('../modals/sweet-alert-modal.js');
  var templateCreatorPage = require('../pages/template-creator-page.js');

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
  var folders = element.all(by.css('.folderTitle'));
  var createFirstFolder = folders.first();
  var elements = element.all(by.css('.center-panel .grid-view .form-box .element'));
  var createFirstElement = elements.first();
  var templates = element.all(by.css('.center-panel .grid-view .form-box .template'));
  var createFirstTemplate = templates.first();
  var createFirstCss = '.center-panel .grid-view .form-box .';
  var folderType = 'folder';
  var templateType = 'template';
  var elementType = 'element';
  var metadataType = 'metadata';

  // toolbar
  var createToolbar = element(by.id('workspace-toolbar'));
  var createTrashButton = createToolbar.element(by.css('#delete-tool button'));
  var createMoreOptionsButton = createToolbar.element(by.css('#more-options-tool > div > button'));
  var createPopulateResourceButton = createToolbar.element(by.css('#more-options-tool .populate'));
  var createEditResourceButton = createToolbar.element(by.css('#more-options-tool [ng-click="dc.editResource()"]'));
  var createMoveToResourceButton = createToolbar.element(by.css('#more-options-tool [ng-click="dc.showMoveModal(resource)"]'));
  var createCopyToResourceButton = createToolbar.element(by.css('#more-options-tool [ng-click="dc.showCopyModal(resource)"]'));
  var createOpenResourceButton = createToolbar.element(by.css('#more-options-tool [ng-click="dc.goToResource()"]'));
  var createDeleteResourceButton = createToolbar.element(by.css('#more-options-tool [ng-click="dc.deleteResource(resource)"]'));
  var createGridViewButton = createToolbar.element(by.css('#grid-view-tool'));
  var createListViewButton = createToolbar.element(by.css('#list-view-tool'));
  var createViewDetailsButton = createToolbar.element(by.css('#details-view-tool > button'));
  var createHideDetailsButton = createToolbar.element(by.css('#details-hide-tool [ng-click="dc.toggleInfoPanel()"]'));
  var createDetailsPanel = element(by.id('sidebar-right'));
  var createDetailsPanelTitle = createDetailsPanel.element(by.css('div > div.title.ng-binding.folder'));
  var createDetailsPanelOwnerValue = createDetailsPanel.element(by.css('div.info > div> div.owner'));
  var createDetailsPanelDescription = createDetailsPanel.element(by.id('edit-description'));
  var createDetailsPanelDescriptionEditButton = createDetailsPanel.element(by.css('div.description > div.edit > button'));
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
  var createBreadcrumbFirstFolder = element.all(by.css('.breadcrumbs-sb .folder-path')).first();
  var createBreadcrumbFolders = element(by.css('.breadcrumbs-sb')).all(by.repeater('folder in dc.pathInfo'));
  var createBreadcrumbSearch = element(by.css('.breadcrumbs-sb .search-result'));
  var createBreadcrumbUsersLink = createBreadcrumb.element(by.linkText("Users"));
  var createBreadcrumbUserName = createBreadcrumb.element(by.css('p > a.breadcrumbs.ng-binding'));

  // create new buttons
  var createButton = element(by.id('button-create'));
  var createTemplateButton = element(by.id('button-create-template'));
  var createElementButton = element(by.id('button-create-element '));
  var createFolderButton = element(by.id('button-create-folder'));
  var createMetadataButton = element(by.id('button-save-metadata'));
  var createResourceButtons = {
    "template": createTemplateButton,
    "element" : createElementButton,
    "folder"  : createFolderButton
  };

  // main center panel
  var createCenterPanel = element(by.id('center-panel'));

  // create folder modal
  var createFolderModal = element(by.id('new-folder-modal'));
  var createFolderName = createFolderModal.element(by.model('folder.folder.name'));
  var createFolderSubmitButton = createFolderModal.element(by.css('div.modal-footer button.confirm'));

  // share menu item from the option list following a right click on a resource
  var createRightClickMenuItemList = createCenterPanel.element(by.css('div > div > div > div.form-box-container.ng-scope.selected > div > div > ' +
      'div.btn-group.dropdown.ng-scope.open > ul'));
  var createRightClickShareMenuItem = createRightClickMenuItemList.element(by.css('li > a[ng-click="dc.showShareModal(resource)"]'));
  var createRightClickRenameMenuItem = createRightClickMenuItemList.element(by.css('li > a[ng-click="dc.showRenameModal(resource)"]'));
  var createRightClickInfoMenuItem = createRightClickMenuItemList.element(by.css('li > a[ng-click="dc.showInfoPanel()"]'));
  var createRightClickMoveToMenuItem = createRightClickMenuItemList.element(by.css('li > a[ng-click="dc.showMoveModal(resource)"]'));
  var createRightClickCopyToMenuItem = createRightClickMenuItemList.element(by.css('li > a[ng-click="dc.showCopyModal(resource)"]'));


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
  this.createViewDetailsButton = function () {
    return createViewDetailsButton;
  };
  this.createHideDetailsButton = function () {
    return createHideDetailsButton;
  };
  this.createDetailsPanel = function () {
    return createDetailsPanel;
  };
  this.createDetailsPanelTitle = function () {
    return createDetailsPanelTitle;
  };
  this.createBreadcrumbUserName = function () {
    return createBreadcrumbUserName;
  };
  this.createFolderButton = function () {
    return createFolderButton;
  };
  this.createFolderName = function () {
    return createFolderName;
  };
  this.createFolderSubmitButton = function () {
    return createFolderSubmitButton;
  };
  this.createDetailsPanelOwnerValue = function () {
    return createDetailsPanelOwnerValue;
  };
  this.createDetailsPanelDescription = function () {
    return createDetailsPanelDescription;
  };
  this.createDetailsPanelDescriptionEditButton = function () {
    return createDetailsPanelDescriptionEditButton;
  };
  this.createCenterPanel = function () {
    return createCenterPanel;
  };
  this.createRightClickShareMenuItem = function () {
    return createRightClickShareMenuItem;
  };
  this.createRightClickRenameMenuItem = function () {
    return createRightClickRenameMenuItem;
  };
  this.createRightClickInfoMenuItem = function () {
    return createRightClickInfoMenuItem;
  };
  this.createRightClickMoveToMenuItem = function () {
    return createRightClickMoveToMenuItem;
  };
  this.createRightClickCopyToMenuItem = function () {
    return createRightClickCopyToMenuItem;
  };
  this.createFolders = function () {
    return folders;
  };
  this.createTemplates = function () {
    return templates;
  };
  this.createElements = function () {
    return elements;
  };
  this.createDeleteResourceButton = function () {
    return createDeleteResourceButton;
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
    return 'Protractor' + type + getRandomInt(1, 9999999999);
  };

  this.createDescription = function (type) {
    return type + getRandomInt(1, 9999999999) + ' description';
  };

  this.onWorkspace = function () {
    browser.wait(EC.presenceOf(element(by.css('.navbar.dashboard'))));
  };

  this.onMetadata = function () {
    browser.wait(EC.presenceOf(element(by.css('.navbar.metadata'))));
  };

  this.hasControlBar = function () {
    browser.wait(EC.presenceOf(element(by.css('.controls-bar'))));
  };

  this.hasLogo = function () {
    browser.wait(EC.presenceOf(createLogo));
  };


  // create a template or folder resource and set the title, return to the workspace
  this.createResource = function (type, title, description) {

    browser.wait(EC.visibilityOf(createButton));
    browser.wait(EC.elementToBeClickable(createButton));
    browser.actions().mouseMove(createButton).perform();

    var button = createResourceButtons[type];
    browser.wait(EC.visibilityOf(button));
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
    else if (type === 'template') {
      if (title) {
        templateCreatorPage.setTitle('template', title);
      }
      if (description) {
        templateCreatorPage.setDescription('template', description);
      }
      templateCreatorPage.clickSave('template');
      toastyModal.isSuccess();
      templateCreatorPage.clickBackArrow();
    } else if (type === 'element') {
      if (title) {
        templateCreatorPage.setTitle('element', title);
      }
      if (description) {
        templateCreatorPage.setDescription('element', description);
      }
      templateCreatorPage.clickSave('element');
      toastyModal.isSuccess();
      templateCreatorPage.clickBackArrow();
    }
  };

  // create a folder
  this.createFolder = function (name) {
    var folderTitle = this.createTitle(name);
    this.createResource('folder', folderTitle);
    toastyModal.isSuccess();
    return folderTitle;
  };

  // create a template
  this.createTemplate = function (name) {
    var templateTitle = this.createTitle(name);
    this.createResource('template', templateTitle);
    return templateTitle;
  };

  // delete a resource
  this.deleteResource = function (name, type) {
    this.selectResource(name, type);

    // create more on the toolbar
    browser.wait(EC.visibilityOf(createMoreOptionsButton));
    browser.wait(EC.elementToBeClickable(createMoreOptionsButton));
    createMoreOptionsButton.click();

    // delete menu item
    browser.wait(EC.visibilityOf(createDeleteResourceButton));
    browser.wait(EC.elementToBeClickable(createDeleteResourceButton));
    createDeleteResourceButton.click();

    sweetAlertModal.confirm();
    toastyModal.isSuccess();
    this.clearSearch();

  };

  // search for a particular resource
  this.searchForResource = function (name, type) {

    createSearchNavInput.sendKeys(name + protractor.Key.ENTER);
    var createFirst = element.all(by.css(createFirstCss + type)).first();
    browser.wait(EC.visibilityOf(createFirst));

  };

  // clear any ongoing search
  this.clearSearch = function () {

    browser.wait(EC.visibilityOf(createSearchNavClearButton));
    browser.wait(EC.elementToBeClickable(createSearchNavClearButton));
    createSearchNavClearButton.click();
    browser.wait(EC.visibilityOf(createBreadcrumbFirstFolder));

  };

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

    // save this instance and check for success
    browser.wait(EC.visibilityOf(createMetadataButton));
    browser.wait(EC.elementToBeClickable(createMetadataButton));
    createMetadataButton.click();
    toastyModal.isSuccess();

    // return to workspace
    var backArrow = element(by.css('.back-arrow-click'));
    browser.wait(EC.visibilityOf(backArrow));
    browser.wait(EC.elementToBeClickable(backArrow));
    backArrow.click();

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


  this.copyResource = function (name, type) {
    this.rightClickResource(name, type);
    browser.wait(EC.elementToBeClickable(createRightClickCopyToMenuItem));
    createRightClickCopyToMenuItem.click();
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

    return createFirst;
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

  };

  this.clickLogo = function () {
    browser.wait(EC.visibilityOf(createLogo));
    browser.wait(EC.elementToBeClickable(createLogo));
    createLogo.click();
  };


  this.logout = function () {
    browser.sleep(1000);
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


  this.navigateToUserFolder = function (username) {
    this.clickBreadcrumb(1);
    var userFolder = this.createCenterPanel().element(by.cssContainingText('.folderTitle.ng-binding', username));
    browser.wait(EC.elementToBeClickable(userFolder));
    browser.actions().doubleClick(userFolder).perform();
  };


  this.rightClickResource = function (name, type) {
    var element = this.selectResource(name, type);
    browser.actions().mouseMove(element).perform();
    browser.actions().click(protractor.Button.RIGHT).perform();
  };


};

module.exports = new WorkspacePage();
