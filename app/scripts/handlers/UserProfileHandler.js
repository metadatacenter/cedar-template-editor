function UserProfileHandler() {

  this.userHandler = null;
  this.callback = null;
  this.failureCallback = null;
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
    jQuery.get('config/url-service.conf.json?v=' + window.cedarCacheControl, function (urlConfigData) {
      service.usersUrl = urlConfigData.userRestAPI + '/users';
      service.userUrl = service.usersUrl + '/' + userId;
      success();
    }).fail(function (error) {
      service.loadFailed('the URL configuration', error);
    });
  };

  // The application starts only after both loads succeed, and the page stays hidden until it does. A failure
  // that went unreported therefore left a blank page and no indication of what had gone wrong.
  this.loadFailed = function (what, error) {
    console.error('CEDAR could not load ' + what + ': HTTP ' + error.status + ' ' + error.statusText);
    if (this.failureCallback) {
      this.failureCallback();
    }
  };

  this.userProfileLoadedDoCallback = function (userData) {
    this.userHandler.cedarUserProfile = userData;
    this.callback();
  };

  this.loadUserProfile = function () {
    const service = this;
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
            if (error.status === 404) {
              console.log("User was not found using the REST API. Create it!");
              service.userProfileLoadedDoCallback(null);
            } else {
              service.loadFailed('the user profile', error);
            }
          }
        }
    );
  };

  this.proceed = function (userHandler, callback, failureCallback) {
    this.userHandler = userHandler;
    this.callback = callback;
    this.failureCallback = failureCallback;

    const pt = this.userHandler.getParsedToken();
    const userId = pt.sub;

    const service = this;
    this.loadUrlServiceConf(userId, function () {
      service.loadUserProfile();
    });
  };
}
