define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.profile.routes', [])
      .config(profileRoutes);

  profileRoutes.$inject = ['$routeProvider'];

  function profileRoutes($routeProvider) {
    $routeProvider
        .when('/logout', {
          templateUrl: 'scripts/profile/logout.html',
          controller : 'LogoutController'
        })
        .when('/profile', {
          templateUrl: 'scripts/profile/profile.html',
          controller : 'ProfileController'
        })
        .when('/privacy', {
          templateUrl: 'scripts/profile/privacy.html',
          controller : 'PrivacyController'
        })
        .when('/settings', {
          templateUrl: 'scripts/profile/settings.html',
          controller : 'SettingsController'
        });
  }

});
