'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var testConfig = require('../config/test-env.js');
var _ = require('../libs/lodash.min.js');

var resources = [];
var createResource = function (title, type, username, password) {
  var result = new Object;
  result.title = title;
  result.type = type;
  result.username = username;
  result.password = password;
  return result;
};

/**
 *
 * initialize the workspace by setting the default user preferences
 *
 */
describe('create-folders', function () {
  var EC = protractor.ExpectedConditions;
  var workspacePage = WorkspacePage;
  var template;


  jasmine.getEnv().addReporter(workspacePage.myReporter());

  beforeEach(function () {
  });

  afterEach(function () {
  });

  // reset user selections to defaults
  it('should be on the workspace', function () {
    workspacePage.onWorkspace();
  });


  it("should create a folder", function () {
    template = workspacePage.createFolder('template');
    resources.push(createResource(template, 'template', testConfig.testUser1, testConfig.testPassword1));
  });

  it('should be on the workspace', function () {
    workspacePage.onWorkspace();
  });



  xit('should delete resource from the user workspace', function () {
    resources.push(createResource('Pr111', 'folder', testConfig.testUser1, testConfig.testPassword1));

  });

  it('should delete resource from the user workspace', function () {
    workspacePage.deleteResources(resources);
  });


});

