'use strict';

define([
  'angular',
  'cedar/template-editor/messaging/messaging.routes',
  'cedar/template-editor/messaging/messaging.controller'
], function (angular) {
  angular.module('cedar.templateEditor.messaging', [
    'cedar.templateEditor.messaging.routes',
    'cedar.templateEditor.messaging.messagingController'
  ]);
});