'use strict';


define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.temporalRuntimeFieldService', [])
      .service('TemporalRuntimeFieldService', TemporalRuntimeFieldService);

  TemporalRuntimeFieldService.$inject = ["$rootScope", "$filter", "schemaService", "TemporalEditorFieldService", "DataManipulationService"];

  function TemporalRuntimeFieldService($rootScope, $filter, schemaService, TemporalEditorFieldService, DataManipulationService) {

    let service = {
      serviceId: "TemporalRuntimeFieldService"
    };

    let availableTimezones = [
      {id: "-12:00", label: "(GMT -12:00) Eniwetok, Kwajalein"},
      {id: "-11:00", label: "(GMT -11:00) Midway Island, Samoa"},
      {id: "-10:00", label: "(GMT -10:00) Hawaii"},
      {id: "-09:30", label: "(GMT -9:30) Taiohae"},
      {id: "-09:00", label: "(GMT -9:00) Alaska"},
      {id: "-08:00", label: "(GMT -8:00) Pacific Time (US & Canada)"},
      {id: "-07:00", label: "(GMT -7:00) Mountain Time (US & Canada)"},
      {id: "-06:00", label: "(GMT -6:00) Central Time (US & Canada), Mexico City"},
      {id: "-05:00", label: "(GMT -5:00) Eastern Time (US & Canada), Bogota, Lima"},
      {id: "-04:30", label: "(GMT -4:30) Caracas"},
      {id: "-04:00", label: "(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz"},
      {id: "-03:30", label: "(GMT -3:30) Newfoundland"},
      {id: "-03:00", label: "(GMT -3:00) Brazil, Buenos Aires, Georgetown"},
      {id: "-02:00", label: "(GMT -2:00) Mid-Atlantic"},
      {id: "-01:00", label: "(GMT -1:00) Azores, Cape Verde Islands"},
      {id: "Z", label: "(GMT) Western Europe Time, London, Lisbon, Casablanca"},
      {id: "+01:00", label: "(GMT +1:00) Brussels, Copenhagen, Madrid, Paris"},
      {id: "+02:00", label: "(GMT +2:00) Kaliningrad, South Africa"},
      {id: "+03:00", label: "(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg"},
      {id: "+03:30", label: "(GMT +3:30) Tehran"},
      {id: "+04:00", label: "(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi"},
      {id: "+04:30", label: "(GMT +4:30) Kabul"},
      {id: "+05:00", label: "(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent"},
      {id: "+05:30", label: "(GMT +5:30) Bombay, Calcutta, Madras, New Delhi"},
      {id: "+05:45", label: "(GMT +5:45) Kathmandu, Pokhara"},
      {id: "+06:00", label: "(GMT +6:00) Almaty, Dhaka, Colombo"},
      {id: "+06:30", label: "(GMT +6:30) Yangon, Mandalay"},
      {id: "+07:00", label: "(GMT +7:00) Bangkok, Hanoi, Jakarta"},
      {id: "+08:00", label: "(GMT +8:00) Beijing, Perth, Singapore, Hong Kong"},
      {id: "+08:45", label: "(GMT +8:45) Eucla"},
      {id: "+09:00", label: "(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk"},
      {id: "+09:30", label: "(GMT +9:30) Adelaide, Darwin"},
      {id: "+10:00", label: "(GMT +10:00) Eastern Australia, Guam, Vladivostok"},
      {id: "+10:30", label: "(GMT +10:30) Lord Howe Island"},
      {id: "+11:00", label: "(GMT +11:00) Magadan, Solomon Islands, New Caledonia"},
      {id: "+11:30", label: "(GMT +11:30) Norfolk Island"},
      {id: "+12:00", label: "(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka"},
      {id: "+12:45", label: "(GMT +12:45) Chatham Islands"},
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
      return TemporalEditorFieldService.hasTimeComponent(node) && schemaService.getUI(node).timezoneEnabled;
    };

    service.isDecimalSecondsEnabled = function (node) {
      return TemporalEditorFieldService.hasTimeComponent(node) && schemaService.getUI(node).temporalGranularity === 'decimalSecond';
    };

    service.initTimezoneDropdown = function (scope) {
      scope.availableTimezones = availableTimezones;
    };

    service.initializeDateTimeOptions = function ($scope) {

      let dpo = {};
      if (service.isTemporalDate($scope.field)) {
        dpo = service.getDatePickerOption($scope);
        dpo.storageFormat = 'yyyy-MM-dd'
      }
      $scope.datepickerOptions = dpo;

      let tpo = {};
      if (service.isTemporalTime($scope.field)) {
        tpo = service.getTimePickerOptions($scope);
        tpo.storageFormat = 'HH:mm:ss'
      }

      $scope.timepickerOptions = tpo;

      if (service.isTemporalDateTime($scope.field)) {

        dpo.datepickerMode = 'day';
        dpo.minMode = 'day';
        dpo.format = 'MM/dd/yyyy';
        dpo.renderingFormat = 'MMM d, y'

        tpo = service.getTimePickerOptions($scope);

        let renderingFormat = dpo.renderingFormat + ' ' + tpo.renderingFormat;

        dpo.renderingFormat = renderingFormat;
        tpo.renderingFormat = renderingFormat;

        dpo.storageFormat = 'yyyy-MM-ddTHH:mm:ss';
        tpo.storageFormat = 'yyyy-MM-ddTHH:mm:ss';
      }

      $scope.timepickerOptions = tpo;
      $scope.datepickerOptions = dpo;


      if (TemporalEditorFieldService.hasDateComponent($scope.field)) {
        $scope.date.dt = new Date($scope.valueArray[$scope.index]['@value']);
        $scope.date.dt.setMinutes($scope.date.dt.getTimezoneOffset());
      }

      if (TemporalEditorFieldService.hasTimeComponent($scope.field)) {
        let val = $scope.valueArray[$scope.index]['@value'];
        let tzVal = service.getTimezoneAndTime(val, $scope);
        let tzId = tzVal.tzId;
        val = tzVal.time;

        let thisMoment = moment(val, [$scope.timepickerOptions.storageFormat]);
        $scope.time.dt = thisMoment.toDate();
        $scope.time.decimalSeconds = 0;

        if (val !== null) {
          let matchFractional = val.match(/\d\.(\d+)/);
          if (matchFractional != null && matchFractional.length > 1) {
            $scope.time.decimalSeconds = Number(matchFractional[1]);
          }
        }

        service.initTimezoneDropdown($scope);
        let tzLabel = null;
        for (let i in $scope.availableTimezones) {
          if ($scope.availableTimezones[i].id === tzId) {
            tzLabel = $scope.availableTimezones[i].label;
          }
        }
        $scope.time.selectedTimezone = {'id': tzId, 'label': tzLabel};
      }
      if (service.isTemporalDateTime($scope.field)) {
        if ($scope.valueArray[$scope.index]['@value'] != null) {
          $scope.datetime = new Date($scope.valueArray[$scope.index]['@value']);
        }
      }

    };

    service.getTimePickerOptions = function ($scope) {
      let tpo = {};
      tpo.displayAmPm = schemaService.getInputTimeFormat($scope.field) === '12h';
      let ui = schemaService.getUI($scope.field);
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
      return tpo;
    }

    service.getDatePickerOption = function ($scope) {
      let dpo = {};
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
      return dpo;
    }

    service.getTimezoneAndTime = function (val, $scope) {
      let tzId = '-08:00';
      if (val != null && service.isTimezoneEnabled($scope.field)) {
        let lastChar = val.slice(-1);
        let timezoneCandidate = val.slice(-6);
        let timezoneSign = val.slice(-6, -5);
        if (lastChar === 'Z') {
          tzId = 'Z';
          val = val.slice(0, -1);
        } else if (timezoneSign === '-' || timezoneSign === '+') {
          tzId = timezoneCandidate;
          val = val.slice(0, -6);
        }
      }
      return {
        tzId: tzId,
        time: val
      };
    }

    service.showHideDateTimeElements = function ($scope) {
      let tpO = $scope.timepickerOptions;
      // Hack: without the timeout, the minute input was not always hiding
      setTimeout(function () {
        if (angular.element("#timepickerIncMinuteButton")[0]) {
          angular.element("#timepickerIncMinuteButton")[0].style.display = tpO.showMinutes ? 'table-cell' : 'none';
        }
        if (angular.element("#timepickerIncMinuteSpacer")[0]) {
          angular.element("#timepickerIncMinuteSpacer")[0].style.display = tpO.showMinutes ? 'table-cell' : 'none';
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
      }, 100);
    };

    service.setDecimalSecondsAndTimezoneFromUI = function (scope, time, newDecimalSeconds, newTimezone, oldValue) {
      let dateToParse = oldValue;
      if (!TemporalEditorFieldService.hasDateComponent(scope.field)) {
        dateToParse = '2020-02-02T' + dateToParse;
      }

      let tzVal = service.getTimezoneAndTime(dateToParse, scope);
      let tzId = tzVal.tzId;
      dateToParse = tzVal.time;

      let parsedDate = new Date(dateToParse);
      let formattedDate = $filter('date')(parsedDate, scope.timepickerOptions.storageFormat);
      if (newDecimalSeconds != null) {
        if (!isNaN(Number(newDecimalSeconds)) && Number(newDecimalSeconds) != 0) {
          formattedDate += '.' + newDecimalSeconds;
        }
      } else {
        if (!isNaN(Number(time.decimalSeconds)) && Number(time.decimalSeconds) != 0) {
          formattedDate += '.' + time.decimalSeconds;
        }
      }

      if (newTimezone != null) {
        formattedDate += newTimezone.id;
      } else {
        formattedDate += tzId;
      }

      scope.valueArray[scope.index]['@value'] = formattedDate;
    };

    service.updateModelFromUI = function ($scope, newValue, oldValue, isAttributeName, subType, storageFormat, field) {
      if (service.isTemporalDate($scope.field)) {

        let basedate = $filter('date')(newValue, storageFormat);
        $scope.model['@value'] = basedate;
        $scope.datetime = new Date(basedate);

      } else if (service.isTemporalTime($scope.field)) {

        let gran = DataManipulationService.schemaOf(field)._ui.temporalGranularity;
        if (newValue !== null) {
          if (gran === 'hour') {
            newValue.setMinutes(0);
            newValue.setSeconds(0);
          } else if (gran === 'minute') {
            newValue.setSeconds(0);
          }
        }

        let basedate = $filter('date')(newValue, storageFormat);
        $scope.model['@value'] = basedate;
        $scope.datetime = new Date(basedate);

        let tzVal = service.getTimezoneAndTime(oldValue, $scope);
        let tzId = tzVal.tzId;

        service.setDecimalSecondsAndTimezoneFromUI($scope, $scope.time, null, {id: tzId}, $scope.valueArray[$scope.index]['@value']);

      } else if (service.isTemporalDateTime($scope.field)) {
        let oldDateTime = new Date($scope.model['@value']);
        if ($scope.model['@value'] == null) {
          oldDateTime = new Date();
          $scope.date.dt = oldDateTime;
        }

        if (subType === 'time') {
          oldDateTime.setHours(newValue.getHours());
          oldDateTime.setMinutes(newValue.getMinutes());
          oldDateTime.setSeconds(newValue.getSeconds());
        } else if (subType === 'date') {
          oldDateTime.setFullYear(newValue.getFullYear());
          oldDateTime.setMonth(newValue.getMonth());
          oldDateTime.setDate(newValue.getDate());
        }

        let gran = DataManipulationService.schemaOf(field)._ui.temporalGranularity;
        if (newValue !== null) {
          if (gran === 'hour') {
            oldDateTime.setMinutes(0);
            oldDateTime.setSeconds(0);
          } else if (gran === 'minute') {
            oldDateTime.setSeconds(0);
          }
        }

        let basedate = $filter('date')(oldDateTime, storageFormat);
        $scope.model['@value'] = basedate;
        $scope.datetime = new Date(basedate);

        let tzVal = service.getTimezoneAndTime(oldValue, $scope);
        let tzId = tzVal.tzId;

        service.setDecimalSecondsAndTimezoneFromUI($scope, $scope.time, null, {id: tzId}, $scope.valueArray[$scope.index]['@value']);

      }
    }

    return service;
  }

});
