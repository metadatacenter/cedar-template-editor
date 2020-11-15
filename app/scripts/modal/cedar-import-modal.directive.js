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

          vm.state = {
            'submitted': false,
            'paused'   : false,
            'complete' : false,
            'status'   : [],
            'active'   : 0
          };

          /**
           * Public functions
           */
          vm.init = init;
          vm.getTarget = getTarget;
          vm.startUpload = startUpload;
          vm.canSubmit = canSubmit;

          /**
           * Function definitions
           */
          function init() {
            vm.showValidation = false;
            vm.validationMessages = [];
          };

          function getTarget() {
            return UrlService.importCadsrForm();
          };

          function canSubmit(flow) {
            return true;
          };

          function startUpload(flow) {
            flow.opts.target = vm.getTarget();

            console.log("Target", flow.opts.target);

            // set the parameters for the upload
            flow.opts.query = {
              uploadId : Math.random().toString().replace('.', ''),
              numberOfFiles: flow.files.length
            };
            // add our bearer token
            flow.opts.headers = AuthorizedBackendService.getConfig().headers;
            // start the upload
            flow.upload();
            vm.state.submitted = true;
          };

          vm.flowComplete = function ($flow) {
            vm.state.status.unshift({'label': 'Upload Complete', 'file': ''});
            vm.state.complete = true;
          };
          vm.flowProgress = function ($flow) {
            vm.state.status.unshift({'label': 'Progress', 'file': ''});
          };
          vm.flowFileProgress = function ($file, $flow) {
            vm.state.status.unshift({'label': 'File Progress', 'file': $file.file.name});
          };
          vm.flowFileSuccess = function ($file, $message, $flow) {
            vm.state.status.unshift({'label': 'File Success', 'file': $file.file.name});
          };
          vm.flowFileAdded = function ($file, $event, $flow) {
            vm.state.status.unshift({'label': 'File Added', 'file': $file.file.name});
          };
          vm.flowFilesAdded = function ($files, $event, $flow) {
            vm.state.status.unshift({'label': 'Files Added', 'file': ''});
          };
          vm.flowFilesSubmitted = function ($files, $event, $flow) {
            vm.state.status.unshift({'label': 'Files Submitted', 'file': ''});
          };
          vm.flowFileRetry = function ($file, $flow) {
            vm.state.status.unshift({'label': 'File Retry', 'file': $file.file.name});
          };
          vm.flowFileError = function ($file, $message, $flow) {
            vm.state.status.unshift({'label': 'File Error', 'file': $file.file.name});
          };
          vm.flowError = function ($file, $message, $flow) {
            vm.state.status.unshift({'label': 'Upload Error ', 'file': $file.file.name});
          };
          vm.flowUploadStarted = function ($flow) {
            vm.state.submitted = true;
            vm.state.status.unshift({'label': 'Upload Started', 'file': ''});
          };

          vm.getStatus = function () {
            let substring = 'Error';
            if (vm.state.status.length > 0) {
              for (let i = 0; i < vm.state.status.length; i++) {
                console.log(vm.state.status[i].label);
                if (vm.state.status[i].label.indexOf(substring) !== -1) {
                  return vm.state.status[i].label;
                }
              }
            }
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
