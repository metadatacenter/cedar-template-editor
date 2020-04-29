'use strict';

define([
      'angular',
      'cedar/template-editor/service/cedar-user',
    ], function (angular) {
      angular.module('cedar.templateEditor.modal.cedarTermsModalDirective', [
        'cedar.templateEditor.service.cedarUser'
      ]).directive('cedarTermsModal', cedarTermsModalDirective);

      cedarTermsModalDirective.$inject = ['CedarUser', 'DataManipulationService', 'schemaService', '$q'];

      /**
       *
       * share and group modal
       *
       */
      function cedarTermsModalDirective(CedarUser, DataManipulationService, schemaService, $q) {

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
          vm.modalVisible = false;
          vm.resource = null;
          vm.schema = null;
          vm.id = null;
          vm.actions = [];
          vm.list = [];
          vm.sortingLog = [];
          vm.showPosition = false;
          vm.changeTo = null;
          vm.isloading = false;
          vm.showPosition = false;
          vm.term = '*';
          vm.status = {isopen: false};

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
              vm.termUri = ui.item[0].getAttribute('term-uri');
            },
            stop      : function (e, ui) {
              var stopIndex = vm.list.findIndex(item => item['termUri'] === vm.termUri);
              if (stopIndex != -1) {
                vm.actions.push({
                  to       : stopIndex,
                  action   : 'move',
                  termUri  : vm.list[stopIndex]['termUri'],
                  type     : vm.list[stopIndex]['type'],
                  sourceUri: vm.list[stopIndex]['sourceUri'],
                  source   : vm.list[stopIndex]['source']
                });
              }
            }
          };

          vm.log = function (action, list) {
            let entry = action + ': ' + JSON.stringify(list || vm.list);
            vm.sortingLog.push(entry);
          };

          vm.applyChange = function (changeTo, index) {
            let entry = vm.list.splice(index, 1);
            vm.list.splice(changeTo, 0, entry[0]);
            if (changeTo != -1) {
              vm.actions.push({
                to       : changeTo,
                action   : 'move',
                termUri  : vm.list[changeTo]['termUri'],
                type     : vm.list[changeTo]['type'],
                sourceUri: vm.list[changeTo]['sourceUri'],
                source   : vm.list[changeTo]['source']
              });
            }
            vm.showPosition = false;
            vm.changeTo = null;
            vm.close(index);
          };

          vm.toggle = function (event) {
            event.preventDefault();
            event.stopPropagation();
          };

          vm.close = function (index) {
            vm.status['isopen' + index] = false;
          };

          vm.encode = function (uri) {
            return encodeURI(uri).replace(/\W/gi, '')
          };

          // delete the entry at this index
          vm.delete = function (index) {
            let entry = vm.list.splice(index, 1);
            vm.actions.push({
                  'termUri'  : entry[0]['termUri'],
                  'sourceUri': entry[0]['sourceUri'],
                  'source'   : entry[0]['source'],
                  'type'     : entry[0]['type'],
                  'action'   : 'delete'
                }
            );
            // remove any moves as well
            for (let i = 0; i < vm.actions.length; i++) {
              if (vm.actions[i]['termUri'] == entry[0]['termUri'] && vm.actions[i]['action'] == 'move') {
                vm.actions.splice(i, 1);
                i--;
              }
            }
          };

          vm.doSave = function () {
            schemaService.setActions(vm.resource, vm.actions);
          };

          vm.reset = function () {
            vm.actions = [];
            vm.list = [];
            vm.openTerms(vm.schema, vm.actions);
          };

          vm.isOverflow = function (id, label) {
            var elm = jQuery("#" + vm.encode(id) + ' .' + label + '.ellipsis');
            if (elm[0]) {
              return (elm[0].scrollWidth > elm.innerWidth());
            }
          };

          vm.getAcronym = function (sourceUri, id, type, found) {
            // e.g. sourceURI,  https://cadsr.nci.nih.gov/metadata/CADSR-VS/VD2015675v15
            let arr = sourceUri.split('/');
            if (sourceUri == 'template') {
              arr = id.split('/');
              return arr[arr.length - 2];
            }
            else {
              if ((type == 'OntologyClass' && arr[arr.length - 2] == 'ontologies') || (type == 'Value' && arr[arr.length - 2] == 'CADSR-VS')) {
                return arr[arr.length - 1];
              }
              else {
                return arr[arr.length - 2];
              }
            }
          };

          vm.applyActions = function (list, actions) {

            // apply mods to a duplicate of the list

            var dup = list.slice();

            if (actions) {
              for (let i = 0; i < actions.length; i++) {
                let action = actions[i];
                let from = dup.findIndex(item => item['termUri'] === action['termUri']);
                if (from != -1) {
                  // delete it at from
                  let entry = dup.splice(from, 1);
                  if (action.to != -1 && action.action == 'move') {
                    // insert it at to
                    dup.splice(action.to, 0, entry[0]);
                  }
                }
              }
            }
            return dup;
          };

          // initialize the share dialog
          vm.openTerms = function (resource, actions) {
            vm.isloading = true;
            autocompleteService.clearResults(vm.id, vm.term);
            let foundResults = autocompleteService.initResults(vm.id, vm.term);
            let promises = autocompleteService.updateFieldAutocomplete(vm.schema, vm.term, false);
            vm.fullList = [];
            $q.all(promises).then(values => {

              for (let i = 1; i <= foundResults.length; i++) {
                var found = foundResults[i - 1];
                vm.fullList.push({
                  termUri     : found['@id'],
                  label       : found['label'],
                  notation    : found['notation'],
                  sourceUri   : found['sourceUri'],
                  source      : found['source'],
                  acronym     : found['source'],
                  //acronym     : vm.getAcronym(found['sourceUri'], found['@id'], found['type'], found),
                  type        : found['type'],
                  id          : found['id'],
                  vsCollection: found['vsCollection']
                });
              }

              // sort and apply mods
              vm.sortList(vm.fullList);
              vm.list = vm.applyActions(vm.fullList, actions);
              vm.isloading = false;
            });
          };

          // on modal close, scroll to the top the cheap way
          vm.hideModal = function () {
            vm.modalVisible = false;
          };

          vm.sortList = function (list) {
            list.sort(function (a, b) {
              if (a.text && b.text) {
                var labelA = a.text.toLowerCase();
                var labelB = b.text.toLowerCase();
                if (labelA < labelB)
                  return -1;
                if (labelA > labelB)
                  return 1;
              }
              return 0;
            });
          };

          // merge list2  list1
          vm.mergeSort = function (arr1, arr2) {
            vm.sortList(arr1);
            vm.sortList(arr2);

            let merged = [];
            let index1 = 0;
            let index2 = 0;
            let current = 0;

            while (current < (arr1.length + arr2.length)) {

              let isArr1Depleted = index1 >= arr1.length;
              let isArr2Depleted = index2 >= arr2.length;
              let airr1text = arr1[index1] && arr1[index1].text ? arr1[index1].text.toLowerCase() : '';
              let airr2text = arr2[index2] && arr2[index2].text ? arr2[index2].text.toLowerCase() : '';


              if (!isArr1Depleted && (isArr2Depleted || (airr1text < airr2text))) {
                merged[current] = arr1[index1];
                index1++;
              } else {
                merged[current] = arr2[index2];
                index2++;
              }

              current++;
            }

            return merged;
          };

          // callback to load more resources for the current folder
          vm.loadMore = function () {

            // are we currently loading?
            if (!vm.isloading) {
              vm.isloading = true;

              var foundResults = autocompleteService.initResults(vm.id, vm.term);
              var promises = autocompleteService.updateFieldAutocomplete(vm.schema, vm.term, true);
              vm.fullList = [];
              if (promises.length > 0) {

                $q.all(promises).then(values => {

                  for (let i = 1; i <= foundResults.length; i++) {
                    var found = foundResults[i - 1];
                    vm.fullList.push({
                      label       : found['label'],
                      notation    : found['notation'],
                      sourceUri   : found['sourceUri'],
                      source      : found['source'],
                      acronym     : found['source'],
                      termUri     : found['@id'],
                      //acronym     : vm.getAcronym(found['sourceUri'], found['@id'], found['type'], found),
                      type        : found['type'],
                      id          : found['id'],
                      vsCollection: found['vsCollection']
                    });
                  }

                  // merge, sort and apply mods
                  var arr = vm.mergeSort(vm.fullList, vm.list);
                  vm.list = vm.applyActions(arr, vm.actions);
                  vm.isloading = false;
                });

              }
            }
          };

          $rootScope.$on('termsModalVisible', function (event, params) {
            var visible = params[0];
            var r = params[1];
            if (visible && r) {
              vm.modalVisible = visible;
              vm.resource = r;
              vm.id = schemaService.getId(vm.resource);
              vm.schema = schemaService.schemaOf(vm.resource);
              vm.actions = schemaService.getActions(vm.resource);
              vm.openTerms(vm.resource, vm.actions);
            } else {
              vm.modalVisible = false;
              vm.resource = null;
              vm.schema = null;
              vm.id = null;
              vm.actions = [];
              vm.list = [];
              vm.sortingLog = [];
              vm.showPosition = false;
              vm.changeTo = null;
              vm.isloading = false;
            }
          });
        }
      }
    }
);
