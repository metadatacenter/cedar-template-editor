'use strict';

var cedarBox = function ($document, $window, $location, $sce, UrlService) {

  function link(scope, element, attrs) {
    scope.removeObject = function ($event) {
      if (scope.type == 'template') {
        if ($window.confirm("Are you sure you want to remove the selected template?")) {
          scope.$parent.removeTemplate(scope.objectId);
        }
      } else if (scope.type == 'element') {
        if ($window.confirm("Are you sure you want to remove the selected element?")) {
          scope.$parent.removeElement(scope.objectId);
        }
      } else if (scope.type == 'instance') {
        if ($window.confirm("Are you sure you want to remove the populated template?")) {
          scope.$parent.removePopulatedTemplate(scope.objectId);
        }
      }
      //$event.stopImmediatePropagation();
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
      //$event.stopImmediatePropagation();
    }

    scope.getDescription = function() {
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

cedarBox.$inject = ['$document', '$window', '$location', '$sce', 'UrlService'];
angularApp.directive('cedarBox', cedarBox);