String.prototype.toDash = function () {
  return this.replace(/([A-Z])/g, function ($1) {
    return "-" + $1.toLowerCase();
  });
};

var initServices = [
  'DataManipulationService',
  'FieldTypeService',
  'HeaderService',
  'UrlService'
];
var configMap = {};


function checkIfAllLoaded() {
  for (var i in configMap) {
    if (!configMap[i].finished) {
      return;
    }
  }

  // bootstrap real app
  document.serviceConfigMap = configMap;
  angular.bootstrap(document, ['angularJsCedarApplication']);
}

angular.element(document).ready(function () {

  // bootstrap dummy app
  var element = angular.element('<div></div>');
  angular.bootstrap(element);
  var $injector = element.injector();
  var $http = $injector.get('$http');

  // create config descriptors
  for (var i in initServices) {
    var sid = initServices[i];
    var configFile = 'config/' + sid.toDash().substring(1) + '.conf.json';
    var config = {
      "serviceId" : sid,
      "configFile": configFile,
      "finished"  : false,
      "config"    : null,
      "error"     : null
    };
    configMap[sid] = config;
  }

  // load config files
  for (var key in configMap) {
    (function (serviceId) {
      $http.get(configMap[serviceId].configFile).then(function (response) {
        configMap[serviceId].finished = true;
        configMap[serviceId].config = response.data;
        checkIfAllLoaded(configMap);
      }).catch(function (err) {
        configMap[serviceId].finished = true;
        configMap[serviceId].error = error;
        checkIfAllLoaded(configMap);
      });
    })(key);
  }

});