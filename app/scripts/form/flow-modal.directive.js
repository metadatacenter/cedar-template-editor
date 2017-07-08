'use strict';


define([
      'angular'

    ], function (angular) {
      angular.module('cedar.templateEditor.form.flowModal', []).directive('flowModal', flowModal);


      /* new folder modal  */
      function flowModal() {

        var directive = {
          bindToController: {
            modalVisible  : '=',
            files: '=',
            instance: '='
          },
          controller      : flowModalController,
          controllerAs    : 'flowCntl',
          restrict        : 'E',
          templateUrl     : 'scripts/form/flow-modal.directive.html',
        };
        return directive;

        flowModalController.$inject = [
          '$scope',
          '$timeout'
        ];

        function flowModalController($scope, $timeout) {
          var vm = this;
          var vm = $scope;

          // var flow = require('ngFlow');
          // $scope.uploader = {};
          // $scope.uploader.opts = {target: 'another-upload-path.php'};



          vm.url = "https://httpbin.org/post";
          //vm.url =  UrlService.airrSubmission();
          var config = {
            headers: {
              "Content-Type": undefined
            }
          };

          // modal open or closed
          $scope.$on('flowModalVisible', function (event, params) {

            if (params && params[0]) {
              $timeout(function () {
                jQuery('#flow-modal input').focus().select();
              }, 500);
            }
          });
        }
      }
    }
);

