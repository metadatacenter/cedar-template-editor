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
        "DASHBOARDLIST": "DASHBOARDLIST",
        "PROFILE": "PROFILE",
        "METADATA": "METADATA"
      },
      "stagingObject": {
        "NONE": null,
        "ELEMENT": "ELEMENT",
        "FIELD": "FIELD"
      },
      "resourceType": {
        "TEMPLATE": "template",
        "FIELD": "field",
        "ELEMENT": "element",
        "INSTANCE": "instance",
        "LINK": "link",
        "FOLDER": "folder",
        "METADATA": "metadata",
      }
    });
});