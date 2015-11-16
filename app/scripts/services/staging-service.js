'use strict';

var StagingService = function ($rootScope, CONST) {

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

  return service;
};

StagingService.$inject = ["$rootScope", "CONST"];
angularApp.service('StagingService', StagingService);