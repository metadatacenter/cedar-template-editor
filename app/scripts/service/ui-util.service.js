'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.uIUtilService', [])
      .service('UIUtilService', UIUtilService);

  UIUtilService.$inject = ["$window", "$timeout", "$rootScope", "$sce", "DataManipulationService",'schemaService', "DataUtilService",
                           "ClientSideValidationService", "$translate","CONST"];

  function UIUtilService($window, $timeout, $rootScope, $sce, DataManipulationService, schemaService,DataUtilService,
                         ClientSideValidationService, $translate,CONST) {

    var service = {
      serviceId             : "UIUtilService",
      showOutput            : false,
      showOutputTab         : 0,
      metaToRDF             : null,
      metaToRDFError        : null,
      instance              : null,
      modalType             : null,
      selectedFieldOrElement: null,
      instanceToSave        : null,
      documentState         : {
        form           : null,
        valid          : true,
        dirty          : false,
        locked         : false,
        message        : true,
        totalMetadata  : 0,
        visibleMetadata: 0,
        instances      : null,
        status         : 'draft',
        version        : '0.0.1'
      }
    };

    var jsonld = require('jsonld');
    var dms = DataManipulationService;

    //
    // document state
    //


    $rootScope.$on(CONST.eventId.form.VALIDATION, function (event, options) {
      service.setValidation(options.state == 'true');
    });

    service.setValidation = function (value) {
      service.documentState.valid = value;
    };

    service.isValid = function () {
      return service.documentState.valid;
    };

    service.setTotalMetadata = function (value) {
      service.documentState.totalMetadata = value;
    };

    service.getTotalMetadata = function (value) {
      return service.documentState.totalMetadata;
    };

    service.hasTotalMetadata = function () {
      return service.documentState.totalMetadata;
    };

    service.setVisibleMetadata = function (value) {
      service.documentState.visibleMetadata = value;
    };

    service.getVisibleMetadata = function () {
      return service.documentState.visibleMetadata;
    };

    service.setInstances = function (value) {
      service.documentState.instances = value;
    };

    service.getInstances = function () {
      return service.documentState.instances;
    };

    service.setStatus = function (value) {
      service.documentState.status = value;
    };

    service.isDraft = function () {
      return service.documentState.status == 'bibo:draft';
    };

    service.isPublished = function () {
      return service.documentState.status == 'bibo:published';
    };

    service.setVersion = function (value) {
      service.documentState.version = value;
    };

    service.getVersion = function () {
      return service.documentState.version;
    };

    service.isFirstVersion = function () {
      return service.documentState.version == '0.0.1';
    };

    service.setDirty = function (value) {
      if (service.documentState.dirty != value) {
        if (value) {
          $rootScope.$broadcast("form:firstDirty");
        }
        service.documentState.dirty = value;

        if (service.documentState.form) {
          service.documentState.form.$dirty = value;
        }
      }
    };

    service.setForm = function (value) {
      service.documentState.form = value;
    };

    service.isDirty = function () {
      return service.documentState.dirty;
    };

    service.isLocked = function () {
      return service.documentState.locked;
    };

    service.setLocked = function (value) {
      service.documentState.locked = value;
    };


    //
    //  json and rdf output
    //

    // create the RDF from the current metadata instance
    service.toRDF = function () {
      var instance = service.instanceToSave;
      var copiedForm = jQuery.extend(true, {}, instance);
      if (copiedForm) {
        jsonld.toRDF(copiedForm, {format: 'application/nquads'}, function (err, nquads) {
          service.metaToRDFError = err;
          service.metaToRDF = nquads;
          service.instance = instance;
          return service.metaToRDF;
        });
      }
    };

    // get the RDF
    service.getRDF = function () {
      return service.metaToRDF;
    };

    // get any RDF conversion errors
    service.getRDFError = function () {
      var result = $translate.instant('SERVER.RDF.SaveFirst');
      if (service.metaToRDFError) {
        result = service.metaToRDFError.details.cause.message;
      }
      return result;
    };


    //
    //  view states: spreadsheet, tabbed, and list
    //

    // is this state currently active?
    service.isSpreadsheetView = function (viewState) {
      return (viewState && viewState.selected === 'spreadsheet');
    };

    service.isListView = function (viewState) {
      return (viewState && viewState.selected === 'list');
    };

    service.isTabView = function (viewState) {
      return (viewState && viewState.selected === 'tab');
    };

    // toggle through the list of view states, call the callback for spreadsheets
    service.toggleView = function (viewState) {
      var oldState = viewState.selected;
      var index = viewState.views.indexOf(viewState.selected);
      index = (index + 1) % viewState.views.length;
      viewState.selected = viewState.views[index];

      // throw away the old spreadsheet
      if (oldState === 'spreadsheet' && oldState != viewState.selected && typeof viewState.cleanupCallback == 'function') {
        viewState.cleanupCallback();
      }

      // create the new spreadsheet
      if (viewState.selected == 'spreadsheet' && typeof viewState.spreadsheetCallback == 'function') {
          setTimeout(function () {
          viewState.spreadsheetCallback();
        });
      }
      return viewState;
    };

    // switch into full screen mode  for the spreadsheet container
    service.fullscreen = function (locator) {
      var elm = document.querySelector('#' + locator + ' .spreadsheetViewContainer');
      if (!("mozRequestFullScreen" in elm)) {
        if (!("webkitRequestFullscreen" in elm)) {
          console.log('no fullscreen ' + document.fullscreenEnabled);
        } else {
          elm.webkitRequestFullscreen();
          elm.setAttribute('style', 'width:100%;height:100%;overflow: hidden');
        }
      } else {
        elm.mozRequestFullScreen();
        elm.setAttribute('style', 'width:100%;height:100%;overflow: hidden');
      }
    };

    // element or field be edited as a spreadsheet if it is multi-instance
    // and does not contain nested elements or multi-instance fields
    service.isSpreadsheetable = function (node) {

      var schema = schemaService.schemaOf(node);
      var result = schemaService.isCardinalElement(node) && !schemaService.isMultipleChoice(node) && !schemaService.isAttributeValueType(node);
      if (DataUtilService.isElement(schema) && schemaService.isCardinalElement(node)) {
        result = dms.getFlatSpreadsheetOrder(node).length > 0;
      }
      return result;
      //return false;
    };

    // is this an element that can be expanded?
    service.isExpandable = function (node) {
      var result = false;
      if (DataUtilService.isElement(dms.schemaOf(node))) {
        var props = dms.propertiesOf(node);
        angular.forEach(props, function (value, key) {
          if (DataUtilService.isElement(dms.schemaOf(value))) {
            result = true;
          }
        });
      }
      return result;
    };

    service.createViewState = function (node, callback, cleanup) {
      var viewState = {
        // views   : ['tab', 'list'],
        views   : ['tab'],
        selected: 'tab'
      };
      if (service.isSpreadsheetable(node)) {
        viewState.views.push('spreadsheet');
        viewState.spreadsheetCallback = callback;
        viewState.cleanupCallback = cleanup;
        viewState.selected = 'tab';
      }
      return viewState;
    };

    //
    //  basics
    //

    service.isRuntime = function () {
      return $rootScope.pageId == 'RUNTIME';
    };

    service.formatTitle = function (node) {
      if (node) {
        var title = dms.getTitle(node);
        if (title) {
          return title.substring(0, 40) + (title.length > 40 ? '...' : '');
        }
      }
    };

    service.formatTitleString = function (title) {
      if (title) {
        return title.substring(0, 40) + (title.length > 40 ? '...' : '');
      }
    };

    service.formatTitleStringFull = function (title) {
      if (title) {
        return title;
      }
    };

    // get the locator for the node's dom object
    service.getLocator = function (node, index, path, id) {
      var hashId = DataUtilService.getHashCode(id);
      var hashPath = DataUtilService.getHashCode(path);
      return 'dom' + hashId + '-' + (hashPath || 0).toString() + '-' + (index || 0).toString();
    };

    // look to see if this node's value has been identified by angular as invalid
    service.isValidPattern = function (node, index, path, id) {
      var locator = service.getLocator(node, index, path, id) + '.ng-invalid';
      var target = jQuery('#' + locator);
      return (target.length == 0);
    };

    // get the dom object for this node
    service.getDomValue = function (node, index, path, id) {
      var result;
      var locator = service.getLocator(node, index, path, id);
      var target = jQuery('#' + locator);
      if (target.length > 0) {
        result = target[0].value;
      }
      return result;
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

    // Scroll to a dom id. Delay ensures that a new field or element has been created and drawn.
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

    // toggle element's contents
    service.toggleElement = function (id) {

      $timeout(function () {

            var target = angular.element('#' + id);
            if (target) {
              // target.find('.element').toggle();
              target.find('.field-root').toggle();
              target.find('.element-root').toggle();
              // target.find('.elementTotalContent').first().toggle();
              target.find(".visibilitySwitch").first().toggle();
              // target.find(".spreadsheetSwitchLink").toggle();
            }
          }, 350
      );
    };

    service.getYouTubeEmbedFrame = function (field) {
      var width = 560;
      var height = 315;
      var content = dms.getContent(field);
      if (content) {
        content = content.replace(/<(?:.|\n)*?>/gm, '');
      }

      var size = dms.getSize(field);

      if (size && size.width && Number.isInteger(size.width)) {
        width = size.width;
      }
      if (size && size.height && Number.isInteger(size.height)) {
        height = size.height;
      }

      // if I say trust as html, then better make sure it is safe first
      if (content) {
        return $sce.trustAsHtml(
            '<iframe width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + content + '" frameborder="0" allowfullscreen></iframe>');
      }
    };

    service.console = function (txt, label) {
      console.log(label + ' ' + JSON.stringify(txt, null, 2));
    };

    service.cardinalityString = function (node) {
      var result = '';
      if (schemaService.isMultipleCardinality(node)) {
        result = '[' + dms.getMinItems(node) + '...' + (dms.getMaxItems(
                node) || 'N') + ']';
      }
      return result;
    };

    //
    //  modals
    //

    // create a modal id for the controlled terms modal
    service.getModalId = function (id, type) {
      return 'controlled-term-modal';
    };

    // show the modal
    service.showModal = function (options) {
      service.modalType = options.type;
      service.modalId = options.modalId;
      service.modalOptions = options;
      jQuery("#" + service.modalId).modal('show');
      $rootScope.$broadcast("ctdc:init", [options]);
    };

    // hide the modal
    service.hideModal = function () {
      jQuery("#" + service.modalId).modal('hide');
      service.modalType = null;
      service.modalId = null;
    };


    //
    //  editing fields
    //

    // is this field active
    service.isActive = function (locator) {
      return (service.activeLocator === locator);
    };

    // is some other field active
    service.isInactive = function (locator) {
      return (service.activeLocator && service.activeLocator != locator);
    };

    // set this field instance active
    service.setActive = function (field, index, path, uid, value) {
      if (value) {
        service.activeLocator = service.getLocator(field, index, path, uid);
        service.activeZeroLocator = service.getLocator(field, 0, path, uid);
      } else {
        service.activeLocator = null;
        service.activeZeroLocator = null;
      }
    };

    // are we editing this field?
    service.isEditState = function (node) {
      return dms.isTmpState(node, "creating");
    };

    service.clearEditState = function (node) {
      return dms.clearTmpState(node);
    };

    // set edit mode
    service.setSelected = function (node) {
      dms.setTmpState(node, "creating");
      service.selectedFieldOrElement = node;
    };

    // set as selected
    service.setSelected = function (node) {
      var schema = dms.schemaOf(node);
      schema._tmp = schema._tmp || {};
      schema._tmp.state = "creating";
      service.selectedFieldOrElement = node;
    };

    // deselect any current selected items, then select this one
    service.canSelect = function (node) {
      var result = true;
      if (!service.isEditState(node)) {
        if (service.selectedFieldOrElement && service.isEditState(service.selectedFieldOrElement)) {
          result = service.canDeselect(service.selectedFieldOrElement);
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

      schemaService.setMinMax(node);
      service.setDefaults(node);

      var errorMessages = jQuery.merge(ClientSideValidationService.checkFieldConditions(node),
          ClientSideValidationService.checkFieldCardinalityOptions(node));

      // don't continue with errors
      if (errorMessages.length == 0) {
        //dms.stripTmpIfPresent(node);
        dms.clearEditState(node);

        if (renameChildKey) {
          var key = dms.getFieldName(dms.getTitle(node));
          renameChildKey(node, key);
        }

        var event = DataUtilService.isElement(node) ? "invalidElementState" : "invalidFieldState";
        $rootScope.$emit(event,
            ["remove", dms.getTitle(node), dms.getId(node)]);
      }

      $rootScope.$broadcast("deselect", [node, errorMessages]);

      return errorMessages.length == 0;
    };

    // default the title and options if necessary
    service.setDefaults = function (node) {
      dms.defaultTitle(node);
      if (schemaService.isMultiAnswer(node)) {
        dms.defaultOptions(node, $translate.instant("VALIDATION.noNameField"));
      }
    };



    return service;
  };

})
;
