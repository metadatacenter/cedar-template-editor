/*jslint node: true */
/*global angular */
'use strict';

angular.module('cedarFilters', [])

  .filter('orderObjectBy', function() {
    return function (items, field, reverse) {
      var filtered = [];
      angular.forEach(items, function(item) {
        filtered.push(item);
      });
      function index(obj, i) {
        return obj[i];
      }
      filtered.sort(function (a, b) {
        var comparator;
        var reducedA = field.split('.').reduce(index, a);
        var reducedB = field.split('.').reduce(index, b);
        if (reducedA === reducedB) {
          comparator = 0;
        } else {
          comparator = (reducedA > reducedB ? 1 : -1);
        }
        return comparator;
      });
      if (reverse) {
        filtered.reverse();
      }
      return filtered;
    };
  })
  .filter('keyToTitle', function() {
    return function(input) {
      // Caml case to spaces
      input = input.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1");
      input = input.replace(/_/g,' ').toUpperCase();
      return input;
    };
  //})
  //.filter('encodeURI', function() {
  //  return function(input) {
  //    return encodeURIComponent(input);
  //  };
  //})
  //.filter('doubleEncodeURI', function() {
  //  return function(input) {
  //    return encodeURIComponent(encodeURIComponent(input));
  //  };
  //})
  //.filter('decodeURI', function() {
  //  return function(input) {
  //    return decodeURIComponent(input);
  //  };
  }).filter('propsFilter', function() {
    // This filter is copied from demo of angular-ui-select
    return function(items, props) {
      var out = [];
      if (angular.isArray(items)) {
        var keys = Object.keys(props);

        items.forEach(function(item) {
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
});
