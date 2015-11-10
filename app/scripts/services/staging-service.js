'use strict';

var StagingService = function ($rootScope, CONST) {
  return {
    serviceId: "StagingService",

    pageId: null,
    stagingObjectType: CONST.stagingObject.NONE,

    configure: function(pageId) {
      this.pageId = pageId;
      this.stagingObjectType = CONST.stagingObject.NONE;
      this.updateStatus();
    },

    addField: function() {
      this.stagingObjectType = CONST.stagingObject.FIELD;
      this.updateStatus();
    },

    addElement: function() {
      this.stagingObjectType = CONST.stagingObject.ELEMENT;
      this.updateStatus();
    },

    removeObject: function() {
      this.stagingObjectType = CONST.stagingObject.NONE;
      this.updateStatus();
    },

    moveIntoPlace: function() {
      this.stagingObjectType = CONST.stagingObject.NONE;
      this.updateStatus();
    },

    resetPage: function() {
      this.stagingObjectType = CONST.stagingObject.NONE;
      this.updateStatus();
    },

    isEmpty: function() {
      return this.stagingObjectType == CONST.stagingObject.NONE;
    },

    updateStatus: function() {
      $rootScope.stagingVisible = (this.stagingObjectType != CONST.stagingObject.NONE);
      //console.log("We are on page: " + this.pageId + ", object in staging:" + this.stagingObjectType);
      //angular.element("#form-item-config-section").toggle(this.stagingObjectType != CONST.stagingObject.NONE);
    }

  };
};

StagingService.$inject = ["$rootScope", "CONST"];
angularApp.service('StagingService', StagingService);