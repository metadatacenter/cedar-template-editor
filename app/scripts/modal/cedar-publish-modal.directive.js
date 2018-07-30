'use strict';

define([
      'angular',
      'cedar/template-editor/service/cedar-user',
    ], function (angular) {
      angular.module('cedar.templateEditor.modal.cedarPublishModalDirective', [
        'cedar.templateEditor.service.cedarUser'
      ]).directive('cedarPublishModal', cedarPublishModalDirective);

      cedarPublishModalDirective.$inject = ['CedarUser'];

      function cedarPublishModalDirective(CedarUser) {

        var directive = {
          bindToController: {
            publishResource: '=',
            modalVisible   : '='
          },
          controller      : cedarPublishModalController,
          controllerAs    : 'publish',
          restrict        : 'E',
          templateUrl     : 'scripts/modal/cedar-publish-modal.directive.html'
        };

        return directive;

        cedarPublishModalController.$inject = [
          '$scope'
        ];

        function cedarPublishModalController($scope) {
          var vm = this;
          vm.hideModal = hideModal;
          vm.modalVisible = false;
          vm.parts;
          vm.min;


          // on modal close, scroll to the top the cheap way
          function hideModal() {
            vm.modalVisible = false;
          }

          // on modal close, scroll to the top the cheap way
          function hideModal() {
            vm.modalVisible = false;
          }

          vm.getVersion = function (resource) {
            if (resource != null) {
              return resource['pav:version'];
            }
          };

          vm.getTitle = function (resource) {
            if (resource != null) {
              return resource['schema:name'];
            }
          };


          var getTotal = function (parts) {
            if (parts.length == 3) {
              return parts[0] * 1000000 + parts[1] * 1000 + parts[2];
            }
          };

          var isLarger = function (value) {
            return getTotal(value) >= vm.min;
          };

          vm.canIncrement = function (index) {
            return vm.parts && (vm.parts.length > index) && vm.parts[index] < 1000;
          };

          vm.canDecrement = function (index) {
            if (vm.parts && vm.parts.length > index && vm.parts[index] > 0) {
              var value = vm.parts.slice();
              value[index] = value[index] > 0 ? value[index] - 1 : 0;
              return (getTotal(value) >= vm.min);
            }
          };

          vm.increment = function (index) {
            if (vm.parts && vm.parts.length > index) {
              vm.parts[index] = vm.parts[index] < 1000 ? vm.parts[index] + 1 : vm.parts[index];
            }
          };

          vm.decrement = function (index) {
            if (vm.parts && vm.parts.length > index) {
              vm.parts[index] = vm.parts[index] > 0 ? vm.parts[index] - 1 : 0;
              if (getTotal(vm.parts) < vm.min) {
                vm.parts[index]++;
              }
            }
          };

          vm.change = function (index, newValue, oldValue) {

            var value;
            if (isNaN(parseInt(newValue))) {
              value = parseInt(oldValue);
            } else {
              value = parseInt(newValue);
            }

            // got a new value
            vm.parts[index] = value;
            if (getTotal(vm.parts) < vm.min) {
              // restore old value
              vm.parts[index] = oldValue;
            }
          };

          vm.getNextVersion = function (resource) {
            var currentVersion = vm.getVersion(resource);
            var parts = currentVersion.split(".");
            if (parts.length == 3) {
              parts[0] = parseInt(parts[0]);
              parts[1] = parseInt(parts[1]);
              parts[2] = parseInt(parts[2]) + (resource['bibo:status'] == 'bibo:published' ? 1 : 0);
              return parts;
            }
            return null;
          };

          vm.getVersionString = function () {
            if (vm.parts.length == 3) {
              return vm.parts[0] + '.' + vm.parts[1] + '.' + vm.parts[2];
            }
          };


          // on modal open
          $scope.$on('publishModalVisible', function (event, params) {

            var visible = params[0];
            var resource = params[1];
            var callback = params[2];
            var titleText = params[3];

            if (visible && resource) {
              vm.resource = resource;
              vm.callback = callback;
              vm.titleText = titleText;
              vm.modalVisible = visible;
              vm.initial = vm.getVersion(resource);
              vm.title = vm.getTitle(resource);
              vm.parts = vm.getNextVersion(resource);
              vm.min = getTotal(vm.parts);
            }
          });
        }
      }
    }
)
;
