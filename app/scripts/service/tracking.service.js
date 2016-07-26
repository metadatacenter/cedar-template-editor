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
      if (isTracking && typeof ga != 'undefined') {
        ga('create', analyticsKey, 'auto');
      }
    };

    // goal should be to save
    // 1. IP address
    // 2. user agent
    // 3. user name  or user id
    // 4. the name which describes the action or purpose of the click "addTextField", "addParagraph",... also include stuff like basic navigation
    // stuff, what is the user doing,  "saveTemplate",
    // 5. the object clicked on, like the template id, or link name, the text that is clicked or the url
    // 5. the url

    service.eventTrack = function(eventName, eventParameters) {
      console.log('eventTrack');
      console.log(eventParameters);
      eventParameters.url = $location.path();
      eventParameters.ip = 'ip';
      eventParameters.host = 'host';
      $analytics.eventTrack(eventName, eventParameters);

    };

    service.clickTrack = function(action, objectId) {
      service.eventTrack("mouseClick", {'action':action,  'objectId': objectId});
    };

    service.pageTrack = function() {
      service.eventTrack("pageLoad", {'url': $location.path()});
    };

    return service;
  };

});
