'use strict';

var applicationData = {

  getConfig: function () {
    return this.config;
  },

  config: {
    CedarUserProfile: {
      uiPreferences: {
        folderView         : {
          currentFolderId: 'https:%2F%2Frepo.metadatacenter.orgx%2Ffolders%2F80e366b2-c8fb-4de5-b899-7d46c770d2f4',
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
        },
      }
    }
  }
};
