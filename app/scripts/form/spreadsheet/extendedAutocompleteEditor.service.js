// "use strict" mode helps in catching common coding errors and unsafe actions.
'use strict';

// Define the module and factory using AngularJS
define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.spreadsheet.extendedAutocompleteEditor', [])
    .factory('extendedAutocompleteEditor', function () {

      // Extend Handsontable's AutocompleteEditor
      var ExtendedAutocompleteEditor = Handsontable.editors.AutocompleteEditor.prototype.extend();

      // Override the finishEditing function to handle custom behaviors
      ExtendedAutocompleteEditor.prototype.finishEditing = function (isCancelled, ctrlDown) {
        if (this.htEditor && this.htEditor.isListening()) {
          this.instance.listen(); // Re-focus the main editor instance
        }
        if (this.htEditor && this.htEditor.getSelected()) {
          var value = this.htEditor.getInstance().getValue();
          if (value !== void 0) {
            this.setValue(value.label || value); // Use label if available, else use the value
          }
        }
        Handsontable.editors.BaseEditor.prototype.finishEditing.apply(this, arguments);
      };

      // Sort choices by relevance to the user's input
      function sortByRelevance(value, choices, caseSensitive) {
        var choicesRelevance = [];
        var valueLength = value.length;

        if (valueLength === 0) {
          return choices.map((_, index) => index); // Return all indices if no input
        }

        choices.forEach((choice, i) => {
          var currentItem = choice.label ? choice.label : choice;
          currentItem = String(currentItem);

          var valueIndex = caseSensitive
            ? currentItem.indexOf(value)
            : currentItem.toLowerCase().indexOf(value.toLowerCase());

          if (valueIndex === -1) return; // Skip non-matching items

          var charsLeft = currentItem.length - valueIndex - valueLength;
          choicesRelevance.push({
            baseIndex: i,
            index: valueIndex,
            charsLeft: charsLeft,
            value: currentItem
          });
        });

        choicesRelevance.sort((a, b) => {
          if (a.index !== b.index) return a.index - b.index;
          return a.charsLeft - b.charsLeft;
        });

        return choicesRelevance.map(item => item.baseIndex);
      }

      // Transpose a 2D array (rows become columns)
      function pivot(arr) {
        if (!arr || arr.length === 0 || !arr[0].length) return [];

        return arr[0].map((_, colIndex) => arr.map(row => row[colIndex]));
      }

      // Calculate the pixel length of a text string
      function getTextPixelLength(text, font = "18px Arial") {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        context.font = font;
        return context.measureText(text).width;
      }

      // Update the dropdown's width based on the longest label
      function updateDropdownWidth(htEditor, choices) {
        let dropdownWidth = htEditor.getColWidth(0);

        choices.forEach(choice => {
          if (choice.label) {
            let labelSize = getTextPixelLength(choice.label) + 30; // Add padding
            dropdownWidth = Math.max(dropdownWidth, Math.min(window.innerWidth - 20, labelSize));
          }
        });

        htEditor.updateSettings({
          colWidths: [dropdownWidth]
        });
      }

      // Update the choices list and dropdown properties
      ExtendedAutocompleteEditor.prototype.updateChoicesList = function (choices) {
        var orderByRelevance = sortByRelevance(this.getValue(), choices, this.cellProperties.filteringCaseSensitive);
        var highlightIndex;
        if (this.cellProperties.filter == false) {
          highlightIndex = orderByRelevance[0];
        } else {
          var sorted = [];
          for (var i = 0,
              choicesCount = orderByRelevance.length; i < choicesCount; i++) {
            sorted.push(choices[orderByRelevance[i]]);
          }
          highlightIndex = 0;
          choices = sorted;
        }
        this.choices = choices;
        this.htEditor.loadData(pivot([choices]));
        this.cellProperties.trimDropdown = true;
        updateDropdownWidth(this.htEditor, choices);
        this.cellProperties.trimDropdown = false;
        this.updateDropdownHeight();
        if (this.cellProperties.strict === true) {
          this.highlightBestMatchingChoice(highlightIndex);
        }
        this.instance.listen();
        this.TEXTAREA.focus();
      };

      // Override the open method to customize dropdown rendering and positioning
      ExtendedAutocompleteEditor.prototype.open = function () {
        this.instance.updateSettings({
          autoColumnSize: false
        });

        Handsontable.editors.AutocompleteEditor.prototype.open.apply(this);

        // Renderer for custom dropdown behavior
        const customLabelRenderer = (TD, row, col, prop, value) => {
          if (value && value.label) {
            Handsontable.dom.empty(TD);

            let label = value.label;
            let indexOfMatch = label.toLowerCase().indexOf(this.query.toLowerCase());
            if (indexOfMatch !== -1) {
              let match = label.substr(indexOfMatch, this.query.length);
              label = label.replace(match, `<strong>${match}</strong>`);
            }
            let link = ''; 
            if (value['@id'])
              link = `<li class="material-icons md-48 md-dark ui-select-container">
                        <a href="${value['@id']}" target="_blank">
                          <span class="controlledTerm fa fa-share-alt-square fa-rotate-90"></span> 
                        </a>
                        &nbsp;
                      </li>`;
            TD.innerHTML = `${link}${label}`;
          }
        };

        // Prevent dropdown links from closing the editor
        const enableLinksInDropdown = (TD) => {
          TD.querySelectorAll('a').forEach(link => {
            ['click', 'touchstart', 'touchend', 'mousedown'].forEach(event => {
              link.addEventListener(event, e => e.stopPropagation());
            });
          });
        };

        this.htEditor.addHook('afterRenderer', customLabelRenderer);
        this.htEditor.addHook('afterRenderer', enableLinksInDropdown);

        // Adjust dropdown position based on viewport
        const dropdownElement = this.htEditor.rootElement;
        const cell = this.getEditedCell();

        const recalculateDropdownPosition = () => {
          const rect = cell.getBoundingClientRect();
          const dropdownHeight = dropdownElement.offsetHeight;
          const dropdownWidth = dropdownElement.offsetWidth;

          const spaceAbove = rect.top;
          const spaceBelow = window.innerHeight - rect.bottom - 30;

          let dropdownTop = spaceBelow >= dropdownHeight || spaceAbove < dropdownHeight
            ? rect.bottom
            : rect.top - dropdownHeight;

          dropdownElement.style.setProperty('--dropdown-top', `${dropdownTop}px`);

          let dropdownLeft = rect.left;
          if (window.innerWidth - rect.left < dropdownWidth) {
            dropdownLeft = Math.max(0, rect.right - dropdownWidth);
          }

          dropdownElement.style.setProperty('--dropdown-left', `${dropdownLeft}px`);
        };

        recalculateDropdownPosition();

        const adjustDropdownPosition = () => {
          const scrollDeltaY = window.scrollY || document.documentElement.scrollTop;
          const currentTop = parseInt(getComputedStyle(dropdownElement).getPropertyValue('--dropdown-top'), 10) || 0;
          dropdownElement.style.setProperty('--dropdown-top', `${currentTop - scrollDeltaY}px`);
        };

        angular.element(window).bind('scroll', adjustDropdownPosition);

        const observer = new MutationObserver(recalculateDropdownPosition);
        observer.observe(dropdownElement, {
          childList: true,
          subtree: true,
          characterData: true
        });

        const originalClose = this.close.bind(this);
        this.close = function () {
          angular.element(window).unbind('scroll', adjustDropdownPosition);
          observer.disconnect();
          originalClose();
        };
      };

      return ExtendedAutocompleteEditor;
    });
});
