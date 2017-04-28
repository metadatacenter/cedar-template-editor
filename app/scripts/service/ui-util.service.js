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
            var target = angular.element('#' + id);
            if (target && target.offset()) {
              var y = target.offset().top;
              var center = $window.height/2;
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

    // create a modal id for the controlled terms modals
    service.getModalId = function (id, type) {
      if (id) {
        id = id.substring(id.lastIndexOf('/') + 1);
      }
      return "control-options-" + id + "-" + type;
    };

    // show the controlled terms modal
    service.showModal = function (id, type) {
      jQuery("#" + service.getModalId(id, type)).modal('show');
    };

    // hide the controlled terms modal
    service.hideModal = function (id, type) {
      jQuery("#" + service.getModalId(id, type)).modal('hide');
    };


    service.getYouTubeEmbedFrame = function (field) {

      var width = 560;
      var height = 315;
      var content = $rootScope.propertiesOf(field)._content.replace(/<(?:.|\n)*?>/gm, '');

      if ($rootScope.propertiesOf(field)._size && $rootScope.propertiesOf(field)._size.width && Number.isInteger($rootScope.propertiesOf(field)._size.width)) {
        width = $rootScope.propertiesOf(field)._size.width;
      }
      if ($rootScope.propertiesOf(field)._size && $rootScope.propertiesOf(field)._size.height && Number.isInteger($rootScope.propertiesOf(field)._size.height)) {
        height = $rootScope.propertiesOf(field)._size.height;
      }

      // if I say trust as html, then better make sure it is safe first
      return $sce.trustAsHtml('<iframe width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + content + '" frameborder="0" allowfullscreen></iframe>');

    };

    service.console = function (txt, label) {
      console.log(label + ' ' + JSON.stringify(txt, null, 2));
    };

    return service;
  };

})
;