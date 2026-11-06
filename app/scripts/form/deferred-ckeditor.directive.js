'use strict';

define(['angular', 'require'], function (angular, require) {
  angular.module('cedar.templateEditor.deferredCkeditor', [])
      .factory('CkeditorLoader', ['$q', '$injector', function ($q, $injector) {
        var pending;
        return function () {
          if (!pending) {
            pending = $q(function (resolve, reject) {
              function failed(error) {
                (error.requireModules || []).forEach(function (name) { requirejs.undef(name); });
                requirejs.undef('lib/ng-ckeditor/ng-ckeditor.min');
                reject(error);
              }
              // RequireJS 2's shim dependency loader does not forward a dependency's
              // network error to the adapter's errback. Request CKEditor explicitly first.
              require(['ckeditor'], function () {
                require(['lib/ng-ckeditor/ng-ckeditor.min'], function () {
                  try {
                    $injector.loadNewModules(['ngCkeditor']);
                    resolve();
                  } catch (error) { reject(error); }
                }, failed);
              }, failed);
            }).catch(function (error) {
              pending = undefined;
              throw error;
            });
          }
          return pending;
        };
      }])
      .directive('cedarCkeditor', ['$compile', 'CkeditorLoader', 'UIMessageService', '$exceptionHandler',
        function ($compile, load, messages, report) {
          return {
            restrict: 'A', priority: 1000, terminal: true,
            link: function (scope, element, attrs) {
              var destroyed = false;
              element.on('$destroy', function () { destroyed = true; });
              element.prop('disabled', true);
              load().then(function () {
                if (destroyed) return;
                element.removeAttr('cedar-ckeditor');
                element.attr('ckeditor', attrs.cedarCkeditor);
                element.prop('disabled', false);
                // Compile ngModel and the original vendor directive only after its module
                // is registered. Its toolbar, model handling and teardown stay unchanged.
                $compile(element)(scope);
              }).catch(function (error) {
                if (destroyed) return;
                messages.flashWarning('GENERIC.Error', {}, 'GENERIC.Error');
                report(error);
              });
            }
          };
        }]);
});
