function UserProfileHandler() {

  this.userHandler = null;
  this.callback = null;
  this.usersUrl = null;
  this.userUrl = null;
  this.foldersUrl = null;
  this.homeFolderId = null;

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
    this.homeFolderId = userData.homeFolderId;

    if (this.homeFolderId == null) {
      var service = this;
      // touch a folder, this should create the home folder
      jQuery.ajax(
          service.foldersUrl + "/contents?resource_types=folder&path=" + encodeURIComponent("/Users/" + userData.userId),
          {
            'method' : 'GET',
            'headers': service.getHeaders(),
            'success': function (folderData) {
              var userHome = folderData.pathInfo[folderData.pathInfo.length - 1];
              console.log(userHome);
              var putData = {
                'homeFolderId': userHome['@id']
              };
              jQuery.ajax(
                  service.userUrl,
                  {
                    'data'       : JSON.stringify(putData),
                    'dataType'   : 'json',
                    'method'     : 'PUT',
                    'contentType': 'application/json; charset=utf-8',
                    'headers'    : service.getHeaders(),
                    'success'    : function (userData) {
                      console.log("PUT success");
                      console.log(userData);
                    },
                    'error'      : function (error) {
                    }
                  }
              );

              // do nothing, this folder should not be present
            },
            'error'  : function (error) {
              // expected behaviour. Home folder was created in the background
              service.loadUserProfile(false);
            }
          }
      );
    } else {
      this.userProfileLoadedDoCallback(userData);
    }
  };

  this.userProfileLoadedDoCallback = function (userData) {
    this.userHandler.cedarUserProfile = userData;
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

  this.loadUserProfile = function (createUserAndTouchHomeFolder) {
    var service = this;
    jQuery.ajax(
        service.userUrl,
        {
          'method' : 'GET',
          'headers': service.getHeaders(),
          'success': function (userData) {
            if (createUserAndTouchHomeFolder) {
              service.userProfileLoaded(userData);
            } else {
              service.userProfileLoadedDoCallback(userData);
            }
          },
          'error'  : function (error) {
            if (error.status == 404) {
              if (createUserAndTouchHomeFolder) {
                console.log("User was not found using the REST API. Create it!");
                service.createUser();
              } else {
                service.userProfileLoadedDoCallback(userData);
              }
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
      service.loadUserProfile(true);
    });
  };
}