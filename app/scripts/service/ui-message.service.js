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


    service.showBackendError = function (messageKey, response) {
      var errorObject = response.data;
      toasty.error({
        title  : $translate.instant('SERVER.ERROR.title'),
        msg    : $translate.instant(messageKey),
        timeout: false,
        onClick: function () {
          //console.log(response);
          var message, string, stackTraceHtml, statusCode, statusText, url, method;
          statusCode = response.status;
          statusText = response.statusText;
          url = response.config.url;
          method = response.config.method;
          //console.log(response);
          if (response.status == 404) {
            message = $translate.instant('SERVER.ERROR.NotFoundMessage');
            string = $translate.instant('SERVER.ERROR.NotFoundString');
            stackTraceHtml = $translate.instant('GENERIC.NotAvailable');
          } else if (response.status == 0 || response.status == 502) {
            message = $translate.instant('SERVER.ERROR.InaccessibleMessage');
            string = $translate.instant('SERVER.ERROR.InaccessibleMessageString');
            stackTraceHtml = $translate.instant('GENERIC.NotAvailable');
          } else {
            message = errorObject.message;
            string = errorObject.string;
            stackTraceHtml = "<textarea>" + errorObject.stackTrace.join('<br />') + "</textarea>";
          }

          var content = $translate.instant('SERVER.ERROR.technicalDetailsTemplate', {
            message   : message,
            string    : string,
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
