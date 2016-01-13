'use strict';

var StagingService = function ($rootScope, TemplateElementService, $timeout, CONST) {

  var service = {
    serviceId: "StagingService",

    pageId: null,
    stagingObjectType: CONST.stagingObject.NONE,
  };

  service.configure = function (pageId) {
    this.pageId = pageId;
    this.stagingObjectType = CONST.stagingObject.NONE;
    this.updateStatus();
  };

  service.addField = function () {
    this.stagingObjectType = CONST.stagingObject.FIELD;
    this.updateStatus();
  };

  service.addElement = function () {
    this.stagingObjectType = CONST.stagingObject.ELEMENT;
    this.updateStatus();
  };

  service.removeObject = function () {
    this.stagingObjectType = CONST.stagingObject.NONE;
    this.updateStatus();
  };

  service.moveIntoPlace = function () {
    this.stagingObjectType = CONST.stagingObject.NONE;
    this.updateStatus();
  };

  service.resetPage = function () {
    this.stagingObjectType = CONST.stagingObject.NONE;
    this.updateStatus();
  };

  service.isEmpty = function () {
    return this.stagingObjectType == CONST.stagingObject.NONE;
  };

  service.updateStatus = function () {
    $rootScope.stagingVisible = (this.stagingObjectType != CONST.stagingObject.NONE);
  };

  service.addElementWithId = function($scope, elementId) {
    $scope.staging = {};
    $scope.previewForm = {};

    TemplateElementService.getTemplateElement(elementId).then(function (response) {
      var newElement = response;
      newElement.minItems = 1;
      newElement.maxItems = 1;
      $scope.staging[newElement['@id']] = newElement;
      $timeout(function () {
        var fieldName = $rootScope.getFieldName(newElement.properties._ui.title);
        $scope.previewForm.properties = {};
        $scope.previewForm.properties[fieldName] = newElement;
      });
    });
  }

  return service;
};

StagingService.$inject = ["$rootScope", "TemplateElementService", "$timeout", "CONST"];
angularApp.service('StagingService', StagingService);