'use strict';

define(['angular', 'require'], function (angular, require) {
  angular.module('cedar.templateEditor.service.yamlService', [])
      .factory('YamlService', ['$q', function ($q) {
        var library, pending;
        var previews = new WeakMap();
        function load() {
          if (library) return $q.resolve(library);
          if (!pending) {
            pending = $q(function (resolve, reject) {
              require(['CedarModelTypescriptLibrary'], function (loaded) {
                library = loaded;
                resolve(loaded);
              }, function (error) {
                requirejs.undef('CedarModelTypescriptLibrary');
                reject(error);
              });
            }).catch(function (error) {
              pending = undefined;
              throw error;
            });
          }
          return pending;
        }
        return {
          load: load,
          copy: function (write) {
            var content = Promise.resolve(load()).then(write);
            try {
              // Start the clipboard operation in the click's user activation. Safari does
              // not retain that activation while the first writer download is pending.
              if (typeof ClipboardItem === 'function' && navigator.clipboard.write) {
                return navigator.clipboard.write([new ClipboardItem({
                  'text/plain': content.then(function (text) { return new Blob([text], {type: 'text/plain'}); })
                })]);
              }
              return content.then(function (text) { return navigator.clipboard.writeText(text); });
            } catch (error) {
              content.catch(function () {});
              return Promise.reject(error);
            }
          },
          get: function () {
            if (!library) throw new Error('The YAML writer has not loaded.');
            return library;
          },
          preview: function (scope, write) {
            if (library) {
              try { return write(); } catch (error) { return error.message; }
            }
            var state = previews.get(scope);
            if (!state) {
              state = {requested: false, error: ''};
              previews.set(scope, state);
              // Closing and reopening an unsuccessful preview retries the download.
              scope.$watch('openStatus', function (open) {
                if (!open) { state.requested = false; state.error = ''; }
              });
            }
            if (!state.requested) {
              state.requested = true;
              load().catch(function (error) { state.error = error.message; });
            }
            return state.error;
          }
        };
      }]);
});
