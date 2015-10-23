'use strict';

var HeaderService = function (HEADER_MINI) {
  return {
    serviceId: "HeaderService",

    miniHeaderEnabled: false,
    miniHeaderScrollLimit: NaN,

    dataContainer: {
      currentObjectScope: null
    },

    configure: function(pageId) {
      this.miniHeaderEnabled = HEADER_MINI[pageId].enabled;
      this.miniHeaderScrollLimit = HEADER_MINI[pageId].scrollLimit;
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

HeaderService.$inject = ["HEADER_MINI"];
angularApp.service('HeaderService', HeaderService);