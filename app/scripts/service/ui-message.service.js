'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.uIMessageService', [])
      .service('UIMessageService', UIMessageService);

  UIMessageService.$inject = ['toasty', '$translate', '$timeout'];

  function UIMessageService(toasty, $translate, $timeout) {

    var service = {
      serviceId: "UIMessageService"
    };

    service.flashSuccess = function (messageKey, messageParameters, title) {
      this.flash('success', messageKey, messageParameters, title);
    };

    service.flashWarning = function (messageKey, messageParameters, title) {
      this.flash('warning', messageKey, messageParameters, title);
    };

    service.flashMessageNotification = function (message) {
      toasty['info']({
        title: message.subject + ":" + message.creationDate,
        msg  : message.body
      });
    };

    service.flash = function (type, messageKey, messageParameters, titleKey) {
      toasty[type]({
        title: $translate.instant(titleKey),
        msg  : $translate.instant(messageKey, messageParameters)
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
      var errorObject = response.data;
      if (response.status == -1) {
        var params = {};
        params.url = response.config.url;
        var interpolatedServerError = $translate.instant("SERVER.ERROR.BackendIsNotResponding", params);
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
        var i18nKey = 'REST_ERROR.' + errorObject.errorKey;
        var interpolatedServerError = $translate.instant(i18nKey, errorObject.parameters);
        if (interpolatedServerError != i18nKey) {
          if (errorObject.hasOwnProperty("errorReasonKey")) {
            var i18nReasonKey = 'REST_ERROR_REASON.' + errorObject.errorReasonKey;
            var interpolatedServerReason = $translate.instant(i18nReasonKey, errorObject.parameters);
            if (interpolatedServerReason != i18nReasonKey) {
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
          //console.log(response);
          var message, exceptionMessage, stackTraceHtml, statusCode, statusText, url, method, errorKey;
          statusCode = response.status;
          statusText = response.statusText;
          url = response.config.url;
          method = response.config.method;
          //console.log(response);
          if (response.status == -1) {
            message = $translate.instant('SERVER.ERROR.InaccessibleMessage');
            exceptionMessage = $translate.instant('SERVER.ERROR.InaccessibleMessageString');
            stackTraceHtml = $translate.instant('GENERIC.NotAvailable');
          } else {
            if (errorObject !== null) {
              message = errorObject.message;
              errorKey = errorObject.errorKey;
              if (errorObject.hasOwnProperty('sourceException')) {
                var ex = errorObject.sourceException;
                if (ex != null) {
                  if (ex.hasOwnProperty('message')) {
                    exceptionMessage = ex.message;
                  }
                  if (ex.hasOwnProperty('stackTrace') && ex.stackTrace != null) {
                    stackTraceHtml = "<textarea>";
                    for (var i in ex.stackTrace) {
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

          var content = $translate.instant('SERVER.ERROR.technicalDetailsTemplate', {
            message   : message,
            errorKey  : errorKey,
            exception : exceptionMessage,
            statusCode: statusCode,
            statusText: statusText,
            url       : url,
            method    : method
          });
          if (stackTraceHtml != null) {
            content += stackTraceHtml;
          }
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
