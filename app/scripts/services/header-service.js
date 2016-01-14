'use strict';

var HeaderService = function ($rootScope, $http) {

  var config = null;

  var service = {
    serviceId: "HeaderService",

    miniHeaderEnabled: false,
    miniHeaderScrollLimit: NaN,
    dataContainer: {
      currentObjectScope: null
    }
  };

  service.init = function () {
    $http.get('config/header-service.conf.json').then(function (response) {
      config = response.data;
    }).catch(function (err) {
      console.log(err);
    });
  };

  service.configure = function (pageId, applicationMode) {
    this.miniHeaderEnabled = config[pageId].enabled;
    this.miniHeaderScrollLimit = config[pageId].scrollLimit;
    $rootScope.applicationMode = applicationMode;
    $rootScope.pageId = pageId;
  };

  service.isEnabled = function () {
    return this.miniHeaderEnabled;
  };

  service.getScrollLimit = function () {
    return this.miniHeaderScrollLimit;
  };

  service.getStickyThreshold = function () {
    return config.stickyThreshold;
  };

  service.showMini = function (pageYOffset) {
    return this.isEnabled() && pageYOffset > this.getScrollLimit();
  };

  return service;
};

HeaderService.$inject = ["$rootScope", "$http"];
angularApp.service('HeaderService', HeaderService);