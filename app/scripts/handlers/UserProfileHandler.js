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
    var service = this;
    jQuery.get('config/url-service.conf.json?v=' + window.cedarCacheControl, function (urlConfigData) {
      service.usersUrl = urlConfigData.userRestAPI + '/users';
      service.userUrl = service.usersUrl + '/' + userId;
      success();
    });
  };

  this.userProfileLoadedDoCallback = function (userData) {
    this.userHandler.cedarUserProfile = userData;
    this.callback();
  };

  this.loadUserProfile = function () {
    var service = this;
    jQuery.ajax(
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
            if (error.status == 404) {
              console.log("User was not found using the REST API. Create it!");
              service.userProfileLoadedDoCallback(null);
            }
          }
        }
    );
  };

  this.proceed = function (userHandler, callback) {
    this.userHandler = userHandler;
    this.callback = callback;

    var pt = this.userHandler.getParsedToken();
    var userId = pt.sub;

    var service = this;
    this.loadUrlServiceConf(userId, function () {
      service.loadUserProfile();
    });
  };
}