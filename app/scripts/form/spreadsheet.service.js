'use strict';

define([
      'angular'
    ], function (angular) {
      angular.module('cedar.templateEditor.form.spreadsheetService', [])
          .service('SpreadsheetService', SpreadsheetService);

      SpreadsheetService.$inject = ['$rootScope', '$document', '$filter', 'DataManipulationService', 'DataUtilService',
                                    'AuthorizedBackendService', 'HttpBuilderService', 'UrlService',
                                    'ValueRecommenderService', 'autocompleteService'];

      function SpreadsheetService($rootScope, $document, $filter, DataManipulationService, DataUtilService,
                                  AuthorizedBackendService,
                                  HttpBuilderService, UrlService, ValueRecommenderService, autocompleteService) {

        var service = {
          serviceId     : "SpreadsheetService",
          emailValidator: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
          phoneValidator: /^[\s()+-]*([0-9][\s()+-]*){6,20}$/,
          linkValidator : /^(ftp|http|https):\/\/[^ "]+$/
        };

        var dms = DataManipulationService;


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

        // Handsontable.renderers.registerRenderer('checkboxes', service.customRendererCheckBoxes);
        // Handsontable.renderers.registerRenderer('deepObject', service.customRendererDeepObject);

        // copy table data to source table
        var updateDataModel = function ($scope, $element) {
          //console.log('updateDataModel');
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

                  // get the types and thge node for a nested field in an element
                  var inputType = sds.columnDescriptors[col].type;
                  var cedarType = sds.columnDescriptors[col].cedarType;


                  if (inputType == 'dropdown') {
                    sds.tableDataSource[row][col]['@value'] = sds.tableData[row][col];
                  } else if (cedarType == 'checkbox') {
                    var valueObject = JSON.parse(sds.tableData[row][col]);
                    var value = {};
                    for (var key in valueObject) {
                      value[key] = true;
                    }
                    sds.tableDataSource[row][col]['@value'] = value;

                  } else if (inputType == 'autocomplete') {
                    if (sds.tableData[row][col]) {
                      var value = sds.tableData[row][col];
                      var id = sds.columnDescriptors[col].nodeId;
                      var schema = sds.columnDescriptors[col].schema;

                      if (isConstrained(schema)) {

                        console.log('isConstrained ' + row + ' '  + col);


                        // do we have some autocomplete results?
                          var results = autocompleteService.getAutocompleteResultsCache(id, value);
                          if (results) {
                            var found = false;
                            loop: for (var i = 0; i < results.length; i++) {
                              if (value === results[i]['label']) {

                                sds.tableDataSource[row][col]['@id'] = results[i]['@id'];
                                sds.tableDataSource[row][col]['_valueLabel'] = results[i]['label'];
                                found = true;
                                break loop;
                              }
                            }

                            if (!found) {
                              console.log('not found ' + value);
                              delete sds.tableDataSource[row][col]['@id'];
                              delete sds.tableDataSource[row][col]['_valueLabel'];

                            }
                          }
                      }
                    }
                  } else {
                    sds.tableDataSource[row][col]['@value'] = sds.tableData[row][col];
                  }
                }
              }
            }
        ;

        // get column headers for single field or element's fields
        var getColumnHeaderOrder = function (context, scopeElement) {
          var headerOrder = [];
          if (context.isField()) {
            headerOrder.push('value');
          } else {
            var itemOrder = dms.getOrder(scopeElement);
            for (var i in itemOrder) {
              headerOrder.push(itemOrder[i]);
            }
          }
          return headerOrder;
        };

        // extract a list of option labels
        var extractOptionsForList = function (options) {
          var list = [];
          for (var i in options) {
            list.push(options[i].label);
          }
          return list;
        };

        // has value constraints?
        var isConstrained = function (node) {
          return dms.hasValueConstraint(node);
        };

        // build a description of the cell data
        var getDescriptor = function (context, node, $scope) {
          var desc = {};
          var literals = dms.getLiterals(node);
          var inputType = dms.getInputType(node);
          desc.cedarType = inputType;
          switch (inputType) {

            case 'date':
              desc.type = 'date';
              desc.dateFormat = 'MM/DD/YYYY';
              desc.correctFormat = true;
              break;
            case 'link':
              desc.allowInvalid = true;
              desc.validator = service.linkValidator;
              desc.allowInvalid = true;
              break;
            case 'phone-number':
              desc.allowInvalid = true;
              desc.validator = service.phoneValidator;
              desc.allowInvalid = true;
              break;
            case 'email':
              desc.allowInvalid = true;
              desc.validator = service.emailValidator;
              desc.allowInvalid = true;
              break;
            case 'numeric':
              desc.type = 'numeric';
              desc.format = '0.0[0000]';
              desc.allowInvalid = true;
              break;
            case 'list':
              desc.type = 'dropdown';
              desc.source = extractOptionsForList(dms.getLiterals(node));
              break;
            case 'checkbox':
              //   desc.type = 'checkboxes';
              //   desc.renderer = service.customRendererCheckboxes;
              //   desc.editor = 'checkboxes';//MultiCheckboxEditor;
              //   desc.source = extractOptionsForList(dms.getLiterals(node));
              break;
            case 'textfield':
              if (isConstrained(node)) {
                desc.type = 'autocomplete';
                desc.strict = true;
                desc.nodeId = dms.getId(node);
                desc.schema = dms.schemaOf(node);

                desc.source = function (query, process) {

                  autocompleteService.updateFieldAutocomplete(desc.schema, query);
                  setTimeout(function () {

                    var id = dms.getId(node);
                    var results = autocompleteService.getAutocompleteResults(id, query);

                    var labels = [];
                    for (var i = 0; i < results.length; i++) {
                      labels[i] = results[i]['label'];
                    }
                    process(labels);
                  }, 1000);
                };
              } else {
                desc.type = 'text';
              }
              break;
          }
          return desc;
        };

        // build the data object descriptor for each column
        var getColumnDescriptors = function (context, node, columnHeaderOrder, $scope) {
          var colDescriptors = [];
          for (var i in columnHeaderOrder) {
            if (context.isField()) {
              colDescriptors.push(getDescriptor(context, node, $scope));
            } else {
              var key = columnHeaderOrder[i];
              var child = dms.propertiesOf(node)[key];
              colDescriptors.push(getDescriptor(context, child, $scope));
            }
          }
          return colDescriptors;
        };

        // build the table for one row
        var extractAndStoreCellData = function (cellDataObject, rowData, columnDescriptor) {
          var inputType = columnDescriptor.type;
          var cedarType = columnDescriptor.cedarType;
          if (inputType == 'dropdown') {
            rowData.push(cellDataObject['@value']);
          } else if (cedarType == 'checkboxes') {
            rowData.push(JSON.stringify(cellDataObject['@value']));
          } else if (cedarType == 'deepObject') {
            rowData.push(columnDescriptor.cedarLabel);
          } else {
            rowData.push(cellDataObject._valueLabel || cellDataObject['@value']);
          }
        };

        // build the table of values
        var getTableData = function (context, $scope, headerOrder, columnDescriptors) {
          var tableData = [];
          if (angular.isArray($scope.model)) {
            for (var i in $scope.model) {
              if (!DataUtilService.isSpecialKey($scope.model[i])) {
                var row = $scope.model[i];
                var rowData = [];
                if (context.isField()) {
                  extractAndStoreCellData(row, rowData, columnDescriptors[0]);
                } else {
                  for (var col in headerOrder) {
                    var colName = headerOrder[col];
                    var cellDataObject = row[colName];
                    extractAndStoreCellData(cellDataObject, rowData, columnDescriptors[col]);
                  }
                }
                tableData.push(rowData);
              }
            }
            return tableData;
          }
        };

        var getTableDataSource = function (context, $scope, headerOrder) {
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

        // get the single field or nested field titles
        var getColHeaders = function ($element, columnHeaderOrder, isField) {
          var colHeaders = [];

          if (isField) {
            colHeaders.push(DataManipulationService.getTitle($element));
          } else {
            for (var i in columnHeaderOrder) {
              var key = columnHeaderOrder[i];
              var node = DataManipulationService.propertiesOf($element)[key];
              var title = DataManipulationService.getTitle(node);
              colHeaders.push(title);
            }
          }
          return colHeaders;
        };


        var applyVisibility = function ($scope) {
          var context = $scope.spreadsheetContext;
          var ov = context.isOriginalContentVisible();
          jQuery(context.getOriginalContentContainer()).toggleClass("visible", ov);
          jQuery(context.getOriginalContentContainer()).toggleClass("hidden", !ov);
          jQuery(context.getSpreadsheetContainer()).toggleClass("visible", !ov);
        };

        // register the event hooks
        var registerHooks = function (hot, $scope, $element, columnHeaderOrder) {
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
            if (hook === 'beforePaste' || hook === 'afterPaste' || hook === 'beforeChange' || hook === 'afterChange' || hook === 'afterSelection' || hook === 'afterCreateRow' || hook === 'afterRemoveRow' || hook === 'afterCreateRow' ||
                hook === 'afterCreateCol' || hook === 'afterRemoveCol') {
              checked = 'checked';
            }

            hot.addHook(hook, function () {

              if (hook === 'afterChange') {
                //console.log('afterChange');
                updateDataModel($scope, $element);
              }

              if (hook === 'afterCreateRow') {
                //console.log('afterCreateRow');
                $scope.spreadsheetDataScope.addCallback();
                $scope.spreadsheetDataScope.tableDataSource = getTableDataSource($scope.spreadsheetContext, $scope,
                    columnHeaderOrder);
                updateDataModel($scope, $element);
                resize($scope);
              }

              if (hook === 'afterRemoveRow') {
                //console.log('afterRemoveRow');
                $scope.spreadsheetDataScope.removeCallback();
                $scope.spreadsheetDataScope.tableDataSource = getTableDataSource($scope.spreadsheetContext, $scope,
                    columnHeaderOrder);
                updateDataModel($scope, $element);
                resize($scope);
              }
            });
          });
        };

        // resize the container based on size of table
        var resize = function ($scope) {
          if (!service.isFullscreen($scope)) {

            var tableData = $scope.spreadsheetDataScope.tableData;
            var container = $scope.spreadsheetDataScope.container;
            var detectorElement = $scope.spreadsheetDataScope.detectorElement;

            // Compute size based on available width and number of rows
            var spreadsheetRowCount = tableData.length;
            var spreadsheetContainerHeight = Math.min(300, 30 + spreadsheetRowCount * 30 + 20);
            var spreadsheetContainerWidth = detectorElement.width() - 5;

            // angular.element(container).css("height", spreadsheetContainerHeight + "px");
            // angular.element(container).css("width", spreadsheetContainerWidth + "px");
            // angular.element(container).css("overflow", "hidden");

            $scope.spreadsheetContext.getTable().updateSettings({
              height: spreadsheetContainerHeight,
              width : spreadsheetContainerWidth
            });
          }
        };

        var PasswordEditor = Handsontable.editors.TextEditor.prototype.extend();

        PasswordEditor.prototype.createElements = function () {
          // Call the original createElements method
          Handsontable.editors.TextEditor.prototype.createElements.apply(this, arguments);
          console.log('define passwordEditor');

          // Create password input and update relevant properties
          this.TEXTAREA = document.createElement('input');
          this.TEXTAREA.setAttribute('type', 'password');
          this.TEXTAREA.className = 'handsontableInput';
          this.textareaStyle = this.TEXTAREA.style;
          this.textareaStyle.width = 0;
          this.textareaStyle.height = 0;

          // Replace textarea with password input
          Handsontable.dom.empty(this.TEXTAREA_PARENT);
          this.TEXTAREA_PARENT.appendChild(this.TEXTAREA);
        };


        // build the spreadsheet, stuff it into the dom, and make it visible
        var createSpreadsheet = function (context, $scope, $element, index, isField, addCallback, removeCallback) {

          $scope.spreadsheetContext = context;
          context.isField = isField;

          var columnHeaderOrder = getColumnHeaderOrder(context, $element);
          var columnDescriptors = getColumnDescriptors(context, $element, columnHeaderOrder, $scope);
          var tableData = getTableData(context, $scope, columnHeaderOrder, columnDescriptors);
          var tableDataSource = getTableDataSource(context, $scope, columnHeaderOrder);
          var colHeaders = getColHeaders($element, columnHeaderOrder, isField());
          var minRows = dms.getMinItems($element) || 0;
          var maxRows = dms.getMaxItems($element) || Number.POSITIVE_INFINITY;
          var config = {
            data              : tableData,
            editor: PasswordEditor,
            minSpareRows      : 1,
            autoWrapRow       : true,
            contextMenu       : true,
            minRows           : minRows,
            maxRows           : maxRows,
            rowHeaders        : true,
            stretchH          : 'all',
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
          var detectorElement = angular.element(document.querySelector(id + '.spreadsheetViewDetector'),
              context.getPlaceholderContext());
          var container = angular.element(document.querySelector(id + '.spreadsheetViewContainer'),
              context.getPlaceholderContext())[0];

          // push spreadsheet data to parent scope
          $scope.spreadsheetDataScope = {
            tableData        : tableData,
            tableDataSource  : tableDataSource,
            columnDescriptors: columnDescriptors,
            columnHeaderOrder: columnHeaderOrder,
            addCallback      : addCallback,
            removeCallback   : removeCallback,
            detectorElement  : detectorElement,
            container        : container
          };
          $scope.config = config;


          // put the spreadsheet into the container
          context.setSpreadsheetContainer(container);
          context.setOriginalContentContainer(angular.element('.originalContent', context.getPlaceholderContext())[0]);
          context.switchVisibility();
          applyVisibility($scope);

          // build the handsontable
          var hot = new Handsontable(container, config);

          registerHooks(hot, $scope, $element, columnHeaderOrder);
          context.setTable(hot);
          resize($scope);

          console.log(Handsontable.editors);

          var fullScreenHandler = function (event) {

            setTimeout(function () {
              if (service.isFullscreen($scope)) {
              } else {
                resize($scope);
              }
            }, 200);
          };

          $document[0].addEventListener('webkitfullscreenchange', fullScreenHandler);
          $document[0].addEventListener('mozfullscreenchange', fullScreenHandler);
          $document[0].addEventListener('msfullscreenchange', fullScreenHandler);
          $document[0].addEventListener('fullscreenchange', fullScreenHandler);

          //console.log(Handsontable.editors.DateEditor);
        };

        service.isFullscreen = function () {
          return window.innerWidth == screen.width;
        };


        service.addRow = function ($scope) {
          if ($scope.hasOwnProperty('spreadsheetContext')) {
            var context = $scope.spreadsheetContext;
            var hot = context.getTable();
            hot.alter('insert_row', 1);
          }
        };

        // destroy the handsontable spreadsheet and set the container empty
        service.destroySpreadsheet = function ($scope) {
          if ($scope.hasOwnProperty('spreadsheetContext')) {
            var context = $scope.spreadsheetContext;
            context.switchVisibility();
            if (context.isOriginalContentVisible()) {
              if (context.getTable()) {
                context.getTable().destroy();
                jQuery(context.getSpreadsheetContainer()).html("");
                applyVisibility($scope);
              }
            } else {
              context.switchVisibility();
            }
          }
        };

        // create spreadsheet view using handsontable
        service.switchToSpreadsheet = function ($scope, $element, index, isField, addCallback, removeCallback) {
          var type = isField() ? 'field' : 'element';
          var context = new SpreadsheetContext(type, $element);
          createSpreadsheet(context, $scope, $element, index, isField, addCallback, removeCallback);
        };

        return service;
      };

    }
);