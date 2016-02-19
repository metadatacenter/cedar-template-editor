'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.dashboard.boxDirective', [])
    .directive('cedarBox', cedarBox);

  cedarBox.$inject = ['$document', '$location', '$sce', '$translate', 'UrlService', 'CONST'];

  function cedarBox($document, $location, $sce, $translate, UrlService, CONST) {

    function link(scope, element, attrs) {

      scope.removeObject = function ($event) {
        swal({
          title: $translate.instant('GENERIC.AreYouSure'),
          text: $translate.instant('DASHBOARD.delete.confirm.' + scope.type),
          type: "warning",
          showCancelButton: true,
          confirmButtonText: $translate.instant('GENERIC.YesDeleteIt'),
          closeOnConfirm: true,
          customClass: 'cedarSWAL',
          confirmButtonColor: null
        },
             function (isConfirm) {
               if (isConfirm) {
                 switch (scope.type) {
                 case CONST.boxType.TEMPLATE:
                   scope.$parent.deleteTemplate(scope.objectId);
                   break;
                 case CONST.boxType.ELEMENT:
                   scope.$parent.deleteElement(scope.objectId);
                   break;
                 case CONST.boxType.INSTANCE:
                   scope.$parent.deleteInstance(scope.objectId);
                   break;
                 }
               }
             });

        $event.stopImmediatePropagation();
        $document.trigger('click');
      }

      scope.editObject = function ($event) {
        switch (scope.type) {
        case CONST.boxType.TEMPLATE:
          $location.path(UrlService.getTemplateEdit(scope.objectId));
          break;
        case CONST.boxType.ELEMENT:
          $location.path(UrlService.getElementEdit(scope.objectId));
          break;
        case CONST.boxType.INSTANCE:
          $location.path(UrlService.getInstanceEdit(scope.objectId));
          break;
        case CONST.boxType.LINK:
          $location.path(scope.href);
          break;
        }
        $event.stopImmediatePropagation();
        $document.trigger('click');
      }

      scope.getDescription = function () {
        return $sce.trustAsHtml(scope.description);
      }
    }

    return {
      restrict: 'E',
      templateUrl: 'scripts/dashboard/box.directive.html',
      scope: {
        type: '@',
        description: '@',
        title: '@',
        objectId: '@',
        allowRemove: '@',
        allowEdit: '@',
        iconClass: '@',
        href: '@',
        cssClass: '@'
      },
      link: link
    };

  };

});
