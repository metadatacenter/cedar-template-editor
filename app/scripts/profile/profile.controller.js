'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.profile.profileController', [])
      .controller('ProfileController', ProfileController);

  ProfileController.$inject = ["$rootScope", "$scope", "$location", "$window","UrlService", "HeaderService", "UserService", "CONST","UIUtilService", "CedarUser", "QueryParamUtilsService", "AuthorizedBackendService", "HttpBuilderService", "UIMessageService", "PreviousRouteService"];

  function ProfileController($rootScope, $scope, $location,$window, UrlService, HeaderService, UserService, CONST, UIUtilService, CedarUser, QueryParamUtilsService, AuthorizedBackendService, HttpBuilderService, UIMessageService, PreviousRouteService) {

    $rootScope.pageTitle = 'Profile';

    // Inject constants
    $scope.CONST = CONST;

    var pageId = CONST.pageId.PROFILE;
    HeaderService.configure(pageId);

    $scope.busy = false;
    $scope.maxApiKeys = 20;
    // Bind the new-key description through an object ("dot rule"): the API Keys card sits under an
    // ng-if, which creates a child scope - a bare ng-model="newKeyDescription" would be shadowed on
    // that child scope and never reach the controller.
    $scope.apiKeyForm = {description: ''};
    $scope.memberSince = null;

    // "Member since" is the Keycloak account creation time, exposed via the user summary endpoint
    // (it is not part of the CEDAR user object). Non-critical: silently ignore failures.
    function loadMemberSince() {
      AuthorizedBackendService.doCall(
          HttpBuilderService.get(UrlService.getUserSummary(CedarUser.getUserId())),
          function (response) {
            $scope.memberSince = response.data ? response.data.createdTimestamp : null;
          },
          function () {}
      );
    }
    loadMemberSince();

    $scope.apiKeyCount = function () {
      return (CedarUser.getApiKeys() || []).length;
    };

    $scope.atKeyLimit = function () {
      return $scope.apiKeyCount() >= $scope.maxApiKeys;
    };

    // A key may be deleted only when it is not the last one (the backend also enforces keeping >=1).
    $scope.canDeleteKey = function () {
      return $scope.apiKeyCount() > 1;
    };

    // The key the REST examples are built from: the first enabled key, else the first key.
    $scope.activeApiKey = function () {
      var keys = CedarUser.getApiKeys() || [];
      for (var i = 0; i < keys.length; i++) {
        if (keys[i].enabled) {
          return keys[i].key;
        }
      }
      return keys.length ? keys[0].key : '';
    };

    // Public production API has a valid TLS certificate; local/dev servers use self-signed certs,
    // so the copy-paste cURL examples need -k there. Returns ' -k' or '' (leading space, no trailing).
    $scope.curlOpts = function () {
      var base = UrlService.base() || '';
      var m = base.match(/^https?:\/\/([^\/]+)/);
      var host = m ? m[1] : '';
      return host === 'resource.metadatacenter.org' ? '' : ' -k';
    };

    // Renders a key as a masked value (first 6 + last 4 chars) for display; the full key is still
    // what gets copied by the copy-to-clipboard directive.
    $scope.maskKey = function (key) {
      if (!key || key.length <= 12) {
        return key;
      }
      return key.substring(0, 6) + '••••••••••••••••••••' + key.substring(key.length - 4);
    };

    $scope.toggleKeyVisibility = function (apiKey) {
      apiKey.revealed = !apiKey.revealed;
    };

    // A live example of today's date rendered in the user's preferred format (moment.js token).
    $scope.dateFormatExample = function () {
      var fmt = CedarUser.getPreferredDateFormat();
      return (fmt && window.moment) ? window.moment().format(fmt) : '';
    };

    // Jackson may serialize a LocalDateTime either as an ISO string or as a numeric array
    // [year, month, day, hour, minute, second, nano]. Render both defensively.
    $scope.formatDate = function (value) {
      if (!value) {
        return '';
      }
      var d = null;
      if (angular.isArray(value) && value.length >= 3) {
        d = new Date(value[0], (value[1] || 1) - 1, value[2], value[3] || 0, value[4] || 0, value[5] || 0);
      } else if (angular.isString(value) || angular.isNumber(value)) {
        d = new Date(value);
      }
      return (d && !isNaN(d.getTime())) ? d.toLocaleString() : ('' + value);
    };

    function refreshKeys(response) {
      CedarUser.setApiKeys(response.data.apiKeys);
      $scope.busy = false;
    }

    function onKeyError(error) {
      $scope.busy = false;
      UIMessageService.showBackendError('SERVER.GENERIC.error', error);
    }

    // Creates a new API key. An optional description is taken from the input; when blank the backend
    // fills in a default description carrying today's date.
    $scope.createApiKey = function () {
      if ($scope.busy || $scope.atKeyLimit()) {
        return;
      }
      $scope.busy = true;
      var body = {};
      if ($scope.apiKeyForm.description && $scope.apiKeyForm.description.trim()) {
        body.description = $scope.apiKeyForm.description.trim();
      }
      AuthorizedBackendService.doCall(
          HttpBuilderService.post(UrlService.createApiKey(CedarUser.getUserId()), body),
          function (response) {
            refreshKeys(response);
            $scope.apiKeyForm.description = '';
            UIMessageService.flashSuccess('A new API key was created.', {}, 'Success');
          },
          onKeyError
      );
    };

    // Regenerates a single key: replaces its value and revokes the old one. Confirmed first.
    $scope.regenerateApiKey = function (apiKey) {
      if ($scope.busy) {
        return;
      }
      UIMessageService.confirmedExecution(
          function () {
            $scope.busy = true;
            AuthorizedBackendService.doCall(
                HttpBuilderService.post(UrlService.regenerateApiKey(CedarUser.getUserId(), apiKey.id), {}),
                function (response) {
                  refreshKeys(response);
                  UIMessageService.flashSuccess('The API key was regenerated. The previous value no longer works.',
                      {}, 'Success');
                },
                onKeyError
            );
          },
          'Regenerate this API key?',
          'This replaces the key with a new random value and immediately revokes the old one. Any scripts ' +
          'or integrations using the old value will stop working until you update them.',
          'Regenerate'
      );
    };

    // Deletes a single key. The backend refuses to remove the last active key.
    $scope.deleteApiKey = function (apiKey) {
      if ($scope.busy) {
        return;
      }
      UIMessageService.confirmedExecution(
          function () {
            $scope.busy = true;
            AuthorizedBackendService.doCall(
                HttpBuilderService.delete(UrlService.deleteApiKey(CedarUser.getUserId(), apiKey.id)),
                function (response) {
                  refreshKeys(response);
                  UIMessageService.flashSuccess('The API key was deleted.', {}, 'Success');
                },
                onKeyError
            );
          },
          'Delete this API key?',
          'This permanently removes the key. Any scripts or integrations using it will stop working.',
          'Delete'
      );
    };

    $scope.getTokenValidity = function () {
      return UserService.getTokenValiditySeconds();
    };

    $scope.goToDashboardOrBack = function () {
      UIUtilService.activeLocator = null;
      UIUtilService.activeZeroLocator = null;
      PreviousRouteService.goBack();
    };

    $scope.urlService = UrlService;
  }

});
