'use strict';

var propsFilter = function () {
// This filter is copied from demo of angular-ui-select
  return function (items, props) {
    if (items && items.length == 1 && items[0].label == 'No Results...')
      return items;

    var out = [];
    if (angular.isArray(items)) {
      var keys = Object.keys(props);

      items.forEach(function (item) {
        var itemMatches = false;

        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop] && item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  };
};

propsFilter.$inject = [];
angularApp.filter('propsFilter', propsFilter);