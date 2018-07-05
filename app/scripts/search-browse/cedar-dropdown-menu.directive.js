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

      if (typeof scope.toggleId == 'function') {
        toggle = document.getElementById(scope.toggleId(scope.resource,'list'));
        if (toggle) {
          console.log('toggle',toggle.offsetLeft, toggle.offsetTop);
          toggleRect = toggle.getBoundingClientRect();
          //el.style.setProperty("top", toggleRect.top + "px");
        }
      }

      var scrollTop = document.getElementById('center-panel');
      if (scrollTop) {
        console.log('center-panel', scrollTop.offsetLeft, scrollTop.offsetTop);
        centerPanelRect = toggle.getBoundingClientRect();
        el.style.setProperty("top", centerPanelRect.top + "px");
      }


      // console.log(el,el.parentElement);
      // console.log(el.offsetLeft, el.offsetTop);
      // console.log(el.parentElement.offsetLeft, el.parentElement.offsetTop);
      //el.style.setProperty("top", rect.top + "px");

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