'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.ceeDirtyTrackerService', [])
      .service('CeeDirtyTrackerService', CeeDirtyTrackerService);

  /**
   * Dirty state for the CEE instance embedded by the CEDAR workspace.
   *
   * CEE owns the working model and announces actual model mutations. The
   * workspace owns the meaning of "unsaved", because only it knows when a save
   * succeeded. Keep a copy of that saved baseline and compare CEE's public
   * serialization after each mutation; DOM event traffic is not a baseline.
   */
  function CeeDirtyTrackerService() {
    var cleanMetadata = null;

    this.reset = function () {
      cleanMetadata = null;
    };

    this.markClean = function (metadata) {
      cleanMetadata = angular.copy(metadata);
    };

    this.hasBaseline = function () {
      return cleanMetadata !== null;
    };

    this.isDirty = function (metadata) {
      return cleanMetadata !== null && !angular.equals(cleanMetadata, metadata);
    };
  }
});
