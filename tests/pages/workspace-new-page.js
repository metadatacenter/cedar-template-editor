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
  var createTrashButton = createToolbar.element(by.css('#delete-tool button'));
  var createMoreOptionsButton = createToolbar.element(by.css('#more-options-tool > div > button'));
  var createPopulateResourceButton = createToolbar.element(by.css('#more-options-tool .populate'));
  var createEditResourceButton = createToolbar.element(by.css('#more-options-tool [ng-click="dc.editResource()"]'));
  var createMoveToResourceButton = createToolbar.element(by.css('#more-options-tool [ng-click="dc.showMoveModal(resource)"]'));
  var createOpenResourceButton = createToolbar.element(by.css('#more-options-tool [ng-click="dc.goToResource()"]'));
  var createDeleteResourceButton = createToolbar.element(by.css('#more-options-tool [ng-click="dc.deleteResource(resource)"]'));
  var createGridViewButton = createToolbar.element(by.css('#grid-view-tool'));
  var createListViewButton = createToolbar.element(by.css('#list-view-tool'));
  var createViewDetailsButton = createToolbar.element(by.css('#details-view-tool [ng-click="dc.toggleInfoPanel()"'));
  var createHideDetailsButton = createToolbar.element(by.css('#details-hide-tool [ng-click="dc.toggleInfoPanel()"'));
  var createDetailsPanel = element(by.id('sidebar-right'));
  var createSortDropdownButton = createToolbar.element(by.css('#workspace-sort-tool [ng-click="dc.deleteResource()"]'));
  var createSortByNameMenuItem = createToolbar.element(by.css('#workspace-sort-tool [ng-click="dc.setSortOption(\\042name\\042)"]'));
  var createSortByCreatedMenuItem = createToolbar.element(by.css('#workspace-sort-tool [ng-click="dc.setSortOption(\\042createdOnTS\\042)"]'));
  var createSortByUpdatedMenuItem = createToolbar.element(by.css('#workspace-sort-tool [ng-click="dc.setSortOption(\\042lastUpdatedOnTS\\042)"]'));
  var createUserDropdownButton = createToolbar.element(by.css('#user-tool > div > button'));
  var createProfileMenuItem = createToolbar.element(by.css('#user-tool #user-profile-tool a'));
  var createLogoutMenuItem = createToolbar.element(by.css('#user-tool #user-logoout-tool a'));
  var createListView = element(by.css('.center-panel .list-view'));
  var createGridView = element(by.css('.center-panel .grid-view'));

  // breadcrumbs
  var createBreadcrumb = element(by.css('.breadcrumbs-sb'));
  var createBreadcrumbFolders = element(by.css('.breadcrumbs-sb')).all(by.repeater('folder in dc.pathInfo'));
  var createBreadcrumbSearch = element(by.css('.breadcrumbs-sb .search-result'));

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

    console.log('selected template resource');

    // create more on the toolbar
    browser.wait(EC.visibilityOf(createMoreOptionsButton));
    browser.wait(EC.elementToBeClickable(createMoreOptionsButton));
    createMoreOptionsButton.click();

    console.log('clicked create more');

    // populate menu item
    browser.wait(EC.visibilityOf(createPopulateResourceButton));
    browser.wait(EC.elementToBeClickable(createPopulateResourceButton));
    createPopulateResourceButton.click();

    console.log('clicked populate');

  };

  // populate a template resource
  this.populateResourceStepOne = function (name, type) {

    // find the resource
    createSearchNavInput.sendKeys(name + protractor.Key.ENTER);
    var createFirst = element.all(by.css(createFirstCss + type)).first();
    browser.wait(EC.visibilityOf(createFirst));
    browser.wait(EC.elementToBeClickable(createFirst));
    createFirst.click();

  };

  // populate a template resource
  this.populateResourceStepTwo = function (name, type) {

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

  };

  this.clickLogo = function () {

    createLogo.click();
  }
};

module.exports = new WorkspacePage();
