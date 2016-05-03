function UserProfileHandler() {

  this.userHandler = null;
  this.callback = null;
  this.usersUrl = null;
  this.userUrl = null;

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
        success();
      });
    }
  };

  this.storeProfileAndCallback = function (userData) {
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
            service.storeProfileAndCallback(userData);
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
            service.storeProfileAndCallback(userData);
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