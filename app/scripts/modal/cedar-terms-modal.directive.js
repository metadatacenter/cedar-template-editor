'use strict';

define([
      'angular',
      'cedar/template-editor/service/cedar-user',
    ], function (angular) {
      angular.module('cedar.templateEditor.modal.cedarTermsModalDirective', [
        'cedar.templateEditor.service.cedarUser'
      ]).directive('cedarTermsModal', cedarTermsModalDirective);

      cedarTermsModalDirective.$inject = ['CedarUser', 'DataManipulationService', '$q'];

      /**
       *
       * share and group modal
       *
       */
      function cedarTermsModalDirective(CedarUser, DataManipulationService, $q) {

        var directive = {
          bindToController: {
            termsResource: '=',
            modalVisible : '='
          },
          controller      : cedarTermsModalController,
          controllerAs    : 'terms',
          restrict        : 'E',
          templateUrl     : 'scripts/modal/cedar-terms-modal.directive.html'
        };

        return directive;

        cedarTermsModalController.$inject = [
          '$timeout',
          '$scope',
          '$rootScope',
          '$translate',
          '$uibModal',
          'CedarUser',
          'resourceService',
          'UIMessageService',
          'UISettingsService',
          'AuthorizedBackendService',
          'CONST',
          "DataManipulationService", "UIUtilService", "autocompleteService"
        ];

        function cedarTermsModalController($timeout, $scope, $rootScope, $translate, $uibModal, CedarUser,
                                           resourceService, UIMessageService, UISettingsService,
                                           AuthorizedBackendService, CONST, DataManipulationService, UIUtilService,
                                           autocompleteService) {


          $scope.status = {
            isopen: false
          };


          var vm = this;
          var dms = DataManipulationService;

          vm.showPosition = false;
          vm.changeTo;
          vm.resource;
          vm.model;
          vm.autocompleteResultsCache = autocompleteService.autocompleteResultsCache;
          vm.updateFieldAutocomplete = autocompleteService.updateFieldAutocomplete;


          vm.tmpList = [];
          vm.deletedList = [];
          vm.list = vm.tmpList;
          vm.sortingLog = [];
          vm.sortableOptions = {
            activate  : function () {
            },
            beforeStop: function () {
            },
            change    : function () {
            },
            create    : function () {
            },
            deactivate: function () {
            },
            out       : function () {
            },
            over      : function () {
            },
            receive   : function () {
            },
            remove    : function () {
            },
            sort      : function () {
            },
            start     : function () {
            },
            update    : function (e, ui) {
              vm.log('Update');
            },
            stop      : function (e, ui) {
              vm.log('Stop');
            }
          };


          // does this field have a value constraint?
          vm.hasValueConstraint = function () {
            return dms.hasValueConstraint($scope.resource);
          };

          // is this field required?
          vm.isRequired = function () {
            return dms.isRequired($scope.resource);
          };

          vm.getId = function () {
            return dms.getId($scope.resource);
          };

          //
          //  dropdown menu
          //

          vm.log = function(action) {
            var logEntry = vm.tmpList.map(function (i) {
              return i.value;
            }).join(', ');
            vm.sortingLog.push(action + ': ' + logEntry);
          };


          vm.toggleDropdown = function (event) {
            console.log('toggleDropdown', event);
          };

          vm.applyChange = function (changeTo, index) {
            var deleted = vm.list.splice(index, 1);
            vm.list.splice(changeTo, 0, deleted[0]);
            vm.log('Apply');

            vm.showPosition = false;
            $scope.status.isopen = false;
          };

          vm.toggle = function (index) {
            console.log('toggle', index);
            //$scope.status.isopen = value;
            vm.showPosition = false;
          };

          vm.delete = function (index) {
            var deleted = vm.list.splice(index, 1);
            vm.deletedList.push(deleted[0]);
            vm.log('Delete');
          };

          // update schema title and description if necessary
          $scope.$watch("status.isopen", function (newField, oldField) {
            console.log('status.isopen', newField, oldField)
          }, true);

          // initialize the share dialog
          vm.openTerms = function (resource) {
            vm.schema = dms.schemaOf(vm.resource);
            vm.term = '*';
            vm.id = dms.getId(vm.resource);
            var foundResults = autocompleteService.initResults(vm.id, vm.term);
            var promises = autocompleteService.updateFieldAutocomplete(vm.schema, vm.term);

            $q.all(promises).then(values => {
              vm.tmpList = [];
              vm.deletedList = [];
              for (var i = 1; i <= foundResults.length; i++){
                vm.tmpList.push({
                  text: foundResults[i-1]['label'],
                  value: i
                });
              }
              vm.list = vm.tmpList;
            });
          };

          // on modal close, scroll to the top the cheap way
          vm.hideModal = function () {
            vm.modalVisible = false;
          };

          $rootScope.$on('termsModalVisible', function (event, params) {
            var visible = params[0];
            var r = params[1];
            if (visible && r) {
              vm.modalVisible = visible;
              vm.resource = r;
              vm.openTerms(vm.resource);
            }
          });
        }
      }
    }
);
