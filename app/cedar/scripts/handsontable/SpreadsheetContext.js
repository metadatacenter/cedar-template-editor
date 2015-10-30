var SpreadsheetContext = function (mode, element) {
  this.mode = mode;
  this.placeholderContext = element;
  this.originalContentVisible = true;
  this.spreadsheetContainer = null;
  this.originalContentContainer = null;
  this.table = null;
}

SpreadsheetContext.prototype.isField = function () {
  return this.mode == 'field';
}

SpreadsheetContext.prototype.getPlaceholderContext = function () {
  return this.placeholderContext;
}

SpreadsheetContext.prototype.setSpreadsheetContainer = function (c) {
  this.spreadsheetContainer = c;
}

SpreadsheetContext.prototype.setOriginalContentContainer = function (c) {
  this.originalContentContainer = c;
}

SpreadsheetContext.prototype.getSpreadsheetContainer = function () {
  return this.spreadsheetContainer;
}

SpreadsheetContext.prototype.getOriginalContentContainer = function () {
  return this.originalContentContainer;
}

SpreadsheetContext.prototype.isOriginalContentVisible = function () {
  return this.originalContentVisible;
}

SpreadsheetContext.prototype.switchVisibility = function () {
  return this.originalContentVisible = !this.originalContentVisible;
}

SpreadsheetContext.prototype.setTable = function (hot) {
  this.table = hot;
}

SpreadsheetContext.prototype.getTable = function () {
  return this.table;
}
