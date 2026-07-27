'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.core.copyToClipboardDirective', [])
      .directive('copyToClipboard', copyToClipboard);

  copyToClipboard.$inject = ['$timeout'];

  /**
   * One-click "copy to clipboard" directive.
   *
   * Put it on a clickable element (typically a button). The text that gets copied is resolved, in
   * order of precedence:
   *   1. copy-text="<angular expression>"  - the evaluated string is copied
   *   2. otherwise the innerText of the ".copy-source" element inside the closest ".copy-block"
   *      ancestor is copied (handy for multi-line code samples, whose exact rendered text is copied)
   *
   * On success the element gets an "is-copied" class for a short time and, if it contains a
   * ".copy-to-clipboard__label" span, that label briefly switches to "Copied!".
   *
   * Uses the async Clipboard API when available (localhost / https are secure contexts) and falls
   * back to a hidden textarea + execCommand('copy') otherwise.
   */
  function copyToClipboard($timeout) {

    var directive = {
      restrict: 'A',
      link    : linker
    };

    return directive;

    function writeText(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
      }
      // Fallback for non-secure contexts / very old browsers.
      return new Promise(function (resolve, reject) {
        try {
          var textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.setAttribute('readonly', '');
          textarea.style.position = 'absolute';
          textarea.style.left = '-9999px';
          document.body.appendChild(textarea);
          textarea.select();
          var ok = document.execCommand('copy');
          document.body.removeChild(textarea);
          ok ? resolve() : reject(new Error('execCommand copy failed'));
        } catch (e) {
          reject(e);
        }
      });
    }

    function linker(scope, element, attrs) {
      var node = element[0];
      var label = node.querySelector('.copy-to-clipboard__label');
      var originalLabel = label ? label.textContent : null;
      var pending = null;

      function resolveText() {
        if (attrs.copyText) {
          var value = scope.$eval(attrs.copyText);
          return value == null ? '' : ('' + value);
        }
        var block = node.closest('.copy-block');
        var source = block ? block.querySelector('.copy-source') : null;
        // innerText preserves the rendered line breaks of code samples; trim the trailing newline.
        return source ? source.innerText.replace(/\s+$/, '') : '';
      }

      function showCopied() {
        element.addClass('is-copied');
        if (label) {
          label.textContent = 'Copied!';
        }
        if (pending) {
          $timeout.cancel(pending);
        }
        pending = $timeout(function () {
          element.removeClass('is-copied');
          if (label) {
            label.textContent = originalLabel;
          }
        }, 1500);
      }

      element.on('click', function (event) {
        event.preventDefault();
        var text = resolveText();
        if (!text) {
          return;
        }
        writeText(text).then(function () {
          scope.$apply(showCopied);
        }).catch(function () {
          // Last-resort visual feedback still helps the user notice something happened.
          scope.$apply(showCopied);
        });
      });

      scope.$on('$destroy', function () {
        if (pending) {
          $timeout.cancel(pending);
        }
      });
    }

  }

});
