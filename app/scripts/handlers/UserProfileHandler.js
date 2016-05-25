function UserProfileHandler() {

  this.userHandler = null;
  this.callback = null;
  this.usersUrl = null;
  this.userUrl = null;
  this.foldersUrl = null;

  this.getHeaders = function () {
    return {
      'Authorization': 'Bearer ' + this.userHandler.getToken()
    };
  };

  this.loadUrlServiceConf = function (userId, success) {
    var service = this;
    if (window.__karma__) {
      service.usersUrl = 'https://user.metadatacenter.orgx/users';
      service.userUrl = service.usersUrl + '/' + userId;
      success();
    } else {
      jQuery.get('config/url-service.conf.json', function (urlConfigData) {
        service.usersUrl = urlConfigData.userRestAPI + '/users';
        service.userUrl = service.usersUrl + '/' + userId;
        service.foldersUrl = urlConfigData.resourceRestAPI + '/folders';
        success();
      });
    }
  };

  this.userProfileLoaded = function (userData) {
    this.userHandler.cedarUserProfile = userData;

    var service = this;
    jQuery.ajax(
        service.foldersUrl + "/" + encodeURIComponent(userData.homeFolderId),
        {
          'method' : 'GET',
          'headers': service.getHeaders(),
          'success': function (userData) {
            console.log("Home folder was accessed");
            service.homeFolderWasTouched();
          },
          'error'  : function (error) {
            console.log("Home folder was not accessed:");
            console.log(error);
            service.homeFolderWasTouched();
          }
        }
    );
  }

  this.homeFolderWasTouched = function () {
    this.callback();
  };

  this.createUser = function () {
    var service = this;
    jQuery.ajax(
        service.usersUrl,
        {
          'method' : 'POST',
          'headers': service.getHeaders(),
          'success': function (userData) {
            console.log("User was created:");
            service.userProfileLoaded(userData);
          },
          'error'  : function (error) {
            console.log("User profile creation error:");
            console.log(error);
          }
        }
    );
  };

  this.loadUserProfile = function () {
    var service = this;
    jQuery.ajax(
        service.userUrl,
        {
          'method' : 'GET',
          'headers': service.getHeaders(),
          'success': function (userData) {
            //console.log("User was read from REST API");
            service.userProfileLoaded(userData);
          },
          'error'  : function (error) {
            if (error.status == 404) {
              console.log("User was not found using the REST API. Create it!");
              service.createUser();
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