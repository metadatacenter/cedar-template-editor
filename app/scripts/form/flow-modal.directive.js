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

          $scope.init = function(flow) {
            //flow.clear();
          };

          $scope.cancelAll = function(flow) {
            flow.cancel();
          };

          $scope.pauseAll = function(flow) {
            flow.pause();
          };

          $scope.resumeAll = function(flow) {
            flow.resume();
          };


          // var flow = require('ngFlow');
          // $scope.uploader = {};
          // $scope.uploader.opts = {target: 'another-upload-path.php'};

          $scope.$on('flow::fileAdded', function (event, $flow, flowFile) {
            console.log('flow::fileAdded');
          });

          $scope.$on('flow::progress', function (event, $flow, flowFile) {
            console.log('flow::progress');
          });

          $scope.flowProgress = function(flow) {
            console.log('flow::progress ');console.log(flow);
          };

          $scope.flowFileProgress = function(flow, file) {
            console.log('flow::fileProgress ');console.log(file);
          };

          //from the 'UploadCtrl as uploadctrl' controller, which has scope on the whole thing
          $scope.$on('flow::complete', function (event, $flow) {
            $http.get('/uploading/here').then(function(response){
              // yay! LET'S GET CREATIVE!
            });
            $timeout(function(){
              $flow.cancel();
            }, 5000);
          });



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

