'use strict';


define([
      'angular'

    ], function (angular) {
      angular.module('cedar.templateEditor.searchBrowse.flowModal', []).directive('flowModal', flowModal);


      /* new folder modal  */
      function flowModal() {

        var directive = {
          bindToController: {
            modalVisible: '='
          },
          controller      : flowModalController,
          controllerAs    : 'flowCntl',
          restrict        : 'E',
          templateUrl     : 'scripts/search-browse/flow-modal.directive.html',
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
          'TemplateInstanceService',
          'AuthorizedBackendService',
          'UrlService'
        ];


        // TODO
        //
        // 1. fix the way the code is loaded and configured from app.cs.
        // 2. use real ImmPort workspaces
        //


        function flowModalController($scope, $rootScope, $timeout, QueryParamUtilsService, UISettingsService,
                                     UIMessageService, resourceService, TemplateInstanceService, AuthorizedBackendService, UrlService) {


          //
          // init
          //
          $scope.flow;
          $scope.submitted = false;
          $scope.paused = false;
          $scope.complete = false;
          $scope.init = function (flow) {
            $scope.flow = flow;
          };

          //
          // tabs
          //
          $scope.modes = ['<strong>ImmPort</strong> - The Immunology Database and Analysis Portal',
                          '<strong>AIRR</strong> - Adaptive Immune Receptor Repertoire',
                          '<strong>LINCS</strong> - Library of Integrated Network-Based Cellular Signatures'];
          $scope.selectedMode = 0;

          $scope.getTarget = function () {
            var result;
            if ($scope.selectedMode === 0) {
              result = UrlService.immportSubmission();
            } else if ($scope.selectedMode === 1) {
              result = UrlService.airrSubmission();
            } else if ($scope.selectedMode === 2) {
              result = UrlService.lincsSubmission();
            }
            return result;
          };

          $scope.setMode = function (mode) {
            $scope.selectedMode = mode;
          };

          //
          // workspaces
          //
          $scope.selectedWorkspace = undefined;
          $scope.loadingWorkspace;
          $scope.workspaces = ['Test Environment for CEDAR', 'cedaruser_cedaruser_Workspace'];
          $scope.dummyWorkspaceResponse = {
            "success"   : true,
            "workspaces": [
              {
                "workspaceID"  : "100001",
                "workspaceName": "Test Environment for CEDAR"
              },
              {
                "workspaceID"  : "5733",
                "workspaceName": "cedaruser_cedaruser_Workspace"
              }
            ]
          };

          //
          // metadata instances
          //

          $scope.xx = {};       // xx or something like it is required because of Angular's ng-model, scope and dot notation
          $scope.xx.selectedInstance = undefined;
          $scope.loadingInstances;
          $scope.resources = [];
          $scope.instances = function (term) {

            var limit = UISettingsService.getRequestLimit();
            var offset = 0;
            var resourceTypes = ['instance'];
            var sort = 'name';

            return resourceService.getSearchResourcesPromise(term,
                {
                  resourceTypes: resourceTypes,
                  sort         : sort,
                  limit        : limit,
                  offset       : offset
                },
                function (response) {
                  // keep the full data in the resources array
                  // give the name map back to the typeahead directive
                  $scope.resources = response.data.resources;
                  return $scope.resources.map(function (item) {
                    return item.name;
                  });
                },
                function (error) {
                  UIMessageService.showBackendError('SERVER.SEARCH.error', error);
                }
            );
          };

          // load and add the instances to the flow queue
          $scope.insertItems = function (flow, name) {
            for (var i = 0; i < $scope.resources.length; i++) {
              if ($scope.resources[i].name === name) {

                // get this instance
                var instanceId = $scope.resources[i]['@id'];
                AuthorizedBackendService.doCall(
                    TemplateInstanceService.getTemplateInstance(instanceId),
                    function (instanceResponse) {

                      // this needs a timeout or flow vomits
                      $timeout(function () {
                        var blob = new Blob([JSON.stringify(instanceResponse.data, null, 2)], {type: 'application/json'});
                        blob.name = name + '.json';
                        flow.addFile(blob);

                        $scope.xx.selectedInstance = '';

                      }, 0);

                    },
                    function (instanceErr) {
                      UIMessageService.showBackendError('SERVER.INSTANCE.load.error', instanceErr);
                    }
                );
              }
            }
          };

          //
          // flow of control
          //
          $scope.startUpload = function (flow) {

            flow.opts.target = $scope.getTarget();
            flow.opts.query = {submissionId: Math.random().toString().replace('.', ''), numberOfFiles: flow.files.length};
            flow.opts.headers = AuthorizedBackendService.getConfig().headers;

            flow.upload();
            $scope.submitted = true;
          };

          $scope.canClear = function (flow) {
            return flow.files.length > 0;
          };

          $scope.canPause = function (flow) {
            return flow.files.length > 0  && flow.isUploading();
          };

          $scope.canResume = function (flow) {
            return $scope.paused;
          };


          $scope.canSubmit = function (flow) {
            var validRepo = ($scope.selectedWorkspace && $scope.selectedMode ==0) || ($scope.selectedMod != 0);
            return validRepo && !$scope.complete && !$scope.submitted &&  flow.files.length > 0;
          };

          $scope.cancelAll = function (flow) {
            $scope.paused = false;
            $scope.submitted = false;
            $scope.complete = false;
            flow.cancel();
          };

          $scope.pauseAll = function (flow) {
            $scope.paused = true;
            flow.pause();
          };

          $scope.resumeAll = function (flow) {
            $scope.paused = false;
            flow.resume();
          };

          $scope.$on('flow::fileAdded', function (event, $flow, flowFile) {
          });

          $scope.$on('flow::progress', function (event, $flow, flowFile) {
          });

          $scope.flowProgress = function (flow) {
          };

          $scope.flowFileProgress = function (flow, file) {
          };

          $scope.$on('flow::uploadStart', function (event, $flow, flowFile) {
            $scope.submitted = true;

          });

          // TODO not seeing this event coming through
          // $scope.$on('flow::complete', function (event, $flow) {
          //   console.log('flow::complete');
          //   $scope.complete = true;
          //   $timeout(function () {
          //     $flow.cancel();
          //   }, 5000);
          // });

          // modal open or closed
          $scope.$on('flowModalVisible', function (event, params) {

            if (params && params[0]) {
              $timeout(function () {
                // modal just opened
                if (!$scope.flow.isUploading()  || $scope.paused) {
                  $scope.flow.cancel();
                  $scope.submitted = false;
                  $scope.complete = false;
                  $scope.paused = false;
                }
                jQuery('#flow-modal input').focus().select();
              }, 0);
            }
          });
        }
      }
    }
);

