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

        var directive = {
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
          vm.updateResource = updateResource;

          var dms = DataManipulationService;


          function updateResource() {
            var resource = vm.renameResource;
            if (resource != null) {
              var id = resource['@id'];
              var type = resource.resourceType.toUpperCase();
              var name = resource['schema:name'];

              AuthorizedBackendService.doCall(
                  resourceService.renameNode(id, name, null),
                  function (response) {
                    var title = dms.getTitle(response.data);
                    UIMessageService.flashSuccess('SERVER.' + type + '.update.success', {"title": title},
                        'GENERIC.Updated');
                    refresh();
                  },
                  function (err) {
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

            var visible = params[0];
            var resource = params[1];

            if (visible && resource) {
              vm.modalVisible = visible;
              vm.renameResource = angular.copy(resource);

              $timeout(function () {
                jQuery('#rename-modal input').focus().select();
              }, 500);
            }
          });

        }
      }
    }
);
