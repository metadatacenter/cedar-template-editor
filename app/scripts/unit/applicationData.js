'use strict';

var applicationData = {

  getConfig: function () {
    return this.config;
  },

  config: {
    CedarUserProfile: {
      uiPreferences: {
        folderView         : {
          currentFolderId: null,
          sortBy         : "createdOnTS",
          sortDirection  : "asc",
          viewMode       : "grid"
        },
        infoPanel          : {
          opened: false
        },
        metadataEditor     : {
          metadataJsonViewer: false,
          templateViewer    : false
        },
        resourceTypeFilters: {
          template: false,
          element : true,
          field   : false,
          instance: false
        },
        templateEditor     : {
          templateViewer: false
        }
      }
    }
  }
};
