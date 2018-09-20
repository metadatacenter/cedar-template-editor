'use strict';

//require('../pages/workspace-page.js');

var FinderModal = function () {


  var EC = protractor.ExpectedConditions;

  var createFinder = element(by.id('finder-modal'));
  var createToolbar = createFinder.element(by.css('.toolbar'));
  var createActions = createFinder.element(by.css('.finder-actions'));
  var createSearchInput =  createFinder.element(by.id('finder-search-input'));
  var createDoSearch =  createFinder.element(by.css('.do-search'));
  var createClearSearch =  createFinder.element(by.css('.clear-search'));
  var createFirstElement = createFinder.all(by.css('[ng-dblclick="finder.openResource(resource)"]')).first();
  var searchField = element(by.css('#finder-modal .modal-header input.form-control.search-input'));
  var createOpenButton = createActions.element(by.css('.clear-save .btn-save'));
  var createCancelButton = createActions.element(by.css('.clear-save .btn-clear'));
  var createGridViewButton = createFinder.element(by.css('.toolbar .tool.grid-view'));
  var createListViewButton = createFinder.element(by.css('.toolbar .tool.list-view'));
  var createSearchResult = createFinder.element(by.css('.toolbar .search-result'));
  var createListView = createFinder.element(by.css('.modal-body .list-view'));
  var createGridView = createFinder.element(by.css('.modal-body .grid-view'));
  var cssSearchInput = 'finder-search-input';


  this.test = function () {
    console.log('finder page test');
  };

  this.isFinder = function () {
    return createFinder.isDisplayed();
  };

  this.onFinder = function () {
    browser.wait(EC.presenceOf(createFinder));
  };

  this.createFinder = function() {
    return createFinder;
  };

  this.createSearchInput = function() {
    return createSearchInput;
  };


  this.createDoSearch = function() {
    return createDoSearch;
  };

  this.createClearSearch = function() {
    return createClearSearch;
  };

  // this.createFirstElementGridView = function() {
  //   return createFirstElementGridView;
  // };
  //
  // this.createFirstElementListView = function() {
  //   return createFirstElementListView;
  // };
  //
  // this.createFirstSelectedElementGridView = function() {
  //   return createFirstSelectedElementGridView;
  // };
  //
  // this.createFirstSelectedElementListView = function() {
  //   return createFirstSelectedElementListView;
  // };

  this.cssSearchInput = function() {
    return cssSearchInput;
  };

  this.createOpenButton = function() {
    return createOpenButton;
  };

  this.createCancelButton = function() {
    return createCancelButton;
  };

  this.createGridView = function() {
    return createGridView;
  };

  this.createListView = function() {
    return createListView;
  };

  this.createGridViewButton = function() {
    return createGridViewButton;
  };

  this.createListViewButton = function() {
    return createListViewButton;
  };

  this.createSearchResult = function() {
    return createSearchResult;
  };

  this.selectGridView = function() {
    createListView.isPresent().then(function (isList) {
      if (isList) {
        createGridViewButton.click();
      }
    });
  };

  // look for the first toast to be a success
  this.clearSearch = function () {

    browser.wait(EC.visibilityOf(createClearSearch));
    browser.wait(EC.elementToBeClickable(createClearSearch));
    createClearSearch.click();

  };


  // look for the first toast to be a success
  this.addFirstElement = function (name) {

    searchField.sendKeys(name);

    var doSearch = element(by.css('a.do-search'));
    browser.wait(EC.elementToBeClickable(doSearch));
    doSearch.click();

    browser.wait(EC.visibilityOf(createFirstElement));
    browser.wait(EC.elementToBeClickable(createFirstElement));
    browser.actions().doubleClick(createFirstElement).perform();

  };



};

module.exports = new FinderModal(); 
