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

          vm.mods = [];
          vm.list = [];
          vm.sortingLog = [];
          vm.sortableOptions = {
            activate  : function () {
            },
            beforeStop: function (e, ui) {
            },
            change    : function (e, ui) {
            },
            create    : function (e, ui) {
            },
            deactivate: function (e, ui) {
            },
            out       : function (e, ui) {
            },
            over      : function (e, ui) {
            },
            receive   : function (e, ui) {
            },
            remove    : function (e, ui) {
            },
            sort      : function (e, ui) {
            },
            start     : function (e, ui) {
            },
            update    : function (e, ui) {
              vm.updateId = ui.item[0].id;
            },
            stop      : function (e, ui) {
              var stopIndex = vm.list.findIndex(item => item.id === vm.updateId);
              vm.mods.push({'id': vm.updateId, 'to': stopIndex, 'action': 'move'});
              ;
            }
          };

          vm.getId = function () {
            return dms.getId(vm.resource);
          };

          vm.log = function (action, list) {
            let entry = action + ': ' + JSON.stringify(list || vm.list);
            vm.sortingLog.push(entry);
          };

          vm.applyChange = function (changeTo, index) {
            let entry = vm.list.splice(index, 1);
            vm.list.splice(changeTo, 0, entry[0]);
            vm.mods.push({'id': entry[0].id, 'to': changeTo, 'action': 'move'});
            vm.showPosition = false;
            vm.changeTo = null;
          };

          vm.toggle = function (event) {
            event.preventDefault();
            event.stopPropagation();
          };

          vm.delete = function (index) {
            let entry = vm.list.splice(index, 1);
            vm.mods.push({'id': entry[0].id, 'action': 'delete'});
          };

          vm.doSave = function () {
            dms.setSortOrder(vm.resource, vm.mods);
          };

          vm.reset = function () {
            dms.setSortOrder(vm.resource);
            vm.openTerms(vm.resource);
          };

          // initialize the share dialog
          vm.openTerms = function (resource) {

            var getShortId = function (uri) {
              var lastFragment = uri.substr(uri.lastIndexOf('/') + 1);
              return lastFragment.substr(lastFragment.lastIndexOf('#') + 1);
            };


            vm.schema = dms.schemaOf(vm.resource);
            vm.term = '*';
            vm.id = dms.getId(vm.resource);

            var foundResults = autocompleteService.initResults(vm.id, vm.term);
            var promises = autocompleteService.updateFieldAutocomplete(vm.schema, vm.term);
            vm.fullList = [];
            $q.all(promises).then(values => {
              for (let i = 1; i <= foundResults.length; i++) {
                vm.fullList.push({
                  id    : foundResults[i - 1]['@id'],
                  text  : foundResults[i - 1]['label'],
                  source: getShortId(foundResults[i - 1]['sourceUri']),
                  value : i
                });
              }

              // apply mods
              vm.mods = dms.getMods(vm.resource);
              for (let i = 0; i < vm.mods.length; i++) {
                let mod = vm.mods[i];
                if (mod.action == 'delete') {
                  // do the delete
                  let index = vm.fullList.findIndex(item => item.id === mod.id);
                  let entry = vm.fullList.splice(index, 1);
                } else {
                  // do the move
                  let id = mod.id;
                  let to = mod.to;
                  let from = vm.fullList.findIndex(item => item.id === mod.id);
                  if (from != -1 && to != -1) {
                    let entry = vm.fullList.splice(from, 1);
                    vm.fullList.splice(to, 0, entry[0]);
                  }
                }
              }
              vm.list = vm.fullList;
            });
          };

          // on modal close, scroll to the top the cheap way
          vm.hideModal = function () {
            vm.modalVisible = false;
          };

          // callback to load more resources for the current folder
          vm.loadMore = function () {
            console.log('loadMore');

            // are there more?
            if (!vm.totalCount || (vm.lastOffset < vm.totalCount)) {
              vm.lastOffset += vm.requestLimit;
              var offset = vm.offset;
              return resourceService.getResources(
                  {
                    folderId     : vm.currentFolderId,
                    resourceTypes: activeResourceTypes(),
                    sort         : sortField(),
                    limit        : vm.requestLimit,
                    offset       : offset
                  },
                  function (response) {

                    for (let i = 0; i < response.resources.length; i++) {
                      vm.resources[i + offset] = response.resources[i];
                    }
                    vm.offset = offset + vm.requestLimit;
                    vm.totalCount = response.totalCount;
                  },
                  function (error) {
                    UIMessageService.showBackendError('SERVER.FOLDER.load.error', error);
                  }
              );
            }
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
