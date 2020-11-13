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
          'SubmissionService'
        ];

        function cedarImportModalController($scope, $rootScope, $timeout, QueryParamUtilsService, UISettingsService,
                                            UIMessageService, resourceService, TemplateInstanceService,
                                            AuthorizedBackendService,
                                            UrlService, HttpBuilderService, $translate) {


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
            console.log('initializing');
            console.log(flow);

            $scope.flow = flow;
            $scope.showValidation = false;
            $scope.validationMessages = [];
          };

          $scope.resetValidation = function () {
            $scope.validationMessages = [];
            $scope.showValidation = false;
          };

          $scope.getTarget = function () {
            return UrlService.importCadsrForm();
          };

          //
          // flow of control
          //
          $scope.startUpload = function (flow) {

            flow.opts.target = UrlService.importCadsrForm();

            console.log(UrlService.importCadsrForm());

            console.log(flow.opts.target);

            // set the parameters for the upload
            flow.opts.query = {
              submissionId : Math.random().toString().replace('.', ''),
              numberOfFiles: flow.files.length
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
            let substring = 'Error';
            if ($scope.state.status.length > 0) {
              for (let i = 0; i < $scope.state.status.length; i++) {
                console.log($scope.state.status[i].label);
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


          // TODO
          $scope.canSubmit = function (flow) {
            return true;
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
          $scope.$on('importModalVisible', function (event, params) {

            $scope.resetValidation();

            if (params && params[0]) {
              $timeout(function () {

                // var instanceId = params[1];
                // var name = params[2];

                if (!$scope.flow.isUploading() || $scope.state.paused) {
                  $scope.cancelAll($scope.flow);
                }

                if (!$scope.workspaces) {
                  // TODO turn this on again later for ImmPort
                  //$scope.getWorkspaces();
                }

                jQuery('#import-modal input').focus().select();

              }, 0);
            }
          });
        }

        return {
          bindToController: {
            modalVisible: '='
          },
          controller      : cedarImportModalController,
          controllerAs    : 'importCntl',
          restrict        : 'E',
          templateUrl     : 'scripts/modal/cedar-import-modal.directive.html'
        };

      }
    }
);
