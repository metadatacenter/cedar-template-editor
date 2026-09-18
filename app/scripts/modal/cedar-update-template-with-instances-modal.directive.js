'use strict';

define('cedar/template-editor/modal/cedar-update-template-with-instances-modal.directive', ['angular'], function (angular) {
  angular.module('cedar.templateEditor.modal.cedarUpdateTemplateWithInstancesModalDirective', []).directive(
      'cedarUpdateTemplateWithInstancesModal', function () {
        Controller.$inject = ['$scope', '$rootScope', '$window', '$location', '$timeout',
          'QueryParamUtilsService', 'UIUtilService', 'CedarUser', 'AuthorizedBackendService',
          'TemplateService', 'UIMessageService', 'FrontendUrlService', '$element'];

        function Controller($scope, $rootScope, $window, $location, $timeout, QueryParamUtilsService,
                            UIUtilService, CedarUser, AuthorizedBackendService, TemplateService,
                            UIMessageService, FrontendUrlService, $element) {
          var vm = this;
          vm.saving = false;
          vm.doCancel = function () {
            if (!vm.saving) vm.modalVisible = false;
          };
          function closeEditor() {
            vm.modalVisible = false;
            UIUtilService.setDirty(false);
            function leave() {
              $scope.$evalAsync(function () {
                $location.url(FrontendUrlService.getFolderContents(QueryParamUtilsService.getFolderId()));
              });
            }
            // The header cancels route changes while a Bootstrap modal is open.
            // Wait for its actual close event, not just the Angular visibility flag.
            if (($element.data('bs.modal') || {}).isShown) {
              $element.one('hidden.bs.modal', leave);
              $element.modal('hide');
            } else {
              leave();
            }
          }
          vm.doDiscard = function () {
            if (!vm.saving) closeEditor();
          };
          vm.doAccept = function () {
            if (vm.saving) return;
            vm.saving = true;
            // Version the definition only. Existing instances stay on the original template.
            AuthorizedBackendService.doCall(
                TemplateService.publishCreateDraftTemplate(vm.copyId, vm.copyCopiedForm, null, vm.sourceEtag),
                function (response) {
                  vm.saving = false;
                  closeEditor();
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
              vm.sourceEtag = params[4];
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
