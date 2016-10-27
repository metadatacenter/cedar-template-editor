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
        if (target && target.offset()) {
          var y = target.offset().top;
          $window.scrollTo(0, y - 95);
        }

      }, 250);
    };

    /**
     * Scroll to a dom id. Delay ensures that a new field or element has been created and drawn.
     * @param id
     */
    service.scrollToDomId = function (id) {

      $timeout(function () {
            console.log('scrollToDomId ' + id);

            var target = angular.element('#' + id);
            if (target && target.offset()) {
              var y = target.offset().top;
              var center = $window.height/2;
              console.log('scrollTo ' + 0 + (y - 95));
              $window.scrollTo(0, y - 95);
            } else {
              console.log('not found' + target );
            }
          }, 250
      );
    };

    /**
     * toggle element's contents.
     * @param id
     */
    service.toggleElement = function (id) {

      $timeout(function () {

            var target = angular.element('#' + id );
            if (target) {
              target.find('.elementTotalContent').first().toggle();
              target.find(".visibilitySwitch").toggle();
              target.find(".spreadsheetSwitchLink").toggle();
            }
          }, 350
      );
    };


    service.console = function (txt, label) {
      console.log(label + ' ' + JSON.stringify(txt, null, 2));
    };

    return service;
  };

})
;