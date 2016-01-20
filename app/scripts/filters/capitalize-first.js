'use strict';

var capitalizeFirst = function () {
  // Capitalize first letter
  return function (string) {
    string = string.toLowerCase();
    return string.substring(0, 1).toUpperCase() + string.substring(1);
  };
};

capitalizeFirst.$inject = [];
angularApp.filter('capitalizeFirst', capitalizeFirst);