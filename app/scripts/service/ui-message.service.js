'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.uIMessageService', [])
      .service('UIMessageService', UIMessageService);

  UIMessageService.$inject = ['toasty', '$translate'];

  function UIMessageService(toasty, $translate) {

    var service = {
      serviceId: "UIMessageService"
    };

    service.flashSuccess = function (messageKey, messageParameters, title) {
      this.flash('success', messageKey, messageParameters, title);
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
      // Test if this is an error that we are expecting:
      // If yes, show a warning, and return
      // If not, this is a server error, and we should show it.
      if (errorObject.hasOwnProperty("errorKey")) {
        var errorKey = errorObject.errorKey;
        var interpolatedServerError = $translate.instant('RESTERROR.' + errorKey, errorObject.parameters);
        if (interpolatedServerError != errorKey) {
          service.showBackendWarning(
              $translate.instant('GENERIC.Warning'),
              interpolatedServerError
          );
          return;
        }
      }

      toasty.error({
        title  : $translate.instant('SERVER.ERROR.title'),
        msg    : $translate.instant(messageKey),
        //timeout: false,
        onClick: function () {
          //console.log(response);
          var message, exception, stackTraceHtml, statusCode, statusText, url, method, errorKey;
          statusCode = response.status;
          statusText = response.statusText;
          url = response.config.url;
          method = response.config.method;
          //console.log(response);
          if (response.status == -1) {
            message = $translate.instant('SERVER.ERROR.InaccessibleMessage');
            exception = $translate.instant('SERVER.ERROR.InaccessibleMessageString');
            stackTraceHtml = $translate.instant('GENERIC.NotAvailable');
          } else {
            if (errorObject !== null) {
              message = errorObject.message;
              errorKey = errorObject.errorKey;
              if (errorObject.hasOwnProperty('sourceException')) {
                var ex = errorObject.sourceException;
                exception = ex.message;
                if (ex.hasOwnProperty('stackTrace')) {
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

          var content = $translate.instant('SERVER.ERROR.technicalDetailsTemplate', {
            message   : message,
            errorKey  : errorKey,
            exception : exception,
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
