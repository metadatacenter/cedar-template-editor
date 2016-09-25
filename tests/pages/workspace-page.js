'use strict';

require('../pages/template-creator-page.js');


var WorkspacePage = function () {
  //var url = 'https://cedar.metadatacenter.orgx/dashboard';
  var testConfig = require('../config/test-env.js');
  var url = testConfig.baseUrl + '/dashboard';
  var EC = protractor.ExpectedConditions;

  // header
  var createTopNavigation = element(by.id('top-navigation'));
  var createLogo = createTopNavigation.element(by.css('.navbar-brand'));
  var createPageName = element(by.css('#top-navigation.dashboard'));
  var createMetadataPage = element(by.css('#top-navigation.metadata'));

  // search nav
  var createSearchNav = element(by.css('#top-navigation  .nav-search'));
  var createSearchNavForm = element(by.css('#top-navigation  .nav-search form'));
  var createSearchNavInput = element(by.model('hc.searchTerm'));
  var createSearchNavSearchButton = element(by.css('#top-navigation .nav-search form a.do-search'));
  var createSearchNavClearButton = element(by.css('#top-navigation .nav-search form a.clear-search'));
  var createTopNavWorkspace = element(by.css('.navbar.metadata'));
  var createFirstSelected = element(by.css('.form-box-container.selected'));

  // toolbar
  var createToolbar = element(by.id('workspace-toolbar'));
  var createTrashButton = createToolbar.element(by.css('#delete-tool button[tooltip="delete selection"]'));
  var createMoreOptionsButton = createToolbar.element(by.css('#more-options-tool > div > button'));
  var createEditResourceButton = createToolbar.element(by.css('#more-options-tool [ng-click="dc.editResource()"]'));
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
  var createLogoutMenuItem = createToolbar.element(by.css('#user-tool #user-logoout-tool a'));
  var trashTooltip = 'delete selection';

  var createListView = element(by.css('.center-panel .list-view'));
  var createGridView = element(by.css('.center-panel .grid-view'));


  // breadcrumbs
  var createBreadcrumb = element(by.css('.breadcrumbs-sb'));
  var createBreadcrumbFolders = element(by.css('.breadcrumbs-sb')).all(by.repeater('folder in dc.pathInfo'));
  var createBreadcrumbSearch = element(by.css('.breadcrumbs-sb .search-result'));

  // create new
  var createNewButton = element(by.css('.add-new button#button-create'));
  var createNewTemplateButton = element(by.css('.add-new button#button-create-template'));
  var createNewElementButton = element(by.css('.add-new button#button-create-element '));
  var createNewFolderButton = element(by.css('.add-new button#button-create-folder'));

  // create folder modal
  var createFolderModal = element(by.id('newFolderModal'));
  var createFolderName = createFolderModal.element(by.model('dc.folder.name'));
  var createFolderSubmitButton = createFolderModal.element(by.css('div.modal-footer button.confirm'));
  var testFolderName = 'f';
  var testFolderDescription = 'd';
  var sampleTemplateTitle = 't';
  var sampleTemplateDescription = 't';
  var sampleElementTitle = 's';
  var sampleElementDescription = 's';

  // toasty messages
  var createToastyConfirmationPopup = element(by.id('toasty')).element(by.css('.toasty-type-success'));
  var createToastyMessageText = element(by.id('toasty')).element(by.css('.toast')).element(by.css('.toast-msg'));

  var toastyFolderMessage = "The folder ";
  var toastyTemplateMessage = "The template ";
  var toastyElementMessage = "The element ";
  var toastyMessage = "The ";
  var toastyMessageCreated = " has been created.";
  var toastyMessageDeleted = " has been deleted.";

  // sweet alert confirmation modals
  var createConfirmationDialog = element(by.css('.sweet-alert'));
  var sweetAlertCancelAttribute = 'data-has-cancel-button';
  var sweetAlertConfirmAttribute = 'data-has-confirm-button';
  var createSweetAlertCancelButton = element(by.css('.sweet-alert')).element(by.css('.sa-button-container')).element(by.css('.cancel'));
  var createSweetAlertConfirmButton = element(by.css('.sweet-alert')).element(by.css('.sa-button-container')).element(by.css('.confirm'));

  // contents of workspace
  var createFirstFolder = element.all(by.css('.center-panel .grid-view .form-box .folder')).first();
  var createFirstElement = element.all(by.css('.center-panel .grid-view .form-box .element')).first();
  var createFirstTemplate = element.all(by.css('.center-panel .grid-view .form-box .template')).first();
  var createFirstCss = '.center-panel .grid-view .form-box .';
  var folderType = 'folder';
  var templateType = 'template';
  var elementType = 'element';
  var metadataType = 'metadata';


  this.get = function () {
    browser.get(url);
    //browser.sleep(1000);
  };

  this.test = function () {
    console.log('workspace page test ');
  };

  this.isDashboard = function () {
    var deferred = protractor.promise.defer();
    isReady(createPageName).then(function () {
      deferred.fulfill(true);
    });
    return deferred.promise;
  };

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
  this.createSearchNavText = function () {
    return createSearchNavInput.getText();
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
  this.createNew = function () {
    return createNewButton;
  };

  this.createNewTemplateButton = function () {
    return createNewTemplateButton;
  };

  // create a new template
  this.createTemplate = function () {
    browser.actions().mouseMove(createNewButton).perform();
    createNewTemplateButton.click();
    return require('./template-creator-page.js');
  };

  // create a new element
  this.createElement = function () {
    browser.actions().mouseMove(createNewButton).perform();
    createNewElementButton.click();
    browser.sleep(1000);
    return require('./template-creator-page.js');
  };

  var getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  };

  this.createRandomFolderName = function () {
    return testFolderName + getRandomInt(1, 9999);
  };
  this.sampleTemplateTitle = function () {
    return sampleTemplateTitle;
  };

  this.sampleTemplateDescription = function () {
    return sampleTemplateDescription;
  };

  this.sampleElementTitle = function () {
    return sampleElementTitle;
  };
  this.sampleElementDescription = function () {
    return sampleElementDescription;
  };

  this.createToastyConfirmationPopup = function () {
    return createToastyConfirmationPopup;
  };
  this.createToastyMessageText = function () {
    return createToastyMessageText;
  };
  this.toastyFolderMessage = function () {
    return toastyFolderMessage;
  };
  this.toastyMessageCreated = function () {
    return toastyMessageCreated;
  };

  // create a new folder with name
  this.createFolder = function (name) {
    var deferred = protractor.promise.defer();
    var EC = protractor.ExpectedConditions;

    isReady(createNewButton).then(function () {
      browser.actions().mouseMove(createNewButton).perform();
      isReady(createNewFolderButton).then(function () {
        createNewFolderButton.click();
        isReady(createFolderModal).then(function () {

          // give it a folder name
          createFolderName.sendKeys(name);
          browser.wait(EC.elementToBeClickable(createFolderSubmitButton)).then(function () {
            createFolderSubmitButton.click();

            isReady(createToastyConfirmationPopup).then(function () {
              createToastyMessageText.getText().then(function (value) {
                var result = value.indexOf(toastyFolderMessage + name + toastyMessageCreated) !== -1;
                browser.wait(EC.not(EC.presenceOf(createToastyConfirmationPopup))).then(function () {
                  deferred.fulfill(result);
                });
              });
            });
          });
        });
      });
    });

    return deferred.promise;
  };

// delete a resource by name
  this.deleteResource = function (name, type) {

    var deferred = protractor.promise.defer();

    // search for the name
    isReady(createSearchNavInput).then(function () {
      browser.wait(EC.elementToBeClickable(createSearchNavInput)).then(function () {
        createSearchNavInput.sendKeys(name).sendKeys(protractor.Key.ENTER).then(function () {

          // wait for search results to show in the breadcrumb
          isReady(createBreadcrumbSearch).then(function () {
            browser.sleep(2000);  // TODO not correctly waiting for search to return

            // select the first result
            var createFirst = element.all(by.css(createFirstCss + type)).first();
            isReady(createFirst).then(function () {

              browser.wait(EC.elementToBeClickable(createFirst)).then(function () {
                createFirst.click().then(function () {

                  // wait for a selected item and the trash button
                  isReady(createFirstSelected).then(function () {

                    isReady(createTrashButton).then(function () {

                      browser.wait(EC.elementToBeClickable(createTrashButton)).then(function () {
                        createTrashButton.click().then(function () {

                          isReady(createConfirmationDialog).then(function () {

                            expect(createConfirmationDialog.getAttribute(sweetAlertCancelAttribute)).toBe('true');
                            expect(createConfirmationDialog.getAttribute(sweetAlertConfirmAttribute)).toBe('true');

                            isReady(createSweetAlertConfirmButton).then(function () {
                              //browser.sleep(1000);

                              browser.wait(EC.elementToBeClickable(createSweetAlertConfirmButton)).then(function () {
                                browser.sleep(1000); // TODO animation needs to be turned off

                                createSweetAlertConfirmButton.click().then(function () {

                                  isReady(createToastyConfirmationPopup).then(function () {
                                    //browser.sleep(1000);

                                    isReady(createToastyMessageText).then(function () {
                                      createToastyMessageText.getText().then(function (value) {
                                        var result = value.indexOf(toastyMessage + name + toastyMessageDeleted) !== -1;
                                        browser.wait(EC.not(EC.presenceOf(createToastyConfirmationPopup))).then(function () {
                                          deferred.fulfill(result);
                                        });
                                      });
                                    });
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });

    return deferred.promise;

  };

  this.selectFolder = function (name) {
    var deferred = protractor.promise.defer();

    // search for the resource
    createSearchNavInput.sendKeys(name).sendKeys(protractor.Key.ENTER);
    isReady(createBreadcrumbSearch).then(function () {

      // select the first result
      isReady(createFirstTemplate).then(function () {
        createFirstFolder.click();
        deferred.fulfill(true);
      });
    });


    return deferred.promise;
  };


// open the template by title
  this.openTemplate = function (name) {
    var deferred = protractor.promise.defer();

    // search for the folder
    createSearchNavInput.sendKeys(name).sendKeys(protractor.Key.ENTER).then(function () {
      isReady(createBreadcrumbSearch).then(function () {

        // select the first result
        isReady(createFirstTemplate).then(function () {
          createFirstTemplate.click().then(function () {

            // double click the resource to create metadata
            isReady(createFirstSelected).then(function () {

              browser.actions().doubleClick(createFirstTemplate).perform().then(function () {

                // wait until metadata page is displayed
                isReady(createMetadataPage).then(function () {

                  deferred.fulfill(true);
                });
              });
            });
          });
        });
      });
    });

    return deferred.promise;
  };


// open folder by the index in the breadcrumb
  this.openFolder = function (index) {
    var folders = createBreadcrumbFolders;
    var link = folders.get(index).element(by.tagName('a'));
    expect(link.isDisplayed()).toBe(true);
    link.click();
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
  this.createConfirmationDialog = function () {
    return createConfirmationDialog;
  };
  this.sweetAlertConfirmAttribute = function () {
    return sweetAlertConfirmAttribute;
  };
  this.sweetAlertCancelAttribute = function () {
    return sweetAlertCancelAttribute;
  };
  this.createSweetAlertCancelButton = function () {
    return createSweetAlertCancelButton;
  };
  this.createSweetAlertConfirmButton = function () {
    return createSweetAlertConfirmButton;
  };
  this.createBreadcrumbSearch = function () {
    return createBreadcrumbSearch;
  };

  this.selectGridView = function () {
    createListView.isPresent().then(function (isList) {
      if (isList) {
        createGridViewButton.click();
      }
    });
  };

  var isReady = function (elm) {
    var deferred = protractor.promise.defer();

    browser.wait(elm.isPresent()).then(function () {
      browser.wait(elm.isDisplayed()).then(function () {
        deferred.fulfill(true);
      });
    });

    return deferred.promise;
  };

  this.isReady = function (elm) {
    var deferred = protractor.promise.defer();

    browser.wait(elm.isPresent()).then(function () {
      browser.wait(elm.isDisplayed()).then(function () {
        deferred.fulfill(true);
      });
    });

    return deferred.promise;
  };

};

module.exports = new WorkspacePage();
