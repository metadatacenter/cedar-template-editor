'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.fieldToolbar', [])
      .directive('fieldToolbar', fieldToolbar);


  fieldToolbar.$inject = ["$rootScope", "$sce", "$document", "$translate", "$filter", "$location",
                            "$window", '$timeout'];

  function fieldToolbar($rootScope, $sce, $document, $translate, $filter, $location, $window,
                          $timeout) {


    var linker = function ($scope, $element, attrs) {




    };

    return {
      templateUrl: 'scripts/form/field-toolbar.directive.html',
      restrict   : 'EA',
      scope      : {
        field: "=",
        model: '=',
        index     : '=',
        remove   : "=",
        add   : "=",
        close : "=",
        isActive: '=',
        setActive: '=',
        isMultiple: '=',
        description: '=',
        toggle:  '=',
        showMultiple: '=',
        cardinality : "=",
        spreadsheet: "="
      },
      controller : function ($scope, $element) {

      },
      replace    : true,
      link       : linker
    };

  }

})
;