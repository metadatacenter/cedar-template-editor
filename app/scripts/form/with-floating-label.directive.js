'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.form.withFloatingLabelDirective', [])
    .directive('withFloatingLabel', withFloatingLabelDirective);
 
  // TODO: refactor to cedarWithFloatingLabel <cedar-with-floating-label>

  withFloatingLabelDirective.$inject = [];

  function withFloatingLabelDirective() {

    return {
      restrict: 'A',
      link: function ($scope, $element, attrs) {
        var template = '<div class="floating-label">' + attrs.placeholder +'</div>';

        //append floating label template
        $element.after(template);
        
        //remove placeholder after set by Angular binding
        attrs.$observe('placeholder', function() {
          //console.log($element.attr('placeholder'));
          $element.removeAttr('placeholder');
        });
        
        //hide label tag assotiated with given input
        //document.querySelector('label[for="' +  attrs.id +  '"]').style.display = 'none';
        
        $scope.$watch(function () {
          if($element.val().toString().length < 1) {
            $element.addClass('empty');
          } else {
            $element.removeClass('empty');
          }
        });
      }
    };
  };

});

