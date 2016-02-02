'use strict';

var UIUtilService = function ($window, $timeout) {

  var service = {
    serviceId: "UIUtilService"
  };

  service.scrollToAnchor = function (hash) {
    $timeout(function () {
      var target = angular.element('#' + hash);
      var y = target.offset().top;
      $window.scrollTo(0, y - 95);
    }, 250);
  };

  service.console = function (txt, label) {
    console.log(label + ' ' + JSON.stringify(txt, null, 2));
  };

  return service;
};

UIUtilService.$inject = ["$window", "$timeout"];
angularApp.service('UIUtilService', UIUtilService);