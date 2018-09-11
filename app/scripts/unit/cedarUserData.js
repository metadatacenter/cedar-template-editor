'use strict';


var cedarUserData = {

  getConfig: function (appData) {

    this.config.getUIPreferences = function() {
      return appData.CedarUserProfile.uiPreferences
    };
    return this.config;
  },

  config: {
    init            : function () {
      return true
    },
    setAuthProfile  : function () {
      return true
    },
    setCedarProfile : function () {
      return true
    },
    getUIPreferences: function () {
      return null
    },
    isSortByName    : function () {
      return false
    },
    isSortByCreated : function () {
      return true
    },
    isSortByUpdated : function () {
      return false
    },
    isListView      : function () {
      return true
    },
    isGridView      : function () {
      return false
    },
    getHomeFolderId : function () {
      return 'https://repo.metadatacenter.orgx/folders/f55c5f4b-1ee6-4839-8836-fcb7509cecfe'
    },
    getSort : function () {
      return "createdOnTS";
    },
    getVersion      : function () {
      return '';
    },
    getStatus      : function () {
      return '';
    },
  }
};

