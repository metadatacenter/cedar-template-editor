'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var testConfig = require('../config/test-env.js');
var _ = require('../libs/lodash.min.js');

/**
 *
 * initialize the workspace by setting the default user preferences
 *
 */
describe('clean-up', function () {
  var EC = protractor.ExpectedConditions;
  var workspacePage = WorkspacePage;


  // before each test maximize the window area for clicking
  beforeEach(function () {
  });

  afterEach(function () {
  });

  // reset user selections to defaults
  it('should be on the workspace', function () {
    console.log("clean-up should be on the workspace - hello");
    workspacePage.onWorkspace();
  });

  // reset user selections to defaults
  it('should default user selections for user 2', function () {
    console.log("clean-up should default user selections for user 2");
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
    workspacePage.initPreferences();
  });

  // reset user selections to defaults
  it('should default user selections for user 1', function () {
    console.log("clean-up should default user selections for user 1");
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
    workspacePage.initPreferences();
  });


});

