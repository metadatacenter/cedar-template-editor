'use strict';
var DashboardPage = require('../pages/dashboard-page.js');
var MetadataPage = require('../pages/metadata-page.js');
var TemplatePage = require('../pages/template-creator-page.js');
var _ = require('../libs/lodash.min.js');


describe('metadata-creator', function () {
  var EC = protractor.ExpectedConditions;
  var metadataPage;
  var dashboardPage;
  var templatePage;


  // before each test, load a new page and create a template
  // maximize the window area for clicking
  beforeEach(function () {
    metadataPage = MetadataPage;
    dashboardPage = DashboardPage;
    templatePage = TemplatePage;
    dashboardPage.get();
    browser.driver.manage().window().maximize();
  });

  it("should create the sample template", function () {
    dashboardPage.createTemplate();
    templatePage.setTemplateTitle(dashboardPage.sampleTemplateTitle);
    templatePage.addTextField();
    templatePage.clickSaveTemplate();
  });


  it("should show metadata editor header, title, description, and json preview", function () {

    dashboardPage.openTemplate(dashboardPage.sampleTemplateTitle).then(function () {

      expect(metadataPage.isMetadata()).toBe(true);

      // should have top nav basics
      expect(metadataPage.topNavigation.isDisplayed()).toBe(true);
      expect(metadataPage.topNavBackArrow.isDisplayed()).toBe(true);
      expect(metadataPage.documentTitle.isDisplayed()).toBe(true);
      expect(metadataPage.templateJson.isDisplayed()).toBe(true);
      expect(metadataPage.metadataJson.isDisplayed()).toBe(true);

      // and the right document
      metadataPage.documentTitle.getText().then(function (text) {
        expect(dashboardPage.sampleTemplateTitle === text).toBe(true);
      });

      // and the right page title
      metadataPage.pageTitle.getText().then(function (text) {
        expect(metadataPage.metadataPageTitle === text).toBe(true);
      });

      metadataPage.topNavBackArrow.click().then(function () {
        browser.sleep(1000);
        expect(metadataPage.isDashboard()).toBe(true);
      });
    });
  });


  it("should have Cancel button present and active", function () {

    dashboardPage.openTemplate(dashboardPage.sampleTemplateTitle).then(function () {

      expect(metadataPage.isMetadata()).toBe(true);

      // make the metadata  dirty
      var firstTitle  = metadataPage.firstItemTitle;

      firstTitle.sendKeys(metadataPage.sampleTitle).sendKeys(protractor.Key.ENTER);
      firstTitle.getAttribute('value').then(function (value) {
        expect(value === metadataPage.sampleTitle).toBe(true);
      });

      // clicking the cancel should cancel edits
      metadataPage.clickCancelMetadata();
      expect(metadataPage.isDashboard()).toBe(true);
    });
  });

  it("should have save button present and active", function () {

    dashboardPage.openTemplate(dashboardPage.sampleTemplateTitle).then(function () {

      expect(metadataPage.isMetadata()).toBe(true);

      // make the metadata  dirty
      var firstTitle  = metadataPage.firstItemTitle;

      firstTitle.sendKeys(metadataPage.sampleTitle).sendKeys(protractor.Key.ENTER);
      firstTitle.getAttribute('value').then(function (value) {
        expect(value === metadataPage.sampleTitle).toBe(true);
      });

      // clicking the save should save edits
      metadataPage.clickSaveMetadata();

    });
  });


  it("should delete sample template from the workspace, ", function () {

    var searchInput = element(by.id('search'));

    searchInput.sendKeys(dashboardPage.sampleTemplateTitle).sendKeys(protractor.Key.ENTER).then(function () {

      browser.wait(EC.textToBePresentInElementValue($('#search'), dashboardPage.sampleTemplateTitle), 10000);


      // click the search submit icon
      element(by.css('.do-search')).click().then(function () {

        browser.wait(EC.visibilityOf(dashboardPage.getFirstElement()), 10000);

        // the search browse modal should show some results
        expect(dashboardPage.getFirstElement().isPresent()).toBe(true);

        // get the first element in the list of search results
        dashboardPage.getFirstElement().click().then(function () {

          var buttons = dashboardPage.topNavButtons;
          //expect(buttons.count()).toBe(6);

          var deleteButton = buttons.first();
          browser.wait(EC.visibilityOf(deleteButton), 10000);
          deleteButton.getAttribute('tooltip').then(function (value) {

            // make sure it really is delete
            expect(_.isEqual(value, dashboardPage.deleteButtonTooltip)).toBe(true);
            deleteButton.click();
            browser.sleep(1000);

            browser.wait(EC.visibilityOf(dashboardPage.createConfirmationDialog), 10000);
            expect(dashboardPage.createConfirmationDialog.isDisplayed()).toBe(true);
            expect(dashboardPage.createConfirmationDialog.getAttribute(dashboardPage.sweetAlertCancelAttribute)).toBe('true');
            expect(dashboardPage.createConfirmationDialog.getAttribute(dashboardPage.sweetAlertConfirmAttribute)).toBe('true');

            // click confirm to delete the element
            dashboardPage.clickSweetAlertConfirmButton();

            browser.wait(EC.visibilityOf(dashboardPage.createToastyConfirmationPopup), 10000);
            expect(dashboardPage.createToastyConfirmationPopup.isDisplayed()).toBe(true);
            dashboardPage.getToastyMessageText().then(function (value) {
              expect(value.indexOf(dashboardPage.deleteTemplateMessage) !== -1).toBe(true);
            });

          });
        });
      });
    });
  });

});

