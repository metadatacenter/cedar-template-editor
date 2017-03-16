'use strict';

define([
      'angular',
      'cedar/template-editor/service/cedar-user',
    ], function (angular) {
      angular.module('cedar.templateEditor.searchBrowse.cedarNewFolderModalDirective', [
        'cedar.templateEditor.service.cedarUser'
      ]).directive('cedarNewFolderModal', cedarNewFolderModalDirective);

      cedarNewFolderModalDirective.$inject = ['CedarUser'];

      /* new folder modal  */
      function cedarNewFolderModalDirective(CedarUser) {

        var directive = {
          bindToController: {
            renameResource: '=',
            modalVisible  : '='
          },
          controller      : cedarNewFolderModalController,
          controllerAs    : 'folder',
          restrict        : 'E',
          templateUrl     : 'scripts/search-browse/cedar-new-folder-modal.directive.html'
        };

        return directive;

        cedarNewFolderModalController.$inject = [
          '$scope',
          '$uibModal',
          '$timeout',
          'CedarUser',
          'resourceService',
          'UIMessageService',
          'AuthorizedBackendService',
          'TemplateInstanceService',
          'TemplateElementService',
          'TemplateService',
          , 'CONST'
        ];

        function cedarNewFolderModalController($scope, $uibModal, $timeout, CedarUser,
                                               resourceService,
                                               UIMessageService,
                                               AuthorizedBackendService,
                                               TemplateInstanceService,
                                               TemplateElementService,
                                               TemplateService,
                                               CONST) {
          var vm = this;
          vm.modalVisible = false;
          vm.folder = {};
          vm.folder.name = "";
          vm.folder.description = "description";
          vm.folderId = null;

          vm.newFolder = newFolder;


          function newFolder() {
            if (vm.folder.name) {
              resourceService.createFolder(
                  vm.folderId,
                  vm.folder.name,
                  vm.folder.description,
                  function (response) {
                    refresh();
                    UIMessageService.flashSuccess('SERVER.FOLDER.create.success', {"title": vm.folder.name},
                        'GENERIC.Created');
                  },
                  function (response) {
                    UIMessageService.showBackendError('SERVER.FOLDER.create.error', response);
                  }
              );
            }
          }

          function refresh() {
            $scope.$broadcast('refreshWorkspace');
          }

          // modal open or closed
          $scope.$on('newFolderModalVisible', function (event, params) {

            var visible = params[0];
            var folderId = params[1];

            if (visible) {
              vm.modalVisible = visible;
              vm.folderId = folderId;
              vm.folder.name = '';
              $timeout(function () {
                jQuery('#new-folder-modal input').focus().select();
              }, 500);
            }
          });
        }
      }
    }
);
