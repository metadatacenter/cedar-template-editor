'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var _ = require('../libs/lodash.min.js');

/**
 *
 * clean up the workspace by resetting the default user permisisons and deleting any leftover resources
 *
 */
xdescribe('clean-up', function () {
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
  // TODO turn this on once we have updated staging
  xit('should default user selections', function () {
    workspacePage.resetFiltering();
    workspacePage.closeInfoPanel();
    workspacePage.setSortOrder('sortCreated');
  });

  // turn this on if you need to clean up the workspace
  // this deletes by searching for resources by type
  // this fails if we have resource inside folders that we cannot write
  it('should delete any Protractor resource from the user workspace by searching', function () {
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

