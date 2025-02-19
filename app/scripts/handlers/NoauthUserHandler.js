function NoauthUserHandler() {

  this.doLogin = function () {
    console.log("NoauthUserHandler:login()");
  };

  this.doLogout = function (options) {
    console.log("NoauthUserHandler:doLogout()");
  };

  this.getToken = function () {
    return 'c515e38268feb00dd6265cc2009877f59f5868838735eb0cd2eccb93340ea8c7';
  };

  this.getRefreshToken = function () {
    return null;
  };

  this.getParsedToken = function () {
    return {
      "name": "Unauthenticated User",
      "sub": "a0914b48-1ea9-4e1b-a5b2-cf194530b1ba",
      "email": "webmaster@carrerasresearch.org"
    }
  };

  this.getTokenValiditySeconds = function () {
    return Math.POSITIVE_INFINITY;
  };

  this.refreshToken = function (minValidity, successCallback, errorCallback) {
    console.log("NoauthUserHandler:refreshToken()");
  };

  this.initUserHandler = function (successCallback, failureCallback) {
    successCallback(true);
  };
}