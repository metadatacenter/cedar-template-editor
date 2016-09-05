'use strict';

require('../pages/workspace-page.js');

var FinderPage = function () {


  var createFinder = element(by.id('finder-modal'));
  var createToolbar = createFinder.element(by.css('.toolbar'));
  var createActions = createFinder.element(by.css('.finder-actions'));
  var createSearchInput =  createFinder.element(by.id('finder-search-input'));
  var createDoSearch =  createFinder.element(by.css('.do-search'));
  var createClearSearch =  createFinder.element(by.css('.clear-search'));
  var createFirstElementGridView = element.all(by.css('#finder-modal .form-box')).first();
  var createFirstElementListView = element.all(by.css('#finder-modal .list-side .box-row')).first();
  var createFirstSelectedElementGridView = createFinder.element(by.css('.form-box-container.selected .form-box'));
  var createFirstSelectedElementListView = createFinder.element(by.css('.list-side .box-row.selected'));
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


  this.createFinder = function() {
    return createFinder;
  };

  this.createSearchInput = function() {
    return createSearchInput;
  };


  this.createDoSearch = function() {
    return createDoSearch;
  };

  this.createFirstElementGridView = function() {
    return createFirstElementGridView;
  };

  this.createFirstElementListView = function() {
    return createFirstElementListView;
  };

  this.createFirstSelectedElementGridView = function() {
    return createFirstSelectedElementGridView;
  };

  this.createFirstSelectedElementListView = function() {
    return createFirstSelectedElementListView;
  };

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


};

module.exports = new FinderPage(); 
