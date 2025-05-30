'use strict';

define([
  'angular',
  'cedar/template-editor/service/authorized-backend.service',
  'cedar/template-editor/service/client-side-validation.service',
  'cedar/template-editor/service/data-manipulation.service',
  'cedar/template-editor/service/data-template.service',
  'cedar/template-editor/service/data-util.service',
  'cedar/template-editor/service/field-type.service',
  'cedar/template-editor/service/http-builder.service',
  'cedar/template-editor/service/rich-text-config.service',
  'cedar/template-editor/service/resource.service',
  'cedar/template-editor/service/staging.service',
  'cedar/template-editor/service/template-element.service',
  'cedar/template-editor/service/template-field.service',
  'cedar/template-editor/service/template-instance.service',
  'cedar/template-editor/service/template.service',
  'cedar/template-editor/service/url.service',
  'cedar/template-editor/service/ui-settings.service',
  'cedar/template-editor/service/ui-message.service',
  'cedar/template-editor/service/schema.service',
  'cedar/template-editor/service/instance-model.service',
  'cedar/template-editor/service/ui-progress.service',
  'cedar/template-editor/service/ui-util.service',
  'cedar/template-editor/service/user.service',
  'cedar/template-editor/service/rich-text-config.service',
  'cedar/template-editor/service/value-recommender.service',
  'cedar/template-editor/service/cedar-user',
  'cedar/template-editor/service/ui-settings.service',
  'cedar/template-editor/service/tracking.service',
  'cedar/template-editor/service/messaging.service',
  'cedar/template-editor/service/string-utils.service',
  'cedar/template-editor/service/submission.service',
  'cedar/template-editor/service/controlled-term-http.service',
  'cedar/template-editor/service/query-param-utils.service',
  'cedar/template-editor/service/frontend-url.service',
  'cedar/template-editor/service/validation.service',
  'cedar/template-editor/service/category.service',
  'cedar/template-editor/service/local-storage.service',
  'cedar/template-editor/service/temporal-runtime-field.service',
  'cedar/template-editor/service/temporal-editor-field.service',
  'cedar/template-editor/service/question-text.service',
  'cedar/template-editor/service/import.service',
  'cedar/template-editor/service/inclusion.service',
  'cedar/template-editor/service/cee-config.service'
], function(angular) {
  angular.module('cedar.templateEditor.service', [
    'cedar.templateEditor.service.authorizedBackendService',
    'cedar.templateEditor.service.clientSideValidationService',
    'cedar.templateEditor.service.dataManipulationService',
    'cedar.templateEditor.service.dataTemplateService',
    'cedar.templateEditor.service.dataUtilService',
    'cedar.templateEditor.service.fieldTypeService',
    'cedar.templateEditor.service.httpBuilderService',
    'cedar.templateEditor.service.richTextConfigService',
    'cedar.templateEditor.service.resourceService',
    'cedar.templateEditor.service.stagingService',
    'cedar.templateEditor.service.templateElementService',
    'cedar.templateEditor.service.templateFieldService',
    'cedar.templateEditor.service.templateInstanceService',
    'cedar.templateEditor.service.templateService',
    'cedar.templateEditor.service.urlService',
    'cedar.templateEditor.service.uISettingsService',
    'cedar.templateEditor.service.uIMessageService',
    'cedar.templateEditor.service.schemaService',
    'cedar.templateEditor.service.instanceModelService',
    'cedar.templateEditor.service.uIProgressService',
    'cedar.templateEditor.service.uIUtilService',
    'cedar.templateEditor.service.userService',
    'cedar.templateEditor.service.richTextConfigService',
    'cedar.templateEditor.service.valueRecommenderService',
    'cedar.templateEditor.service.cedarUser',
    'cedar.templateEditor.service.uISettingsService',
    'cedar.templateEditor.service.trackingService',
    'cedar.templateEditor.service.messagingService',
    'cedar.templateEditor.service.stringUtilsService',
    'cedar.templateEditor.service.submissionService',
    'cedar.templateEditor.service.controlledTermHttpService',
    'cedar.templateEditor.service.queryParamUtilsService',
    'cedar.templateEditor.service.frontendUrlService',
    'cedar.templateEditor.service.validationService',
    'cedar.templateEditor.service.categoryService',
    'cedar.templateEditor.service.localStorageService',
    'cedar.templateEditor.service.temporalRuntimeFieldService',
    'cedar.templateEditor.service.temporalEditorFieldService',
    'cedar.templateEditor.service.questionTextService',
    'cedar.templateEditor.service.importService',
    'cedar.templateEditor.service.inclusionService',
    'cedar.templateEditor.service.ceeConfigService'
  ]);
});
