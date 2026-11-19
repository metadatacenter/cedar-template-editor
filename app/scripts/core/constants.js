/*jslint node: true */
/*global angularApp */
'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.core.constants', [])
      .constant('CONST', {
        "eventId"      : {
          "form": {
            "VALIDATION": "form:validation"
          }
        },
        "pageId"       : {
          "TEMPLATE" : "TEMPLATE",
          "ELEMENT"  : "ELEMENT",
          "FIELD"    : "FIELD",
          "RUNTIME"  : "RUNTIME",
          "DASHBOARD": "DASHBOARD",
          "PROFILE"  : "PROFILE",
          "PRIVACY"  : "PRIVACY",
          "METADATA" : "METADATA",
          "MESSAGING": "MESSAGING",
          "SETTINGS" : "SETTINGS"
        },
        "stagingObject": {
          "NONE"   : null,
          "ELEMENT": "ELEMENT",
          "FIELD"  : "FIELD"
        },
        "resourceType" : {
          "TEMPLATE": "template",
          "FIELD"   : "field",
          "ELEMENT" : "element",
          "INSTANCE": "instance",
          "LINK"    : "link",
          "FOLDER"  : "folder",
          "METADATA": "metadata",
        },
        "resourceIcon" : {
          "TEMPLATE": "fa fa-file-text",
          "FIELD"   : "fa fa-cube",
          "ELEMENT" : "fa fa-cubes",
          "INSTANCE": "fa fa-tag",
          "LINK"    : "fa fa-link",
          "FOLDER"  : "fa fa-folder",
          "METADATA": "fa fa-tag",
        },
        "publication"  : {
          "VERSION"  : "pav:version",
          "STATUS"   : "bibo:status",
          "DRAFT"    : "bibo:draft",
          "PUBLISHED": "bibo:published",
          "ALL"      : "all",
          "LATEST"   : "latest-by-status"
        },
        "model"        : {
          "NAME"               : "schema:name",
          "DESCRIPTION"        : "schema:description",
          "IDENTIFIER"         : "schema:identifier",
          "ISBASEDON"          : "schema:isBasedOn",
          "NUMBEROFINSTANCES"  : 'numberOfInstances',
          "DERIVEDFROM"        : "derivedFrom",
          "PREFLABEL"          : "skos:prefLabel",
          "CONSTRAINEDTERMID"  : 'termUri',
          "CONSTRAINEDID"      : '@id',
          "CONSTRAINEDLABEL"   : 'rdfs:label',
          "CONSTRAINEDNOTATION": 'skos:notation',
          "NOTATION"           : 'notation'
        }
      });
});
