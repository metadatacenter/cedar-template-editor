'use strict';

define([
  'angular',
  'json!config/tracking-service.conf.json'
], function (angular, config) {
  angular.module('cedar.templateEditor.service.trackingService', [])
      .service('TrackingService', TrackingService);

  TrackingService.$inject = ["$analytics","$location"];

  function TrackingService($analytics,$location) {

    var analyticsKey = null;
    var isTracking = null;


    var service = {
      serviceId: "TrackingService"
    };

    service.init = function () {
      analyticsKey = config.analyticsKey;
      isTracking = analyticsKey !== 'false';
      if (isTracking) {
        ga('create', analyticsKey, 'auto');
      }
    };

    service.eventTrack = function(eventName, eventParameters) {
      console.log('isTracking eventTrack ' +  isTracking + ' ' + analyticsKey + " " + eventName);
      console.log(eventParameters);
      console.log($location.absUrl());
      $analytics.eventTrack(eventName, eventParameters);
      $analytics.pageTrack($location.absUrl());
    };

    return service;
  };

});
