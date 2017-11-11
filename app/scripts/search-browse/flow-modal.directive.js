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
          'UrlService',
          'SubmissionService'
        ];


        // TODO
        //
        // 1. fix the way the code is loaded and configured from app.cs.
        // 2. use real ImmPort workspaces
        //


        function flowModalController($scope, $rootScope, $timeout, QueryParamUtilsService, UISettingsService,
                                     UIMessageService, resourceService, TemplateInstanceService, AuthorizedBackendService,
                                     UrlService,
                                     SubmissionService) {

          //
          // init
          //
          $scope.flow;
          $scope.submitted = false;
          $scope.paused = false;
          $scope.complete = false;

          $scope.init = function (flow) {
            $scope.flow = flow;
            //$scope.getWorkspaces();
          };

          //
          // tabs
          //


          var flowNcbiSra = 0;
          var flowImmport = 1;
          var flowLincs = 2;
          $scope.modes = ['<strong>NCBI SRA</strong> - The Sequence Read Archive',
                          '<strong>ImmPort</strong> - The Immunology Database and Analysis Portal',
                          '<strong>LINCS</strong> - Library of Integrated Network-Based Cellular Signatures'];


          $scope.getTarget = function () {
            var result;
            if ($scope.model.selectedMode === flowNcbiSra) {
              result = UrlService.airrSubmission();
            } else if ($scope.model.selectedMode === flowImmport) {
              result = UrlService.immportSubmission();
            } else if ($scope.model.selectedMode === flowLincs) {
              result = UrlService.lincsSubmission();
            }
            return result;
          };

          $scope.setMode = function (mode) {
            $scope.model.selectedMode = mode;
          };

          //
          // workspaces
          //
          $scope.loadingWorkspace;
          $scope.workspaces;
          $scope.workspaceIds;

          $scope.getWorkspaces = function () {

            SubmissionService.getWorkspaces(
                function (response) {
                  // keep the ids in the id map
                  $scope.workspaceIds = response.workspaces.map(function (item) {
                    return item.workspaceID;
                  });
                  // give the name map back to the typeahead directive
                  $scope.workspaces = response.workspaces.map(function (item) {
                    return item.workspaceName;
                  });
                },
                function (error) {
                  UIMessageService.showBackendError('SERVER.WORKSPACE.error', error);
                }
            );
          };

          $scope.getSelectedWorkspaceId = function () {
            if ($scope.model.selectedWorkspace) {
              var index = $scope.workspaces.indexOf($scope.model.selectedWorkspace);
              return $scope.workspaceIds[index];
            }
          };

          //
          // metadata instances
          //

          $scope.model = {
            selectedInstance : undefined,
            selectedWorkspace: undefined,
            selectedMode     : flowNcbiSra
          };
          $scope.loadingInstances;
          $scope.resources = [];
          $scope.metadataFiles = [];

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
            if (!$scope.submitted) {
              for (var i = 0; i < $scope.resources.length; i++) {
                if ($scope.resources[i].name === name) {

                  // get this instance
                  var instanceId = $scope.resources[i]['@id'];
                  AuthorizedBackendService.doCall(
                      TemplateInstanceService.getTemplateInstance(instanceId),
                      function (instanceResponse) {

                        // this needs a timeout or flow vomits
                        $timeout(function () {
                          var blob = new Blob([JSON.stringify(instanceResponse.data, null, 2)],
                              {type: 'application/json'});
                          blob.name = name + '.json';
                          $scope.metadataFiles.push(blob.name);
                          flow.addFile(blob);

                          $scope.model.selectedInstance = '';

                        }, 0);

                      },
                      function (instanceErr) {
                        UIMessageService.showBackendError('SERVER.INSTANCE.load.error', instanceErr);
                      }
                  );
                }
              }
            }
          };

          // load and add the instances to the flow queue
          $scope.insertItemById = function (flow, instanceId, name) {

            if (instanceId && name) {

              AuthorizedBackendService.doCall(
                  TemplateInstanceService.getTemplateInstance(instanceId),
                  function (instanceResponse) {

                    // this needs a timeout or flow vomits
                    $timeout(function () {
                      var blob = new Blob([JSON.stringify(instanceResponse.data, null, 2)],
                          {type: 'application/json'});
                      blob.name = name + '.json';
                      $scope.metadataFiles.push(blob.name);
                      flow.addFile(blob);

                      $scope.model.selectedInstance = '';
                    }, 0);
                  },
                  function (instanceErr) {
                    UIMessageService.showBackendError('SERVER.INSTANCE.load.error', instanceErr);
                  }
              );
            }
          };

          // load and add the instances to the flow queue
          $scope.removeItem = function (flow, file) {
            var index = flow.files.indexOf(file);
            if (index > -1) {
              flow.files.splice(index, 1);
            }
          };

          //
          // flow of control
          //
          $scope.startUpload = function (flow) {

            flow.opts.target = $scope.getTarget();

            // set the parameters for the upload
            flow.opts.query = {
              submissionId : Math.random().toString().replace('.', ''),
              numberOfFiles: flow.files.length,
              metadataFiles: $scope.metadataFiles.join(", "),
              workspaceId  : $scope.getSelectedWorkspaceId()
            };

            // add our bearer token
            flow.opts.headers = AuthorizedBackendService.getConfig().headers;

            // start the upload
            flow.upload();
            $scope.submitted = true;
          };

          $scope.canClear = function (flow) {
            return flow.files.length > 0;
          };

          $scope.canPause = function (flow) {
            return flow.files.length > 0 && flow.isUploading();
          };

          $scope.canResume = function (flow) {
            return $scope.paused;
          };

          $scope.canInsert = function (flow) {
            return !$scope.submitted;
          };


          $scope.canSubmit = function (flow) {
            var validRepo = ($scope.model.selectedWorkspace && $scope.model.selectedMode == flowImmport) || ($scope.model.selectedMode != flowImmport);
            return validRepo && !$scope.complete && !$scope.submitted && flow.files.length > 0;
          };

          $scope.cancelAll = function (flow) {
            $scope.paused = false;
            $scope.submitted = false;
            $scope.complete = false;
            $scope.metadataFiles = [];
            $scope.resources = [];
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

                var instanceId = params[1];
                var name = params[2];

                if (!$scope.flow.isUploading() || $scope.paused) {
                  $scope.cancelAll($scope.flow);

                }

                // modal just opened
                $scope.insertItemById($scope.flow, instanceId, name);

                if (!$scope.workspaces) {
                  // TODO turn this on again later
                  //$scope.getWorkspaces();
                }

                jQuery('#flow-modal input').focus().select();
              }, 0);
            }
          });
        }
      }
    }
);

