'use strict';

define([
  'angular',
], function(angular) {
  angular.module('cedar.templateEditor.controlTerm.htmlToPlainTextFilter', [])
    .filter('htmlToPlainText', htmlToPlainTextFilter);

  function htmlToPlainTextFilter() {
    return function(text) {
      return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
    }
  };

});