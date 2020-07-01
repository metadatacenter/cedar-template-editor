'use strict';


define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.temporalRuntimeFieldService', [])
      .service('TemporalRuntimeFieldService', TemporalRuntimeFieldService);

  TemporalRuntimeFieldService.$inject = ["$rootScope", "schemaService", "TemporalEditorFieldService"];

  function TemporalRuntimeFieldService($rootScope, schemaService, TemporalEditorFieldService) {

    let service = {
      serviceId: "TemporalRuntimeFieldService"
    };

    let availableTimezones = [
      {id: "-12:00", label: "(GMT -12:00) Eniwetok, Kwajalein"},
      {id: "-11:00", label: "(GMT -11:00) Midway Island, Samoa"},
      {id: "-10:00", label: "(GMT -10:00) Hawaii"},
      {id: "-09:50", label: "(GMT -9:30) Taiohae"},
      {id: "-09:00", label: "(GMT -9:00) Alaska"},
      {id: "-08:00", label: "(GMT -8:00) Pacific Time (US & Canada)"},
      {id: "-07:00", label: "(GMT -7:00) Mountain Time (US & Canada)"},
      {id: "-06:00", label: "(GMT -6:00) Central Time (US & Canada), Mexico City"},
      {id: "-05:00", label: "(GMT -5:00) Eastern Time (US & Canada), Bogota, Lima"},
      {id: "-04:50", label: "(GMT -4:30) Caracas"},
      {id: "-04:00", label: "(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz"},
      {id: "-03:50", label: "(GMT -3:30) Newfoundland"},
      {id: "-03:00", label: "(GMT -3:00) Brazil, Buenos Aires, Georgetown"},
      {id: "-02:00", label: "(GMT -2:00) Mid-Atlantic"},
      {id: "-01:00", label: "(GMT -1:00) Azores, Cape Verde Islands"},
      {id: "+00:00", label: "(GMT) Western Europe Time, London, Lisbon, Casablanca"},
      {id: "+01:00", label: "(GMT +1:00) Brussels, Copenhagen, Madrid, Paris"},
      {id: "+02:00", label: "(GMT +2:00) Kaliningrad, South Africa"},
      {id: "+03:00", label: "(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg"},
      {id: "+03:50", label: "(GMT +3:30) Tehran"},
      {id: "+04:00", label: "(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi"},
      {id: "+04:50", label: "(GMT +4:30) Kabul"},
      {id: "+05:00", label: "(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent"},
      {id: "+05:50", label: "(GMT +5:30) Bombay, Calcutta, Madras, New Delhi"},
      {id: "+05:75", label: "(GMT +5:45) Kathmandu, Pokhara"},
      {id: "+06:00", label: "(GMT +6:00) Almaty, Dhaka, Colombo"},
      {id: "+06:50", label: "(GMT +6:30) Yangon, Mandalay"},
      {id: "+07:00", label: "(GMT +7:00) Bangkok, Hanoi, Jakarta"},
      {id: "+08:00", label: "(GMT +8:00) Beijing, Perth, Singapore, Hong Kong"},
      {id: "+08:75", label: "(GMT +8:45) Eucla"},
      {id: "+09:00", label: "(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk"},
      {id: "+09:50", label: "(GMT +9:30) Adelaide, Darwin"},
      {id: "+10:00", label: "(GMT +10:00) Eastern Australia, Guam, Vladivostok"},
      {id: "+10:50", label: "(GMT +10:30) Lord Howe Island"},
      {id: "+11:00", label: "(GMT +11:00) Magadan, Solomon Islands, New Caledonia"},
      {id: "+11:50", label: "(GMT +11:30) Norfolk Island"},
      {id: "+12:00", label: "(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka"},
      {id: "+12:75", label: "(GMT +12:45) Chatham Islands"},
      {id: "+13:00", label: "(GMT +13:00) Apia, Nukualofa"},
      {id: "+14:00", label: "(GMT +14:00) Line Islands, Tokelau"}
    ];

    service.isTemporalDate = function (node) {
      return schemaService.isTemporalType(node) && TemporalEditorFieldService.getTemporalType(node) === 'xsd:date';
    };

    service.isTemporalTime = function (node) {
      return schemaService.isTemporalType(node) && TemporalEditorFieldService.getTemporalType(node) === 'xsd:time';
    };

    service.isTemporalDateTime = function (node) {
      return schemaService.isTemporalType(node) && TemporalEditorFieldService.getTemporalType(node) === 'xsd:dateTime';
    };

    service.isTimezoneEnabled = function (node) {
      return service.hasTimeComponent(node) && schemaService.getValueConstraints(node).xsdTimeZoneEnable;
    };

    service.isDecimalSecondsEnabled = function (node) {
      return service.hasTimeComponent(node) && schemaService.getValueConstraints(node).xsdTimeFinestGranularity === 'DecimalSecond';
    };

    service.hasTimeComponent = function (node) {
      return schemaService.isTemporalType(node) && (TemporalEditorFieldService.getTemporalType(node) === 'xsd:dateTime' || TemporalEditorFieldService.getTemporalType(node) === 'xsd:time');
    };

    service.hasDateComponent = function (node) {
      return schemaService.isTemporalType(node) && (TemporalEditorFieldService.getTemporalType(node) === 'xsd:dateTime' || TemporalEditorFieldService.getTemporalType(node) === 'xsd:date');
    };

    service.initTimezoneDropdown = function (scope) {
      scope.availableTimezones = availableTimezones;
    };

    service.initializeDateTimeOptions = function ($scope) {

      let dpo = {};
      if (service.isTemporalDate($scope.field)) {
        let ui = schemaService.getUI($scope.field);
        let gran = ui.temporalGranularity;
        if (gran === 'year') {
          dpo.datepickerMode = 'year';
          dpo.minMode = 'year';
          dpo.format = 'yyyy';
          dpo.renderingFormat = 'y'
        } else if (gran === 'month') {
          dpo.datepickerMode = 'month';
          dpo.minMode = 'month';
          dpo.format = 'MM/yyyy';
          dpo.renderingFormat = 'MMM y'
        } else if (gran === 'day') {
          dpo.datepickerMode = 'day';
          dpo.minMode = 'day';
          dpo.format = 'MM/dd/yyyy';
          dpo.renderingFormat = 'MMM d, y'
        }
        dpo.storageFormat = 'yyyy-MM-dd'
      }
      $scope.datepickerOptions = dpo;

      let tpo = {};
      if (service.isTemporalTime($scope.field)) {
        tpo.displayAmPm = schemaService.getInputTimeFormat($scope.field) === '12h';
        let ui = schemaService.getUI($scope.field);
        console.log($scope.field);
        console.log(ui);
        let gran = ui.temporalGranularity;
        if (gran === 'hour') {
          tpo.showMinutes = false;
          tpo.showSeconds = false;
          if (tpo.displayAmPm) {
            tpo.renderingFormat = 'hh a'
          } else {
            tpo.renderingFormat = 'HH'
          }
        } else if (gran === 'minute') {
          tpo.showMinutes = true;
          tpo.showSeconds = false;
          if (tpo.displayAmPm) {
            tpo.renderingFormat = 'hh:mm a'
          } else {
            tpo.renderingFormat = 'HH:mm'
          }
        } else if (gran === 'second') {
          tpo.showMinutes = true;
          tpo.showSeconds = true;
          if (tpo.displayAmPm) {
            tpo.renderingFormat = 'hh:mm:ss a'
          } else {
            tpo.renderingFormat = 'HH:mm:ss'
          }
        } else if (gran === 'decimalSecond') {
          tpo.showMinutes = true;
          tpo.showSeconds = true;
          if (tpo.displayAmPm) {
            tpo.renderingFormat = 'hh:mm:ss a'
          } else {
            tpo.renderingFormat = 'HH:mm:ss'
          }
        }
        tpo.storageFormat = 'HH:mm:ss'
      }

      $scope.timepickerOptions = tpo;

      if (service.isTemporalDateTime($scope.field)) {
        let ui = schemaService.getUI($scope.field);
        let gran = ui.temporalGranularity;

        dpo.datepickerMode = 'day';
        dpo.minMode = 'day';
        dpo.format = 'MM/dd/yyyy';
        dpo.renderingFormat = 'MMM d, y'

        tpo.displayAmPm = schemaService.getInputTimeFormat($scope.field) === '12h';
        ui = schemaService.getUI($scope.field);
        gran = ui.temporalGranularity;
        if (gran === 'hour') {
          tpo.showMinutes = false;
          tpo.showSeconds = false;
          if (tpo.displayAmPm) {
            tpo.renderingFormat = 'hh a'
          } else {
            tpo.renderingFormat = 'HH'
          }
        } else if (gran === 'minute') {
          tpo.showMinutes = true;
          tpo.showSeconds = false;
          if (tpo.displayAmPm) {
            tpo.renderingFormat = 'hh:mm a'
          } else {
            tpo.renderingFormat = 'HH:mm'
          }
        } else if (gran === 'second') {
          tpo.showMinutes = true;
          tpo.showSeconds = true;
          if (tpo.displayAmPm) {
            tpo.renderingFormat = 'hh:mm:ss a'
          } else {
            tpo.renderingFormat = 'HH:mm:ss'
          }
        } else if (gran === 'decimalSecond') {
          tpo.showMinutes = true;
          tpo.showSeconds = true;
          if (tpo.displayAmPm) {
            tpo.renderingFormat = 'hh:mm:ss a'
          } else {
            tpo.renderingFormat = 'HH:mm:ss'
          }
        }

        let renderingFormat = dpo.renderingFormat + ' ' + tpo.renderingFormat;

        dpo.renderingFormat = renderingFormat;
        tpo.renderingFormat = renderingFormat;

        dpo.storageFormat = 'yyyy-MM-ddTHH:mm:ss';
        tpo.storageFormat = 'yyyy-MM-ddTHH:mm:ss';
      }

      $scope.timepickerOptions = tpo;
      $scope.datepickerOptions = dpo;


      if (service.hasDateComponent($scope.field)) {
        $scope.date.dt = new Date($scope.valueArray[$scope.index]['@value']);
        $scope.date.dt.setMinutes($scope.date.dt.getTimezoneOffset());
      }
      if (service.hasTimeComponent($scope.field)) {
        service.initTimezoneDropdown($scope);
        let thisMoment = moment($scope.valueArray[$scope.index]['@value'], [$scope.timepickerOptions.storageFormat]);
        $scope.time.dt = thisMoment.toDate();
        $scope.decimalSeconds = 0;
        let tzId = '-08:00';
        let tzLabel = null;
        for (let i in $scope.availableTimezones) {
          if ($scope.availableTimezones[i].id === tzId) {
            tzLabel = $scope.availableTimezones[i].label;
          }
        }
        $scope.selectedTimezone = {'id': tzId, 'label': tzLabel};
      }
      if (service.isTemporalDateTime($scope.field)) {
        $scope.datetime = new Date($scope.valueArray[$scope.index]['@value']);
      }

    };

    service.showHideDateTimeElements = function($scope) {
      let tpO = $scope.timepickerOptions;
      if (angular.element("#timepickerIncMinuteButton")[0]) {
        angular.element("#timepickerIncMinuteButton")[0].style.display = tpO.showMinutes ? 'table-cell' : 'none';
      }
      if (angular.element("#timepickerIncMinuteSpacer")[0]) {
        angular.element("#timepickerIncMinuteSpacer")[0].style.display = tpO.showMinutes?'table-cell':'none';
      }
      if (angular.element("#timepickerDecMinuteButton")[0]) {
        angular.element("#timepickerDecMinuteButton")[0].style.display = tpO.showMinutes ? 'table-cell' : 'none';
      }
      if (angular.element("#timepickerDecMinuteSpacer")[0]) {
        angular.element("#timepickerDecMinuteSpacer")[0].style.display = tpO.showMinutes ? 'table-cell' : 'none';
      }
      if (angular.element("#timepickerMinuteSparator")[0]) {
        angular.element("#timepickerMinuteSparator")[0].style.display = tpO.showMinutes ? 'table-cell' : 'none';
      }
      if (angular.element("#timepickerMinuteInput")[0]) {
        angular.element("#timepickerMinuteInput")[0].style.display = tpO.showMinutes ? 'table-cell' : 'none';
      }

    };

    return service;
  }

});
