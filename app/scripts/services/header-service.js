'use strict';

var HeaderService = function ($rootScope, HEADER_MINI) {
  return {
    serviceId: "HeaderService",

    miniHeaderEnabled: false,
    miniHeaderScrollLimit: NaN,

    dataContainer: {
      currentObjectScope: null
    },

    configure: function(pageId, applicationMode) {
      this.miniHeaderEnabled = HEADER_MINI[pageId].enabled;
      this.miniHeaderScrollLimit = HEADER_MINI[pageId].scrollLimit;
      $rootScope.applicationMode = applicationMode;
      $rootScope.pageId = pageId;
    },

    isEnabled: function() {
      return this.miniHeaderEnabled;
    },

    getScrollLimit: function() {
      return this.miniHeaderScrollLimit;
    },

    showMini: function(pageYOffset) {
      return this.isEnabled() && pageYOffset > this.getScrollLimit();
    }

  };
};

HeaderService.$inject = ["$rootScope", "HEADER_MINI"];
angularApp.service('HeaderService', HeaderService);