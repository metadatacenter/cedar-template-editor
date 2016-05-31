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


    var offsetX;
    var offsetY;
    var id;
    var el;


    // select the element and toggle the button trigger for the menu dropdown
    var selectAndToggleMenu = function(id) {

      $timeout(function () {
        el.click();
        jQuery('#' + id + ' button').dropdown('toggle');

      });

      return false;
    };

    var getPosition = function(element) {
      var xPos = 0;
      var yPos = 0;

      while (element) {
        if (element.tagName == "BODY") {
          // deal with browser quirks with body/window/document and page scroll
          var xScroll = element.scrollLeft || document.documentElement.scrollLeft;
          var yScroll = element.scrollTop || document.documentElement.scrollTop;

          xPos += (element.offsetLeft - xScroll + element.clientLeft);
          yPos += (element.offsetTop - yScroll + element.clientTop);
        } else {
          // for all other non-BODY elements
          xPos += (element.offsetLeft - element.scrollLeft + element.clientLeft);
          yPos += (element.offsetTop - element.scrollTop + element.clientTop);
        }

        element = element.offsetParent;
      }
      return {
        x: xPos,
        y: yPos
      };
    };

    // calculate the absolute position of the context menu
    function getClickPosition(e, id, dx, dy) {
      var parentPosition = getPosition(e.currentTarget);
      var xPosition = e.clientX - parentPosition.x + dx;
      var yPosition = e.clientY - parentPosition.y + dy;
      jQuery( "#" + id ).css('left' , xPosition + "px").css('top' , yPosition + "px").css('position' , "absolute");
    }

    return {
      restrict: 'A',
      link    : function (scope, element, attr) {

        scope.getId = function(resource, prefix) {

          var resourceId = resource['@id'];
          return (prefix || "") + 'id' +  resourceId.substr(resourceId.lastIndexOf('/') + 1);

        };

        //var fn = $parse(attr.simpleClick);
        element.bind('contextmenu', function($event) {
          el = element;
          id =  attr.dropdownid.substr(attr.dropdownid.lastIndexOf('/') + 1);


          getClickPosition($event, id, parseInt(attr.offsetx), parseInt(attr.offsety));

          scope.$apply(function() {
            $event.preventDefault();
            selectAndToggleMenu(attr.dropdownid);
            //fn(scope, {$event:event});
          });
        });

      }
    };
  };

});