'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var testConfig = require('../config/test-env.js');
var _ = require('../libs/lodash.min.js');

/**
 *
 * initialize the workspace by setting the default user preferences
 *
 */
describe('create-folders', function () {
  var EC = protractor.ExpectedConditions;
  var workspacePage = WorkspacePage;


  // before each test maximize the window area for clicking
  beforeEach(function () {
  });

  afterEach(function () {
  });

  // reset user selections to defaults
  it('should be on the workspace', function () {
    console.log("create-folders should be on the workspace");
    workspacePage.onWorkspace();
  });


  it("should create 100 folders", function () {
    console.log('create-folders should create 100 folders for user 1');
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    // create folder
    for (var i=0;i<100;i++) {
      workspacePage.createFolder('folder' + i);
    }
  });


});

