'use strict';

var HeaderService = function ($rootScope, HEADER_MINI) {

  var service = {
    serviceId: "HeaderService",

    miniHeaderEnabled: false,
    miniHeaderScrollLimit: NaN,
    dataContainer: {
      currentObjectScope: null
    }
  };

  service.configure = function (pageId, applicationMode) {
    this.miniHeaderEnabled = HEADER_MINI[pageId].enabled;
    this.miniHeaderScrollLimit = HEADER_MINI[pageId].scrollLimit;
    $rootScope.applicationMode = applicationMode;
    $rootScope.pageId = pageId;
  };

  service.isEnabled = function () {
    return this.miniHeaderEnabled;
  };

  service.getScrollLimit = function () {
    return this.miniHeaderScrollLimit;
  };

  service.showMini = function (pageYOffset) {
    return this.isEnabled() && pageYOffset > this.getScrollLimit();
  };

  return service;
};

HeaderService.$inject = ["$rootScope", "HEADER_MINI"];
angularApp.service('HeaderService', HeaderService);