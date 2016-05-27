'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.rightClickDirective', [])
      .directive('rightclick', rightClickDirective);

  rightClickDirective.$inject = ['$parse','$timeout','$document'];

  /**
   * Hides an image if the image src does not load.
   */
  function rightClickDirective($parse,$timeout,$document) {

    var theThing;
    var container;

    var selectAndToggleMenu = function(id) {
      console.log('selectAndToggleMenu');
      var selectId = '#select' + id;
      var buttonId = '#button' + id;

      $timeout(function () {
        jQuery(selectId).click();
        jQuery(buttonId).dropdown('toggle');

      });

      return false;
    };

    var getPosition = function(el) {
      var xPos = 0;
      var yPos = 0;

      while (el) {
        if (el.tagName == "BODY") {
          // deal with browser quirks with body/window/document and page scroll
          var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
          var yScroll = el.scrollTop || document.documentElement.scrollTop;

          xPos += (el.offsetLeft - xScroll + el.clientLeft);
          yPos += (el.offsetTop - yScroll + el.clientTop);
        } else {
          // for all other non-BODY elements
          xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
          yPos += (el.offsetTop - el.scrollTop + el.clientTop);
        }

        el = el.offsetParent;
      }
      return {
        x: xPos,
        y: yPos
      };
    };

    function getClickPosition(e, id) {

      var parentPosition = getPosition(e.currentTarget);

      var xPosition = e.clientX - parentPosition.x;
      var yPosition = e.clientY - parentPosition.y;

      console.log(theThing);
      console.log('parent')
      console.log(e.currentTarget);
      console.log('parentPosition')
      console.log(parentPosition);

      console.log('clientX clientY')
      console.log(e.clientX + ' ' + e.clientY);

      console.log('xPosition yPosition')
      console.log(xPosition + ' ' + yPosition);

      jQuery( "#" + id ).css('left' , xPosition + "px");
      jQuery( "#" + id ).css('top' , yPosition + "px");
      jQuery( "#" + id ).css('position' , "absolute");
    }

    return {
      restrict: 'A',
      link    : function (scope, element, attr) {

        scope.getId = function(resource) {
          var resourceId = resource['@id'];
          var id =  'id' + resourceId.substr(resourceId.lastIndexOf('/') + 1);
          return id;
        };

        //var fn = $parse(attr.simpleClick);
        element.bind('contextmenu', function($event) {

          var resourceId = attr.dropdownid;
          var id =  resourceId.substr(resourceId.lastIndexOf('/') + 1);
          theThing = jQuery( "#" + id );
          container = jQuery( "#select" + id );

          getClickPosition($event, id);

          scope.$apply(function() {
            event.preventDefault();
            selectAndToggleMenu(attr.dropdownid);
            //fn(scope, {$event:event});
          });
        });

      }
    };
  };

});