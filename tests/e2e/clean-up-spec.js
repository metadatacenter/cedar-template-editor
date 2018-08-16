'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');
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
  var sweetAlertModal = SweetAlertModal;
  jasmine.getEnv().addReporter(workspacePage.myReporter());

  // before each test maximize the window area for clicking
  beforeEach(function () {
  });

  afterEach(function () {
  });

  // reset user selections to defaults
  it('should default user selections for user 1', function () {
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
    workspacePage.initPreferences();
  });

  // reset user selections to defaults
  it('should default user selections for user 2', function () {
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
    workspacePage.initPreferences();
  });

  // reset user selections to defaults
  it('should remove all resources for user 1', function () {
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
    workspacePage.deleteAllBySearching('Protractor', 'metadata', testConfig.testUser1);
    workspacePage.deleteAllBySearching('Protractor', 'field', testConfig.testUser1);
    workspacePage.deleteAllBySearching('Protractor', 'element', testConfig.testUser1);
    workspacePage.deleteAllBySearching('Protractor', 'template', testConfig.testUser1);
  });

  // reset user selections to defaults
  it('should remove all resources for user 2', function () {
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
    workspacePage.deleteAllBySearching('Protractor', 'metadata', testConfig.testUser2);
    workspacePage.deleteAllBySearching('Protractor', 'field', testConfig.testUser2);
    workspacePage.deleteAllBySearching('Protractor', 'element', testConfig.testUser2);
    workspacePage.deleteAllBySearching('Protractor', 'template', testConfig.testUser2);
  });

  // reset user selections to defaults
  it('should remove all folders for user 2', function () {
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
    workspacePage.deleteAllBySearching('Protractor', 'folder', testConfig.testUser2);
  });

  // reset user selections to defaults
  it('should remove all folders for user 1', function () {
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
    workspacePage.deleteAllBySearching('Protractor', 'folder', testConfig.testUser1);
  });



});

