'use strict';

angularApp.service('HeaderService', function HeaderService() {
  return {
    serviceId: "HeaderService",

    miniHeaderEnabled: false,
    dataContainer: {
      currentObjectScope: null
    },

    setEnabled: function(b) {
      this.miniHeaderEnabled = b;
    },

    isEnabled: function() {
      return this.miniHeaderEnabled;
    }
  };
});
