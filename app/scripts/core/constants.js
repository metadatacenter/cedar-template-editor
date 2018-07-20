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
        "FIELD": "FIELD",
        "RUNTIME": "RUNTIME",
        "DASHBOARD": "DASHBOARD",
        "PROFILE": "PROFILE",
        "PRIVACY" : "PRIVACY",
        "METADATA": "METADATA",
        "MESSAGING": "MESSAGING"
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
      },
      "resourceIcon": {
        "TEMPLATE": "fa fa-file-text",
        "FIELD": "fa fa-cube",
        "ELEMENT": "fa fa-cubes",
        "INSTANCE":  "fa fa-tag",
        "LINK": "fa fa-link",
        "FOLDER":  "fa fa-folder",
        "METADATA": "fa fa-tag",
      },
      "publication" : {
        "STATUS": "bibo:status",
        "DRAFT": "bibo:draft",
        "PUBLISHED": "bibo:published",
        "ALL": "all",
        "LATEST": "latest"
      },
      "model": {
        "NAME": "schema:name",
        "DESCRIPTION": "schema:description",
        "BASEDON": "schema:isBasedOn"
      }
    });
});