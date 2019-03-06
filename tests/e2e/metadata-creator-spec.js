'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var MetadataPage = require('../pages/metadata-page.js');
var TemplatePage = require('../pages/template-creator-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var FinderModal = require('../modals/finder-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');
var testConfig = require('../config/test-env.js');
var _ = require('../libs/lodash.min.js');

describe('metadata-creator', function () {
  var EC = protractor.ExpectedConditions;
  var workspacePage = WorkspacePage;
  var metadataPage = MetadataPage;
  var templatePage = TemplatePage;
  var toastyModal = ToastyModal;
  var finderModal = FinderModal;
  var sweetAlertModal = SweetAlertModal;

  var template;
  var element;
  var folder;
  var fields;
  var firstField;
  var lastField;

  var resources = [];
  var createResource = function (title, type, username, password) {
    var result = new Object;
    result.title = title;
    result.type = type;
    result.username = username;
    result.password = password;
    return result;
  };

  jasmine.getEnv().addReporter(workspacePage.myReporter());

  beforeEach(function () {
  });

  afterEach(function () {
  });

  it("should be on the workspace", function () {
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
    workspacePage.onWorkspace();
    workspacePage.hasLogo();
    workspacePage.hasControlBar();
  });

  /**
   * Test the metadata editor by first creating some test data,
   * then opening it to manipulate items in the metadata editor.
   *
   * Everything that is created is deleted at the end of the spec.
   *
   */
  describe('create metadata', function () {

    it("should create the sample folder", function () {
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      var target1Folder = workspacePage.createFolder('Trgt');
    });

    it("should create the sample template", function () {
      template = workspacePage.createTitle('Src');
      workspacePage.createPage('template', template, 'description');
      resources.push(createResource(template, 'template', testConfig.testUser1, testConfig.testPassword1));
      templatePage.clickSave('template');
      toastyModal.isSuccess();

      workspacePage.onTemplate();
      templatePage.isClean();
      templatePage.clickBackArrow();
      workspacePage.onWorkspace();
    });

    // put a test between the creation of a resource and the search for it
    // it may take two seconds to index the new resource
    it("metadata-creator create metadata should be on the workspace", function () {
      workspacePage.onWorkspace();
    });

    it("should edit the resource and add fields", function () {
      workspacePage.doubleClickResource(template, 'template');
      templatePage.addField('textfield', false, 'one', 'one');
      templatePage.isDirty();
      templatePage.clickSave('template');
      toastyModal.isSuccess();

      workspacePage.onTemplate();
      templatePage.isClean();
      templatePage.clickBackArrow();
      workspacePage.onWorkspace();
    });

    it("should populate the sample template", function () {
      workspacePage.populateResource(template, 'template');
      resources.unshift(createResource(template, 'metadata', testConfig.testUser1, testConfig.testPassword1));
      workspacePage.onWorkspace();
    });

    it("should create an element", function () {
      element = workspacePage.createElement('Src');
      resources.push(createResource(element, 'element', testConfig.testUser1, testConfig.testPassword1));
      workspacePage.onWorkspace();
    });

    it("should edit the element", function () {
      workspacePage.doubleClickResource(element, 'element');
      workspacePage.onElement();
    });

    it("should add a field to the element ", function () {
      templatePage.addField('textfield', false, 'one', 'one');
      templatePage.addField('textfield', false, 'one', 'one');
    });

    it("should save the element ", function () {
      workspacePage.onElement();
      templatePage.clickSave('element');
      toastyModal.isSuccess();
      templatePage.clickBackArrow();
      workspacePage.onWorkspace();
    });

    xdescribe('open finder', function () {

      it("should add the element to the template ", function () {
        workspacePage.doubleClickResource(template, 'template');
        workspacePage.onTemplate();
      });

      it("should open finder ", function () {
        templatePage.openFinder();
        finderModal.onFinder();
      });

      xit("should cancel finder  ", function () {
        var cancel = element(by.css('div.modal-footer.actions div.clear-save button.canc'));
        browser.wait(EC.elementToBeClickable(cancel));
        cancel.click();
      });

      it("should add first element  ", function () {
        finderModal.addFirstElement(element);
        templatePage.clickSave('template');
        toastyModal.isSuccess();
        templatePage.clickBackArrow();
        workspacePage.onWorkspace();
      });
    });

    it("should populate the sample template", function () {
      workspacePage.populateResource(template, 'template');
      resources.unshift(createResource(template, 'metadata', testConfig.testUser1, testConfig.testPassword1));
      workspacePage.onWorkspace();
    });

    it("should open metadata with open menu", function () {
      workspacePage.doubleClickResource(template, 'metadata');
      workspacePage.onMetadata();
      metadataPage.clickBackArrow();
      workspacePage.onWorkspace();
    });

    it("should open metadata with double-click showing header, back arrow, title, and first instance of the multi-instance element",
        function () {
          workspacePage.doubleClickResource(template, 'metadata');
          expect(metadataPage.topNavigation().isDisplayed()).toBe(true);
          expect(metadataPage.documentTitle().isDisplayed()).toBe(true);

          // look at the value of the document title
          browser.wait(EC.presenceOf(metadataPage.documentTitle()));
          metadataPage.documentTitle().getText().then(function (text) {
            expect(text === template + ' metadata').toBe(true);
          });

          // TODO make sure the element is multi-instance and is clickable -> only works if spreadsheets are not the default view
          // metadataPage.checkMultiple();
          // metadataPage.addInstance();
          // metadataPage.isDirty();

          metadataPage.clickBackArrow();
          workspacePage.onWorkspace();
        });
  });

  describe('create static fields', function () {

    it("should create a template with static fields", function () {
      var template = workspacePage.createTemplate('Static');
      resources.push(createResource(template, 'template', testConfig.testUser1, testConfig.testPassword1));

      workspacePage.doubleClickResource(template, 'template');
      templatePage.addField('image', true, 'image', 'image',
          "https://farm8.static.flickr.com/7178/14027473486_63ec060a17_z.jpg");
      templatePage.addField('textfield', false, 'one', 'one');

      templatePage.addField('richtext', true, 'richtext', 'richtext', "testing");
      templatePage.addField('textfield', false, 'two', 'two');

      templatePage.clickSave('template');
      toastyModal.isSuccess();
      templatePage.clickBackArrow();
      workspacePage.onWorkspace();

      workspacePage.populateResource(template, 'template');
      resources.unshift(createResource(template, 'metadata', testConfig.testUser1, testConfig.testPassword1));
      workspacePage.onWorkspace();

      workspacePage.doubleClickResource(template, 'metadata');
      workspacePage.onMetadata();

      expect(templatePage.createQuestion().isPresent()).toBe(true);
      var fields = templatePage.createQuestions();
      fields.count().then(function (value) {
        expect(value).toBe(2);
      });

      var firstField = fields.first();
      expect(firstField.isPresent()).toBe(true);
      var lastField = fields.last();
      expect(lastField.isPresent()).toBe(true);

      //TODO these work locally but fail on Travis
      // browser.actions().mouseMove(firstField).perform();
      // browser.wait(EC.elementToBeClickable(firstField));
      // firstField.click();
      //expect(templatePage.createImage().isPresent()).toBe(true);

      // browser.actions().mouseMove(lastField).perform();
      // browser.wait(EC.elementToBeClickable(lastField));
      // lastField.click();
      // expect(templatePage.createRichtext().isPresent()).toBe(true);

      metadataPage.clickBackArrow();
      workspacePage.onWorkspace();
    });
  });

  xdescribe('create spreadsheets', function () {

    it("should view a template as spreadsheet", function () {
      var template = workspacePage.createTemplate('Src');
      workspacePage.onWorkspace();
      resources.push(createResource(template, 'template', testConfig.testUser1, testConfig.testPassword1));

      workspacePage.doubleClickResource(template, 'template');
      templatePage.addField('textfield', false, 'one', 'one');
      templatePage.setMultiple();

      templatePage.clickSave('template');
      toastyModal.isSuccess();
      templatePage.clickBackArrow();
      workspacePage.onWorkspace();

      workspacePage.populateResource(template, 'template');
      resources.unshift(createResource(template, 'metadata', testConfig.testUser1, testConfig.testPassword1));

      workspacePage.doubleClickResource(template, 'metadata');
      metadataPage.switchToSpreadsheet();

      metadataPage.clickBackArrow();
      workspacePage.onWorkspace();
    });
  });


  describe('remove all created resources', function () {

    // clean up created resources
    it('should delete resource from the user workspace for user', function () {
      for (var i = 0; i < resources.length; i++) {
        (function (resource) {
          workspacePage.login(resource.username, resource.password);
          workspacePage.deleteResource(resource.title, resource.type);
        })
        (resources[i]);
      }
    });

  });

});

