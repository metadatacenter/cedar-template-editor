'use strict';

define([
  'angular',
], function(angular) {
  angular.module('cedar.templateEditor.controlledTerm.htmlToPlainTextFilter', [])
    .filter('htmlToPlainText', htmlToPlainTextFilter);

  function htmlToPlainTextFilter() {
    return function(text) {
      return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
    }
  };

});