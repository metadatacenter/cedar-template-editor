'use strict';

define([
  'angular',
  'cedar/template-editor/core/config',
  'cedar/template-editor/core/constants',
  'cedar/template-editor/core/run',

  'cedar/template-editor/core/capitalize-first.filter',
  'cedar/template-editor/core/key-to-title.filter',
  'cedar/template-editor/core/order-object-by.filter',
  'cedar/template-editor/core/props.filter',
  'cedar/template-editor/core/encode-uri-component.filter',
], function(angular) {
  angular.module('cedar.templateEditor.core', [
    'cedar.templateEditor.core.config',
    'cedar.templateEditor.core.constants',
    'cedar.templateEditor.core.run',

    'cedar.templateEditor.core.capitalizeFirstFilter',
    'cedar.templateEditor.core.keyToTitleFilter',
    'cedar.templateEditor.core.orderObjectByFilter',
    'cedar.templateEditor.core.propsFilter',
    'cedar.templateEditor.core.encodeURIComponentFilter',
  ]);
});