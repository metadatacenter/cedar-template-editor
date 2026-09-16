'use strict';

define('cedar/template-editor/modal/cedar-update-template-with-instances-modal.directive', ['angular'], function (angular) {
  angular.module('cedar.templateEditor.modal.cedarUpdateTemplateWithInstancesModalDirective', []).directive(
      'cedarUpdateTemplateWithInstancesModal', function () {
        Controller.$inject = ['$scope', '$rootScope', '$window', '$location', '$timeout',
          'QueryParamUtilsService', 'UIUtilService', 'CedarUser', 'AuthorizedBackendService',
          'TemplateService', 'UIMessageService', 'FrontendUrlService'];

        function Controller($scope, $rootScope, $window, $location, $timeout, QueryParamUtilsService,
                            UIUtilService, CedarUser, AuthorizedBackendService, TemplateService,
                            UIMessageService, FrontendUrlService) {
          var vm = this;
          vm.saving = false;
          vm.doCancel = function () {
            if (!vm.saving) vm.modalVisible = false;
          };
          vm.doAccept = function () {
            if (vm.saving) return;
            vm.saving = true;
            // Version the definition only. Existing instances stay on the original template.
            AuthorizedBackendService.doCall(
                TemplateService.publishCreateDraftTemplate(vm.copyId, vm.copyCopiedForm, null),
                function (response) {
                  vm.saving = false;
                  vm.modalVisible = false;
                  UIUtilService.setDirty(false);
                  $location.path(FrontendUrlService.getTemplateEdit(response.data['@id'], QueryParamUtilsService.getFolderId()));
                  UIMessageService.flashSuccess('DELTAFINDER.DestructiveDetected.create.success',
                      {title: response.data['schema:name'], version: response.data['pav:version']}, 'GENERIC.Created');
                },
                function (error) {
                  vm.saving = false;
                  UIMessageService.showBackendError('SERVER.TEMPLATE.update.error', error);
                });
          };
          $scope.$on('updateTemplateWithInstancesModalVisible', function (event, params) {
            if (params[0] && params[1].data) {
              var resource = params[1].data;
              vm.copyId = params[2];
              vm.copyCopiedForm = params[3];
              vm.templateName = vm.copyCopiedForm['schema:name'];
              vm.currentVersion = resource.oldVersion;
              vm.numberOfInstances = resource.numberOfInstances;
              vm.saving = false;
              vm.modalVisible = true;
            }
          });
        }
        return {
          bindToController: {modalVisible: '='},
          controller: Controller,
          controllerAs: 'publish',
          restrict: 'E',
          templateUrl: 'scripts/modal/cedar-update-template-with-instances-modal.directive.html'
        };
      });
});
