/*jslint node: true */
/*global angularApp */
'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.core.constants', [])
    .constant('CONST', {
      "pageId": {
        "TEMPLATE": "TEMPLATE",
        "ELEMENT": "ELEMENT",
        "RUNTIME": "RUNTIME",
        "ROLESELECTOR": "ROLESELECTOR",
        "DASHBOARD": "DASHBOARD",
        "DASHBOARDLIST": "DASHBOARDLIST"
      },
      "stagingObject": {
        "NONE": null,
        "ELEMENT": "ELEMENT",
        "FIELD": "FIELD"
      },
      "applicationMode": {
        "DEFAULT": "default",
        "CREATOR": "creator",
        "RUNTIME": "runtime"
      },
      "boxType": {
        "TEMPLATE": "template",
        "ELEMENT": "element",
        "INSTANCE": "instance",
        "LINK": "link"
      }
    });
});