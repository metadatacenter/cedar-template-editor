'use strict';

var cedarBox = function ($document, $window, $location, $sce, UrlService, LS) {

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
            if (scope.type == 'template') {
              scope.$parent.removeTemplate(scope.objectId);
            } else if (scope.type == 'element') {
              scope.$parent.removeElement(scope.objectId);
            } else if (scope.type == 'instance') {
              scope.$parent.removePopulatedTemplate(scope.objectId);
            }
          }
        });

      $event.stopImmediatePropagation();
      angular.element($document).trigger('click');
    }

    scope.editObject = function ($event) {
      if (scope.type == 'template') {
        $location.path(UrlService.getTemplateEdit(scope.objectId));
      } else if (scope.type == 'element') {
        $location.path(UrlService.getElementEdit(scope.objectId));
      } else if (scope.type == 'instance') {
        $location.path(UrlService.getInstanceEdit(scope.objectId));
      } else if (scope.type == 'link') {
        //console.log("It is link:", scope.href);
        $location.path(scope.href);
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

cedarBox.$inject = ['$document', '$window', '$location', '$sce', 'UrlService', 'LS'];
angularApp.directive('cedarBox', cedarBox);