'use strict';

define([
  'angular',
  'cedar/template-editor/modal/modal.module',
  'cedar/template-editor/modal/cedar-copy-modal.directive',
  'cedar/template-editor/modal/cedar-move-modal.directive',
  'cedar/template-editor/modal/cedar-publish-modal.directive',
  'cedar/template-editor/modal/cedar-rename-modal.directive',
  'cedar/template-editor/modal/cedar-share-modal.directive',
  'cedar/template-editor/modal/cedar-rename-modal.directive',
  'cedar/template-editor/modal/cedar-new-folder-modal.directive',
  'cedar/template-editor/modal/cedar-finder.directive',
  'cedar/template-editor/modal/cedar-terms-modal.directive',
  'cedar/template-editor/modal/cedar-test-modal.directive',
  'cedar/template-editor/modal/cedar-import-modal.directive'
], function(angular) {
  angular.module('cedar.templateEditor.modal', [
    'cedar.templateEditor.modal.cedarCopyModal',
    'cedar.templateEditor.modal.cedarMoveModal',
    'cedar.templateEditor.modal.cedarPublishModal',
    'cedar.templateEditor.modal.cedarRenameModal',
    'cedar.templateEditor.modal.cedarShareModal',
    'cedar.templateEditor.modal.cedarRenameModal',
    'cedar.templateEditor.modal.cedarNewFolderModal',
    'cedar.templateEditor.modal.cedarFinder',
    'cedar.templateEditor.modal.cedarTermsModal',
    'cedar.templateEditor.modal.cedarTestModal',
    'cedar.templateEditor.modal.cedarImportModal',
    'cedar.templateEditor.modal.cedarInclusionModal'

  ]);
});
