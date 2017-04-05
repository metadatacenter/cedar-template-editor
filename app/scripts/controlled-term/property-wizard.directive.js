'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.controlledTerm.propertyWizardDirective', [])
      .directive('propertyWizard', propertyWizardDirective);

  propertyWizardDirective.$inject = ['$timeout'];

  function propertyWizardDirective($timeout) {
    var directive = {
      restrict   : 'E',
      scope      : {
        tree                   : '=',
        term                   : '=',
        level                  : '='
      },
      templateUrl: 'scripts/controlled-term/property-wizard.directive.html',
      replace    : true,
      link       : linker
    };

    return directive;

    function linker(scope, element, attrs) {

      console.log('property wizard');

      //Model
      scope.currentStep = 1;
      scope.steps = [
        {
          step: 1,
          name: "First step",
          template: "property-wizard-step1.html"
        },
        {
          step: 2,
          name: "Second step",
          template: "property-wizard-step2.html"
        },
        {
          step: 3,
          name: "Third step",
          template: "property-wizard-step3.html"
        },
      ];
      scope.user = {
        name: "user",
        email: "user@user.com",
        age: "10"
      };

      //Functions
      scope.gotoStep = function(newStep) {
        console.log('getStepTemplate');
        scope.currentStep = newStep;
      }

      scope.getStepTemplate = function(){
        console.log('getStepTemplate');
        for (var i = 0; i < scope.steps.length; i++) {
          if (scope.currentStep == scope.steps[i].step) {
            return 'scripts/controlled-term/' + scope.steps[i].template;
          }
        }
      };

      scope.save = function() {
        alert(
            "Saving form... \n\n" +
            "Name: " + scope.user.name + "\n" +
            "Email: " + scope.user.email + "\n" +
            "Age: " + scope.user.age);
      };
    }
  }

});

