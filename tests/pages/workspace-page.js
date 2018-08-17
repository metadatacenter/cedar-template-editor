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
      var createFilterOptions = element(by.css('#sidebar-left  div.filter-options'));
      var createShares = element(by.css('#sidebar-left  div.filter-options div.shares'));
      var createWorkspaceLink = element(by.css('#sidebar-left  div.filter-options  div.shares  a.share.workspace'));
      var createSharedWithMeLink = element(by.css('#sidebar-left > div.filter-options > div.shares > a.share.shared'));


      // search navigation
      var createSearchNav = element(by.css('#search'));
      var createSearchNavInput = element(by.model('hc.searchTerm'));
      var createSearchNavClearButton = element(by.css('#headerCtrl a.clear.clear-search'));


      // resources
      var folders = element.all(by.css('.center-panel .populate-form-boxes .form-box .folder'));
      var createFirstFolder = folders.first();
      var elements = element.all(by.css('.center-panel populate-form-boxes .form-box .element'));
      var createFirstElement = elements.first();
      var templates = element.all(by.css('.center-panel populate-form-boxes .form-box .template'));
      var createFirstTemplate = templates.first();
      var createFirstCss = '.center-panel populate-form-boxes .form-box .';

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
      var infoPanelTabs = element(by.css('#sidebar-right .element-toggles'));
      var infoPanelTitle = element(by.css('#sidebar-right div.flex div.title span'));

      var createSortDropdownButton = element(by.css('#workspace-sort-tool > div > button'));
      var createUserDropdownButton = element(by.css('#user-menu-dropdown-trigger'));
      var createProfileMenuItem = element(by.css('#user-profile-tool'));
      var createLogoutMenuItem = element(by.css('#user-logout-tool'));
      var createListView = element(by.css('li.grid-view > button'));
      var createGridView = element(by.css('li.list-view > button'));


      // details panel
      var createDetailsPanel = element(by.id('sidebar-right'));
      var createDetailsPanelTitle = createDetailsPanel.element(by.css('.title span'));
      var createDetailsPanelOwner = createDetailsPanel.element(by.css('.owner-name'));
      var createDetailsPanelPath = createDetailsPanel.element(by.css('.parent-path'));
      var createDetailsPanelUpdated = createDetailsPanel.element(by.css('.created-date'));
      var createDetailsPanelCreated = createDetailsPanel.element(by.css('.updated-name'));
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


      // create new buttons left side bar
      var createButton = element(by.id('button-create'));
      var createFolderButton = element(by.css('#sidebar-left > div.compose-options.add-new > div > ul > li:nth-child(1) > a'));
      var createFieldButton = element(by.css('#sidebar-left > div.compose-options.add-new > div > ul > li:nth-child(2) > a'));
      var createElementButton = element(by.css('#sidebar-left > div.compose-options.add-new > div > ul > li:nth-child(3) > a'));
      var createTemplateButton = element(by.css('#sidebar-left > div.compose-options.add-new > div > ul > li:nth-child(4) > a'));

      // create  buttons top nav
      // var createButton = element(by.css('#compose-options button.button-create'));
      // var createTemplateButton = element(by.css('li.button-create-template'));
      // var createFieldButton = element(by.css('li.button-create-field'));
      // var createElementButton = element(by.css('li.button-create-element'));
      // var createFolderButton = element(by.css('li.button-create-folder'));

      var createResourceButtons = {
        "template": createTemplateButton,
        "element" : createElementButton,
        "folder"  : createFolderButton,
        "field"   : createFieldButton
      };

      // main center panel
      var createCenterPanel = element(by.id('center-panel'));
      var createMetadataButton = element(by.id('button-save-metadata'));

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


      var messagingButton = element(by.id('messaging'));
      var messagingReport = element(by.id('messaging-report'));
      var messagingBackArrow = element(by.css('#messaging-report div.back-arrow-click'));
      var userMenuButton = element(by.id('user-menu'));
      var userProfileButton = element(by.id('user-profile-tool'));
      var userProfileReport = element(by.id('profile'));
      var userProfileBackButton = element(by.css('#profile div.back-arrow-click'));


      this.myReporter = function () {
        var reporter = {
          specDone: function (result) {
            console.log(result.fullName + '...' + result.status);
          }
        };
        return reporter;
      };


      this.createSidebarLeft = function () {
        return createSidebarLeft;
      };

      this.createFilterOptions = function () {
        return createFilterOptions;
      };

      this.createShares = function () {
        return createShares;
      };

      this.createWorkspaceLink = function () {
        return createWorkspaceLink;
      };

      this.createSharedWithMeLink = function () {
        return createSharedWithMeLink;
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

      this.infoPanelTabs = function () {
        return infoPanelTabs;
      };

      this.infoPanelTitle = function () {
        return infoPanelTitle;
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


      this.clickSharedWithMe = function () {
        browser.wait(EC.elementToBeClickable(sharedWithMe));
        sharedWithMe.click();
      };

      this.hasLogo = function () {
        browser.wait(EC.visibilityOf(createLogo));
      };

      this.hasBreadcrumb = function () {
        browser.wait(EC.visibilityOf(createBreadcrumb));
      };

      this.hasCreateNew = function () {
        browser.wait(EC.visibilityOf(createButton));
      };

      this.hasSearchNav = function () {
        browser.wait(EC.visibilityOf(createSearchNav));
      };

      this.hasMessaging = function () {
        browser.wait(EC.visibilityOf(messagingButton));
      };

      this.openMessaging = function () {
        browser.wait(EC.visibilityOf(messagingButton));
        messagingButton.click();
        browser.wait(EC.visibilityOf(messagingReport));
      };

      this.closeMessaging = function () {
        browser.wait(EC.visibilityOf(messagingBackArrow));
        messagingBackArrow.click();
      };

      this.hasMessagingReport = function () {
        browser.wait(EC.visibilityOf(messagingReport));
      };

      this.hasUserMenu = function () {
        browser.wait(EC.visibilityOf(userMenuButton));
      };

      this.openUserProfile = function () {
        browser.wait(EC.visibilityOf(userMenuButton));
        browser.wait(EC.elementToBeClickable(userMenuButton));
        userMenuButton.click();

        browser.wait(EC.visibilityOf(userProfileButton));
        browser.wait(EC.elementToBeClickable(userProfileButton));
        userProfileButton.click();

        browser.wait(EC.visibilityOf(userProfileReport));
      };

      this.closeUserProfile = function () {
        browser.wait(EC.visibilityOf(userProfileBackButton));
        browser.wait(EC.elementToBeClickable(userProfileBackButton));
        userProfileBackButton.click();
      };

      var createPage = function (type, title, description) {
        console.log('createPage',type);

        browser.wait(EC.visibilityOf(createButton));
        browser.wait(EC.elementToBeClickable(createButton));
        createButton.click();

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
      this.createPage = createPage;

      // create a template or folder resource and set the title, return to the workspace
      this.createResource = function (type, title, description) {
        console.log('createResource',type);

        if (type != 'folder') {


          createPage(type, title, description);

          templateCreatorPage.clickSave(type);
          toastyModal.isSuccess();
          templateCreatorPage.clickBackArrow();


        } else {

          browser.wait(EC.visibilityOf(createButton));
          browser.wait(EC.elementToBeClickable(createButton));
          createButton.click();

          var button = createResourceButtons[type];
          browser.wait(EC.visibilityOf(button));
          browser.wait(EC.elementToBeClickable(button));
          button.click();

          browser.wait(EC.visibilityOf(createFolderModal));
          if (title) {
            createFolderName.sendKeys(title);
          }
          browser.wait(EC.elementToBeClickable(createFolderSubmitButton));
          createFolderSubmitButton.click();
          toastyModal.isSuccess();

        }
        ;
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
        console.log('createTemplate',name);
        var templateTitle = this.createTitle(name);
        var templateDescription = this.createDescription(name);
        this.createResource('template', templateTitle, templateDescription);
        return templateTitle;
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





      // owner name


      var setView = function (view) {
        var current = view == 'grid' ? element(by.css('#grid-view-tool.grid-view')) : element(
            by.css('#grid-view-tool.list-view'));
        current.isPresent().then(function (result) {
          if (!result) {
            var link = element(by.css('#grid-view-tool'));
            browser.wait(EC.visibilityOf(link));
            browser.wait(EC.elementToBeClickable(link));
            link.click();
          }
        });
      };
      this.setView = setView;

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
        this.openInfoPanel();
        this.setSortOrder('sortCreated');
        this.setView('list');
      };

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
            console.log('Warning: ' + count + ' results for ' + name + ' of type ' + type);
          }
        });
        //var createFirst = results.first();
        //browser.wait(EC.visibilityOf(createFirst));
        return results.get(0);
      };

      var doSelect = function (name, type) {
        var createFirst = doSearch(name, type);
        browser.wait(EC.elementToBeClickable(createFirst));
        createFirst.click();
        return createFirst;
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

      this.clearSearch = function () {
        doClear();
      };


      // edit a resource
      this.editResource = function (name, type) {
        var createFirst = doSelect(name, type);

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
        var createFirst = doSelect(name, type);

        var moreButton = createFirst.all(by.css('button.more-button')).get(0);
        browser.wait(EC.visibilityOf(moreButton));
        browser.wait(EC.elementToBeClickable(moreButton));
        moreButton.click();

        // edit menu item
        var editButton = createFirst.all(by.css('ul.dropdown-menu li a.move')).get(0);
        browser.wait(EC.visibilityOf(editButton));
        browser.wait(EC.elementToBeClickable(editButton));
        editButton.click();
      };


// copy a resource using the right-click menu item
      this.copyResource = function (name, type) {
        var createFirst = doSelect(name, type);

        var moreButton = createFirst.all(by.css('button.more-button')).get(0);
        browser.wait(EC.visibilityOf(moreButton));
        browser.wait(EC.elementToBeClickable(moreButton));
        moreButton.click();

        // edit menu item
        var editButton = createFirst.all(by.css('ul.dropdown-menu li a.copy')).get(0);
        browser.wait(EC.visibilityOf(editButton));
        browser.wait(EC.elementToBeClickable(editButton));
        editButton.click();
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


      this.hasWorkspace = function () {
        //#sidebar-left > div.filter-options > div.shares > a.share.workspace.ng-scope.active
        // #sidebar-left > div.filter-options > div.shares > a.share.workspace
        browser.wait(EC.visibilityOf(createWorkspaceLink));
      };

      this.hasSharedWithMe = function () {
        browser.wait(EC.visibilityOf(createSharedWithMeLink));
      };


// click on the workspace link
      this.clickWorkspace = function () {
        browser.wait(EC.visibilityOf(createWorkspaceLink));
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
        browser.actions().doubleClick(userFolder);
        createBreadcrumbUserName.getText().then(function (text) {
          console.log('navigateToUserFolder', text);
        });
      };

//
//   sharing resources
//

// open share modal
      this.shareResource = function (name, type) {


        var createFirst = doSelect(name, type);
        var moreButtons;
        var shareButtons;

        // create more on the toolbar
        moreButtons = createFirst.all(by.css('button.more-button'));
        moreButtons.count().then(function (count) {


          if (count > 0) {

            var moreButton = moreButtons.get(0);
            browser.wait(EC.visibilityOf(moreButton));
            browser.wait(EC.elementToBeClickable(moreButton));
            moreButton.click();

            shareButtons = createFirst.all(by.css('ul.dropdown-menu li a.share'));
            shareButtons.count().then(function (count) {


              if (count > 0) {

                var shareButton = shareButtons.get(0);

                browser.wait(EC.visibilityOf(shareButton));
                browser.wait(EC.elementToBeClickable(shareButton));
                shareButton.click();

              } else {
                console.log("Error: shareResource shareButton not found", count);
              }
            });
          } else {
            console.log("Error: shareResource moreButton not found", count);
          }
        });

      };


// open the share dialog of the given resource via the right-click menu item
      this.moveShareDisabled = function (name, type) {
        var createFirst = doSelect(name, type);
        var moreButtons;
        var moveButtons;
        var shareButtons;

        // create more on the toolbar
        moreButtons = createFirst.all(by.css('button.more-button'));
        moreButtons.count().then(function (count) {

          if (count) {
            var moreButton = moreButtons.get(0);
            browser.wait(EC.visibilityOf(moreButton));
            browser.wait(EC.elementToBeClickable(moreButton));
            moreButton.click();

            moveButtons = createFirst.all(by.css('ul.dropdown-menu li a.move.link-disabled'));
            moveButtons.count().then(function (count) {

              if (count) {

                var moveButton = moveButtons.get(0);
                browser.wait(EC.visibilityOf(moveButton));
                browser.wait(EC.elementToBeClickable(moveButton));

                shareButtons = createFirst.all(by.css('ul.dropdown-menu li a.share.link-disabled'));
                shareButtons.count().then(function (count) {

                  if (count) {

                    var shareButton = shareButtons.get(0);
                    browser.wait(EC.visibilityOf(shareButton));
                    browser.wait(EC.elementToBeClickable(shareButton));

                    moreButton.click();

                  } console.log("Error: shareAndDeleteEnabled shareButton not found", count);

                });


              } console.log("Error: shareAndDeleteEnabled deleteButton not found", count);

            });
          } console.log("Error: shareAndDeleteEnabled moreButton not found", count);
        });
      };

      this.moveShareEnabled = function (name, type) {
        var createFirst = doSelect(name, type);
        var moreButtons = createFirst.all(by.css('button.more-button'));
        var moveButtons = createFirst.all(by.css('ul.dropdown-menu li a.move'));
        var shareButtons = createFirst.all(by.css('ul.dropdown-menu li a.share'));

        // create more on the toolbar
        var moreButton = moreButtons.get(0);
        browser.wait(EC.visibilityOf(moreButton));
        browser.wait(EC.elementToBeClickable(moreButton));
        moreButton.click();

        var moveButton = moveButtons.get(0);
        browser.wait(EC.visibilityOf(moveButton));
        browser.wait(EC.elementToBeClickable(moveButton));

        var shareButton = shareButtons.get(0);
        browser.wait(EC.visibilityOf(shareButton));
        browser.wait(EC.elementToBeClickable(shareButton));
      };

      this.shareAndDeleteEnabled = function (name, type) {
        var createFirst = doSelect(name, type);
        var moreButtons = createFirst.all(by.css('button.more-button'));
        var deleteButtons = createFirst.all(by.css('ul.dropdown-menu li a.delete'));
        var shareButtons = createFirst.all(by.css('ul.dropdown-menu li a.share'));

        // create more on the toolbar
        var moreButton = moreButtons.get(0);
        browser.wait(EC.visibilityOf(moreButton));
        browser.wait(EC.elementToBeClickable(moreButton));
        moreButton.click();

        var deleteButton = deleteButtons.get(0);
        browser.wait(EC.visibilityOf(deleteButton));
        browser.wait(EC.elementToBeClickable(deleteButton));

        var shareButton = shareButtons.get(0);
        browser.wait(EC.visibilityOf(shareButton));
        browser.wait(EC.elementToBeClickable(shareButton));
      };

//
// deleting resources
//

      var openInfoPanel = function () {
        createSidebarRight.isPresent().then(function (result) {
          if (!result) {
            browser.wait(EC.visibilityOf(createShowDetailsButton));
            browser.wait(EC.elementToBeClickable(createShowDetailsButton));
            createShowDetailsButton.click();
            browser.wait(EC.visibilityOf(infoPanelTabs));
          }
        });
      };
      this.openInfoPanel = openInfoPanel;

      var getOwner = function () {
        return createDetailsPanelOwner.getText();
      };
      this.getOwner = getOwner;

      var isInfoPanelTitle = function (name) {
        expect(createDetailsPanelTitle.isPresent()).toBe(true);
        expect(createDetailsPanelTitle.getText()).toBe(name);
      };
      this.isInfoPanelTitle = isInfoPanelTitle;

      var isInfoPanelPath = function (path) {
        expect(createDetailsPanelPath.isPresent()).toBe(true);
        expect(createDetailsPanelPath.getText()).toBe(path);
      };
      this.isInfoPanelPath = isInfoPanelPath;

      var getPermission = function (prop) {
        var props = {
          'read' : '#resource-info span.can-read',
          'write': '#resource-info  span.can-write',
          'owner': '#resource-info  span.can-change-owner'
        };
        return element.all(by.css(props[prop]));
      };
      this.getPermission = getPermission;

      // delete a resource
      var deleteResource = function (name, type) {


        var createFirst = doSelect(name, type);
        var moreButtons;
        var deleteButtons;

        openInfoPanel();
        getPermission('write').count().then(function (count) {
          if (count) {

            // create more on the toolbar
            moreButtons = createFirst.all(by.css('button.more-button'));
            moreButtons.count().then(function (count) {

              if (count) {
                var moreButton = moreButtons.get(0);
                browser.wait(EC.visibilityOf(moreButton));
                browser.wait(EC.elementToBeClickable(moreButton));
                moreButton.click();

                deleteButtons = createFirst.all(by.css('ul.dropdown-menu li a.delete'));
                deleteButtons.count().then(function (count) {

                  if (count) {

                    var deleteButton = deleteButtons.get(0);

                    browser.wait(EC.visibilityOf(deleteButton));
                    browser.wait(EC.elementToBeClickable(deleteButton));
                    deleteButton.click();

                    console.log('deleteResource', name, type);

                    // confirm
                    sweetAlertModal.confirm();
                    toastyModal.isSuccess();
                    doClear();
                  } else {
                    console.log("Error: deleteResource deleteButton not found", count);
                  }
                });
              } else {
                console.log("Error: deleteResource moreButton not found", count);
              }
            });
          } else {
            console.log('Error: no write permission',name,type);
          }
        });
      };
      this.deleteResource = deleteResource;


      this.deleteResources = function (resources) {
        var resourceTypeOrder = ['metadata', 'field', 'element', 'template', 'folder'];
        for (var j = 0; j < resourceTypeOrder.length; j++) {
          for (var i = 0; i < resources.length; i++) {
            (function (resource, type) {
              if (resource.type == type) {
                console.log('deleteResources', resource.title, resource.type, resource.username);
                login(resource.username, resource.password);
                deleteResource(resource.title, resource.type);
              }
            })
            (resources[i], resourceTypeOrder[j]);
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
        var n = name;
        var t = type;

        createSearchNavInput.sendKeys(name + protractor.Key.ENTER);

        // wait for search results to appear
        var result = "Search Results For: '" + name + "'";
        var searchSelector = '.search-result';
        var searchResult = element(by.css(searchSelector));
        browser.wait(EC.textToBePresentInElement(searchResult, result));

        // get the results
        var selector = createResourceInstanceCss + '.' + type;
        var results = element.all(by.css(selector));

        doClear();
        results.count().then(function (count) {
          console.log('deleteAllBySearching', name, type, user, count);
          for (var i = 0; i < count; i++) {
            (function (name, type) {
              deleteResource(name, type);
            })
            (name, type);
          }
        });
      };


    }
;

module.exports = new WorkspacePage();