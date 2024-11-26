var applicationData = {

  getCedarUserProfile: function () {
    return this.config.CedarUserProfile;
  },

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
        resourcePublicationStatusFilter : {
          publicationStatus: false
        },
        useMetadataEditorV2 : true
      }
    }
  }
};

function UserProfileHandler() {

  this.userHandler = null;
  this.callback = null;
  this.usersUrl = null;
  this.userUrl = null;
  this.homeFolderId = null;

  this.getHeaders = function () {
    return {
      'Authorization': 'Bearer ' + this.userHandler.getToken(),
      "CEDAR-Client-Session-Id": window.cedarClientSessionId,
    };
  };

  this.loadUrlServiceConf = function (userId, success) {
    const service = this;
    success();
    // jQuery.get('config/url-service.conf.json?v=' + window.cedarCacheControl, function (urlConfigData) {
    //   service.usersUrl = urlConfigData.userRestAPI + '/users';
    //   service.userUrl = service.usersUrl + '/' + userId;
    //   success();
    // });
  };

  this.userProfileLoadedDoCallback = function (userData) {
    this.userHandler.cedarUserProfile = userData;
    this.callback();
  };

  this.loadUserProfile = function () {
    const service = this;
    const userData = applicationData.getCedarUserProfile();
    service.userHandler.cedarUserProfile = userData;
    service.homeFolderId = userData.homeFolderId;
    service.userProfileLoadedDoCallback(userData);
    /*jQuery.ajax(
        service.userUrl,
        {
          'method' : 'GET',
          'headers': service.getHeaders(),
          'success': function (userData) {
            service.userHandler.cedarUserProfile = userData;
            service.homeFolderId = userData.homeFolderId;
            service.userProfileLoadedDoCallback(userData);
          },
          'error'  : function (error) {
            if (error.status === 404) {
              console.log("User was not found using the REST API. Create it!");
              service.userProfileLoadedDoCallback(null);
            }
          }
        }
    );*/
  };

  this.proceed = function (userHandler, callback) {
    this.userHandler = userHandler;
    this.callback = callback;

    const pt = this.userHandler.getParsedToken();
    const userId = pt.sub;

    const service = this;
    this.loadUrlServiceConf(userId, function () {
      service.loadUserProfile();
    });
  };
}
