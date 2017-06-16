'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.uIUtilService', [])
      .service('UIUtilService', UIUtilService);

  UIUtilService.$inject = ["$window", "$timeout", "$rootScope", "$sce", "DataManipulationService", "DataUtilService",
                           "ClientSideValidationService","$translate"];

  function UIUtilService($window, $timeout, $rootScope, $sce, DataManipulationService, DataUtilService,
                         ClientSideValidationService, $translate) {

    var service = {
      serviceId: "UIUtilService"
    };

    // get the locator for the node's dom object
    service.getLocator = function (node, index, path, id) {
      return 'dom-' + id + '-' + (path || 0).toString() + '-' + (index || 0).toString();
    };

    // look to see if this node has been identified by angular as an invalid pattern
    service.isValidPattern = function (node, index, path, id) {
      var locator = service.getLocator(node, index, path, id) + '.ng-invalid';
      var target = jQuery('#' + locator);
      return (target.length == 0);
    };

    // get the value of the dom object for this node
    service.getDomValue = function (node, index, path, id) {
      var result;
      var locator = service.getLocator(node, index, path, id);
      var target = jQuery('#' + locator);
      if (target.length > 0) {
        result = target[0].value;
      }
      return result;
    };


    // set this field instance active
    service.setActive = function (field, index, path, uid, value) {
      if (value) {
        $rootScope.activeLocator = service.getLocator(field, index, path, uid);
        $rootScope.activeZeroLocator = service.getLocator(field, 0, path, uid);
      } else {
        $rootScope.activeLocator = null;
        $rootScope.activeZeroLocator = null;
      }

    };

    // is this field active
    service.isActive = function (locator) {
      return ($rootScope.activeLocator === locator);
    };

    // is some other field active
    service.isInactive = function (locator) {
      return ($rootScope.activeLocator && $rootScope.activeLocator != locator);
    };

    service.scrollToAnchor = function (hash) {
      $timeout(function () {
        var target = angular.element('#' + hash);
        if (target && target.offset()) {
          var y = target.offset().top;
          $window.scrollTo(0, y - 95);
        }

      }, 250);
    };

    /**
     * Scroll to a dom id. Delay ensures that a new field or element has been created and drawn.
     * @param id
     */
    service.scrollToDomId = function (id) {

      $timeout(function () {
            var target = angular.element('#' + id);
            if (target && target.offset()) {
              var y = target.offset().top;
              var center = $window.height / 2;
              $window.scrollTo(0, y - 95);
            } else {
              console.log('not found' + target);
            }
          }, 250
      );
    };

    /**
     * toggle element's contents.
     * @param id
     */
    service.toggleElement = function (id) {

      $timeout(function () {

            var target = angular.element('#' + id);
            if (target) {
              target.find('.elementTotalContent').first().toggle();
              target.find(".visibilitySwitch").toggle();
              target.find(".spreadsheetSwitchLink").toggle();
            }
          }, 350
      );
    };

    // create a modal id for the controlled terms modals
    service.getModalId = function (id, type) {
      if (id) {
        id = id.substring(id.lastIndexOf('/') + 1);
      }
      return "control-options-" + id + "-" + type;
    };

    // show the controlled terms modal
    service.showModal = function (id, type) {
      jQuery("#" + service.getModalId(id, type)).modal('show');
    };

    // hide the controlled terms modal
    service.hideModal = function (id, type) {
      jQuery("#" + service.getModalId(id, type)).modal('hide');
    };


    service.getYouTubeEmbedFrame = function (field) {

      var width = 560;
      var height = 315;
      var content = DataManipulationService.getContent(field).replace(/<(?:.|\n)*?>/gm, '');
      var size = DataManipulationService.getSize(field);

      if (size && size.width && Number.isInteger(size.width)) {
        width = size.width;
      }
      if (size && size.height && Number.isInteger(size.height)) {
        height = size.height;
      }

      // if I say trust as html, then better make sure it is safe first
      return $sce.trustAsHtml(
          '<iframe width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + content + '" frameborder="0" allowfullscreen></iframe>');

    };

    service.console = function (txt, label) {
      console.log(label + ' ' + JSON.stringify(txt, null, 2));
    };

    // element or field be edited as a spreadsheet if it is multi-instance
    // and does not contain nested elements or multi-instance fields
    service.isSpreadsheetable = function (node) {

      var schema = DataManipulationService.schemaOf(node);
      var result = DataManipulationService.isCardinalElement(node);
      if (DataUtilService.isElement(node)) {
        angular.forEach(schema.properties, function (value, key) {
          if (!DataUtilService.isSpecialKey(key)) {
            var isElement = DataUtilService.isElement(value);
            var isCardinal = DataManipulationService.isCardinalElement(value);
            result = result && (!isElement && !isCardinal);
          }
        });
      }
      return result;
    };

    service.cardinalityString = function (node) {
      var result = '';
      if (DataManipulationService.isMultipleCardinality(node)) {
        result = '[' + DataManipulationService.getMinItems(node) + '...' + (DataManipulationService.getMaxItems(
                node) || 'N') + ']';
      }
      return result;
    };


    //
    //  editing fields
    //

    // are we editing this field?
    service.isEditState = function (node) {
      return DataManipulationService.isTmpState(node, "creating");
    };

    // set edit mode
    service.setSelected = function (node) {
      DataManipulationService.setTmpState(node, "creating");
      $rootScope.selectedFieldOrElement = node;
    };

    // deselect any current selected items, then select this one
    service.canSelect = function (node) {
      var result = true;
      if (!service.isEditState(node)) {
        if ($rootScope.selectedFieldOrElement && service.isEditState($rootScope.selectedFieldOrElement)) {
          result = service.canDeselect($rootScope.selectedFieldOrElement);
        }
        if (result) service.setSelected(node);
      }
      return result;
    };

    // When user clicks Save button, switch field or element from creating state to completed state
    service.canDeselect = function (node, renameChildKey) {

      if (!node) {
        return;
      }

      DataManipulationService.setMinMax(node);
      service.setDefaults(node);

      var errorMessages = jQuery.merge(ClientSideValidationService.checkFieldConditions(node),
          ClientSideValidationService.checkFieldCardinalityOptions(node));

      // don't continue with errors
      if (errorMessages.length == 0) {
        //delete DataManipulationService.propertiesOf(node)._tmp;
        DataManipulationService.stripTmpIfPresent(node);

        if (renameChildKey) {
          var key = DataManipulationService.getFieldName(DataManipulationService.getTitle(node));
          renameChildKey(node, key);
        }

        var event = DataUtilService.isElement(node) ? "invalidElementState" : "invalidFieldState";
        $rootScope.$emit(event,
            ["remove", DataManipulationService.getTitle(node), DataManipulationService.getId(node)]);
      }

      $rootScope.$broadcast("deselect", [node, errorMessages]);

      return errorMessages.length == 0;
    };

    service.setDefaults = function (node) {

      DataManipulationService.defaultTitle(node);

      var inputType = DataManipulationService.getInputType(node);
      if (inputType == "radio" || inputType == "checkbox" || inputType == "list") {
        DataManipulationService.defaultOptions(node, $translate.instant("VALIDATION.noNameField"));
      }
    };


    return service;
  };

})
;