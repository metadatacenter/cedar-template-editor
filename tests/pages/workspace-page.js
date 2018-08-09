'use strict';


var WorkspacePage = function () {


  var testConfig = require('../config/test-env.js');
  var toastyModal = require('../modals/toasty-modal.js');
  var sweetAlertModal = require('../modals/sweet-alert-modal.js');
  var templateCreatorPage = require('../pages/template-creator-page.js');
  var metadataCreatorPage = require('../pages/metadata-page.js');
  var createRootElement = element(by.css('body#rootElement'));

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
  var createNavbarElement = element(by.css('#top-navigation.element'));
  var createNavbarTemplate = element(by.css('#top-navigation.template'));


  // page content
  var createSidebarRight = element(by.css('#sidebar-right'));
  var createSidebarLeft = element(by.css('#sidebar-left'));
  var createWorkspaceLink = createSidebarLeft.element(by.css('div > div.shared > a [ng-click="dc.goToMyWorkspace()"]'));
  var createSharedWithMeLink = element(by.css('div > div.shared > a [ng-click="dc.goToSharedWithMe()"]'));


  // search navigation

  var createSearchNav = element(by.css('#search'));
  var createSearchNavInput = element(by.model('hc.searchTerm'));
  var createSearchNavClearButton = element(by.css('#headerCtrl a.clear.clear-search'));


  // resources
  var folders = element.all(by.css('.center-panel .grid-view .form-box .folder'));
  var createFirstFolder = folders.first();
  var elements = element.all(by.css('.center-panel .grid-view .form-box .element'));
  var createFirstElement = elements.first();
  var templates = element.all(by.css('.center-panel .grid-view .form-box .template'));
  var createFirstTemplate = templates.first();
  var createFirstCss = '.center-panel .grid-view .form-box .';
  var createResourceInstanceCss = '#workspace-view-container div.populate-form-boxes div.resource-instance';
  var resourceTypes = ['metadata', 'element', 'template', 'folder'];
  var defaultTitle = 'Protractor';


  // create more ellipsis on resource
  var createMoreOptionsButton = element(
      by.css('#workspace-view-container  div.form-box-container.selected  div.toolbar-right > button'));
  // create more dropdown and items inside
  var createMoreOptionsDropdown = element(
      by.css('#workspace-view-container  div.form-box-container.selected  div.toolbar-right.open'));
  var createOpenResourceButton = createMoreOptionsDropdown.element(by.css('li.open'));
  var createEditResourceButton = createMoreOptionsDropdown.element(by.css('li.edit'));
  var createMoveToResourceButton = createMoreOptionsDropdown.element(by.css('li.move'));

  var createCopyResourceButton = createMoreOptionsDropdown.element(by.css('li.copy'));
  var createRenameResourceButton = createMoreOptionsDropdown.element(by.css('li.rename'));
  var createShareMenuItem = createMoreOptionsDropdown.element(by.css('li.share'));
  var createDeleteResourceButton = createMoreOptionsDropdown.element(by.css('li.delete'));

  var createShowDetailsButton = element(by.css('#show-details.showPanel > button'));
  var createHideDetailsButton = element(by.css(' #show-details.hidePanel > button'));
  var createSortDropdownButton = element(by.css('#workspace-sort-tool > div > button'));
  var createUserDropdownButton = element(by.css('#user-menu-dropdown-trigger'));
  var createProfileMenuItem = element(by.css('#user-profile-tool'));
  var createLogoutMenuItem = element(by.css('#user-logout-tool'));
  var createListView = element(by.css('li.grid-view > button'));
  var createGridView = element(by.css('li.list-view > button'));


  // details panel
  var createDetailsPanel = element(by.id('sidebar-right'));
  var createDetailsPanelTitle = createDetailsPanel.element(by.css('.title span'));
  var createDetailsPanelOwner = createDetailsPanel.element(by.css('.owner'));
  var createDetailsPanelOwnerValue = createDetailsPanel.element(by.css('div.info > div> div.owner'));
  var createDetailsPanelDescription = createDetailsPanel.element(by.id('edit-description'));
  var createDetailsPanelDescriptionEditButton = createDetailsPanel.element(
      by.css('div.description > div.edit > button'));

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
      'off': element(by.css('#sidebar-left .filter-options div.resource-icon.deselected.template')),
      'on' : element(by.css('#sidebar-left .filter-options div.resource-icon.selected.template'))
    },
    {
      'off': element(by.css('#sidebar-left .filter-options div.resource-icon.deselected.element')),
      'on' : element(by.css('#sidebar-left .filter-options div.resource-icon.element.selected'))
    },
    {
      'off': element(by.css('#sidebar-left .filter-options div.resource-icon.deselected.metadata ')),
      'on' : element(by.css('#sidebar-left .filter-options div.resource-icon.selected.metadata '))
    },
    {
      'off': element(by.css('#sidebar-left .filter-options div.resource-icon.deselected.field')),
      'on' : element(by.css('#sidebar-left .filter-options div.resource-icon.selected.field'))
    }
  ];


  // create new buttons
  var createButton = element(by.id('button-create'));
  var createDropdown = element(by.css('ul.dropdown-menu.composeOpen'));
  var createTemplateButton = element(by.id('button-create-template'));
  var createFieldButton = element(by.id('button-create-field'));
  var createElementButton = element(by.id('button-create-element'));
  var createFolderButton = element(by.id('button-create-folder'));
  var createMetadataButton = element(by.id('button-save-metadata'));
  var createResourceButtons = {
    "template": createTemplateButton,
    "element" : createElementButton,
    "folder"  : createFolderButton,
    "field"   : createFieldButton
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
  var createShareDisabled = createRightClickMenuItemList.element(by.css('li > a.share.link-disabled'));
  var createMoveDisabled = createRightClickMenuItemList.element(by.css('li > a.move.link-disabled'));
  var createDeleteDisabled = createRightClickMenuItemList.element(by.css('li > a.delete.link-disabled'));
  var createCopyDisabled = createRightClickMenuItemList.element(by.css('li > a.copy.link-disabled'));
  var sharedWithMe = element(by.css('#sidebar-left > div > div.shares > a.share.ng-scope.active'));


  this.myReporter = function () {
    var reporter = {
      specDone: function (result) {
        console.log(result.fullName + '...' + result.status);
      }
    };
    return reporter;
  };


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

  this.createShareDisabled = function () {
    return createShareDisabled;
  };

  this.createCopyDisabled = function () {
    return createCopyDisabled;
  };

  this.createMoveDisabled = function () {
    return createMoveDisabled;
  };

  this.createDeleteDisabled = function () {
    return createDeleteDisabled;
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

  // are we on the element page
  this.onTemplate = function () {
    browser.wait(EC.presenceOf(createNavbarTemplate));
  };

  // are we on the element page
  this.onElement = function () {
    browser.wait(EC.presenceOf(createNavbarElement));
  };

  // do we have the controls bar
  this.hasControlBar = function () {
    browser.wait(EC.presenceOf(createControlsBar));
  };

  this.moveDisabled = function (name, type) {
    this.rightClickResource(name, type);
    var moveMenuItem = this.createMoveDisabled();
    browser.wait(EC.visibilityOf(moveMenuItem));
  };

  this.clickSharedWithMe = function () {
    browser.wait(EC.elementToBeClickable(sharedWithMe));
    sharedWithMe.click();
  };

  this.hasLogo = function () {
    browser.wait(EC.presenceOf(createLogo));
  };

  this.createPage = function (type, title, description) {

    browser.wait(EC.visibilityOf(createButton));
    browser.wait(EC.elementToBeClickable(createButton));
    createButton.click();
    browser.wait(EC.visibilityOf(createDropdown));

    var button = createResourceButtons[type];
    browser.wait(EC.visibilityOf(button));
    browser.wait(EC.elementToBeClickable(button));
    button.click();

    if (title) {
      templateCreatorPage.setTitle(type, title);
    }
    if (description) {
      templateCreatorPage.setDescription(type, description);
    }
    return title;
  };

  // create a template or folder resource and set the title, return to the workspace
  this.createResource = function (type, title, description) {

    browser.wait(EC.visibilityOf(createButton));
    browser.wait(EC.elementToBeClickable(createButton));
    createButton.click();
    browser.wait(EC.visibilityOf(createDropdown));

    var button = createResourceButtons[type];
    browser.wait(EC.visibilityOf(button));
    browser.wait(EC.elementToBeClickable(button));
    button.click();

    if (type == 'folder') {
      browser.wait(EC.visibilityOf(createFolderModal));
      if (title) {
        createFolderName.sendKeys(title);
      }
      browser.wait(EC.elementToBeClickable(createFolderSubmitButton));
      createFolderSubmitButton.click();
      toastyModal.isSuccess();
    } else {
      if (title) {
        templateCreatorPage.setTitle(type, title);
      }
      if (description) {
        templateCreatorPage.setDescription(type, description);
      }
      templateCreatorPage.clickSave(type);
      toastyModal.isSuccess();
      templateCreatorPage.clickBackArrow();
    };
    return title;
  };


  // create a folder
  this.createFolder = function (name) {
    return this.createResource('folder', this.createTitle(name), this.createDescription(name));
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
    var templateDescription = this.createDescription(name);
    this.createResource('template', templateTitle, templateDescription);
    return templateTitle;
  };


  // var deleteResourceViaRightClick = function (name, type) {
  //   rightClickResource(name, type);
  //   browser.wait(EC.visibilityOf(createRightClickDeleteMenuItem));
  //   // is delete enabled?
  //   browser.wait(EC.elementToBeClickable(createRightClickDeleteMenuItem));
  //   createRightClickDeleteMenuItem.click();
  //   sweetAlertModal.confirm();
  //   return true;
  // };
  // this.deleteResourceViaRightClick = deleteResourceViaRightClick;

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

  this.setGridView = function () {

    createListView.isPresent().then(function (result) {
      if (result) {
        browser.wait(EC.elementToBeClickable(createListView));
        createListView.click();
      }
    });
  };

  this.isInfoPanelOpen = function () {
    return createSidebarRight.isPresent();
  };

  this.resetFiltering = function () {

    filterButtons.forEach(function (btnObj) {
      var off = btnObj.off;

      off.isPresent().then(function (result) {

        if (result) {
          browser.wait(EC.visibilityOf(off));
          browser.wait(EC.elementToBeClickable(off));
          off.click();

          var on = btnObj.on;
          browser.wait(EC.visibilityOf(on));
        }

      });
    });
  };

  this.initPreferences = function () {
    this.onWorkspace();
    this.resetFiltering();
    this.closeInfoPanel();
    this.setSortOrder('sortCreated');
    this.setGridView();
  };


  // // delete until everything is gone from the workspace by looking for the empty folder icon
  // var deleteAll = function (type) {
  //
  //   // single click on the first result
  //   var noSelection = element(by.css('.center-panel .no-selection'));
  //   noSelection.isPresent().then(function (value) {
  //     if (!value) {
  //
  //       // select it
  //       var results = element.all(by.css('.center-panel .grid-view .form-box ' + '.' + type));
  //       var createFirst = results.first();
  //       browser.wait(EC.visibilityOf(createFirst));
  //       browser.wait(EC.elementToBeClickable(createFirst));
  //       createFirst.click();
  //
  //       // create more on the toolbar
  //       browser.wait(EC.visibilityOf(createMoreOptionsButton));
  //       browser.wait(EC.elementToBeClickable(createMoreOptionsButton));
  //       createMoreOptionsButton.click();
  //
  //       // delete menu item
  //       browser.wait(EC.visibilityOf(createDeleteResourceButton));
  //       browser.wait(EC.elementToBeClickable(createDeleteResourceButton));
  //       createDeleteResourceButton.click();
  //
  //       // confirm
  //       sweetAlertModal.confirm();
  //       toastyModal.isSuccess();
  //
  //       deleteAll(type);
  //     }
  //   });
  // };
  // this.deleteAll = deleteAll;

  // clear any ongoing search
  var doClear = function () {
    browser.wait(EC.visibilityOf(createSearchNavClearButton));
    browser.wait(EC.elementToBeClickable(createSearchNavClearButton));
    createSearchNavClearButton.click();
    browser.wait(EC.visibilityOf(createBreadcrumbFirstFolder));
  };

  // #workspace-view-container div.form-box-container.selected div.toolbar-right  button
  var doSearch = function (name, type) {
    createSearchNavInput.sendKeys(name + protractor.Key.ENTER);

    // wait for search results to appear
    var result = "Search Results For: '" + name + "'";
    var searchSelector = '.search-result';
    var searchResult = element(by.css(searchSelector));
    browser.wait(EC.textToBePresentInElement(searchResult, result));

    // get the results
    var selector = createResourceInstanceCss + '.' + type;
    var results = element.all(by.css(selector));
    results.count().then(function (count) {
      if (count > 1) {
        console.log('Error: ' + count + ' results for ' + name + ' of type ' + type);
      }
    });
    var createFirst = results.first();
    browser.wait(EC.visibilityOf(createFirst));
    return createFirst;
  };

  var doSelect = function (name, type) {
    var createFirst = doSearch(name, type);
    browser.wait(EC.elementToBeClickable(createFirst));
    createFirst.click();
    return createFirst;
  };


  // search for a particular resource
  this.selectForResource = function (name, type) {
    doSelect(name, type);
  };

  // search for a particular resource
  this.searchForResource = function (name, type) {
    doSearch(name, type);
  };

  this.populateResource = function (name, type) {

    this.doubleClickResource(name, type);

    // on metadata page
    browser.wait(EC.presenceOf(createNavbarMetadata));

    // save this instance and check for success
    browser.wait(EC.visibilityOf(createMetadataButton));
    browser.wait(EC.elementToBeClickable(createMetadataButton));
    createMetadataButton.click();
    toastyModal.isSuccess();

    // return to workspace
    metadataCreatorPage.clickBackArrow();
    // var backArrow = element(by.css('.back-arrow-click'));
    // browser.wait(EC.visibilityOf(backArrow));
    // browser.wait(EC.elementToBeClickable(backArrow));
    // backArrow.click();

  };

  this.clearSearch = function (name, type) {
    doClear(name, type);
  };


  // edit a resource
  this.editResource = function (name, type) {
    var createFirst = doSelect(name, type);

    // create more on the toolbar
    // var moreSelector = '#workspace-view-container div.selected button.more-button';
    // var moreButton = element(by.css(moreSelector));
    var moreButton = createFirst.all(by.css('button.more-button')).get(0);
    browser.wait(EC.visibilityOf(moreButton));
    browser.wait(EC.elementToBeClickable(moreButton));
    moreButton.click();

    // edit menu item
    var editButton = createFirst.all(by.css('ul.dropdown-menu li a.edit')).get(0);
    browser.wait(EC.visibilityOf(editButton));
    browser.wait(EC.elementToBeClickable(editButton));
    editButton.click();
  };

  // move a resource
  this.moveResource = function (name, type) {
    doSelect(name, type);

    // create more on the toolbar
    browser.wait(EC.visibilityOf(createMoreOptionsButton));
    browser.wait(EC.elementToBeClickable(createMoreOptionsButton));
    createMoreOptionsButton.click();

    // move menu item
    browser.wait(EC.visibilityOf(createMoveToResourceButton));
    browser.wait(EC.elementToBeClickable(createMoveToResourceButton));
    createMoveToResourceButton.click();
  };

  // copy a resource using the right-click menu item
  this.copyResource = function (name, type) {
    doSelect(name, type);

    // create more on the toolbar
    browser.wait(EC.visibilityOf(createMoreOptionsButton));
    browser.wait(EC.elementToBeClickable(createMoreOptionsButton));
    createMoreOptionsButton.click();

    // move menu item
    browser.wait(EC.visibilityOf(createCopyResourceButton));
    browser.wait(EC.elementToBeClickable(createCopyResourceButton));
    createCopyResourceButton.click();
  };

  // select a resource
  this.selectResource = function (name, type) {
    return doSelect(name, type);
  };

  // double click the resource
  this.doubleClickResource = function (name, type) {

    var createFirst = doSearch(name, type);
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
    browser.wait(EC.visibilityOf(createLogo));
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
  var logout = function () {
    browser.wait(EC.visibilityOf(createUserDropdownButton), 2000);
    browser.wait(EC.elementToBeClickable(createUserDropdownButton), 2000);
    createUserDropdownButton.click();
    browser.wait(EC.elementToBeClickable(createLogoutMenuItem));
    createLogoutMenuItem.click();
  };
  this.logout = logout;

  // login as the specified user with the given password
  var login = function (username, password) {
    logout();
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
  this.login = login;

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
    browser.wait(EC.visibilityOf(createBreadcrumbFirstFolder));
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

  //
  // deleting resources
  //

  // delete a resource
  var deleteResource = function (name, type) {
    console.log('deleteResource', name, type);
    var createFirst = doSelect(name, type);

    // create more on the toolbar
    var moreButton = createFirst.all(by.css('button.more-button')).get(0);
    browser.wait(EC.visibilityOf(moreButton));
    browser.wait(EC.elementToBeClickable(moreButton));
    moreButton.click();

    var deleteButton = createFirst.all(by.css('ul.dropdown-menu li a.delete')).get(0);
    browser.wait(EC.visibilityOf(deleteButton));
    browser.wait(EC.elementToBeClickable(deleteButton));
    deleteButton.click();

    // confirm
    sweetAlertModal.confirm();
    toastyModal.isSuccess();
    doClear();
  };
  this.deleteResource = deleteResource;

  this.getAllResources = function () {
    console.log('getAllResources');
    var selector = createResourceInstanceCss;
    var results = element.all(by.css(selector));
    results.count().then(function (count) {
      console.log('getAllResources', count);
    });
    browser.wait(EC.visibilityOf(results.first()));
    return results;
  };

  this.deleteResources = function (resources, username) {
    console.log('deleteResources', resources.count());
    var resourceTypeOrder = ['metadata', 'field', 'element', 'template', 'folder'];
    for (var j = 0; j < resourceTypeOrder.length; j++) {
      for (var i = 0; i < resources.length; i++) {
        (function (resource, type, user) {
          if (resource.type == type && resource.username == user) {
            deleteResource(resource.title, resource.type);
          }
        })
        (resources[i], resourceTypeOrder[j], username);
      }
    }
  };

  // delete a resource whose name contains this string if possible
  this.deleteAll = function (value) {
    var resources = value.slice();
    for (var i = 0; i < resources.length; i++) {
      (function (resource) {
        login(resource.username, resource.password);
        deleteResource(resource.title, resource.type);
      })
      (resources[i]);
    }
  };

  // delete a resource whose name contains this string if possible
  this.deleteAllBySearching = function (name, type, user) {
    console.log('deleteAllBySearching', name, type, user);

    var n = name;
    var t = type;
    createSearchNavInput.sendKeys(name + protractor.Key.ENTER);
    var selector = createResourceInstanceCss + '.' + type;
    ;
    var results = element.all(by.css(selector));
    doClear();

    results.count().then(function (count) {
      if (count) {
        for (var i = 0; i < count; i++) {
          (function (name, type) {
            deleteResource(name, type);
          })
          (name, type);
        }
      }
    });
  };


};

module.exports = new WorkspacePage();