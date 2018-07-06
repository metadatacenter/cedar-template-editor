'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.searchBrowse.cedarDropdownMenuDirective', [])
      .directive('cedarDropdownMenu', cedarDropdownMenuDirective);


  cedarDropdownMenuDirective.$inject = [];

  function cedarDropdownMenuDirective() {


    var linker = function (scope, element, attrs) {

      var el = element[0]; // element - jQLite element, el - native DOM element
      var parentRect = el.parentElement.getBoundingClientRect();
      var centerPanelRect;
      var toggle;
      var toggleRect;
      var centerPanel;

      if (typeof scope.toggleId == 'function') {
        toggle = document.getElementById(scope.toggleId(scope.resource,'list'));
        centerPanel = document.getElementById('center-panel');
        if (toggle && centerPanel) {
          toggleRect = toggle.getBoundingClientRect();
          centerPanelRect = centerPanel.getBoundingClientRect();
          console.log('center-panel', toggleRect.height, centerPanelRect, toggleRect);

          el.style.setProperty("top", (toggleRect.top - centerPanelRect.top + toggleRect.height) + "px");
          //el.style.setProperty("top", "0px");

        } else {
          console.log('toggle',toggle);
        }
      }

    };

    return {
      templateUrl: 'scripts/search-browse/cedar-dropdown-menu.directive.html',
      restrict   : 'EA',
      scope      : {
        resource         : '=',
        goTo             : '=',
        share            : '=',
        move             : '=',
        delete           : '=',
        copy             : '=',
        rename           : '=',
        publish          : '=',
        createDraft      : '=',
        canNotPopulate   : '=',
        canNotPublish    : '=',
        canNotCreateDraft: '=',
        canNotWrite      : '=',
        canNotShare      : '=',
        canNotDelete     : '=',
        isFolder         : '=',
        toggleId:"="

      },
      controller : function ($scope, $element) {
      },
      replace    : true,
      link       : linker
    };

  }

})
;