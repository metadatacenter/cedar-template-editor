
function CedarBootstrap($http) {

  // Variable holding the loaded data
  var configMap = {};

  // Services that need a preload
  var initServices = {
    'controlTermDataService': true,
    'provisionalClassService': true,
    'DataManipulationService': true,
    'FieldTypeService': true,
    'DataTemplateService': [
      'resources/element-empty.json',
      'resources/field-empty.json',
      'resources/template-empty.json'
    ],
    'HeaderService': true,
    'UrlService': true,
    'UserService': true,
    'UISettingsService': true
  };

  // Function to convert camelCase to train-case
  this.toDash = function (s) {
    s = s.replace(/([A-Z])/g, function ($1) {
      return '-' + $1.toLowerCase();
    });
    if (s.substring(0, 1) == '-') {
      s = s.substring(1);
    }
    return s;
  };

  // Callback function to check the loading status
  this.checkIfAllLoadedAndLaunch = function () {
    for (var sid in configMap) {
      for (var filePath in configMap[sid]) {
        if (!configMap[sid][filePath].finished) {
          return;
        }
      }
    }

    // bootstrap real app
    angular.bootstrap(document, ['cedar.templateEditor']);
  };

  this.getPreloadDescriptor = function (sid, configFile) {
    return {
      "serviceId": sid,
      "configFile": configFile,
      "finished": false,
      "config": null,
      "error": null
    };
  };

  this.getBaseConfigPath = function (sid) {
    return 'config/' + this.toDash(sid) + '.conf.json';
  };

  this.preloadFile = function (sid, filePath) {
    var owner = this;
    $http.get(filePath).then(function (response) {
      configMap[sid][filePath].finished = true;
      configMap[sid][filePath].config = response.data;
      owner.checkIfAllLoadedAndLaunch();
    }).catch(function (err) {
      configMap[sid][filePath].finished = true;
      configMap[sid][filePath].error = error;
      owner.checkIfAllLoadedAndLaunch(configMap);
    });
  };

  this.preload = function () {
    // create config descriptors
    for (var sid in initServices) {
      configMap[sid] = {};
      var files = initServices[sid];
      if (files === true) {
        var configFile = this.getBaseConfigPath(sid);
        configMap[sid][configFile] = this.getPreloadDescriptor(sid, configFile);
      } else if (Array.isArray(files)) {
        for (var i in files) {
          var fn = files[i];
          configMap[sid][fn] = this.getPreloadDescriptor(sid, fn);
        }
      }
    }

    // load config files
    for (var sid2 in configMap) {
      for (var filePath in configMap[sid2]) {
        this.preloadFile(sid2, filePath);
      }
    }
  };

  this.getBaseConfig = function (sid) {
    var configFile = this.getBaseConfigPath(sid);
    return configMap[sid][configFile].config;
  };

  this.getFileConfig = function (sid, configFile) {
    return configMap[sid][configFile].config;
  };

}