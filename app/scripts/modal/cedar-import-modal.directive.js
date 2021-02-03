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
          'UrlService'
        ];

        function cedarImportModalController($scope, $rootScope, $timeout, QueryParamUtilsService, UISettingsService,
                                            UIMessageService, resourceService, TemplateInstanceService,
                                            AuthorizedBackendService,
                                            UrlService) {

          let vm = this;

          vm.uploadState = {
            'submitted': false,
            'paused'   : false,
            'complete' : false,
            'status'   : [],
            'active'   : 0
          };

          vm.generalState = {
            'uploading': false,

            'complete'   : false
          };

          /**
           * Public functions
           */
          vm.init = init;
          vm.getImportUrl = getImportUrl;
          vm.startUpload = startUpload;
          vm.canSubmit = canSubmit;
          vm.getImport

          /**
           * Function definitions
           */
          function init() {
            vm.showValidation = false;
            vm.validationMessages = [];
          };

          function getImportUrl() {
            return UrlService.importCadsrForms();
          };

          function canSubmit(flow) {
            return true;
          };

          function startUpload(flow) {
            flow.opts.target = vm.getImportUrl();
            flow.opts.query = {
              uploadId : Math.random().toString().replace('.', ''),
              numberOfFiles: flow.files.length
            };
            // Add our bearer token
            flow.opts.headers = AuthorizedBackendService.getConfig().headers;
            // Start the upload
            flow.upload();
            vm.uploadState.submitted = true;
          };



          vm.flowComplete = function ($flow) {
            vm.uploadState.status.unshift({'label': 'Upload Complete', 'file': ''});
            vm.uploadState.complete = true;
          };
          vm.flowProgress = function ($flow) {
            vm.uploadState.status.unshift({'label': 'Progress', 'file': ''});
          };
          vm.flowFileProgress = function ($file, $flow) {
            vm.uploadState.status.unshift({'label': 'File Progress', 'file': $file.file.name});
          };
          vm.flowFileSuccess = function ($file, $message, $flow) {
            vm.uploadState.status.unshift({'label': 'File Success', 'file': $file.file.name});
          };
          vm.flowFileAdded = function ($file, $event, $flow) {
            vm.uploadState.status.unshift({'label': 'File Added', 'file': $file.file.name});
          };
          vm.flowFilesAdded = function ($files, $event, $flow) {
            vm.uploadState.status.unshift({'label': 'Files Added', 'file': ''});
          };
          vm.flowFilesSubmitted = function ($files, $event, $flow) {
            vm.uploadState.status.unshift({'label': 'Files Submitted', 'file': ''});
          };
          vm.flowFileRetry = function ($file, $flow) {
            vm.uploadState.status.unshift({'label': 'File Retry', 'file': $file.file.name});
          };
          vm.flowFileError = function ($file, $message, $flow) {
            vm.uploadState.status.unshift({'label': 'File Error', 'file': $file.file.name});
          };
          vm.flowError = function ($file, $message, $flow) {
            vm.uploadState.status.unshift({'label': 'Upload Error ', 'file': $file.file.name});
          };
          vm.flowUploadStarted = function ($flow) {
            vm.uploadState.submitted = true;
            vm.uploadState.status.unshift({'label': 'Upload Started', 'file': ''});
          };

          // vm.getStatus = function () {
          //   let substring = 'Error';
          //   if (vm.uploadState.status.length > 0) {
          //     for (let i = 0; i < vm.uploadState.status.length; i++) {
          //       console.log(vm.uploadState.status[i].label);
          //       if (vm.uploadState.status[i].label.indexOf(substring) !== -1) {
          //         return vm.uploadState.status[i].label;
          //       }
          //     }
          //   }
          // };

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
