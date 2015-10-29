(function (Handsontable) {

    var MultiCheckboxEditor = Handsontable.editors.BaseEditor.prototype.extend();

    MultiCheckboxEditor.prototype.init = function () {
        this.container = document.createElement('DIV');
        Handsontable.Dom.addClass(this.container, 'htCedarCheckboxes');
        this.container.style.display = 'none';
        this.container.style.position = 'absolute';
        this.container.style.zIndex = 9998;
        this.instance.rootElement.appendChild(this.container);

        this.cbContainer = document.createElement('DIV');
        Handsontable.Dom.addClass(this.cbContainer, 'htCedarCheckboxContainer');
        this.container.appendChild(this.cbContainer);

        this.key2IdMap = {};
    };

    MultiCheckboxEditor.prototype.prepare = function () {
        Handsontable.editors.BaseEditor.prototype.prepare.apply(this, arguments);

        var options = {};
        var source = this.cellProperties.source;
        for (var i in source) {
            options[source[i]] = source[i];
        }

        Handsontable.Dom.empty(this.cbContainer);

        this.key2IdMap = {};

        var ts = new Date().getTime();
        var i = 0;

        for (var option in options) {
            var cbId = "cb" + ts + "_" + i;

            this.key2IdMap[option] = cbId;

            var oneCbContainer = document.createElement('DIV');

            var cbElement = document.createElement('INPUT');
            cbElement.type = "checkbox";
            cbElement.value = option;
            cbElement.id = cbId;
            oneCbContainer.appendChild(cbElement);
            var label = document.createElement('LABEL');
            label.htmlFor = cbId;
            oneCbContainer.appendChild(document.createTextNode(' '));
            oneCbContainer.appendChild(label);
            var labelText = document.createTextNode(option);
            label.appendChild(labelText);

            this.cbContainer.appendChild(oneCbContainer);
            i++;
        }

    };

    MultiCheckboxEditor.prototype.getValue = function () {
        console.log("getValue");
        var val = {};
        for(var i in this.cellProperties.source) {
            var n = this.cellProperties.source[i];
            if (angular.element('#' + this.key2IdMap[n]).prop('checked')) {
                val[n] = true;
            }
        }
        console.log(val);
        return JSON.stringify(val);
    };

    MultiCheckboxEditor.prototype.setValue = function (value) {
        var valueObject = JSON.parse(value);
        console.log("setValue");
        console.log(value);
        for(var i in this.cellProperties.source) {
            var n = this.cellProperties.source[i];
            angular.element('#' + this.key2IdMap[n]).prop('checked', valueObject.hasOwnProperty(n));
        }
    };

    MultiCheckboxEditor.prototype.open = function () {
        var width = Handsontable.Dom.outerWidth(this.TD);
        var height = Handsontable.Dom.outerHeight(this.TD);
        var rootOffset = Handsontable.Dom.offset(this.instance.rootElement);
        var tdOffset = Handsontable.Dom.offset(this.TD);

        // sets select dimensions to match cell size
        this.container.style.height = height + 'px';
        this.container.style.minWidth = width + 'px';

        // make sure that list positions matches cell position
        this.container.style.top = tdOffset.top - rootOffset.top + 'px';
        this.container.style.left = tdOffset.left - rootOffset.left + 'px';
        this.container.style.margin = '0px';

        // display the list
        this.container.style.display = '';
    };

    MultiCheckboxEditor.prototype.close = function () {
        this.container.style.display = 'none';
    };

    MultiCheckboxEditor.prototype.focus = function () {
        this.container.focus();
    };

    MultiCheckboxEditor.prototype.beginEditing = function(initialValue, event) {
        if (this.state != Handsontable.EditorState.VIRGIN) {
            return;
        }
        this.instance.view.scrollViewport(new WalkontableCellCoords(this.row, this.col));
        this.instance.view.render();
        this.state = Handsontable.EditorState.EDITING;

        initialValue = typeof initialValue == 'string' ? initialValue : this.originalValue;
        this.setValue(initialValue);

        this.open(event);
        this._opened = true;
        this.focus();

        // only rerender the selections (FillHandle should disappear when beginediting is triggered)
        this.instance.view.render();
    };

    Handsontable.editors.MultiCheckboxEditor = MultiCheckboxEditor;

    Handsontable.editors.registerEditor('checkboxes', MultiCheckboxEditor);

})(Handsontable);