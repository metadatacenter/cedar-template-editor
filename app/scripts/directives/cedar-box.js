'use strict';

var cedarBox = function ($document, $window, $location, $sce, UrlService, LS, CONST) {

  function link(scope, element, attrs) {
    scope.removeObject = function ($event) {
      swal({
          title: "Are you sure?",
          text: LS.dashboard.delete.confirm[scope.type],
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: true,
          customClass: 'cedarSWAL',
          confirmButtonColor: null
        },
        function (isConfirm) {
          if (isConfirm) {
            switch (scope.type) {
              case CONST.boxType.TEMPLATE:
                scope.$parent.removeTemplate(scope.objectId);
                break;
              case CONST.boxType.ELEMENT:
                scope.$parent.removeElement(scope.objectId);
                break;
              case CONST.boxType.INSTANCE:
                scope.$parent.removeInstance(scope.objectId);
                break;
            }
          }
        });

      $event.stopImmediatePropagation();
      angular.element($document).trigger('click');
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
      angular.element($document).trigger('click');
    }

    scope.getDescription = function () {
      return $sce.trustAsHtml(scope.description);
    }
  }

  return {
    restrict: 'E',
    templateUrl: './views/directive-templates/cedar-box.html',
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

cedarBox.$inject = ['$document', '$window', '$location', '$sce', 'UrlService', 'LS', 'CONST'];
angularApp.directive('cedarBox', cedarBox);