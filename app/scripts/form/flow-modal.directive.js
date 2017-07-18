'use strict';


define([
      'angular'

    ], function (angular) {
      angular.module('cedar.templateEditor.form.flowModal', []).directive('flowModal', flowModal);


      /* new folder modal  */
      function flowModal() {

        var directive = {
          bindToController: {
            modalVisible: '=',
            files       : '=',
            instance    : '='
          },
          controller      : flowModalController,
          controllerAs    : 'flowCntl',
          restrict        : 'E',
          templateUrl     : 'scripts/form/flow-modal.directive.html',
        };
        return directive;

        flowModalController.$inject = [
          '$scope',
          '$rootScope',
          '$timeout',
          'QueryParamUtilsService',
          'UISettingsService',
          'UIMessageService',
          'resourceService',
          '$http'
        ];

        function flowModalController($scope, $rootScope, $timeout, QueryParamUtilsService, UISettingsService,
                                     UIMessageService, resourceService, $http) {
          var vm = this;
          var vm = $scope;

          $scope.totalCount = -1;
          $scope.instanceName;
          $scope.offset = 0;
          $scope.resources = [];
          $scope.loadingInstances;
          $scope.mode = 'ImmPort';

          $scope.setMode = function (mode) {
            $scope.mode = mode;
            console.log($scope.mode);
          };


          // locations
          $scope.selected = undefined;
          $scope.getLocation = function (val) {
            return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
              params: {
                address: val,
                sensor : false
              }
            }).then(function (response) {
              return response.data.results.map(function (item) {
                return item.formatted_address;
              });

            });
          };


          // instances
          $scope.selectedInstance = undefined;
          $scope.instances = function (term) {

            var limit = UISettingsService.getRequestLimit();
            var offset = 0;
            var resourceTypes = ['instance'];
            var sort = 'name';

            return  resourceService.getSearchResourcesPromise(term,
                {
                  resourceTypes: resourceTypes,
                  sort         : sort,
                  limit        : limit,
                  offset       : offset
                },
                function (response) {

                  vm.resources = response.data.resources;
                  return vm.resources.map(function (item) {
                    return item.name;
                  });
                },
                function (error) {
                  UIMessageService.showBackendError('SERVER.SEARCH.error', error);
                }
            );
          };


          $scope.init = function (flow) {
          };

          $scope.insertItems = function (flow, name) {
            $timeout(function () {

              for (var i=0;i<vm.resources.length;i++) {
                if (vm.resources[i].name === name) {
                  // go get this document
                  console.log(vm.resources[i]['@id']);
                }
              }

              var debug = {hello: "world"};
              var blob = new Blob([JSON.stringify(debug, null, 2)], {type: 'application/json'});
              blob.name = name + '.json';
              flow.addFile(blob);
            }, 0);
          };

          $scope.startUpload = function (flow) {
            flow.upload();
          };

          $scope.cancelAll = function (flow) {
            flow.cancel();
          };

          $scope.pauseAll = function (flow) {
            flow.pause();
          };

          $scope.resumeAll = function (flow) {
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

          $scope.flowProgress = function (flow) {
            console.log('flow::progress ');
            console.log(flow);
          };

          $scope.flowFileProgress = function (flow, file) {
            console.log('flow::fileProgress ');
            console.log(file);
          };

          //from the 'UploadCtrl as uploadctrl' controller, which has scope on the whole thing
          $scope.$on('flow::complete', function (event, $flow) {
            console.log('flow::complete');
            $timeout(function () {
              console.log('cancel');
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

