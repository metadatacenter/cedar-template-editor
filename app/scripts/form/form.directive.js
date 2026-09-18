'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.formDirective', [])
      .directive('formDirective', formDirective);

  // TODO: refactor to cedarFormDirective <cedar-form-directive>

  formDirective.$inject = ['$document', '$timeout', 'DataManipulationService',
                           'DataUtilService', 'UIMessageService', 'UIUtilService'];

  function formDirective($document, $timeout, DataManipulationService,
                         DataUtilService, UIMessageService, UIUtilService) {
    return {
      templateUrl: 'scripts/form/form.directive.html',
      restrict   : 'E',
      scope      : {
        pageIndex : '=',
        form      : '=',
        isEditData: "=",
        model     : '=',
        path      : '='
      },
      controller : function ($scope) {

        let dms = DataManipulationService;

        $scope.directiveName = 'form';
        $scope.forms = {};
        $scope.model = $scope.model || {};

        $scope.dataManipulationService = DataManipulationService;

        var startParseForm = function () {
          if (!$scope.form) { return; }
          dms.findChildren($scope.form.properties, $scope.model);
          if (!dms.isStaticField($scope.form)) {
            $scope.form._ui = $scope.form._ui || {};
            $scope.form._ui.order = $scope.form._ui.order || [];
            if (!$scope.form._ui.order.length) {
              angular.forEach($scope.form.properties, function (value, key) {
                if (value.properties || value.items && value.items.properties) {
                  $scope.form._ui.order.push(key);
                }
              });
            }
          }
        };

        // remove the child node from the form
        $scope.removeChild = function (node) {
          if (dms.firstClassField($scope.form,node)) {
            $scope.form = {};
          } else {
            dms.removeChild($scope.form, node);
            dms.updateAdditionalProperties($scope.form);
            var state = DataUtilService.isElement(node) ? 'invalidElementState' : 'invalidFieldState';
            $scope.$emit(state, ["remove", dms.getTitle(node), dms.getId(node)]);
          }

        };

        // // rename the key of a child in the form
        // $scope.renameChildKey = function (child, newKey) {
        //   dms.renameChildKey($scope.form, child, newKey);
        // };

        $scope.addPopover = function () {
          //Initializing Bootstrap Popover fn for each item loaded
          $timeout(function () {
            angular.element('[data-toggle="popover"]').popover();
          }, 1000);
        };

        $document.on('click', function (e) {
          // Check if Popovers exist and close on click anywhere but the popover toggle icon
          if (angular.element(e.target).data('toggle') !== 'popover' && angular.element('.popover').length) {
            angular.element('[data-toggle="popover"]').popover('hide');
          }
        });

        //
        // watches
        //

        // Initialize authoring models when the schema changes.
        $scope.$watch('form.properties', function () {
          startParseForm();
        });

        // watch the dirty flag on the form
        $scope.$watch('forms.templateForm.$dirty', function (value) {
          UIUtilService.setForm($scope.forms.templateForm);
          if (value) {
            UIUtilService.setDirty(value);
          }
        });

        $scope.$on("form:firstDirty", function () {
          if (UIUtilService.isLocked()) {
            UIMessageService.flashWarning(UIUtilService.getLockReason() || "TEMPLATEEDITOR.lock.generic");
          }
        });

        $scope.$on("form:clean", function () {
          UIUtilService.setDirty(false);
        });

        $scope.$on("form:update", function () {
          startParseForm();
          UIUtilService.setDirty(true);
        });

        $scope.$on("form:reset", function () {
          UIUtilService.setDirty(true);
        });

        // Angular $watch function to run the Bootstrap Popover initialization on new form elements when they load
        $scope.$watch('page', function () {
          $scope.addPopover();
        });

        $scope.isFirstClassField = function(node) {
          return node && ((dms.getType(node) === 'https://schema.metadatacenter.org/core/TemplateField') || (dms.getType(node) === 'https://schema.metadatacenter.org/core/StaticTemplateField'));
        };

      }
    };
  }
});
