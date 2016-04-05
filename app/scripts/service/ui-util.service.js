'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.uIUtilService', [])
      .service('UIUtilService', UIUtilService);

  UIUtilService.$inject = ["$window", "$timeout"];

  function UIUtilService($window, $timeout) {

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

    /**
     * Scroll to a dom id. Delay ensures that a new field or element has been created and drawn.
     * @param id
     */
    service.scrollToDomId = function (id) {

      $timeout(function () {

            var target = angular.element('#' + id);
            if (target) {
              var y = target.offset().top;
              $window.scrollTo(0, y - 95);
            }
          }, 250
      );
    };


    service.console = function (txt, label) {
      console.log(label + ' ' + JSON.stringify(txt, null, 2));
    };

    return service;
  };

})
;