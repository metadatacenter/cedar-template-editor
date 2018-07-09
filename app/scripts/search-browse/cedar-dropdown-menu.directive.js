'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.searchBrowse.cedarDropdownMenuDirective', [])
      .directive('cedarDropdownMenu', cedarDropdownMenuDirective);


  cedarDropdownMenuDirective.$inject = [];

  function cedarDropdownMenuDirective() {


    var linker = function (scope, element, attrs) {
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