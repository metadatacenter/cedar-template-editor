'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.noImageDirective', [])
      .directive('noImage', noImageDirective);

  noImageDirective.$inject = [];

  /**
   * Hides an image if the image src does not load.
   */
  function noImageDirective() {

    var setDefaultImage = function (el) {

      // could put a missing image
      //el.attr('src', "missing.png");

      // just hide it for now
      el.hide();
    };

    return {
      restrict: 'A',
      link    : function (scope, el, attr) {
        scope.$watch(function () {
          return attr.ngSrc;
        }, function () {
          var src = attr.ngSrc;

          if (!src) {
            setDefaultImage(el);
          }
        });

        el.bind('error', function () {
          setDefaultImage(el);
        });
      }
    };
  }

});

