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
      return input.replace(/_/g,' ').toUpperCase();
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
  });
