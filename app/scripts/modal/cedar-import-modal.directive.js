'use strict';

define([
      'angular'
    ], function (angular) {
      angular.module('cedar.templateEditor.modal.cedarImportModalDirective', []).directive('cedarImportModal',
          cedarImportModalDirective);

      function cedarImportModalDirective() {

        cedarImportModalController.$inject = [
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
          'ImportService'
        ];

        function cedarImportModalController($scope, $rootScope, $timeout, QueryParamUtilsService, UISettingsService,
                                            UIMessageService, resourceService, TemplateInstanceService,
                                            AuthorizedBackendService,
                                            UrlService, ImportService) {

          let vm = this;

          // Keeps track of the upload status. Used by ng-flow
          vm.uploadStatus = {
            'submitted': false,
            'paused'   : false,
            'complete' : false,
            'status'   : [],
            'active'   : 0
          };

          // General status, including the upload process
          vm.importStatus = {};

          vm.importFileStatus = {
            UPLOADING      : {"value": "uploading", "message": "Uploading"},
            UPLOAD_COMPLETE: {"value": "uploaded", "message": "Queued"},
            IMPORTING      : {"value": "importing", "message": "Importing"},
            IMPORT_COMPLETE: {"value": "complete", "message": "Complete"},
            ERROR          : {"value": "error", "message": "Error"},
          };

          vm.importFileReport = {};

          // Statuses used in the Impex Server. Update if the Api changes
          const importFileStatusRestApi = {
            PENDING    : "PENDING",
            IN_PROGRESS: "IN_PROGRESS",
            COMPLETE   : "COMPLETE"
          };

          /**
           * Public functions
           */
          vm.getImportUrl = getImportUrl;
          vm.startUpload = startUpload;
          vm.getImportStatus = getImportStatus;
          vm.isImportComplete = isImportComplete;
          vm.getImportFileReport = getImportFileReport;
          vm.resetModal = resetModal;

          /**
           * Function definitions
           */

          function getImportUrl() {
            return UrlService.importCadsrForms();
          };

          let importRefreshInterval; // Used to stop refreshing the status once the import is complete

          function startUpload(flow) {
            flow.opts.target = vm.getImportUrl();
            flow.opts.query = {
              uploadId     : Math.random().toString().replace('.', ''),
              numberOfFiles: flow.files.length
            };
            flow.opts.headers = AuthorizedBackendService.getConfig().headers;
            flow.upload();
            vm.uploadStatus.submitted = true;

            // Initialize status
            for (const file of flow.files) {
              vm.importStatus[file.file.name] = vm.importFileStatus.UPLOADING;
            }

            refreshImportStatus(flow.files, flow.opts.query.uploadId);
            // Refresh the import status periodically
            importRefreshInterval = setInterval(function () {
              refreshImportStatus(flow.files, flow.opts.query.uploadId);
            }, 2000);
          };

          function refreshImportStatus(files, uploadId) {

            if (vm.uploadStatus.complete) {
              return AuthorizedBackendService.doCall(
                  ImportService.getImportStatus(uploadId),
                  function (response) {
                    vm.importStatus = {};
                    vm.importFileReport = {};
                    if (response.data.filesImportStatus) {
                      let keys = Object.keys(response.data.filesImportStatus);
                      for (const key of keys) {
                        vm.importFileReport[key] = response.data.filesImportStatus[key].report;
                        let status = response.data.filesImportStatus[key].importStatus;
                        if (status == importFileStatusRestApi.PENDING) {
                          // this 'if' shouldn't have any effect since this status was already set by 'flowFileSuccess'
                          vm.importStatus[key] = vm.importFileStatus.UPLOAD_COMPLETE;
                        } else if (status == importFileStatusRestApi.IN_PROGRESS) {
                          vm.importStatus[key] = vm.importFileStatus.IMPORTING;
                        } else if (status == importFileStatusRestApi.COMPLETE) {
                          vm.importStatus[key] = vm.importFileStatus.IMPORT_COMPLETE;
                        } else {
                          console.error('Unknown import status: ' + status);
                        }
                      }
                      // If the import process is complete for all the files, stop refreshing the import status
                      if (isImportComplete()) {
                        clearInterval(importRefreshInterval);
                      }
                    }
                  },
                  function (err) {
                    clearInterval(importRefreshInterval);
                    UIMessageService.showBackendError('IMPEX.error', err);
                    return err;
                  }
              );
            }
          };

          function getImportStatus(fileName) {
            if (vm.importStatus[fileName]) {
              return vm.importStatus[fileName];
            }
          };

          // Checks if the import process is complete or errored
          function isImportComplete() {
            if (!vm.uploadStatus.complete) { // Upload is not complete yet, so import is not complete either
              return false;
            }
            for (const key of Object.keys(vm.importStatus)) {
              if (vm.importStatus[key] != vm.importFileStatus.IMPORT_COMPLETE && vm.importStatus[key] != vm.importFileStatus.ERROR) {
                return false;
              }
            }
            return true;
          };

          function getImportFileReport(fileName) {
            if (vm.importFileReport[fileName]) {
              return vm.importFileReport[fileName];
            }
          };

          // If the import process is complete, resets the modal. If the process is not complete, the user can reopen
          // the modal and check the status.
          function resetModal(flow) {
            if (isImportComplete()) {
              flow.cancel();
              vm.uploadStatus = {
                'submitted': false,
                'paused'   : false,
                'complete' : false,
                'status'   : [],
                'active'   : 0
              };
              vm.importStatus = {};
            }
          };

          vm.flowComplete = function ($flow) {
            vm.uploadStatus.status.unshift({'label': 'Upload Complete', 'file': ''});
            vm.uploadStatus.complete = true;
          };
          vm.flowProgress = function ($flow) {
            vm.uploadStatus.status.unshift({'label': 'Progress', 'file': ''});
          };
          vm.flowFileProgress = function ($file, $flow) {
            vm.uploadStatus.status.unshift({'label': 'File Progress', 'file': $file.file.name});
          };
          vm.flowFileSuccess = function ($file, $message, $flow) {
            vm.importStatus[$file.file.name] = vm.importFileStatus.UPLOAD_COMPLETE
            vm.uploadStatus.status.unshift({'label': 'File Success', 'file': $file.file.name});
          };
          vm.flowFileAdded = function ($file, $event, $flow) {
            vm.uploadStatus.status.unshift({'label': 'File Added', 'file': $file.file.name});
          };
          vm.flowFilesAdded = function ($files, $event, $flow) {
            vm.uploadStatus.status.unshift({'label': 'Files Added', 'file': ''});
          };
          vm.flowFilesSubmitted = function ($files, $event, $flow) {
            vm.uploadStatus.status.unshift({'label': 'Files Submitted', 'file': ''});
          };
          vm.flowFileRetry = function ($file, $flow) {
            vm.uploadStatus.status.unshift({'label': 'File Retry', 'file': $file.file.name});
          };
          vm.flowFileError = function ($file, $message, $flow) {
            vm.importStatus[$file.file.name] = vm.importFileStatus.ERROR;
            vm.uploadStatus.status.unshift({'label': 'File Error', 'file': $file.file.name});
          };
          vm.flowError = function ($file, $message, $flow) {
            vm.uploadStatus.status.unshift({'label': 'Upload Error ', 'file': $file.file.name});
          };
          vm.flowUploadStarted = function ($flow) {
            vm.uploadStatus.submitted = true;
            vm.uploadStatus.status.unshift({'label': 'Upload Started', 'file': ''});
          };

          // modal open or closed
          $scope.$on('importModalVisible', function (event, params) {
          });
        }

        return {
          bindToController: {
            modalVisible: '='
          },
          controller      : cedarImportModalController,
          controllerAs    : 'import',
          restrict        : 'E',
          templateUrl     : 'scripts/modal/cedar-import-modal.directive.html'
        };

      }
    }
);
