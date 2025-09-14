'use strict';

define('cedar/template-editor/modal/cedar-update-template-with-instances-modal.directive', [
      'angular',
    ], function (angular) {
      angular.module('cedar.templateEditor.modal.cedarUpdateTemplateWithInstancesModalDirective', []).directive(
          'cedarUpdateTemplateWithInstancesModal', cedarUpdateTemplateWithInstancesModalDirective);

      function cedarUpdateTemplateWithInstancesModalDirective() {

        cedarUpdateTemplateWithInstancesModalController.$inject = [
          '$scope',
          '$rootScope',
          '$window',
          '$location',
          '$timeout',
          'QueryParamUtilsService',
          'UIUtilService',
          'CedarUser',
          'AuthorizedBackendService',
          'TemplateService',
          'UIMessageService',
          'FrontendUrlService'
        ];

        function cedarUpdateTemplateWithInstancesModalController($scope, $rootScope, $window, $location, $timeout,
                                                                 QueryParamUtilsService, UIUtilService, CedarUser,
                                                                 AuthorizedBackendService, TemplateService,
                                                                 UIMessageService, FrontendUrlService) {
          var vm = this;
          vm.resource = null;
          vm.copyId = null;
          vm.copyCopiedForm = null;
          vm.hideModal = hideModal;
          vm.modalVisible = false;
          vm.numberOfInstances = 0;
          vm.newFolderName = '';
          vm.updateResource = updateResource;
          vm.selectedOption = 'clone'; // Default to clone option
          vm.templateName = '';
          vm.currentVersion = '';

          // on modal close, scroll to the top the cheap way
          function hideModal() {
            vm.modalVisible = false;
          }

          vm.getTitle = function (resource) {
            if (resource != null) {
              return resource['schema:name'];
            }
          };

          vm.getNumInstances = function (resource) {
            if (resource != null) {
              return resource['numberOfInstances'];
            }
          };

          vm.getNewFolderName = function (resource) {
            if (resource != null) {
              return resource['schema:name'] + ' v ' + resource['pav:version'] + " cloned instances";
            }
          };

          vm.doCancel = function () {
            vm.modalVisible = false;
          }

          vm.doAccept = function () {
            if (vm.selectedOption === 'clone') {
              if (vm.newFolderName && vm.newFolderName.trim()) {
                UIMessageService.flashInfo('DELTAFINDER.ChangedTemplate.cloneNotification');
                vm.doNewVersionWithClones();
              } else {
                UIMessageService.showError('Please enter a folder name for cloned instances.');
                return;
              }
            } else if (vm.selectedOption === 'noClone') {
              vm.doNewVersionNoClones();
            } else if (vm.selectedOption === 'revert') {
              vm.doRevert();
            }
          }

          vm.doRevert = function () {
            vm.modalVisible = false;
            $timeout(function () {
              window.location.reload();
              $window.scrollTo(0, 0);
            }, 500);
          }

          vm.doNewVersionWithClones = function () {
            vm.modalVisible = false;

            AuthorizedBackendService.doCall(
                TemplateService.publishCreateDraftTemplate(vm.copyId, vm.copyCopiedForm, vm.newFolderName),
                function (response) {
                  var newTemplateId = response.data['@id'];
                  var newVersion = response.data['pav:version'];
                  var newTitle = response.data['schema:name'];
                  var folderId = QueryParamUtilsService.getFolderId();
                  $location.path(FrontendUrlService.getTemplateEdit(newTemplateId, folderId));
                  UIMessageService.flashSuccess('DELTAFINDER.DestructiveDetected.create.success',
                      {"title": newTitle, "version": newVersion},
                      'GENERIC.Created');
                },
                function (err) {
                  UIMessageService.showBackendError('SERVER.TEMPLATE.update.error', err);
                  owner.enableSaveButton();
                }
            );

          };

          vm.doNewVersionNoClones = function () {
            vm.modalVisible = false;

            AuthorizedBackendService.doCall(
                TemplateService.publishCreateDraftTemplate(vm.copyId, vm.copyCopiedForm, null),
                function (response) {
                  var newTemplateId = response.data['@id'];
                  var newVersion = response.data['pav:version'];
                  var newTitle = response.data['schema:name'];
                  var folderId = QueryParamUtilsService.getFolderId();
                  $location.path(FrontendUrlService.getTemplateEdit(newTemplateId, folderId));
                  UIMessageService.flashSuccess('DELTAFINDER.DestructiveDetected.create.success',
                      {"title": newTitle, "version": newVersion},
                      'GENERIC.Created');
                },
                function (err) {
                  UIMessageService.showBackendError('SERVER.TEMPLATE.update.error', err);
                  owner.enableSaveButton();
                }
            );
          };

          // on modal open
          $scope.$on('updateTemplateWithInstancesModalVisible', function (event, params) {

            var visible = params[0];
            var resource = params[1]['data'];
            vm.copyId = params[2];
            vm.copyCopiedForm = params[3];

            if (visible && resource) {
              vm.resource = resource;
              vm.modalVisible = visible;
              vm.title = vm.getTitle(resource);
              vm.numberOfInstances = vm.getNumInstances(resource);
              vm.newFolderName = vm.getNewFolderName(resource);
              vm.templateName = resource['schema:name'] || 'Unknown Template';
              vm.currentVersion = resource['oldVersion'] || '0.0.0';
              vm.selectedOption = 'clone'; // Reset to default when opening
            }
          });

          //TODO: move this to a service. It appears in many places
          vm.goToDashboardOrBack = function () {
            //vm.searchTerm = null;
            UIUtilService.activeLocator = null;
            UIUtilService.activeZeroLocator = null;
            var path = $location.path();
            var hash = $location.hash();
            var baseUrl = '/dashboard';
            if (path != baseUrl) {
              var queryParams = {};
              var sharing = QueryParamUtilsService.getSharing();
              if (sharing) {
                queryParams['sharing'] = sharing;
              }
              var folderId = QueryParamUtilsService.getFolderId() || CedarUser.getHomeFolderId();
              if (folderId) {
                queryParams['folderId'] = folderId;
              }
            }
            var url = $rootScope.util.buildUrl(baseUrl, queryParams);
            if (hash) {
              url += '#' + hash;
            }
            $timeout(function () {
              $location.url(url);
              $window.scrollTo(0, 0);
            }, 500);
          };

          function updateResource() {
            // Placeholder for update resource functionality
            console.log('updateResource called');
          }
        }

        let directive = {
          bindToController: {
            modalVisible: '='
          },
          controller      : cedarUpdateTemplateWithInstancesModalController,
          controllerAs    : 'publish',
          restrict        : 'E',
          templateUrl     : 'scripts/modal/cedar-update-template-with-instances-modal.directive.html'
        };

        return directive;

      }
    }
);
