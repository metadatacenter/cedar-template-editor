'use strict';

define([
      'angular',
      'cedar/template-editor/service/cedar-user',
    ], function (angular) {
      angular.module('cedar.templateEditor.form.airrSubmissionModal', [
        'cedar.templateEditor.service.cedarUser'
      ]).directive('airrSubmissionModal', airrSubmissionModal);

      airrSubmissionModal.$inject = ['CedarUser'];

      /* new folder modal  */
      function airrSubmissionModal(CedarUser) {

        var directive = {
          bindToController: {
            modalVisible  : '=',
            files: '=',
            instance: '='
          },
          controller      : airrSubmissionModalController,
          controllerAs    : 'submission',
          restrict        : 'E',
          templateUrl     : 'scripts/form/airr-submission-modal.directive.html',
        };
        return directive;

        airrSubmissionModalController.$inject = [
          '$scope',
          '$timeout',
          '$window',
          'CedarUser',
          'UrlService'

        ];

        function airrSubmissionModalController($scope, $timeout, $window, $http, CedarUser, UrlService
                                              ) {
          var vm = this;
          var vm = $scope;
          //vm.url = "https://httpbin.org/post";
          vm.url =  UrlService.airrSubmission();
          var config = {
            headers: {
              "Content-Type": undefined
            }
          };

          // modal open or closed
          $scope.$on('airrSubmissionModalVisible', function (event, params) {

            if (params && params[0]) {
              $timeout(function () {
                jQuery('#AIRR-submission-modal input').focus().select();
              }, 500);
            }
          });
        }
      }
    }
);
