'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.fileUpload', [])
      .directive('fileUpload', fileUpload);

  fileUpload.$inject = ['$timeout', '$http', 'UIMessageService'];

  /**
   * focus and select all input
   */
  function fileUpload($timeout, $http, UIMessageService) {


    // make the timeout 500;  0 doesn't work for template and element titles
    return {
      restrict: 'E',
      replace : true,
      scope   : {},
      require : '?ngModel',
      templateUrl     : 'scripts/form/file-upload.directive.html',
      link    : function (scope, element, attrs) {


        element.on('dragover', function (e) {
          e.preventDefault();
          e.stopPropagation();
        });

        element.on('dragenter', function (e) {
          e.preventDefault();
          e.stopPropagation();
        });

        element.on('drop', function (e) {
          e.preventDefault();
          e.stopPropagation();
          if (e.originalEvent.dataTransfer) {
            if (e.originalEvent.dataTransfer.files.length > 0) {
              scope.dndUpload(e.originalEvent.dataTransfer.files);
            }
          }
          return false;
        });

        scope.dndUpload = function (files) {

          var data = new FormData();
          angular.forEach(files, function (value) {
            data.append("files[]", value);
          });
          data.append("instance", attrs.instance);

          $http({
            method          : 'POST',
            url             : attrs.to,
            data            : data,
            withCredentials : true,
            headers         : {'Content-Type': undefined},
            transformRequest: angular.identity
          }).success(function () {
            UIMessageService.flashSuccess('AIRR Submission Posted', {"title": "title"},
                'Success');
          }).error(function (err) {
            UIMessageService.showBackendError('AIRR Server Error', err);
          });
        };
      }

    }
  }
});

