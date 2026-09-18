'use strict';

define([
      'angular',
      'cedar/template-editor/service/cedar-user',
      'cedar/template-editor/modal/cedar-artifact-selector.directive',
    ], function (angular) {
      angular.module('cedar.templateEditor.modal.cedarInclusionModalDirective', [
        'cedar.templateEditor.service.cedarUser',
        'cedar.templateEditor.modal.cedarArtifactSelectorDirective'
      ]).directive('cedarInclusionModal', cedarInclusionModalDirective);

      cedarInclusionModalDirective.$inject = ['CedarUser', 'AuthorizedBackendService', 'InclusionService', 'UIMessageService', 'resourceService', 'FrontendUrlService', 'UrlService', 'TemplateFieldService'];

      function cedarInclusionModalDirective(CedarUser, AuthorizedBackendService, InclusionService, UIMessageService, resourceService, FrontendUrlService, UrlService, TemplateFieldService) {

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
          vm.artifactType;
          vm.artifactName;
          // The affected tree as the resource server last reported it, and the details of whichever
          // artifact is selected within it. The selector renders the tree and writes each artifact's
          // operation back into it, so this object is also the body the update posts.
          vm.tree = null;
          vm.artifactDetails = null;


          // on modal close, scroll to the top the cheap way
          function hideModal() {
            vm.modalVisible = false;
          }

          function saveUpdatedArtifacts() {
            if (vm.mutationPending) { return; }

            vm.mutationPending = true;
            AuthorizedBackendService.doCall(
                InclusionService.updateInclusions(vm.tree),
                function (response) {
                  vm.mutationPending = false;
                  UIMessageService.flashSuccess('INCLUSION.bubbling-success');
                  vm.modalVisible = false;
                },
                function (err) {
                  vm.mutationPending = false;
                  UIMessageService.showBackendError('INCLUSION.update-error', err);

                }
            )
          }

          function cancel() {
            vm.modalVisible = false;
          }

          // Ticking an artifact changes which artifacts are affected, because an element brings
          // whatever reuses it into the tree. Ask the server for the tree that selection implies.
          function handleTreeSelectionChange(tree) {
            AuthorizedBackendService.doCall(
                InclusionService.getInclusions(tree),
                function ({data:includingArtifacts}) {
                  if(includingArtifacts) {
                    vm.tree = includingArtifacts;
                  }
                },
                function (err) {
                  UIMessageService.showBackendError('INCLUSION.preview-error', err);
                }
            );
          }

          function handleNodeSelectionChange(artifact) {
            resourceService.getResourceDetailFromId(
                artifact.atId,
                artifact.type,
                function (response) {
                  if(response) {
                    vm.artifactDetails = response;
                  }
                },
                function (err) {
                  UIMessageService.showBackendError('INCLUSION.artifact-details-error', err);
                }
                )
          }

          // on modal open
          $scope.$on('inclusionModalVisible', function (event, params, typeOfArtifact, nameOfArtifact) {
            vm.artifactType = typeOfArtifact;
            vm.artifactName = nameOfArtifact;
            vm.artifactDetails = null;
            vm.tree = params;
          });
        }

        let directive = {
          bindToController: {
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
