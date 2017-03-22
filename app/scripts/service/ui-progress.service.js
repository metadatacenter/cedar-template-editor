'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.uIProgressService', [])
      .service('UIProgressService', UIProgressService);

  UIProgressService.$inject = ['ngProgressFactory'];

  function UIProgressService(ngProgressFactory) {

    var progressbar = ngProgressFactory.createInstance();
    progressbar.reset();

    var service = {
      serviceId: "UIProgressService"
    };

    // Starts the animation and adds between 0 - 5 percent to the loading percentage every 400 milliseconds.
    // Should always be finished with progressbar.complete() to hide it.
    service.start = function () {
      progressbar.start();
    };

    // Jumps to 100% progress and fades away progressbar.
    service.complete = function () {
      progressbar.complete();
    };

    // Returns the current percent value the progressbar is at. Should'nt be needed.
    service.status = function () {
      return progressbar.status();
    };

    // Sets the color of the progressbar and it's shadow. Use any valid HTML color
    service.setColor = function (color) {
      return progressbar.setColor(color);
    };

    // Sets the height of the progressbar. Use any valid CSS value Eg '10px', '1em' or '1%'.
    service.setHeight = function (height) {
      return progressbar.setHeight(height);
    };

    // Stops the progressbar at its current location.
    service.stop = function () {
      progressbar.stop();
    };

    // Sets the progressbar percentage value. Use a number between 0 - 100. If 100 is provided, complete will be called.
    service.set = function () {
      progressbar.set();
    };

    // Resets the progressbar to percentage 0 and will be hidden after it's rolled back.
    service.reset = function () {
      progressbar.reset();
    };

    return service;
  }

});
