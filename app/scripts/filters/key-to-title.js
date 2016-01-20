'use strict';

var keyToTitle = function () {
  return function (input) {
    // Caml case to spaces
    input = input.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1");
    input = input.replace(/_/g, ' ').toUpperCase();
    return input;
  };
};

keyToTitle.$inject = [];
angularApp.filter('keyToTitle', keyToTitle);