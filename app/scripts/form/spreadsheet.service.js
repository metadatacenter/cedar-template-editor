'use strict';

define([
      'angular'
    ], function (angular) {
      angular.module('cedar.templateEditor.form.spreadsheetService', [])
          .service('SpreadsheetService', SpreadsheetService);

      SpreadsheetService.$inject = ['$document', '$q','$translate', 'DataManipulationService','schemaService',
                                    'DataUtilService',
                                    'autocompleteService','UIMessageService'];

      function SpreadsheetService($document, $q, $translate, DataManipulationService,schemaService, DataUtilService, autocompleteService,UIMessageService) {

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


        // may need to add more rows to the model
        var addMoreRows = function ($scope, row) {
          if ($scope.model.length <= row) {
            if ($scope.spreadsheetContext.isField()) {
              // this is a field
              var maxItems = dms.getMaxItems($scope.field);
              if ((!maxItems || $scope.model.length < maxItems)) {
                $scope.model.push({'@id': null});
              }

            } else {
              // this is an element
              var maxItems = dms.getMaxItems($scope.element);
              if ((!maxItems || $scope.model.length < maxItems)) {
                $scope.addElement();
              }
            }
          }
        };

        var getModel = function ($scope, id, row, col) {
          var model;
          var key;
          var colOrder = $scope.spreadsheetContext.colHeaderOrder;

          if ($scope.spreadsheetContext.isField()) {
              model = $scope.model[row];
          } else {
            key = colOrder[col];
            model =  $scope.model[row][key];
          }

          return model;
        };

        // if we don't have an id and label for a controlled term, go get it
        var lazyUpdate = function ($scope, schema, id, term, row, col) {

          var clearTerm = function(model,row,col,term) {
            var msg = $translate.instant('METADATAEDITOR.invalidTerm');
            UIMessageService.flashWarning(msg + " "  + term);

            delete model['@id'];
            delete model['rdfs:label'];
            $scope.spreadsheetContext.getTable().setDataAtCell(row, col, null);

            // update all the model entries with the same term
            var sds = $scope.spreadsheetDataScope;
            for (var r in sds.tableData) {
              for (var c in sds.tableData[row]) {
                if (sds.tableData[r][c] == term) {
                  var m = getModel($scope, id, r, c);
                  delete m['@id'];
                  delete m['rdfs:label'];
                  sds.tableData[r][c] = null;
                  $scope.spreadsheetContext.getTable().setDataAtCell(parseInt(r), parseInt(c), null);
                }
              }
            }
          };

          var noResults = $translate.instant('GENERIC.NoResults');
          var schema = schema;
          var row = parseInt(row);
          var col = parseInt(col);
          var id = id;
          var term = term;
          addMoreRows($scope,row);


          // is the term in the cache?
          if (autocompleteService.autocompleteResultsCache[id] && autocompleteService.autocompleteResultsCache[id][term]) {
            var cachedResults = autocompleteService.autocompleteResultsCache[id][term].results;
            var found = false;
            for (var i = 0; i < cachedResults.length; i++) {
              if (cachedResults[i].label == term) {
                var model = getModel($scope,id, row, col);
                model['@id'] = cachedResults[i]['@id'];
                model['rdfs:label'] = cachedResults[i]['label'];
                found = true;
                break;
              }
            }
          } else {



            // go get the term
            var foundResults = autocompleteService.initResults(id, term);
            var promises = autocompleteService.updateFieldAutocomplete(schema, term, false);

            $q.all(promises).then(values => {

              var model = getModel($scope,id, row, col);

              if ((foundResults.length == 0) || (foundResults.length == 1 && foundResults[0].label == noResults)) {
                clearTerm(model,row,col,term);
              }

              else {

                var found = false;
                // look at the results, save them in the model
                for (var i = 0; i < foundResults.length; i++) {

                  if (foundResults[i].label == term) {

                    model['@id'] = foundResults[i]['@id'];
                    model['rdfs:label'] = foundResults[i]['rdfs:label'];
                    found = true;

                    // update all the model entries with the same term
                    var sds = $scope.spreadsheetDataScope;
                    for (var r in sds.tableData) {
                      for (var c in sds.tableData[r]) {
                        if (sds.tableData[r][c] == term) {
                          var m = getModel($scope, id, r, c);
                          m['@id'] = foundResults[i]['@id'];
                          m['rdfs:label'] = foundResults[i]['rdfs:label'];
                        }
                      }
                    }
                    break;
                  }

                }
                if (!found) {
                  autocompleteService.initResults(id, term);
                  clearTerm(model,row,col,term);
                }
              }

            });
          }
        };

        // copy table data to source table
        var updateDataModel = function ($scope, $element) {

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
              } else if (cedarType == 'attribute-value') {

                sds.tableDataSource[row][col]['@value'] = sds.tableData[row][col];

              } else if (cedarType == 'checkbox') {
                var valueObject = JSON.parse(sds.tableData[row][col]);
                var value = {};
                for (var key in valueObject) {
                  value[key] = true;
                }
                sds.tableDataSource[row][col]['@value'] = value;
              // } else if (cedarType === 'date') {
              //   sds.tableDataSource[row][col]['@value'] = sds.tableData[row][col];
              //   sds.tableDataSource[row][col]['@type'] = DataManipulationService.generateInstanceTypeForDateField($element);
              } else if (cedarType === 'temporal') {
                sds.tableDataSource[row][col]['@value'] = sds.tableData[row][col];
                sds.tableDataSource[row][col]['@type'] = DataManipulationService.generateInstanceTypeForDateTimeField($element);
              // } else if (cedarType === 'time') {
              //   sds.tableDataSource[row][col]['@value'] = sds.tableData[row][col];
              //   sds.tableDataSource[row][col]['@type'] = DataManipulationService.generateInstanceTypeForTimeField($element);
              } else if (cedarType === 'numeric') {
                if (sds.tableData[row][col]) {
                  sds.tableDataSource[row][col]['@value'] = sds.tableData[row][col].toString();
                }
                sds.tableDataSource[row][col]['@type'] = DataManipulationService.generateInstanceTypeForNumericField($element);
              } else if (cedarType === 'link') {
                if (sds.tableData[row][col] && sds.tableData[row][col].length > 0) {
                  sds.tableDataSource[row][col]['@id'] = sds.tableData[row][col];
                } else {
                  delete sds.tableDataSource[row][col]['@id'];
                }
              } else if (inputType == 'autocomplete') {
                if (sds.tableData[row][col]) {

                  var schema = sds.columnDescriptors[col].schema;
                  if (isConstrained(schema)) {
                    var id = sds.columnDescriptors[col].nodeId;
                    var term = sds.tableData[row][col];

                    lazyUpdate($scope, schema, id, term, row, col);

                  }
                }
              } else {
                sds.tableDataSource[row][col]['@value'] = sds.tableData[row][col];
              }
            }
          }
        };


        // get column headers for single field or element's fields
        var getColumnHeaderOrder = function (context, scopeElement, scope) {

          var headerOrder = [];
          if (context.isField()) {
            headerOrder.push('value');
          } else {
            var itemOrder = dms.getFlatSpreadsheetOrder(scopeElement, scope.model);
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

        // date editor that also works in fullscreen mode
        // in full screen move the date picker to the container
        // otherwise append it to the body
        var FullscreenDateEditor = Handsontable.editors.DateEditor.prototype.extend();

        FullscreenDateEditor.prototype.open = function () {

          Handsontable.editors.DateEditor.prototype.open.apply(this, arguments);

          if (service.isFullscreen()) {
            $('.htDatepickerHolder').appendTo(".spreadsheetViewContainer");
          } else {
            $('.htDatepickerHolder').appendTo(document.body);
          }
        };

        // build a description of the cell data
        var getDescriptor = function (context, node, $scope, customValidator) {


          let actions = DataManipulationService.getActions($scope.field);

          // apply the user's sorted ordering
          let applyActions = function (list) {
            // apply mods to a duplicate of the list
            var dup = list.slice();
            for (let i = 0; i < actions.length; i++) {
              let action = actions[i];
              let from = dup.findIndex(item => item['@id'] === action['@id']);
              if (from != -1) {
                // delete it at from
                let entry = dup.splice(from, 1);
                if (action.to != -1 && action.action == 'move') {
                  // insert it at to
                  dup.splice(action.to, 0, entry[0]);
                }
              }
            }
            return dup;
          };

          // order the results based on user preferences
          let order = function (arr) {
            if (arr) {
              var dup = applyActions(arr);
              return dup;
            }
          };

          var literals;
          var inputType;
          var id;
          var inputType;
          var desc = {};
          if (node) {
            literals = dms.getLiterals(node);
            inputType = schemaService.getInputType(node);
            id = dms.getId(node);
          } else {
            inputType = 'attribute-value';
          }

          desc.cedarType = inputType;
          switch (inputType) {

            case 'attribute-value':
              desc.type = 'text';
              break;
            case 'date':
              desc.type = 'date';
              desc.dateFormat = 'YYYY-MM-DD';
              desc.correctFormat = true;
              desc.editor = FullscreenDateEditor;
              break;
            case 'link':
              desc.type = 'text';
              desc.validator = service.linkValidator;
              desc.allowInvalid = true;
              desc.invalidCellClassName = 'myInvalidClass';
              break;
            case 'phone-number':
              desc.type = 'text';
              desc.allowInvalid = true;
              desc.validator = service.phoneValidator;
              desc.invalidCellClassName = 'myInvalidClass';
              break;
            case 'email':
              desc.type = 'text';
              desc.validator = service.emailValidator;
              desc.allowInvalid = true;
              desc.invalidCellClassName = 'myInvalidClass';
              break;
            case 'numeric':
              desc.type = 'numeric';
              desc.format = '0[.]0[0000]';
              desc.allowInvalid = true;
              desc.invalidCellClassName = 'myInvalidClass';
              break;
            case 'list':
            case 'radio':
              desc.type = 'dropdown';
              desc.source = extractOptionsForList(dms.getLiterals(node));
              break;
            case 'textfield':
              if (isConstrained(node)) {
                desc.type = 'autocomplete';
                desc.trimDropdown = true;
                desc.nodeId = dms.getId(node);
                desc.schema = dms.schemaOf(node);
                //desc.validator = customValidator;
                desc.allowInvalid = true;
                desc.strict = false;
                desc.source = function (query, process) {

                  var query = query || '*';
                  var results = autocompleteService.initResults(desc.nodeId, query);
                  autocompleteService.updateFieldAutocomplete(desc.schema, query, false);

                  $scope.$watchCollection(function () {
                    return results;
                  }, function () {
                    process(order(results).map(function (a) {
                      return a.label;
                    }));
                  });
                };
              } else {
                desc.type = 'text';
              }
              break;
          }

          return desc;
        };

        // build the data object descriptor for each column
        var getColumnDescriptors = function (context, node, columnHeaderOrder, $scope, customValidator) {
          var colDescriptors = [];
          for (var i in columnHeaderOrder) {
            if (context.isField()) {
              colDescriptors.push(getDescriptor(context, node, $scope, customValidator));
            } else {
              var key = columnHeaderOrder[i];
              var child = dms.propertiesOf(node)[key];
              colDescriptors.push(getDescriptor(context, child, $scope, customValidator));
            }
          }
          return colDescriptors;
        };

        // build the table for one row
        var extractAndStoreCellData = function (cellDataObject, rowData, columnDescriptor) {
          //cellDataObject is array for multi-field elements so linearize if that's the case
          if(Array.isArray(cellDataObject))
            cellDataObject = cellDataObject[0];
          if (cellDataObject) {
            var inputType = columnDescriptor.type;
            var cedarType = columnDescriptor.cedarType;

            if (inputType == 'dropdown') {
              rowData.push(cellDataObject['@value']);
            } else if (cedarType == 'link') {
              rowData.push(cellDataObject['@id']);
            } else if (cedarType == 'numeric') {
              rowData.push(cellDataObject['@value']);
            } else if (cedarType == 'checkboxes') {
              rowData.push(JSON.stringify(cellDataObject['@value']));
            } else if (cedarType == 'deepObject') {
              rowData.push(columnDescriptor.cedarLabel);
            } else if (cedarType == 'attribute-value') {
              rowData.push(cellDataObject['@value']);
            } else {
              rowData.push(cellDataObject['rdfs:label'] || cellDataObject['@value']);
            }
          } else {
            console.log('Error: missing cellDataObject');
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
                    var cellDataObject = row[colName] || {};
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
        var getColHeaders = function (node, columnHeaderOrder, scope, isField) {
          var colHeaders = [];
          var title = dms.getTitle(node);
          var description = dms.getDescription(node);
          var model = scope.model;

          if (isField) {
            colHeaders.push('<span  title="' + description + '">' + title + ' </span>');
          } else {
            for (var i in columnHeaderOrder) {
              var key = columnHeaderOrder[i];

              var innerNode = dms.propertiesOf(node)[key];
              if (innerNode) {
                title = dms.getTitle(innerNode);
                description = dms.getDescription(innerNode);
              } else {
                title = key;
                description = "key"
              }
              colHeaders.push('<span  title="' + description + '">' + title + ' </span>');
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
            if (hook === 'beforeChange' || hook === 'afterChange' || hook === 'afterSelection' || hook === 'afterCreateRow' || hook === 'afterRemoveRow' || hook === 'afterCreateRow' ||
                hook === 'afterCreateCol' || hook === 'afterRemoveCol') {
              checked = 'checked';
            }

            hot.addHook(hook, function () {

              if (hook === 'afterSelection') {
              }

              if (hook === 'afterChange') {
                updateDataModel($scope, $element);
              }

              if (hook === 'beforeChange') {
              }

              if (hook === 'afterCreateRow') {
                $scope.spreadsheetDataScope.addCallback();
                $scope.spreadsheetDataScope.tableDataSource = getTableDataSource($scope.spreadsheetContext, $scope,
                    columnHeaderOrder);
                updateDataModel($scope, $element);
                resize($scope);
              }

              if (hook === 'afterRemoveRow') {
                $scope.spreadsheetDataScope.removeCallback();
                $scope.spreadsheetDataScope.tableDataSource = getTableDataSource($scope.spreadsheetContext, $scope,
                    columnHeaderOrder);
                updateDataModel($scope, $element);
                resize($scope);
              }
            });
          });

          // TODO this should show a jquery ui tooltip rather than the default browser tooltip, but these work intermittently,
          // TODO not sure if it should be the ht_master or ht_clone_top div
          Handsontable.hooks.add('afterRender', function () {
            //       jQuery('div.ht_master span[data-toggle="tooltip"]').tooltip();
            //       jQuery('div.ht_clone_top span[data-toggle="tooltip"]').tooltip();
            jQuery('span[data-toggle="tooltip"]').tooltip({show: {effect: "blind", duration: 800}});
          });
        };

        // resize the container based on size of table
        var resize = function ($scope) {
          if (!service.isFullscreen($scope)) {

            var tableData = $scope.spreadsheetDataScope.tableData;
            var container = $scope.spreadsheetDataScope.container;
            var detectorElement = $scope.spreadsheetDataScope.detectorElement;

            // Compute size based on available width and number of rows
            var spreadsheetRowCount = tableData ? tableData.length : 0;
            var spreadsheetContainerHeight = Math.min(300, 30 + spreadsheetRowCount * 30 + 20);
            var spreadsheetContainerWidth = detectorElement.width();

            $scope.spreadsheetDataScope.container.style.width = spreadsheetContainerWidth;
            $scope.spreadsheetDataScope.container.style.height = spreadsheetContainerHeight;


            $scope.spreadsheetContext.getTable().updateSettings({
              height: spreadsheetContainerHeight,
              width : spreadsheetContainerWidth
            });


          }
        };


        // build the spreadsheet, stuff it into the dom, and make it visible
        var createSpreadsheet = function (context, $scope, $element, index, isField, addCallback, removeCallback,
                                          createExtraRows, deleteExtraRows) {

          var model = $scope.model;

          // detector and container elements
          var id = '#' + $scope.getLocator(index) + ' ';
          var detectorElement = angular.element(document.querySelector(id + '.spreadsheetViewDetector'),
              context.getPlaceholderContext());
          var container = angular.element(document.querySelector(id + '.spreadsheetViewContainer'),
              context.getPlaceholderContext())[0];

          var customValidator = function (query, callback) {
            var desc = $scope.config.columns[this.col];
            var id = DataManipulationService.getId(desc.schema);
            callback(autocompleteService.isCached(id, query, desc.schema));
          };


          if (container) {

            container.style.width = 700;
            container.style.height = 300;

            $scope.spreadsheetContext = context;
            context.isField = isField;


            var columnHeaderOrder = getColumnHeaderOrder(context, $element, $scope);
            var columnDescriptors = getColumnDescriptors(context, $element, columnHeaderOrder, $scope, customValidator);
            var tableData = getTableData(context, $scope, columnHeaderOrder, columnDescriptors);
            var tableDataSource = getTableDataSource(context, $scope, columnHeaderOrder);
            var colHeaders = getColHeaders($element, columnHeaderOrder, $scope, isField());
            var minRows = dms.getMinItems($element) || 0;
            var maxRows = dms.getMaxItems($element) || Number.POSITIVE_INFINITY;
            var config = {
              data              : tableData,
              minSpareRows      : 10,
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
              headerTooltips    : true
            };

            context.colHeaderOrder = columnHeaderOrder;


            // push spreadsheet data to parent scope
            $scope.spreadsheetDataScope = {
              tableData        : tableData,
              tableDataSource  : tableDataSource,
              columnDescriptors: columnDescriptors,
              columnHeaderOrder: columnHeaderOrder,
              addCallback      : addCallback,
              removeCallback   : removeCallback,
              createExtraRows  : createExtraRows,
              deleteExtraRows  : deleteExtraRows,
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

          }

        };


        service.isFullscreen = function () {
          return document.mozFullscreenElement || document.webkitFullscreenElement;
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

          if ($scope.spreadsheetDataScope) {

            // delete extra rows in the object
            $scope.spreadsheetDataScope.deleteExtraRows();

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
          }
        };

        // create spreadsheet view using handsontable
        service.switchToSpreadsheet = function ($scope, $element, index, isField, addCallback, removeCallback,
                                                createExtraRows, deleteExtraRows) {



          var type = isField() ? 'field' : 'element';
          var context = new SpreadsheetContext(type, $element);

          createSpreadsheet(context, $scope, $element, index, isField, addCallback, removeCallback, createExtraRows,
              deleteExtraRows);

          var hider = ".spreadsheetViewContainer div.wtHider";
          var holder = ".spreadsheetViewContainer div.wtHolder";

          var scrollable = ".template-container.scrollable-content";
          var autoComplete = "div.handsontableInputHolder div.ht_master.handsontable ";
          var td = "div.handsontableInputHolder div.ht_master.handsontable table td ";
          var table = "div.handsontableInputHolder div.ht_master.handsontable table  ";
          $scope.$watch(function () {
            return angular.element(td).is(':visible')
          }, function (newValue, oldValue) {

            if (newValue) {
              setTimeout(function () {


                var elm = angular.element(autoComplete);
                var scrollTop = jQuery(scrollable).scrollTop();

                elm.addClass('fixed');
                elm.css({
                  top   : 0 - scrollTop,
                  height: 'auto'
                });

                var elm = angular.element(hider);
                elm.css({
                  width: 'auto !important'
                });

                var elm = angular.element(table);
                elm.css({
                  'border-width'      : '0',
                  'border-width-right': '1px'
                });

                var elm = angular.element(holder);
                elm.css({
                  width: 'auto !important'
                });

              }, 0);
            }
          });
        };

        return service;
      };

    }
)
;
