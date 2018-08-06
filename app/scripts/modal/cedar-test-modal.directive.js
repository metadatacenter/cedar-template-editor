'use strict';

define([
      'angular',
      'cedar/template-editor/service/cedar-user',
    ], function (angular) {
      angular.module('cedar.templateEditor.modal.cedarTestModalDirective', [
        'cedar.templateEditor.service.cedarUser'
      ]).directive('cedarTestModal', cedarTestModalDirective);

      cedarTestModalDirective.$inject = ['CedarUser'];

      function cedarTestModalDirective(CedarUser) {

        var directive = {
          bindToController: {
            testResource: '=',
            modalVisible: '='
          },
          controller      : cedarTestModalController,
          controllerAs    : 'test',
          restrict        : 'E',
          templateUrl     : 'scripts/modal/cedar-test-modal.directive.html'
        };

        return directive;

        cedarTestModalController.$inject = [
          '$scope',
          '$uibModal',
          'CedarUser',
          '$timeout',
          '$window'
        ];

        function cedarTestModalController($scope, $uibModal, CedarUser,$timeout,$window) {
          var vm = this;
          vm.hideModal = hideModal;


          // on modal close, scroll to the top the cheap way
          function hideModal() {
            vm.modalVisible = false;
          }

          // modal open or closed
          $scope.$on('testModalVisible', function (event, params) {
            console.log('on testModalVisible');

            var visible = params[0];
            var resource = params[1];


            if (visible && resource) {
              vm.modalVisible = visible;
              vm.copyResource = resource;


            }

            if (visible) {

              $timeout(function () {
                var jqDescriptionField = $('#test-modal');
                if (jqDescriptionField) {
                  jqDescriptionField.focus();
                  if (jqDescriptionField.val()) {
                    var l = jqDescriptionField.val().length;
                    jqDescriptionField[0].setSelectionRange(0, l);
                  }
                }

                $window.onclick = function (event) {
                  console.log('on click',event);
                  // make sure we are hitting something else
                  if (event.target.id != 'test-modal') {
                    vm.hideModal();

                    $window.onclick = null;
                    $scope.$apply();
                  }
                };
              });
            } else {
              vm.hideModal();

              $window.onclick = null;
              $scope.$apply();

            }
          });
        }
      }
    }
);
