'use strict';


var MoveModal = function () {

  var EC = protractor.ExpectedConditions;


  var createMoveToModal = element(by.id('move-modal'));
  var createMoveToModalOpen = element(by.css('#move-modal .in'));
  var createMoveButton = element(by.css('#move-modal .confirm'));


  // is it a open?
  this.isOpen = function () {

    expect(createMoveToModalOpen.isPresent()).toBe(true);
  };


  this.moveToDestination = function(title) {

    var folder = createMoveToModal.element(by.linkText(title));

    browser.wait(EC.elementToBeClickable(folder));
    folder.click();
    createMoveButton.click();

  }


};
module.exports = new MoveModal(); 
