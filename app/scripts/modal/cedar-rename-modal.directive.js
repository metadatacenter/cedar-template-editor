'use strict';

define([
      'angular',
      'cedar/template-editor/service/cedar-user',
    ], function (angular) {
      angular.module('cedar.templateEditor.modal.cedarRenameModalDirective', [
        'cedar.templateEditor.service.cedarUser'
      ]).directive('cedarRenameModal', cedarRenameModalDirective);

      cedarRenameModalDirective.$inject = ['CedarUser', "DataManipulationService"];

      function cedarRenameModalDirective(CedarUser, DataManipulationService) {

        cedarRenameModalController.$inject = [
          '$scope',
          '$timeout',
          'resourceService',
          'UIMessageService',
          'AuthorizedBackendService'
        ];

        function cedarRenameModalController($scope,
                                            $timeout,
                                            resourceService,
                                            UIMessageService,
                                            AuthorizedBackendService) {
          var vm = this;

          vm.modalVisible = false;
          vm.renameResource = null;
          var loadGeneration = 0;
          vm.updateResource = updateResource;

          var dms = DataManipulationService;


          function updateResource() {
            if (vm.mutationPending) { return; }
            var resource = vm.renameResource;
            if (resource != null) {
              vm.mutationPending = true;
              var type = resource.resourceType.toUpperCase();
              var name = resource['schema:name'];

              AuthorizedBackendService.doCall(
                  resourceService.renameNode(resource, name, null),
                  function (response) {
                    vm.mutationPending = false;
                    var title = dms.getTitle(response.data);
                    UIMessageService.flashSuccess('SERVER.' + type + '.update.success', {"title": title},
                        'GENERIC.Updated');
                    refresh();
                  },
                  function (err) {
                    vm.mutationPending = false;
                    UIMessageService.showBackendError('SERVER.' + type + '.update.error', err);
                  }
              );
            }
          }

          function refresh() {
            $scope.$broadcast('refreshWorkspace', [vm.renameResource]);
          }

          // modal open or closed
          $scope.$on('renameModalVisible', function (event, params) {

            var generation = ++loadGeneration;
            var visible = params[0];
            var resource = params[1];

            if (visible && resource) {
              resourceService.getCurrentResource(resource,
                  function (current) {
                    if (generation !== loadGeneration) { return; }
                    vm.modalVisible = visible;
                    vm.renameResource = angular.extend(angular.copy(resource), current);
                    $timeout(function () {
                      jQuery('#rename-modal input').focus().select();
                    }, 500);
                  },
                  function (error) {
                    if (generation !== loadGeneration) { return; }
                    UIMessageService.showBackendError('SERVER.' + resource.resourceType.toUpperCase() + '.load.error', error);
                  }
              );
            }
          });

        }

        let directive = {
          bindToController: {
            renameResource: '=',
            modalVisible  : '='
          },
          controller      : cedarRenameModalController,
          controllerAs    : 'rename',
          restrict        : 'E',
          templateUrl     : 'scripts/modal/cedar-rename-modal.directive.html'
        };

        return directive;

      }
    }
);
