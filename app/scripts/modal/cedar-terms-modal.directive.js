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
          "DataManipulationService",
          "autocompleteService"
        ];

        function cedarTermsModalController($timeout, $scope, $rootScope, $translate, $uibModal, CedarUser,
                                           DataManipulationService, autocompleteService) {


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

          vm.getId = function () {
            return dms.getId(vm.resource);
          };

          vm.log = function (action) {
            var logEntry = vm.tmpList.map(function (i) {
              return i.value;
            }).join(', ');
            vm.sortingLog.push(action + ': ' + logEntry);
          };


          vm.applyChange = function (changeTo, index) {
            let deleted = vm.list.splice(index, 1);
            vm.list.splice(changeTo, 0, deleted[0]);
            vm.showPosition = false;
            vm.changeTo = null;
            vm.log('Apply');
          };

          vm.toggle = function (event) {
            event.preventDefault();
            event.stopPropagation();
          };

          vm.delete = function (index) {
            let deleted = vm.list.splice(index, 1);
            vm.deletedList.push(deleted[0]);
            vm.log('Delete');
          };

          vm.doSave = function () {
            vm.log('Save');
            var saveEntry = vm.tmpList.map(function (i) {
              return i.id;
            }).join(', ');
            console.log(saveEntry);
            dms.setSortOrder(vm.resource, saveEntry);
          };

          vm.reset = function () {
            vm.sortOrder = null;
            dms.setSortOrder(vm.resource);
            vm.openTerms(vm.resource);
          };

          // initialize the share dialog
          vm.openTerms = function (resource) {

            var getShortId = function (uri) {
              var lastFragment = uri.substr(uri.lastIndexOf('/') + 1);
              return lastFragment.substr(lastFragment.lastIndexOf('#') + 1);
            };

            vm.sortOrder = dms.getSortOrder(vm.resource);
            vm.schema = dms.schemaOf(vm.resource);
            vm.term = '*';
            vm.id = dms.getId(vm.resource);
            var foundResults = autocompleteService.initResults(vm.id, vm.term);
            var promises = autocompleteService.updateFieldAutocomplete(vm.schema, vm.term);

            $q.all(promises).then(values => {
              vm.tmpList = [];
              vm.deletedList = [];
              for (let i = 1; i <= foundResults.length; i++) {
                vm.tmpList.push({
                  id  : foundResults[i - 1]['@id'],
                  text  : foundResults[i - 1]['label'],
                  source: getShortId(foundResults[i - 1]['sourceUri']),
                  value : i
                });
              }

              if (vm.sortOrder) {
                let sortArray = vm.sortOrder.split(', ');
                let sortList = [];
                for (let i = 0; i < sortArray.length; i++) {
                  let index = vm.tmpList.findIndex(item => item.id === sortArray[i]);
                  sortList.push(vm.tmpList[index]);
                }
                vm.tmpList = sortList;
              }

              vm.list = vm.tmpList;
              vm.log('Reset');
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
