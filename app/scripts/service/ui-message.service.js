'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.uIMessageService', [])
      .service('UIMessageService', UIMessageService);

  UIMessageService.$inject = ['toasty', '$translate', '$timeout', '$window'];

  function UIMessageService(toasty, $translate, $timeout, $window) {

    var service = {
      serviceId: "UIMessageService"
    };

    service.flashSuccess = function (messageKey, messageParameters, title) {
      this.flash('success', messageKey, messageParameters, title);
    };

    service.flashInfo = function (messageKey, messageParameters, title) {
      this.flash('success', messageKey, messageParameters, title);
    };

    service.flashWarning = function (messageKey, messageParameters, title) {
      this.flash('warning', messageKey, messageParameters, title);
    };

    service.flashMessageNotification = function (message) {
      toasty['info']({
        title: message.subject,
        msg  : ""
      });
    };

    service.flash = function (type, messageKey, messageParameters, titleKey) {
      toasty[type]({
        title: $translate.instant(titleKey),
        msg  : $translate.instant(messageKey, messageParameters)
      });
    };

    // Where a message waits out a full page load.
    var PENDING_KEY = 'cedar.pendingFlash';

    /**
     * Flash a message on the page the user is about to land on, not this one.
     *
     * A toast is a DOM node in the page that raised it, so anything that flashes and
     * then navigates with `window.location` shows nothing: the node is created and
     * the document carrying it is discarded a moment later, before it paints. Saving
     * a new instance did exactly that, and the confirmation had never been seen.
     *
     * Storing it rather than delaying the navigation, because the message belongs
     * where the user ends up. `sessionStorage` and not a service field, since nothing
     * in this application outlives the load.
     */
    service.flashAfterReload = function (type, messageKey, titleKey) {
      try {
        $window.sessionStorage.setItem(PENDING_KEY, angular.toJson({
          type      : type,
          messageKey: messageKey,
          titleKey  : titleKey
        }));
      } catch (e) {
        // A browser refusing storage is not a reason to fail a save. The user loses
        // the confirmation, which is what happened before this existed.
      }
    };

    /** Show whatever the previous page left, once. Called on startup. */
    service.flashPending = function () {
      var raw;
      try {
        raw = $window.sessionStorage.getItem(PENDING_KEY);
        if (raw) {
          $window.sessionStorage.removeItem(PENDING_KEY);
        }
      } catch (e) {
        return;
      }
      if (!raw) {
        return;
      }
      var pending = angular.fromJson(raw);
      /*
       * `$translate(...)` rather than `$translate.instant(...)`, because this runs
       * during startup and the language tables are fetched over HTTP: `instant`
       * answers with the key itself until they arrive, and the first version of this
       * raised a toast reading "GENERIC.Created SERVER.INSTANCE.create.success". The
       * promise form resolves once the language is loaded, which is also late enough
       * for the container in `index.html` to have been compiled.
       */
      $translate([pending.messageKey, pending.titleKey]).then(function (translations) {
        toasty[pending.type]({
          title: translations[pending.titleKey],
          msg  : translations[pending.messageKey]
        });
      });
    };

    service.conditionalOrConfirmedExecution = function (condition, callback, titleKey, textKey, confirmTextKey) {
      if (condition) {
        callback();
      } else {
        swal({
              title             : $translate.instant(titleKey),
              text              : $translate.instant(textKey),
              type              : "warning",
              showCancelButton  : true,
              confirmButtonText : $translate.instant(confirmTextKey),
              closeOnConfirm    : true,
              customClass       : 'cedarSWAL',
              confirmButtonColor: null
            },
            function (isConfirm) {
              if (isConfirm) {
                callback();
              }
            }
        );
      }
    };

    service.confirmedExecution = function (callback, titleKey, textKey, confirmTextKey) {
      swal({
            title             : $translate.instant(titleKey),
            text              : $translate.instant(textKey),
            type              : "warning",
            showCancelButton  : true,
            confirmButtonText : $translate.instant(confirmTextKey),
            closeOnConfirm    : true,
            customClass       : 'cedarSWAL',
            confirmButtonColor: null
          },
          function (isConfirm) {
            if (isConfirm) {
              callback();
            }
          });
    };

    service.acknowledgedExecution = function (callback, titleKey, textKey, confirmTextKey) {
      swal({
            title             : $translate.instant(titleKey),
            text              : $translate.instant(textKey),
            type              : "warning",
            showCancelButton  : false,
            confirmButtonText : $translate.instant(confirmTextKey),
            closeOnConfirm    : true,
            closeOnCancel     : false,
            customClass       : 'cedarSWAL',
            confirmButtonColor: null,
            html              : true
          },
          function () {
            callback();
          });
    };

    service.showWarning = function (titleKey, textKey, confirmTextKey, textParameters) {
      swal({
        title             : $translate.instant(titleKey),
        text              : $translate.instant(textKey, textParameters),
        type              : "warning",
        showCancelButton  : false,
        confirmButtonText : $translate.instant(confirmTextKey),
        closeOnConfirm    : true,
        customClass       : 'cedarSWAL',
        confirmButtonColor: null,
        html              : true
      });
    };

    service.showBackendWarning = function (title, text) {
      swal({
        title             : title,
        text              : text,
        type              : "warning",
        showCancelButton  : false,
        confirmButtonText : $translate.instant('GENERIC.Ok'),
        closeOnConfirm    : true,
        customClass       : 'cedarSWAL',
        confirmButtonColor: null,
        html              : true
      });
    };


    service.showBackendError = function (messageKey, response) {
      let errorObject = response.data;
      let interpolatedServerError = null;
      if (response.status === -1) {
        let params = {};
        params.url = response.config.url;
        interpolatedServerError = $translate.instant("SERVER.ERROR.BackendIsNotResponding", params);
        $timeout(function () {
          service.showBackendWarning(
              $translate.instant('GENERIC.Error'),
              interpolatedServerError
          );
        }, 500);
        return;
      }
      // Test if this is an error that we are expecting:
      // If yes, show a warning, and return
      // If not, this is a server error, and we should show it.
      if (errorObject.hasOwnProperty("errorKey")) {
        let i18nKey = 'REST_ERROR.' + errorObject.errorKey;
        interpolatedServerError = $translate.instant(i18nKey, errorObject.parameters);
        if (interpolatedServerError !== i18nKey) {
          if (errorObject.hasOwnProperty("errorReasonKey")) {
            let i18nReasonKey = 'REST_ERROR_REASON.' + errorObject.errorReasonKey;
            let interpolatedServerReason = $translate.instant(i18nReasonKey, errorObject.parameters);
            if (interpolatedServerReason !== i18nReasonKey) {
              interpolatedServerError += "<br /><br />" + interpolatedServerReason;
            }
          }
          $timeout(function () {
            service.showBackendWarning(
                $translate.instant('GENERIC.Warning'),
                interpolatedServerError
            );
          }, 500);
          return;
        }
      }

      toasty.error({
        title  : $translate.instant('SERVER.ERROR.title'),
        msg    : $translate.instant(messageKey),
        //timeout: false,
        onClick: function () {
          let message, exceptionMessage, stackTraceHtml, statusCode, statusText, url, method, errorKey, errorReasonKey, objects;
          statusCode = response.status;
          statusText = response.statusText;
          url = response.config.url;
          method = response.config.method;
          //console.log(response);
          stackTraceHtml = "N/A";
          objects = 'N/A';
          exceptionMessage = 'N/A';
          if (response.status === -1) {
            message = $translate.instant('SERVER.ERROR.InaccessibleMessage');
            exceptionMessage = $translate.instant('SERVER.ERROR.InaccessibleMessageString');
          } else {
            if (errorObject !== null) {
              message = errorObject.errorMessage;
              errorKey = errorObject.errorKey;
              errorReasonKey = errorObject.errorReasonKey;
              if (errorObject.hasOwnProperty('objects')) {
                objects = '<textarea style="height: 100px; white-space: pre">';
                objects += JSON.stringify(errorObject.objects, null, '  ');
                objects += '</textarea>';
              }
              if (errorObject.hasOwnProperty('sourceException')) {
                let ex = errorObject.sourceException;
                if (ex != null) {
                  if (ex.hasOwnProperty('message')) {
                    exceptionMessage = ex.message;
                  }
                  if (ex.hasOwnProperty('stackTrace') && ex.stackTrace != null) {
                    stackTraceHtml = '<textarea style="height: 100px; white-space: pre">';
                    for (let i in ex.stackTrace) {
                      stackTraceHtml += ex.stackTrace[i].className
                          + " -> " + ex.stackTrace[i].methodName
                          + " ( " + ex.stackTrace[i].lineNumber + " )"
                          + "\n";
                    }
                    stackTraceHtml += "</textarea>";
                  }
                }
              }
            }
          }

          let content = $translate.instant('SERVER.ERROR.technicalDetailsTemplate', {
            message       : message,
            errorKey      : errorKey,
            errorReasonKey: errorReasonKey,
            exception     : exceptionMessage,
            statusCode    : statusCode,
            statusText    : statusText,
            url           : url,
            method        : method,
            objects       : objects
          });
          content += '<b>Stack trace</b>:' + stackTraceHtml + '<br />';
          content += '<b>Error details</b>:' + objects + '<br />';
          content += '<br/>';
          swal({
            title      : $translate.instant('SERVER.ERROR.technicalDetailsTitle'),
            type       : "error",
            customClass: "errorTechnicalDetails",
            text       : content,
            html       : true
          });
        }
      });
    }

    return service;
  };

});
