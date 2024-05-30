'use strict';

define([
      'angular',
      'cedar/template-editor/service/cedar-user',
    ], function (angular) {
      angular.module('cedar.templateEditor.modal.cedarInclusionModalDirective', [
        'cedar.templateEditor.service.cedarUser'
      ]).directive('cedarInclusionModal', cedarInclusionModalDirective);

      cedarInclusionModalDirective.$inject = ['CedarUser', 'AuthorizedBackendService', 'InclusionService', 'UIMessageService', 'resourceService'];

      function cedarInclusionModalDirective(CedarUser, AuthorizedBackendService, InclusionService, UIMessageService, resourceService) {

        cedarInclusionModalController.$inject = [
          '$scope'
        ];

        function cedarInclusionModalController($scope) {
          var vm = this;
          vm.hideModal = hideModal;
          vm.modalVisible = false;
          vm.saveUpdatedArtifacts = saveUpdatedArtifacts;
          vm.handleTreeSelectionChange = handleTreeSelectionChange;
          vm.handleNodeSelectionChange = handleNodeSelectionChange;
          vm.cancel = cancel;


          // on modal close, scroll to the top the cheap way
          function hideModal() {
            vm.modalVisible = false;
          }

          function saveUpdatedArtifacts() {
            let as = document.querySelector('artifact-selector');
            const data = as.artifactsToUpdate;

            AuthorizedBackendService.doCall(
                InclusionService.updateInclusions(data),
                function (response) {
                  console.log("Updated", response);
                  vm.modalVisible = false;
                },
                function (err) {
                  UIMessageService.showBackendError('INCLUSION.update-error', err);

                }
            )
          }

          function cancel() {
            vm.modalVisible = false;
          }

          function handleTreeSelectionChange(data) {
            const newData = data.detail;

            AuthorizedBackendService.doCall(
                InclusionService.getInclusions(newData),
                function ({data:includingArtifacts}) {
                  if(includingArtifacts) {
                    let as = document.querySelector('artifact-selector');
                    as.treeData = includingArtifacts;
                  }
                },
                function (err) {
                  UIMessageService.showBackendError('INCLUSION.preview-error', err);
                }
            );
          }

          function handleNodeSelectionChange({detail: selectedNode}) {
            console.log("Selected Node", selectedNode);
            const {type, atId} = selectedNode;
            resourceService.getResourceDetailFromId(
                atId,
                type,
                function (response) {
                  console.log('Data', response);
                  if(response) {
                    console.log('Resource Details', response);
                    let artifactSelectorElement = document.querySelector('artifact-selector');
                    artifactSelectorElement.artifactDetails = response;
                  }
                },
                function (err) {
                  UIMessageService.showBackendError('INCLUSION.artifact-details-error', err);
                }
                )
          }

          // on modal open
          $scope.$on('inclusionModalVisible', function (event, params) {

            const artifactSelectorElement = document.querySelector('artifact-selector');
            artifactSelectorElement.treeData = params;

            artifactSelectorElement.addEventListener('treeSelectionChanged', vm.handleTreeSelectionChange);
            artifactSelectorElement.addEventListener('nodeSelectionChanged', vm.handleNodeSelectionChange);

          });
        }

        let directive = {
          bindToController: {
            publishResource: '=',
            modalVisible   : '='
          },
          controller      : cedarInclusionModalController,
          controllerAs    : 'inclusion',
          restrict        : 'E',
          templateUrl     : 'scripts/modal/cedar-inclusion-modal.directive.html'
        };

        return directive;

      }
    }
);
