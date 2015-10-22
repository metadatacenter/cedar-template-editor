'use strict';

angularApp.service('HeaderService', function HeaderService() {
  return {
    serviceId: "HeaderService",
    dataContainer: {
      currentObjectScope: null
    }
  };
});
