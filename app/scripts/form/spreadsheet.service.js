'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.spreadsheetService', [])
      .service('SpreadsheetService', SpreadsheetService);

  SpreadsheetService.$inject = ['$rootScope', '$filter'];

  function SpreadsheetService($rootScope, $filter) {


    var service = {
      serviceId: "SpreadsheetService"
    };


    service.validators = function () {
      email: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
    };

    service.customRendererCheckboxes = function (instance, td, row, col, prop, value, cellProperties) {
      var objValue = JSON.parse(value);
      var s = "";
      var sep = "";
      for (var name in objValue) {
        if (objValue[name]) {
          s += sep + name;
          sep = ", ";
        }
      }
      var escaped = Handsontable.helper.stringify(s);
      td.innerHTML = escaped;
      return td;
    };

    service.customRendererDeepObject = function (instance, td, row, col, prop, value, cellProperties) {
      var s = value + '<i class="cedar-svg-element inSpreadsheetCell"></i>';
      var escaped = Handsontable.helper.stringify(s);
      td.innerHTML = escaped;
      td.className = 'htDimmed';
      return td;
    };

    // copy table data to source table
    service.updateRowDataModel = function ($scope) {
      var sds = $scope.spreadsheetDataScope;
      for (var row in sds.tableData) {

        // do we have this row in the source?
        if (row >= sds.tableDataSource.length) {
          sds.tableDataSource.push([]);
          for (var i = 0; i < $scope.config.columns.length; i++) {
            var obj = {};
            obj['@value'] = '';
            sds.tableDataSource[row].push(obj);
          }
        }

        for (var col in sds.tableData[row]) {
          var inputType = sds.columnDescriptors[col].type;
          var cedarType = sds.columnDescriptors[col].cedarType;
          if (inputType == 'dropdown') {
            var containerArray = [];
            containerArray.push(sds.tableData[row][col]);
            sds.tableDataSource[row][col]['@value'] = containerArray;
          } else if (cedarType == 'checkboxes') {
            var valueObject = JSON.parse(sds.tableData[row][col]);
            var value = {};
            for (var key in valueObject) {
              value[key] = true;
            }
            sds.tableDataSource[row][col]['@value'] = value;
          } else {
            sds.tableDataSource[row][col]['@value'] = sds.tableData[row][col];
          }
        }
      }
      $scope.spreadsheetDataScope.callback(sds.tableDataSource);
    };

    // copy table data to source table
    service.updateDataModel = function ($scope) {
      var sds = $scope.spreadsheetDataScope;
      for (var row in sds.tableData) {
        for (var col in sds.tableData[row]) {

          // do we have this row in the source?
          if (row >= sds.tableDataSource.length) {
            sds.tableDataSource.push([]);
            for (var i = 0; i < $scope.config.columns.length; i++) {
              var obj = {};
              obj['@value'] = '';
              sds.tableDataSource[row].push(obj);
            }
          }

          var inputType = sds.columnDescriptors[col].type;
          var cedarType = sds.columnDescriptors[col].cedarType;
          if (inputType == 'dropdown') {
            var containerArray = [];
            containerArray.push(sds.tableData[row][col]);
            sds.tableDataSource[row][col]['@value'] = containerArray;
          } else if (cedarType == 'checkboxes') {
            var valueObject = JSON.parse(sds.tableData[row][col]);
            var value = {};
            for (var key in valueObject) {
              value[key] = true;
            }
            sds.tableDataSource[row][col]['@value'] = value;
          } else {
            sds.tableDataSource[row][col]['@value'] = sds.tableData[row][col];
          }
        }
      }
    };

    service.getMinItems = function (scopeElement) {
      var minItems = 0;
      if (scopeElement.hasOwnProperty("minItems")) {
        minItems = scopeElement.minItems;
      }
      return minItems;
    };

    service.getMaxItems = function (scopeElement) {
      var maxItems = Number.POSITIVE_INFINITY;
      if (scopeElement.hasOwnProperty("maxItems")) {
        maxItems = scopeElement.maxItems;
      }
      return maxItems;
    };

    service.getColumnHeaderOrder = function (context, scopeElement) {
      var headerOrder = [];
      if (context.isField()) {
        headerOrder.push('value');
      } else {
        var itemOrder = $rootScope.schemaOf(scopeElement)._ui.order;
        for (var i in itemOrder) {
          headerOrder.push(itemOrder[i]);
        }
      }
      return headerOrder;
    };

    service.extractOptionsForList = function (options) {
      var list = [];
      for (var i in options) {
        list.push(options[i].label);
      }
      return list;
    };

    service.extractOptionsForCheckboxes = function (options) {
      var list = [];
      for (var i in options) {
        list.push(options[i].label);
      }
      return list;
    };

    service.getColumnDescriptors = function (context, scopeElement, columnHeaderOrder, originalScope) {
      var colDescriptors = [];

      for (var i in columnHeaderOrder) {
        var desc = {};
        desc.type = 'text';
        desc.cedarType = null;
        var name = columnHeaderOrder[i];
        var field = null;

        if (context.isField()) {
          field = scopeElement;
        } else {
          field = scopeElement;
        }

        if (field.hasOwnProperty("items")) {

          var items = field.items;
          if (items != null && items.hasOwnProperty('properties')) {

            var _ui = field.items._ui;
            var inputType = _ui.inputType;

            if (inputType == 'date') {
              // http://docs.handsontable.com/0.19.0/demo-date.html
              desc.type = 'date';
              desc.dateFormat = 'MM/DD/YYYY HH:mm';
              desc.correctFormat = true;
            } else if (inputType == 'email') {
              // http://docs.handsontable.com/0.19.0/demo-data-validation.html
              desc.allowInvalid = true;
              desc.validator = service.validators.email;
            } else if (inputType == 'numeric') {
              // http://docs.handsontable.com/0.19.0/demo-numeric.html
              // http://numeraljs.com/
              desc.type = 'numeric';
            } else if (inputType == 'list') {
              if (_valueConstraints.multipleChoice == false) {
                desc.type = 'dropdown';
                var listOptions = service.extractOptionsForList(_valueConstraints.literals);
                desc.source = listOptions;
              }
            } else if (inputType == 'checkbox') {
              desc.renderer = service.customRenderer.checkboxes;
              desc.editor = 'checkboxes';//MultiCheckboxEditor;
              var checkboxOptions = service.extractOptionsForCheckboxes(_valueConstraints.literals);
              desc.source = checkboxOptions;
              desc.cedarType = 'checkboxes';
            }
          } else {
            desc.cedarType = 'deepObject';
            desc.cedarLabel = $filter('keyToTitle')(name);
            desc.readOnly = true;
            desc.renderer = service.customRendererDeepObject;
          }

          colDescriptors.push(desc);
        }
      }
      return colDescriptors;
    };

    service.extractAndStoreCellData = function (cellDataObject, rowData, columnDescriptor) {
      var inputType = columnDescriptor.type;
      var cedarType = columnDescriptor.cedarType;
      if (inputType == 'dropdown') {
        rowData.push(cellDataObject['@value'][0]);
      } else if (cedarType == 'checkboxes') {
        rowData.push(JSON.stringify(cellDataObject['@value']));
      } else if (cedarType == 'deepObject') {
        rowData.push(columnDescriptor.cedarLabel);
      } else {
        rowData.push(cellDataObject._valueLabel || cellDataObject['@value']);
      }
    };

    service.getTableData = function (context, $scope, headerOrder, columnDescriptors) {
      var tableData = [];
      for (var i in $scope.model) {
        var row = $scope.model[i];
        var rowData = [];
        if (context.isField()) {
          service.extractAndStoreCellData(row, rowData, columnDescriptors[0]);
        } else {
          for (var col in headerOrder) {
            var colName = headerOrder[col];
            var cellDataObject = row[colName];
            service.extractAndStoreCellData(cellDataObject, rowData, columnDescriptors[col]);
          }
        }
        tableData.push(rowData);
      }
      return tableData;
    };


    service.getTableDataSource = function (context, $scope, headerOrder) {
      var tableDataSource = [];
      for (var i in $scope.model) {
        var row = $scope.model[i];
        var rowDataSource = [];
        if (context.isField()) {
          rowDataSource.push(row);
        } else {
          for (var col in headerOrder) {
            var colName = headerOrder[col];
            var cellDataObject = row[colName];
            rowDataSource.push(cellDataObject);
          }
        }
        tableDataSource.push(rowDataSource);
      }
      return tableDataSource;
    };

    service.applyVisibility = function ($scope) {
      var context = $scope.spreadsheetContext;
      var ov = context.isOriginalContentVisible();
      jQuery(context.getOriginalContentContainer()).toggleClass("visible", ov);
      jQuery(context.getOriginalContentContainer()).toggleClass("hidden", !ov);
      jQuery(context.getSpreadsheetContainer()).toggleClass("visible", !ov);
      //var elementDirective = jQuery(context.getSpreadsheetContainer()).parent().parent();
      //jQuery(".spreadsheetSwitch.element.spreadsheet", elementDirective).toggleClass("visible", !ov);

    };

    service.destroySpreadsheet = function ($scope) {


      if ($scope.hasOwnProperty('spreadsheetContext')) {

        var context = $scope.spreadsheetContext;
        context.switchVisibility();
        if (context.isOriginalContentVisible()) {
          console.log('destroySpreadsheet ' + $scope.getLocator(0));
          context.getTable().destroy();
          jQuery(context.getSpreadsheetContainer()).html("");
          service.applyVisibility($scope);

        }
      }
    };


    var switchToSpreadsheet = function (ctx, $scope, $element, index, isField, addCallback, removeCallback) {
      var context = ctx;
      // if ($scope.hasOwnProperty('spreadsheetContext')) {
      //   context = $scope.spreadsheetContext;
      //
      //   context.switchVisibility();
      //   if (context.isOriginalContentVisible()) {
      //     context.getTable().destroy();
      //     jQuery(context.getSpreadsheetContainer()).html("");
      //     service.applyVisibility($scope);
      //     return;
      //   } else {
      //     context.switchVisibility();
      //   }
      // } else {
        $scope.spreadsheetContext = context;
      //}
      context.isField = isField;


      var owner = this;
      var scopeElement = (context.isField() ? $scope.field : $scope.element);
      var columnHeaderOrder = service.getColumnHeaderOrder(context, scopeElement);
      var columnDescriptors = service.getColumnDescriptors(context, scopeElement, columnHeaderOrder, $scope);
      var tableData = service.getTableData(context, $scope, columnHeaderOrder, columnDescriptors);
      var tableDataSource = service.getTableDataSource(context, $scope, columnHeaderOrder);
      var colHeaders = [];
      for (var i in columnHeaderOrder) {
        colHeaders.push($filter('keyToTitle')(columnHeaderOrder[i]));
      }
      var config = {
        data              : tableData,
        minSpareRows      : 1,
        autoWrapRow       : true,
        contextMenu       : true,
        minRows           : service.getMinItems(scopeElement),
        maxRows           : service.getMaxItems(scopeElement),
        rowHeaders        : true,
        stretchH          : 'last',
        trimWhitespace    : false,
        manualRowResize   : true,
        manualColumnResize: true,
        columns           : columnDescriptors,
        colHeaders        : colHeaders,
        colWidths         : 247,
        autoColumnSize    : {syncLimit: 300},
      };


      // detector and container elements
      var id = '#' + $scope.getLocator(index) + ' ';
      console.log('switchToSpreadsheet ' + $scope.getLocator(index) );
      var detectorElement = angular.element(document.querySelector(id + '.spreadsheetViewDetector'),
          context.getPlaceholderContext());
      var container = angular.element(document.querySelector(id + '.spreadsheetViewContainer'),
          context.getPlaceholderContext())[0];

      context.setSpreadsheetContainer(container);

      // Compute size based on available width and number of rows
      var spreadsheetRowCount = tableData.length;
      var spreadsheetContainerHeight = Math.min(300,30 + spreadsheetRowCount * 30 + 20);
      var spreadsheetContainerWidth = detectorElement.width() - 5;


      angular.element(container).css("height", spreadsheetContainerHeight + "px");
      angular.element(container).css("width", spreadsheetContainerWidth + "px");
      context.setOriginalContentContainer(angular.element('.originalContent', context.getPlaceholderContext())[0]);
      context.switchVisibility();
      service.applyVisibility($scope);


      var hot = new Handsontable(container, config);

      // push data to spreadsheetService scope
      $scope.spreadsheetDataScope = {
        tableData        : tableData,
        tableDataSource  : tableDataSource,
        columnDescriptors: columnDescriptors,
        addCallback      : addCallback,
        removeCallback   : removeCallback,
      };
      $scope.config = config;


      var $hooksList = $('#hooksList');
      var hooks = Handsontable.hooks.getRegistered();
      var example1_events = document.getElementById("spreadsheetViewLogs");
      var log_events = function (event, data) {

        if (document.getElementById('check_' + event).checked) {
          var now = (new Date()).getTime(),
              diff = now - start,
              vals, str, div, text;

          vals = [
            i,
            "@" + numbro(diff / 1000).format('0.000'),
            "[" + event + "]"
          ];

          for (var d = 0; d < data.length; d++) {
            try {
              str = JSON.stringify(data[d]);
            }
            catch (e) {
              str = data[d].toString(); // JSON.stringify breaks on circular reference to a HTML node
            }

            if (str === void 0) {
              continue;
            }

            if (str.length > 20) {
              str = Object.prototype.toString.call(data[d]);
            }
            if (d < data.length - 1) {
              str += ',';
            }
            vals.push(str);
          }

          if (window.console) {
            console.log(i,
                "@" + numbro(diff / 1000).format('0.000'),
                "[" + event + "]",
                data);
          }
          div = document.createElement("DIV");
          text = document.createTextNode(vals.join(" "));

          div.appendChild(text);
          example1_events.appendChild(div);

          var timer = setTimeout(function () {
            example1_events.scrollTop = example1_events.scrollHeight;
          }, 10);
          clearTimeout(timer);

          i++;
        }
      };


      hooks.forEach(function (hook) {
        var checked = '';
        if (hook === 'beforePaste' || hook === 'afterChange' || hook === 'afterSelection' || hook === 'afterCreateRow' || hook === 'afterRemoveRow' || hook === 'afterCreateRow' ||
            hook === 'afterCreateCol' || hook === 'afterRemoveCol') {
          checked = 'checked';
        }

        hot.addHook(hook, function () {

          if (hook === 'afterChange') {
            service.updateDataModel($scope, $element);
          }

          if (hook === 'afterCreateRow') {
            $scope.spreadsheetDataScope.addCallback();
            $scope.spreadsheetDataScope.tableDataSource = service.getTableDataSource(context, $scope,
                columnHeaderOrder);
            service.updateDataModel($scope, $element);
          }

          if (hook === 'afterRemoveRow') {
            $scope.spreadsheetDataScope.removeCallback();
            $scope.spreadsheetDataScope.tableDataSource = service.getTableDataSource(context, $scope,
                columnHeaderOrder);
            service.updateDataModel($scope, $element);
          }
        });
      });


      // and finally set the table in the context
      context.setTable(hot);

    };

    service.switchToSpreadsheetField = function ($scope, $element, index, isField, addCallback, removeCallback) {
      switchToSpreadsheet(new SpreadsheetContext("field", $element), $scope, $element, index, isField, addCallback, removeCallback);
    };

    service.switchToSpreadsheetElement = function ($scope, $element,index, isField, addCallback, removeCallback) {
      switchToSpreadsheet(new SpreadsheetContext("element", $element), $scope, $element, index, isField, addCallback, removeCallback);
    };


    return service;
  };

});