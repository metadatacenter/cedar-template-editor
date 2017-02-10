'use strict';

var RenameModal = function () {
  var renameModal = element(by.id('rename-modal'));
  var renameModalContent = renameModal.element(by.css('div > div.modal-content'));
  var renameModalBody = renameModalContent.element(by.css('div.modal-body'));
  var renameModalFooter = renameModalContent.element(by.css('div.modal-footer'));
  var newNameTextField = renameModalBody.element(by.css('form > p > input'));
  var saveButton = renameModalFooter.element(by.css('div > button.btn-save'));


  this.getRenameModal = function() {
    return renameModal;
  };

  this.getRenameModalContent = function() {
    return renameModalContent;
  };

  this.getRenameModalBody = function() {
    return renameModalFooter;
  };

  this.getRenameModalBodyFooter = function() {
    return renameModalFooter;
  };

  this.getNewNameTextField = function() {
    return newNameTextField;
  };

  this.getSaveButton = function() {
    return saveButton;
  };


  this.renameTo = function(newName) {
    newNameTextField.sendKeys(newName);
    saveButton.click();
  };


};
module.exports = new RenameModal(); 
