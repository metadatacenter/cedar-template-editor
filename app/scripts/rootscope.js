angularApp.run(['$rootScope',  function($rootScope) {
	
    // Define global pageTitle variable for use
    $rootScope.pageTitle;

    // Global utility functions

    // Simple function to check if an object is empty
    $rootScope.isEmpty = function(obj) {
      return Object.keys(obj).length;
    };

    // Tranform string to become object key
    $rootScope.underscoreText = function(string) {
      return string
        .replace(/'|"|(|)/g,'')
        .replace(/ +/g,"_")
        .toLowerCase();
    };

    // Returning false if the object key value in the properties object is of json-ld type '@'
    $rootScope.ignoreKey = function(key) {
      var pattern = /^@/i,
          result = pattern.test(key);
          
      return !result;
    };

    // Generating a RFC4122 version 4 compliant GUID
    $rootScope.generateGUID = function() {
      var d = Date.now();
      var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (d + Math.random()*16)%16 | 0;
          d = Math.floor(d/16);
          return (c=='x' ? r : (r&0x3|0x8)).toString(16);
      });
      return guid;
    };
}]);