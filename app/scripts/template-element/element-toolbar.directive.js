'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.templateElement.elementToolbar', [])
      .directive('elementToolbar', elementToolbar);


  elementToolbar.$inject = ["$rootScope", "$sce", "$document", "$translate", "$filter", "$location",
                        "$window", '$timeout'];

  function elementToolbar($rootScope, $sce, $document, $translate, $filter, $location, $window,
                      $timeout) {


    var linker = function ($scope, $element, attrs) {





    };

    return {
      templateUrl: 'scripts/template-element/element-toolbar.directive.html',
      restrict   : 'EA',
      scope      : {
        model: '=',
        index     : '=',
        remove   : "=",
        add   : "=",
        isActive: '=',
        setActive: '=',
        toggle:  '=',
        paged: '=',
        expanded: '=',
        cardinality : "="
      },
      controller : function ($scope, $element) {

      },
      replace    : true,
      link       : linker
    };

  }

})
;