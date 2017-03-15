'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var _ = require('../libs/lodash.min.js');

/**
 *
 * clean up the workspace by resetting the default user permisisons and deleting any leftover resources
 *
 */
describe('clean-up', function () {
  var EC = protractor.ExpectedConditions;
  var workspacePage;


  // before each test maximize the window area for clicking
  beforeEach(function () {
    workspacePage = WorkspacePage;
    browser.driver.manage().window().maximize();

  });

  afterEach(function () {
  });

  // reset user selections to defaults
  it('should default user selections', function () {
    workspacePage.onWorkspace();
    workspacePage.resetFiltering();
    workspacePage.closeInfoPanel();
    workspacePage.setSortOrder('sortCreated');
  });


  // TODO this does not work if folders contain files which are not deleted first. Those
  // files can belong to other users and are not visible to the logged in user
  // turn this on if you need to clean up the workspace
  // this deletes by searching for resources by type
  // this fails if we have resource inside folders that we cannot write
  xit('should delete any Protractor resource from the user workspace by searching', function () {
    workspacePage.resourceTypes().forEach(function(type) {
      workspacePage.deleteAllBySearching(workspacePage.defaultTitle(), type);
    });
  });

  // this deletes resources without using search
  // but will fail if we have resources inside folders
  xit('should delete any resource from the user workspace', function () {
    workspacePage.resourceTypes().forEach(function(type) {
      workspacePage.deleteAll( type);
    });
  });


});

