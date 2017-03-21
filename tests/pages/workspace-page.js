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
  var createNavbarWorkspace = element(by.css('.navbar.dashboard'));
  var createNavbarMetadata = element(by.css('.navbar.metadata'));
  var createControlsBar = element(by.css('.controls-bar'));


  // page content
  var createSidebarRight = element(by.css('#sidebar-right'));
  var createSidebarLeft = element(by.css('#sidebar-left'));
  var createWorkspaceLink = createSidebarLeft.element(by.css('div > div.shared > a [ng-click="dc.goToMyWorkspace()"]'));
  var createSharedWithMeLink = element(by.css('div > div.shared > a [ng-click="dc.goToSharedWithMe()"]'));


  // search navigation
  var createSearchNav = element(by.css('#top-navigation  .nav-search'));
  var createSearchNavForm = element(by.css('#top-navigation  .nav-search form'));
  var createSearchNavInput = element(by.model('hc.searchTerm'));
  var createSearchNavSearchButton = element(by.css('#top-navigation .nav-search form a.do-search'));
  var createSearchNavClearButton = element(by.css('#top-navigation .nav-search form a.clear-search'));
  var createTopNavWorkspace = element(by.css('.navbar.metadata'));
  var createFirstSelected = element(by.css('.form-box-container.selected'));


  // resources
  var folders = element.all(by.css('.center-panel .grid-view .form-box .folder'));
  var createFirstFolder = folders.first();
  var elements = element.all(by.css('.center-panel .grid-view .form-box .element'));
  var createFirstElement = elements.first();
  var templates = element.all(by.css('.center-panel .grid-view .form-box .template'));
  var createFirstTemplate = templates.first();
  var createFirstCss = '.center-panel .grid-view .form-box .';
  var resourceTypes = ['metadata', 'element', 'template', 'folder'];
  var defaultTitle = 'Protractor';


  // toolbar
  var createToolbar = element(by.id('workspace-toolbar'));
  var createMoreOptionsButton = createToolbar.element(by.css('.more-options > div > button'));
  var createPopulateResourceButton = createToolbar.element(by.css('.more-options .dropdown .populate'));
  var createMoveToResourceButton = createToolbar.element(by.css('.more-options .dropdown .move'));
  var createOpenResourceButton = createToolbar.element(by.css('.more-options .dropdown .open'));
  var createCopyResourceButton = createToolbar.element(by.css('.more-options .dropdown .copy'));
  var createRenameResourceButton = createToolbar.element(by.css('.more-options .dropdown .rename'));
  var createShareMenuItem = createToolbar.element(by.css('.more-options .dropdown .share'));
  var createDeleteResourceButton = createToolbar.element(by.css('.more-options .dropdown .delete'));
  var createGridViewButton = createToolbar.element(by.css('#grid-view-tool'));
  var createListViewButton = createToolbar.element(by.css('#list-view-tool'));
  var createShowDetailsButton = createToolbar.element(by.css('.toggleDetails.showPanel'));
  var createHideDetailsButton = createToolbar.element(by.css('.toggleDetails.hidePanel'));
  var createSortDropdownButton = createToolbar.element(by.css('#workspace-sort-tool .menu'));
  var createUserDropdownButton = createToolbar.element(by.css('#user-tool > div > button'));
  var createProfileMenuItem = createToolbar.element(by.css('#user-tool #user-profile-tool a'));
  var createLogoutMenuItem = createToolbar.element(by.css('#user-tool #user-logout-tool a'));
  var createListView = element(by.css('.center-panel .list-view'));
  var createGridView = element(by.css('.center-panel .grid-view'));


  // details panel
  var createDetailsPanel = element(by.id('sidebar-right'));
  var createDetailsPanelTitle = createDetailsPanel.element(by.css('.title span'));
  var createDetailsPanelOwner = createDetailsPanel.element(by.css('.owner'));
  var createDetailsPanelOwnerValue = createDetailsPanel.element(by.css('div.info > div> div.owner'));
  var createDetailsPanelDescription = createDetailsPanel.element(by.id('edit-description'));
  var createDetailsPanelDescriptionEditButton = createDetailsPanel.element(by.css('div.description > div.edit > button'));

  // breadcrumbs
  var createBreadcrumb = element(by.css('.breadcrumbs-sb'));
  var createBreadcrumbFirstFolder = element.all(by.css('.breadcrumbs-sb .folder-path')).first();
  var createBreadcrumbFolders = element(by.css('.breadcrumbs-sb')).all(by.repeater('folder in dc.pathInfo'));
  var createBreadcrumbSearch = element(by.css('.breadcrumbs-sb .search-result'));
  var createBreadcrumbUsersLink = createBreadcrumb.element(by.linkText("Users"));
  var createBreadcrumbUserName = createBreadcrumb.element(by.css('p > a.breadcrumbs.ng-binding'));


  // filtering
  var filterButtons = [
    {
      'button': element(by.css('#sidebar-left .filter-options button.template')),
      'active': element(by.css('#sidebar-left .filter-options button.template i.active'))
    },
    {
      'button': element(by.css('#sidebar-left .filter-options button.element')),
      'active': element(by.css('#sidebar-left .filter-options button.element i.active'))
    },
    {
      'button': element(by.css('#sidebar-left .filter-options button.metadata')),
      'active': element(by.css('#sidebar-left .filter-options button.metadata i.active'))
    }
  ];


  // create new buttons
  var createButton = element(by.id('button-create'));
  var createTemplateButton = element(by.id('button-create-template'));
  var createElementButton = element(by.id('button-create-element'));
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
  var createRightClickMenuItemList = createCenterPanel.element(by.css('div.form-box-container.selected  ul'));
  var createRightClickOpenMenuItem = createRightClickMenuItemList.element(by.css('li > a.open'));
  var createRightClickPopulateMenuItem = createRightClickMenuItemList.element(by.css('li > a.populate'));
  var createRightClickShareMenuItem = createRightClickMenuItemList.element(by.css('li > a.share'));
  var createRightClickRenameMenuItem = createRightClickMenuItemList.element(by.css('li > a.rename'));
  var createRightClickMoveToMenuItem = createRightClickMenuItemList.element(by.css('li > a.move'));
  var createRightClickCopyToMenuItem = createRightClickMenuItemList.element(by.css('li > a.copy'));
  var createRightClickDeleteMenuItem = createRightClickMenuItemList.element(by.css('li > a.delete'));


  this.createMoreOptionsButton = function () {
    return createMoreOptionsButton;
  };

  this.createSearchNav = function () {
    return createSearchNav;
  };

  this.createSearchNavInput = function () {
    return createSearchNavInput;
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

  // the default title is used in every resource created so that we can find them later
  this.defaultTitle = function () {
    return defaultTitle;
  };

  this.resourceTypes = function () {
    return resourceTypes;
  };

  this.createShareMenuItem = function () {
    return createShareMenuItem;
  };

  this.createViewDetailsButton = function () {
    return createShowDetailsButton;
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

  this.createRightClickOpenMenuItem = function () {
    return createRightClickOpenMenuItem;
  };

  this.createRightClickPopulateMenuItem = function () {
    return createRightClickPopulateMenuItem;
  };

  this.createRightClickShareMenuItem = function () {
    return createRightClickShareMenuItem;
  };

  this.createRightClickRenameMenuItem = function () {
    return createRightClickRenameMenuItem;
  };

  this.createRightClickMoveToMenuItem = function () {
    return createRightClickMoveToMenuItem;
  };

  this.createRightClickCopyToMenuItem = function () {
    return createRightClickCopyToMenuItem;
  };

  this.createRightClickDeleteMenuItem = function () {
    return createRightClickDeleteMenuItem;
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

  this.createRenameResourceButton = function () {
    return createRenameResourceButton;
  };

  // page load
  this.get = function () {
    browser.get(url);
    //browser.sleep(1000);
  };

  var getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  };

  // create a unique name for a particular type of resource
  this.createTitle = function (type) {
    return defaultTitle + type + getRandomInt(1, 9999999999);
  };

  // create a unique resource description
  this.createDescription = function (type) {
    return type + getRandomInt(1, 9999999999);
  };

  // are we on the workspace page?
  this.onWorkspace = function () {
    browser.wait(EC.presenceOf(createNavbarWorkspace));
  };

      this.topNavigation = function () {
        return createTopNavigation;
      };

  // are we on the metadata page
  this.onMetadata = function () {
    browser.wait(EC.presenceOf(createNavbarMetadata));
  };

  // do we have the controls bar
  this.hasControlBar = function () {
    browser.wait(EC.presenceOf(createControlsBar));
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

    switch (type) {
      case "template":
        if (title) {
          templateCreatorPage.setTitle('template', title);
        }
        if (description) {
          templateCreatorPage.setDescription('template', description);
        }
        templateCreatorPage.clickSave('template');
        toastyModal.isSuccess();
        templateCreatorPage.clickBackArrow();
        break;
      case "element":
        if (title) {
          templateCreatorPage.setTitle('element', title);
        }
        if (description) {
          templateCreatorPage.setDescription('element', description);
        }
        templateCreatorPage.clickSave('element');
        toastyModal.isSuccess();
        templateCreatorPage.clickBackArrow();
        break;
      case "folder":
        browser.wait(EC.visibilityOf(createFolderModal));
        if (title) {
          createFolderName.sendKeys(title);
        }
        browser.wait(EC.elementToBeClickable(createFolderSubmitButton));
        createFolderSubmitButton.click();
        break;
    }
  };


  // create a folder
  this.createFolder = function (name) {
    var folderTitle = this.createTitle(name);
    this.createResource('folder', folderTitle);
    toastyModal.isSuccess();
    return folderTitle;
  };

      // create an element
      this.createElement = function (name) {
        var elementTitle = this.createTitle(name);
        var elementDescription = this.createDescription(name);
        this.createResource('element', elementTitle, elementDescription);
        return elementTitle;
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

  this.deleteResourceViaRightClick = function (name, type) {
    this.rightClickResource(name, type);
    browser.wait(EC.visibilityOf(createRightClickDeleteMenuItem));
    // is delete enabled?
    browser.wait(EC.elementToBeClickable(createRightClickDeleteMenuItem));
    createRightClickDeleteMenuItem.click();
    sweetAlertModal.confirm();
    return true;
  };

  this.setSortOrder = function (order) {

    // create more on the toolbar
    browser.wait(EC.visibilityOf(createSortDropdownButton));
    browser.wait(EC.elementToBeClickable(createSortDropdownButton));
    createSortDropdownButton.click();

    // create more on the toolbar
    var sortItem = element(by.css('#workspace-sort-tool' + ' .' + order));
    browser.wait(EC.visibilityOf(sortItem));
    browser.wait(EC.elementToBeClickable(sortItem));
    sortItem.click();
  };

  this.closeInfoPanel = function () {

    createSidebarRight.isPresent().then(function (result) {
      if (result) {
        browser.wait(EC.visibilityOf(createHideDetailsButton));
        browser.wait(EC.elementToBeClickable(createHideDetailsButton));
        createHideDetailsButton.click();
      }
    });
  };

  this.openInfoPanel = function () {
    createSidebarRight.isPresent().then(function (result) {
      if (!result) {
        browser.wait(EC.visibilityOf(createShowDetailsButton));
        browser.wait(EC.elementToBeClickable(createShowDetailsButton));
        createShowDetailsButton.click();
        browser.wait(EC.visibilityOf(createSidebarRight));
      }
    });
  };

  this.isInfoPanelOpen = function () {
    return createSidebarRight.isPresent();
  };

  this.resetFiltering = function () {

    filterButtons.forEach(function (btnObj) {
      var btn = btnObj.button;
      btnObj.active.isPresent().then(function (on) {
        if (!on) {
          browser.wait(EC.visibilityOf(btn));
          browser.wait(EC.elementToBeClickable(btn));
          btn.click();
        }
      });
    });
  };

  // delete a resource whose name contains this string if possible
  var deleteAllBySearching = function (name, type) {

    // search for the resource
    createSearchNavInput.sendKeys(name + protractor.Key.ENTER);
    var result = "Search Results For: '" + name + "'";
    var searchResult = element(by.css('.search-result'));
    browser.wait(EC.textToBePresentInElement(searchResult, result));

    // single click on the first result
    var results = element.all(by.css('.center-panel .grid-view .form-box' + ' .' + type));

    results.count().then(function (count) {

      if (count) {

        results.first().isPresent().then(function (value) {

          if (value) {

            // select it
            var createFirst = results.first();
            browser.wait(EC.visibilityOf(createFirst));
            browser.wait(EC.elementToBeClickable(createFirst));
            createFirst.click();

            // create more on the toolbar
            browser.wait(EC.visibilityOf(createMoreOptionsButton));
            browser.wait(EC.elementToBeClickable(createMoreOptionsButton));
            createMoreOptionsButton.click();

            // delete menu item
            browser.wait(EC.visibilityOf(createDeleteResourceButton));
            browser.wait(EC.elementToBeClickable(createDeleteResourceButton));
            createDeleteResourceButton.click();

            // confirm
            sweetAlertModal.confirm();
            toastyModal.isSuccess();

            // clean up and look for another
            clearSearch();
            deleteAllBySearching(name, type);
          }
        });
      } else {
        clearSearch();
      }
    });
  };
  this.deleteAllBySearching = deleteAllBySearching;

  // delete until everything is gone from the workspace by looking for the empty folder icon
  var deleteAll = function (type) {

    // single click on the first result
    var noSelection = element(by.css('.center-panel .no-selection'));
    noSelection.isPresent().then(function (value) {
      if (!value) {

        // select it
        var results = element.all(by.css('.center-panel .grid-view .form-box ' + '.' + type));
        var createFirst = results.first();
        browser.wait(EC.visibilityOf(createFirst));
        browser.wait(EC.elementToBeClickable(createFirst));
        createFirst.click();

        // create more on the toolbar
        browser.wait(EC.visibilityOf(createMoreOptionsButton));
        browser.wait(EC.elementToBeClickable(createMoreOptionsButton));
        createMoreOptionsButton.click();

        // delete menu item
        browser.wait(EC.visibilityOf(createDeleteResourceButton));
        browser.wait(EC.elementToBeClickable(createDeleteResourceButton));
        createDeleteResourceButton.click();

        // confirm
        sweetAlertModal.confirm();
        toastyModal.isSuccess();

        deleteAll(type);
      }
    });
  };
  this.deleteAll = deleteAll;

  // search for a particular resource
  this.searchForResource = function (name, type) {

    createSearchNavInput.sendKeys(name + protractor.Key.ENTER);
    var createFirst = element.all(by.css(createFirstCss + type)).first();
    browser.wait(EC.visibilityOf(createFirst));

  };

  // clear any ongoing search
  var clearSearch = function () {

    browser.wait(EC.visibilityOf(createSearchNavClearButton));
    browser.wait(EC.elementToBeClickable(createSearchNavClearButton));
    createSearchNavClearButton.click();
    browser.wait(EC.visibilityOf(createBreadcrumbFirstFolder));

  };
  this.clearSearch = clearSearch;

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
    browser.wait(EC.visibilityOf(createOpenResourceButton));
    browser.wait(EC.elementToBeClickable(createOpenResourceButton));
    createOpenResourceButton.click();

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

  // move a resource using the right-click menu item
  this.moveResourceViaRightClick = function (name, type) {
    this.rightClickResource(name, type);
    browser.wait(EC.elementToBeClickable(createRightClickMoveToMenuItem));
    createRightClickMoveToMenuItem.click();
  };

  // copy a resource using the right-click menu item
  this.copyResource = function (name, type) {
    this.rightClickResource(name, type);
    browser.wait(EC.elementToBeClickable(createRightClickCopyToMenuItem));
    createRightClickCopyToMenuItem.click();
  };

  // select a resource
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

  // click on the cedar logo
  this.clickLogo = function () {
    browser.wait(EC.elementToBeClickable(createLogo));
    createLogo.click();
  };

  // click on the workspace link
  this.clickWorkspace = function () {
    browser.wait(EC.elementToBeClickable(createWorkspaceLink));
    createWorkspaceLink.click();
  };

  // click on the shared-with-me link
  this.clickSharedWithMe = function () {
    browser.wait(EC.elementToBeClickable(createSharedWithMeLink));
    createSharedWithMeLink.click();
  };

  // logout from the account currently logged in to
  this.logout = function () {
    browser.wait(EC.visibilityOf(createUserDropdownButton), 2000);
    browser.wait(EC.elementToBeClickable(createUserDropdownButton), 2000);
    createUserDropdownButton.click();
    browser.wait(EC.elementToBeClickable(createLogoutMenuItem));
    createLogoutMenuItem.click();
  };

  // login as the specified user with the given password
  this.login = function (username, password) {
    browser.driver.findElement(by.id('username')).sendKeys(username).then(function () {
      browser.driver.findElement(by.id('password')).sendKeys(password).then(function () {
        browser.driver.findElement(by.id('kc-login')).click().then(function () {
          browser.driver.findElements(By.id('top-navigation')).then(function (found) {
            browser.driver.findElements(By.id('ng-app')).then(function (found) {
              return true;
            });
          });
        });
      });
    });
  };

  // check whether the given username corresponds to the currently logged in user
  this.isUserLoggedIn = function (username) {
    this.clickLogo();
    browser.wait(EC.visibilityOf(createFirstFolder));
    createBreadcrumbUserName.getText().then(function (text) {
      return text === username;
    });
  };

  // login with the specified userid and password, if the given username is not the one currently logged in
  this.loginIfNecessary = function (username, userid, password) {
    this.clickLogo();
    browser.wait(EC.visibilityOf(createFirstFolder));
    createBreadcrumbUserName.getText().then(function (text) {
      if (text !== username) {
        var page = new WorkspacePage();
        page.logout();
        page.login(userid, password);
      }
    });
  };

  // navigate to the home folder of the specified user
  this.navigateToUserFolder = function (username) {
    this.clickBreadcrumb(1);
    var userFolder = createCenterPanel.element(by.cssContainingText('.folderTitle.ng-binding', username));
    browser.wait(EC.elementToBeClickable(userFolder));
    browser.actions().doubleClick(userFolder).perform();
  };

  // right-click on a resource
  this.rightClickResource = function (name, type) {
    var element = this.selectResource(name, type);
    browser.actions().mouseMove(element).perform();
    browser.actions().click(protractor.Button.RIGHT).perform();
  };


};

module.exports = new WorkspacePage();