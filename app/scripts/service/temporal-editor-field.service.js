'use strict';


define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.temporalEditorFieldService', [])
      .service('TemporalEditorFieldService', TemporalEditorFieldService);

  TemporalEditorFieldService.$inject = ["$rootScope", "schemaService", "DataManipulationService"];

  function TemporalEditorFieldService($rootScope, schemaService, dms) {

    let service = {
      serviceId: "TemporalEditorFieldService"
    };

    let defaultDatePrecision = "day";
    let defaultTimePrecision = "second";
    let defaultTimeZoneEnabled = true;
    let defaultInputTimeFormat = '12h';

    service.datePrecisionFormats = [
      {id: "day", label: "Day (YYYY-MM-DD)"},
      {id: "month", label: "Month (YYYY-MM)"},
      {id: "year", label: "Year (YYYY)"}
    ];

    service.timePrecisionFormats = [
      {id: "second", label: "Second (hh:mm:ss)"},
      {id: "decimalSecond", label: "DecimalSecond (hh:mm:ss.sss...s)"},
      {id: "minute", label: "Minute (hh:mm)"},
      {id: "hour", label: "Hour (hh)"}
    ];

    service.timeEnableTimezoneOptions = [
      {id: true, label: "Allow Timezone Information"},
      {id: false, label: "Do not allow Timezone Information"}
    ];

    service.timeEnableAmPmOptions = [
      {id: '12h', label: "Use AM/PM Input"},
      {id: '24h', label: "Use 24H Input"}
    ];


    // Sets the dateTime type based on the item stored at the model
    service.setDateTimeTypeFromModel = function ($scope) {
      let schema = dms.schemaOf($scope.field);
      if (schema._valueConstraints) {
        let typeId = schema._valueConstraints.temporalType;
        if (!typeId) {
          typeId = "xsd:dateTime";
          schema._valueConstraints.temporalType = typeId;
        }
        const getDateTimeLabel = function (id) {
          for (let i = 0; i < $scope.dateTimeTypes.length; i++) {
            const type = $scope.dateTimeTypes[i];
            if (type.id === id) {
              return type.label;
            }
          }
        };
        $scope.selectedDateTimeType = {
          id   : typeId,
          label: getDateTimeLabel(typeId)
        }
      }
    };

    // Sets the date precision format based on the item stored at the model
    service.setDatePrecisionFormatFromModel = function ($scope) {
      let schema = dms.schemaOf($scope.field);
      if (schema._ui) {
        let typeId = schema._ui.temporalGranularity;
        if (!typeId) {
          typeId = defaultDatePrecision;
          schema._ui.temporalGranularity = typeId;
        }
        const getDatePrecisionFormatLabel = function (id) {
          for (let i = 0; i < service.datePrecisionFormats.length; i++) {
            const type = service.datePrecisionFormats[i];
            if (type.id === id) {
              return type.label;
            }
          }
        };
        $scope.selectedDatePrecisionFormat = {
          id   : typeId,
          label: getDatePrecisionFormatLabel(typeId)
        }
      }
    };

    // Sets the time precision format based on the item stored at the model
    service.setTimePrecisionFormatFromModel = function ($scope) {
      let schema = dms.schemaOf($scope.field);
      if (schema._ui) {
        let typeId = schema._ui.temporalGranularity;
        if (!typeId) {
          typeId = defaultTimePrecision;
          schema._ui.temporalGranularity = typeId;
        }
        const getTimePrecisionFormatLabel = function (id) {
          for (let i = 0; i < service.timePrecisionFormats.length; i++) {
            const type = service.timePrecisionFormats[i];
            if (type.id === id) {
              return type.label;
            }
          }
        };
        $scope.selectedTimePrecisionFormat = {
          id   : typeId,
          label: getTimePrecisionFormatLabel(typeId)
        }
      }
    };

    // Sets the timezone enable based on the item stored at the model
    service.setTimeEnableTimezoneFromModel = function ($scope) {
      let schema = dms.schemaOf($scope.field);
      if (schema._ui) {
        let typeId = schema._ui.timezoneEnabled;
        if (typeof typeId === "undefined") {
          typeId = defaultTimeZoneEnabled;
          schema._ui.timezoneEnabled = typeId;
        }
        const getTimeEnableTimezoneLabel = function (id) {
          for (let i = 0; i < service.timeEnableTimezoneOptions.length; i++) {
            const type = service.timeEnableTimezoneOptions[i];
            if (type.id === id) {
              return type.label;
            }
          }
        };
        $scope.selectedTimeEnableTimezone = {
          id   : typeId,
          label: getTimeEnableTimezoneLabel(typeId)
        }
      }
    };

    // Sets the ampm enable based on the item stored at the model
    service.setTimeEnableAmPmFromModel = function ($scope) {
      let schema = dms.schemaOf($scope.field);
      if (schema._ui) {
        let typeId = schema._ui.inputTimeFormat;
        if (typeof typeId === "undefined") {
          typeId = defaultInputTimeFormat;
          schema._ui.inputTimeFormat = typeId;
        }
        const getTimeEnableAmPmLabel = function (id) {
          for (let i = 0; i < service.timeEnableAmPmOptions.length; i++) {
            const type = service.timeEnableAmPmOptions[i];
            if (type.id === id) {
              return type.label;
            }
          }
        };
        $scope.selectedTimeEnableAmPm = {
          id   : typeId,
          label: getTimeEnableAmPmLabel(typeId)
        }
      }
    };

    // Sets the dateTime type based on the item selected at the UI
    service.setDateTimeTypeFromUI = function (item, $scope) {
      let schema = dms.schemaOf($scope.field);
      schema._valueConstraints.temporalType = item.id;
      delete schema._ui.temporalGranularity;
      service.cleanupExtraSchemaKeys(item, $scope);
    };

    // Sets the date precision format based on the item selected at the UI
    service.setDatePrecisionFormatFromUI = function (item, $scope) {
      dms.schemaOf($scope.field)._ui.temporalGranularity = item.id;
      service.cleanupExtraSchemaKeys(item, $scope);
    };

    // Sets the time precision format based on the item selected at the UI
    service.setTimePrecisionFormatFromUI = function (item, $scope) {
      dms.schemaOf($scope.field)._ui.temporalGranularity = item.id;
      service.cleanupExtraSchemaKeys(item, $scope);
    };

    service.cleanupExtraSchemaKeys = function (item, $scope) {
      if (!service.hasTimeComponent($scope.field)) {
        let schema = dms.schemaOf($scope.field);
        delete schema._ui.inputTimeFormat;
        delete schema._ui.timezoneEnabled;
      }
      // if (!service.hasDateComponent($scope.field)) {
      //   let schema = dms.schemaOf($scope.field);
      // }
    };

    // Sets the time enable microseconds based on the item selected at the UI
    service.setTimeEnableTimezoneFromUI = function (item, $scope) {
      dms.schemaOf($scope.field)._ui.timezoneEnabled = item.id;
    };

    // Sets the time enable microseconds based on the item selected at the UI
    service.setTimeEnableAmPmFromUI = function (item, $scope) {
      dms.schemaOf($scope.field)._ui.inputTimeFormat = item.id;
    };

    service.getTemporalType = function (node) {
      return node && schemaService.schemaOf(node)._valueConstraints.temporalType;
    };

    service.hasTimeGranularity = function (node) {
      return schemaService.isTemporalType(node) && (service.getTemporalType(node) === 'xsd:dateTime' || service.getTemporalType(node) === 'xsd:time');
    };

    service.hasDateGranularity = function (node) {
      return schemaService.isTemporalType(node) && service.getTemporalType(node) === 'xsd:date';
    };

    service.hasTimeComponent = function (node) {
      return schemaService.isTemporalType(node) && (service.getTemporalType(node) === 'xsd:dateTime' || service.getTemporalType(node) === 'xsd:time');
    };

    service.hasDateComponent = function (node) {
      return schemaService.isTemporalType(node) && (service.getTemporalType(node) === 'xsd:dateTime' || service.getTemporalType(node) === 'xsd:date');
    };


    return service;
  }

});
