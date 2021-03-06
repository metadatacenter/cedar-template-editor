'use strict';


define([
      'angular'

    ], function (angular) {
      angular.module('cedar.templateEditor.searchBrowse.flowModal', []).directive('flowModal', flowModal);

      /* new folder modal  */
      function flowModal() {

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
          'HttpBuilderService',
          'SubmissionService',
          '$translate'
        ];


        // TODO
        //
        // 1. fix the way the code is loaded and configured from app.cs.
        // 2. use real ImmPort workspaces
        //


        function flowModalController($scope, $rootScope, $timeout, QueryParamUtilsService, UISettingsService,
                                     UIMessageService, resourceService, TemplateInstanceService, AuthorizedBackendService,
                                     UrlService, HttpBuilderService, SubmissionService, $translate) {

          //
          // init
          //
          $scope.flow;
          $scope.state = {
            'submitted': false,
            'paused'   : false,
            'complete' : false,
            'status'   : [],
            'active'   : false
          };

          $scope.showValidation;
          $scope.validationMessages;

          $scope.init = function (flow) {
            $scope.flow = flow;
            $scope.showValidation = false;
            $scope.validationMessages = [];
          };

          $scope.isTest = false;
          $scope.testData = function () {
            $timeout(function () {
              $scope.flowUploadStarted();
              $scope.flowFileProgress({'file': {'name': 'file name'}});
              $scope.flowFileProgress({'file': {'name': 'file name'}});
              $scope.flowFileProgress({'file': {'name': 'file name'}});
              $scope.flowFileProgress({'file': {'name': 'file name'}});
              $scope.flowFileSuccess({'file': {'name': 'file name'}});
              $scope.flowFileProgress({'file': {'name': 'file name'}});
              $scope.flowFileProgress({'file': {'name': 'file name'}});
              $scope.flowFileProgress({'file': {'name': 'file name'}});
              $scope.flowFileProgress({'file': {'name': 'file name'}});
              $scope.flowFileSuccess({'file': {'name': 'file name'}});
              $scope.flowFileProgress({'file': {'name': 'file name'}});
              $scope.flowFileProgress({'file': {'name': 'file name'}});
              $scope.flowFileProgress({'file': {'name': 'file name'}});
              $scope.flowFileProgress({'file': {'name': 'file name'}});
              $scope.flowFileSuccess({'file': {'name': 'file name'}});
              $scope.flowFileProgress({'file': {'name': 'file name'}});
              $scope.flowFileProgress({'file': {'name': 'file name'}});
              $scope.flowFileProgress({'file': {'name': 'file name'}});
              $scope.flowFileProgress({'file': {'name': 'file name'}});
              $scope.flowFileSuccess({'file': {'name': 'file name'}});
              $scope.flowFileProgress({'file': {'name': 'file name'}});
              $scope.flowFileProgress({'file': {'name': 'file name'}});
              $scope.flowFileProgress({'file': {'name': 'file name'}});
              $scope.flowFileProgress({'file': {'name': 'file name'}});
              $scope.flowFileSuccess({'file': {'name': 'file name'}});
              $scope.flowFileProgress({'file': {'name': 'file name'}});
              $scope.flowFileProgress({'file': {'name': 'file name'}});
              $scope.flowFileProgress({'file': {'name': 'file name'}});
              $scope.flowFileProgress({'file': {'name': 'file name'}});
              $scope.flowFileSuccess({'file': {'name': 'file name'}});
              $scope.flowComplete();
            }, 10000);
          };

          var flowNcbi = 0;
          var flowNcbiMiAIRR = 1;
          var flowImmport = 2;
          var flowLincs = 3;
          $scope.modes = ['<strong>NCBI (Human Tissue)</strong> - NCBI\'s BioProject, BioSample and SRA following the BioSample Human package v1.0',
                          '<strong>NCBI MiAIRR</strong> - NCBI\'s BioProject, BioSample and SRA following the MiARR standard',
                          '<strong>ImmPort</strong> - The Immunology Database and Analysis Portal',
                          '<strong>LINCS</strong> - Library of Integrated Network-Based Cellular Signatures'];


          $scope.getTarget = function () {
            var result;
            if ($scope.model.selectedMode === flowNcbi) {
              result = UrlService.ncbiSubmission();
            } else if ($scope.model.selectedMode === flowNcbiMiAIRR) {
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
            selectedMode     : flowNcbi
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

          // load and add the instance to the flow queue
          $scope.insertItems = function (flow, name) {
            if (!$state.submitted) {
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

                          $scope.model.selectedInstance = instanceResponse.data;

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

          // load and add the instance to the flow queue
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

                      $scope.model.selectedInstance = instanceResponse.data;

                      // Read the value of the the submission_pipeline hidden field from the instance to decide what pipeline should be used to submit this instance
                      var pipelineFieldName = 'submission_pipeline';
                      if ((pipelineFieldName in instanceResponse.data) && ('@value' in instanceResponse.data[pipelineFieldName])) {
                        var pipeline = instanceResponse.data[pipelineFieldName]['@value'];
                        if (pipeline.toUpperCase() == 'NCBI-HUMAN') {
                          $scope.setMode(flowNcbi);
                        }
                        else if (pipeline.toUpperCase() == 'NCBI-MIAIRR') {
                          $scope.setMode(flowNcbiMiAIRR);
                        }
                        else {
                          $scope.setMode(flowNcbi); // Default submission pipeline
                        }
                      }
                      else { // if there is no submission_pipeline value
                        if (name.toLowerCase().includes('miairr')) {
                          $scope.setMode(flowNcbiMiAIRR);
                        }
                        else {
                          $scope.setMode(flowNcbi); // Default submission pipeline
                        }
                      }

                    }, 0);
                  },
                  function (instanceErr) {
                    UIMessageService.showBackendError('SERVER.INSTANCE.load.error', instanceErr);
                  }
              );
            }
          };

          $scope.isFlowDisabled = function (flowId) {
            if (flowId == $scope.model.selectedMode) {
              return false;
            }
            else {
              return true;
            }
          };

          // load and add the instances to the flow queue
          $scope.removeItem = function (flow, file) {
            var index = flow.files.indexOf(file);
            if (index > -1) {
              flow.files.splice(index, 1);
            }
          };

          /**
           * Performs the final validation before submission
           * @param flow
           */
          $scope.submit = function (flow) {
            var selectedFileNames = [];
            flow.files.forEach(function (flowFile) {
              if (flowFile.file.type != 'application/json') { // Ignore the metadata file
                selectedFileNames.push(flowFile.name)
              }
            });

            var instanceAndFilenames = {
              "instance" : $scope.model.selectedInstance,
              "userFileNames": selectedFileNames
            };

            let url;
            if ($scope.model.selectedMode == 0) {
              url = UrlService.ncbiValidation();
            }
            else {
              url = UrlService.airrValidation();
            }

            AuthorizedBackendService.doCall(
                HttpBuilderService.post(url, instanceAndFilenames),

                function (response) {

                  if (response.data.isValid == false) {
                    $scope.showValidation = true;
                    $scope.validationMessages = response.data.messages;
                  }
                  else {
                    // We start the submission
                    $scope.startUpload(flow);
                  }
                },
                function (err) {
                  UIMessageService.showBackendError($translate.instant('VALIDATION.externalValidation'), err);
                }
            );
          };

          $scope.resetValidation = function() {
            $scope.validationMessages = [];
            $scope.showValidation = false;
          }

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
            $scope.state.submitted = true;
          };

          $scope.flowComplete = function ($flow) {
            $scope.state.status.unshift({'label': 'Upload Complete', 'file': ''});
            $scope.state.complete = true;
          };
          $scope.flowProgress = function ($flow) {
            $scope.state.status.unshift({'label': 'Progress', 'file': ''});
          };
          $scope.flowFileProgress = function ($file, $flow) {
            $scope.state.status.unshift({'label': 'File Progress', 'file': $file.file.name});
          };
          $scope.flowFileSuccess = function ($file, $message, $flow) {
            $scope.state.status.unshift({'label': 'File Success', 'file': $file.file.name});
          };
          $scope.flowFileAdded = function ($file, $event, $flow) {
            $scope.state.status.unshift({'label': 'File Added', 'file': $file.file.name});
          };
          $scope.flowFilesAdded = function ($files, $event, $flow) {
            $scope.state.status.unshift({'label': 'Files Added', 'file': ''});
          };
          $scope.flowFilesSubmitted = function ($files, $event, $flow) {
            $scope.state.status.unshift({'label': 'Files Submitted', 'file': ''});
          };
          $scope.flowFileRetry = function ($file, $flow) {
            $scope.state.status.unshift({'label': 'File Retry', 'file': $file.file.name});
          };
          $scope.flowFileError = function ($file, $message, $flow) {
            $scope.state.status.unshift({'label': 'File Error', 'file': $file.file.name});
          };
          $scope.flowError = function ($file, $message, $flow) {
            $scope.state.status.unshift({'label': 'Upload Error ', 'file': $file.file.name});
          };
          $scope.flowUploadStarted = function ($flow) {
            $scope.state.submitted = true;
            $scope.state.status.unshift({'label': 'Upload Started', 'file': ''});
          };

          $scope.getStatus = function () {
            var substring = 'Error';
            if ($scope.state.status.length > 0) {

              for (var i = 0; i < $scope.state.status.length; i++) {
                if ($scope.state.status[i].label.indexOf(substring) !== -1) {
                  return $scope.state.status[i].label;
                }
              }
            }
          };

          $scope.canClear = function (flow) {
            return flow.files.length > 0;
          };

          $scope.canPause = function (flow) {
            return flow.files.length > 0 && flow.isUploading();
          };

          $scope.canResume = function (flow) {
            return $scope.state.paused;
          };

          $scope.canInsert = function (flow) {
            return !$scope.state.submitted;
          };

          $scope.canSubmit = function (flow) {
            var validRepo = ($scope.model.selectedWorkspace && $scope.model.selectedMode == flowImmport) || ($scope.model.selectedMode != flowImmport);
            // We check that the selected files are more than 1 to ensure that the user is uploading the instance plus at least one additional file
            return validRepo && !$scope.state.complete && !$scope.state.submitted && flow.files.length > 1;
          };

          $scope.cancelAll = function (flow) {
            //reset state and cancel flow in progress
            $scope.state.submitted = false;
            $scope.state.paused = false;
            $scope.state.complete = false;
            $scope.state.status = [];
            $scope.metadataFiles = [];
            $scope.resources = [];
            flow.cancel();

            // reset active tab
            $timeout(function () {
              $scope.state.active = 0;
            }, 0);
          };

          $scope.pauseAll = function (flow) {
            $scope.state.paused = true;
            flow.pause();
          };

          $scope.resumeAll = function (flow) {
            $scope.state.paused = false;
            flow.resume();
          };

          // modal open or closed
          $scope.$on('flowModalVisible', function (event, params) {

            $scope.resetValidation();

            if (params && params[0]) {
              $timeout(function () {

                var instanceId = params[1];
                var name = params[2];

                if (!$scope.flow.isUploading() || $scope.state.paused) {
                  $scope.cancelAll($scope.flow);
                }

                // modal just opened
                $scope.insertItemById($scope.flow, instanceId, name);

                if (!$scope.workspaces) {
                  // TODO turn this on again later for ImmPort
                  //$scope.getWorkspaces();
                }

                jQuery('#flow-modal input').focus().select();

                // insert test data
                if ($scope.isTest) {
                  $scope.testData();
                }
              }, 0);
            }
          });
        }

        let directive = {
          bindToController: {
            modalVisible: '='
          },
          controller      : flowModalController,
          controllerAs    : 'flowCntl',
          restrict        : 'E',
          templateUrl     : 'scripts/search-browse/flow-modal.directive.html',
        };
        return directive;

      }
    }
);

