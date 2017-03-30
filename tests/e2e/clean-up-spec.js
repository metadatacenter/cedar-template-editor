'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var testConfig = require('../config/test-env.js');
var MoveModal = require('../modals/move-modal.js');

var _ = require('../libs/lodash.min.js');

/**
 *
 * clean up the workspace by resetting the default user permisisons and deleting any leftover resources
 *
 */
describe('clean-up', function () {
  var EC = protractor.ExpectedConditions;
  var workspacePage = WorkspacePage;
  var toastyModal = ToastyModal;
  var moveModal = MoveModal;
  var resourceTypes = [ 'metadata', 'template', 'element', 'folder'];
  //var resourceTypes = [ 'folder'];
  var max = 0;

  var resourcesUser1 = [];
  var resourcesUser2 = [];


  // before each test maximize the window area for clicking
  beforeEach(function () {
  });

  afterEach(function () {
  });

  // reset user selections to defaults
  it('should be on the workspace', function () {
    workspacePage.onWorkspace();
  });

  it("should move a folder owned by current user to a writable folder", function () {
    // create source and target folders
    var sourceFolder = workspacePage.createFolder('Source');
    var targetFolder = workspacePage.createFolder('Target');

    resourcesUser1.push(sourceFolder);
    resourcesUser1.push(targetFolder);

    // move source to target folder
    workspacePage.moveResource(sourceFolder, 'folder');
    moveModal.moveToDestination(targetFolder);
    toastyModal.isSuccess();
    workspacePage.clearSearch();

    workspacePage.deleteResourceViaRightClick(resourcesUser1[0], 'folder');
    toastyModal.isSuccess();
    workspacePage.clearSearch();

    workspacePage.deleteResourceViaRightClick(resourcesUser1[1], 'folder');
    toastyModal.isSuccess();
    workspacePage.clearSearch();
  });

  // reset user selections to defaults
  xit('should default user selections for user 2', function () {
    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
    workspacePage.onWorkspace();
    workspacePage.resetFiltering();
    workspacePage.closeInfoPanel();
    workspacePage.setSortOrder('sortCreated');
  });

  // reset user selections to defaults
  xit('should default user selections', function () {
    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
    workspacePage.onWorkspace();
    workspacePage.resetFiltering();
    workspacePage.closeInfoPanel();
    workspacePage.setSortOrder('sortCreated');
  });

  xit("should move a resource inside a folder", function () {
    // create a folder and a template
    var folder = workspacePage.createTitle('folder');
    var template = workspacePage.createTitle('template');
    workspacePage.createResource('folder', folder);
    workspacePage.createResource('template', template);

    // move sampleTitle into folderTitle
    workspacePage.moveResource(template, 'template');
    moveModal.moveToDestination(folder);
    toastyModal.isSuccess();
    workspacePage.clearSearch();

    workspacePage.deleteResourceViaRightClick(template, 'template');
    toastyModal.isSuccess();
    workspacePage.clearSearch();

    workspacePage.deleteResourceViaRightClick(folder, 'folder');
    toastyModal.isSuccess();
    workspacePage.clearSearch();
  });





  // delete some number of files of each type
  // turn this on to delete left over stuff from staging
  for (var i = 0; i < max; i++) {
    (function () {

      // for each resource type
      //for (var k = 0; k < resourceTypes.length; k++) {
      for (var k = 0; k < 1; k++) {
        (function (type) {

          // try to delete some number of files
          for (var j = 0; j < max; j++) {
            (function () {

              xit('should delete any template from the user workspace', function () {
                workspacePage.deleteResourceViaRightClick(workspacePage.defaultTitle(), type);
                toastyModal.isSuccess();
                workspacePage.clearSearch();
              });

            })
            ();
          }

        })
        (resourceTypes[k]);
      }

    })
    ();
  }

  // TODO this does not work if folders contain files which are not deleted first. Those
  // files can belong to other users and are not visible to the logged in user
  // turn this on if you need to clean up the workspace
  // this deletes by searching for resources by type
  // this fails if we have resource inside folders that we cannot write
  xit('should delete any Protractor resource from the user workspace by searching', function () {
    workspacePage.resourceTypes().forEach(function (type) {
      workspacePage.deleteAllBySearching(workspacePage.defaultTitle(), type);
    });
  });


});

