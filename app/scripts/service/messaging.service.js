'use strict';

define([
  'angular',
  'json!config/messaging-service.conf.json'
], function (angular, config) {
  angular.module('cedar.templateEditor.service.messagingService', [])
      .service('MessagingService', MessagingService);

  MessagingService.$inject = ['$interval', '$timeout', 'HttpBuilderService', 'UrlService', 'AuthorizedBackendService',
                              'UIMessageService'];

  function MessagingService($interval, $timeout, HttpBuilderService, UrlService, AuthorizedBackendService,
                            UIMessageService) {

    var delay = null;
    var unreadCount = 0;
    var notNotifiedCount = 0;
    var dummyData = {"total":10,"unread":4,"notnotified":0,"messages":[{"id":"https://repo.staging.metadatacenter.org/user-messages/b195bc13-c9c4-46f4-accc-fd08384a7078","readStatus":"unread","notificationStatus":"notified","subject":"NCBI Submission ERROR","body":"Submission ID: 08547657489004863\nStatus: ERROR\n\nNCBI STATUS REPORT\n==================\nSubmission NCBI ID: SUB360188\nStatus: processed-error\nLocation: /am/ftp-trace/centers/CEDAR/submit/Test/2018-02-07T22-48-12.132Z_test\n - Action ID: SUB360188-biosample-f29bab5d-a7f6-4190-a408-058ff70ccbc8\n   Status: processed-ok\n   Target_DB: BioSample\n   Message: Successfully loaded\n - Action ID: SUB360188-sra-2864660c-85c4-4f00-bdaa-0f8dc78a47fd\n   Status: processed-error\n   Target_DB: SRA\n   Message: An error occurred during submission processing. Please contact SRA helpdesk for more information. Please do not create another (duplicate) submission with the same data.\n","creationDate":"2018-02-07T14:51:22-0800","from":{"id":"https://repo.staging.metadatacenter.org/process-types/6896969d-3344-4724-aee7-bf51d53ebc65","senderType":"process","processId":"submission.AIRR","screenName":null}},{"id":"https://repo.staging.metadatacenter.org/user-messages/2a474648-d305-41f3-9a13-df4b22e97c6c","readStatus":"unread","notificationStatus":"notified","subject":"NCBI Submission PROCESSING","body":"Submission ID: 08547657489004863\nStatus: PROCESSING\n\nNCBI STATUS REPORT\n==================\nSubmission NCBI ID: SUB360188\nStatus: processing\nLocation: /am/ftp-trace/centers/CEDAR/submit/Test/2018-02-07T22-48-12.132Z_test\n - Action ID: SUB360188-biosample-f29bab5d-a7f6-4190-a408-058ff70ccbc8\n   Status: submitted\n   Target_DB: BioSample\n - Action ID: SUB360188-sra-2864660c-85c4-4f00-bdaa-0f8dc78a47fd\n   Status: processing\n   Target_DB: SRA\n","creationDate":"2018-02-07T14:50:51-0800","from":{"id":"https://repo.staging.metadatacenter.org/process-types/6896969d-3344-4724-aee7-bf51d53ebc65","senderType":"process","processId":"submission.AIRR","screenName":null}},{"id":"https://repo.staging.metadatacenter.org/user-messages/661e469c-c631-4f0a-824d-acdc926f9234","readStatus":"unread","notificationStatus":"notified","subject":"NCBI Submission PROCESSING","body":"Submission ID: 08547657489004863\nStatus: PROCESSING\n\nThe submission is being processed","creationDate":"2018-02-07T14:48:16-0800","from":{"id":"https://repo.staging.metadatacenter.org/process-types/6896969d-3344-4724-aee7-bf51d53ebc65","senderType":"process","processId":"submission.AIRR","screenName":null}},{"id":"https://repo.staging.metadatacenter.org/user-messages/cf7eae9a-3e52-43e5-a8d8-e6d2575b6b99","readStatus":"unread","notificationStatus":"notified","subject":"NCBI Submission SUBMITTED","body":"Submission ID: 08547657489004863\nStatus: SUBMITTED\n","creationDate":"2018-02-07T14:48:12-0800","from":{"id":"https://repo.staging.metadatacenter.org/process-types/6896969d-3344-4724-aee7-bf51d53ebc65","senderType":"process","processId":"submission.AIRR","screenName":null}},{"id":"https://repo.staging.metadatacenter.org/user-messages/a38593e2-d5c3-4018-a23c-94575bd812a7","readStatus":"read","notificationStatus":"notified","subject":"NCBI Submission REJECTED","body":"Submission ID: 08710325746364334\nStatus: REJECTED\n\nNCBI STATUS REPORT\n==================\nStatus: failed\nMessage: The required file 'submission.xml' is missing in /am/ftp-trace/centers/CEDAR/submit/Test/2018-02-07T22-28-52.959Z_test\n","creationDate":"2018-02-07T14:30:30-0800","from":{"id":"https://repo.staging.metadatacenter.org/process-types/6896969d-3344-4724-aee7-bf51d53ebc65","senderType":"process","processId":"submission.AIRR","screenName":null}},{"id":"https://repo.staging.metadatacenter.org/user-messages/8ced8350-3082-4f43-a05a-44ab56f56f59","readStatus":"read","notificationStatus":"notified","subject":"NCBI Submission PROCESSING","body":"Submission ID: 08710325746364334\nStatus: PROCESSING\n\nThe submission is being processed","creationDate":"2018-02-07T14:28:56-0800","from":{"id":"https://repo.staging.metadatacenter.org/process-types/6896969d-3344-4724-aee7-bf51d53ebc65","senderType":"process","processId":"submission.AIRR","screenName":null}},{"id":"https://repo.staging.metadatacenter.org/user-messages/ecd4d73f-f523-4e0c-8d8c-326cd0cf883d","readStatus":"read","notificationStatus":"notified","subject":"NCBI Submission SUBMITTED","body":"Submission ID: 08710325746364334\nStatus: SUBMITTED\n","creationDate":"2018-02-07T14:28:52-0800","from":{"id":"https://repo.staging.metadatacenter.org/process-types/6896969d-3344-4724-aee7-bf51d53ebc65","senderType":"process","processId":"submission.AIRR","screenName":null}},{"id":"https://repo.staging.metadatacenter.org/user-messages/8c27e822-9db3-4320-828f-69e25743f5a8","readStatus":"read","notificationStatus":"notified","subject":"NCBI Submission REJECTED","body":"Submission ID: 08572838599049541\nStatus: REJECTED\n\nNCBI STATUS REPORT\n==================\nStatus: failed\nMessage: Some files are missing: HD09_U_AB0RF.fastq\n","creationDate":"2018-01-25T15:15:18-0800","from":{"id":"https://repo.staging.metadatacenter.org/process-types/6896969d-3344-4724-aee7-bf51d53ebc65","senderType":"process","processId":"submission.AIRR","screenName":null}},{"id":"https://repo.staging.metadatacenter.org/user-messages/5fb0ab86-04e9-49ce-9f5a-d23d9b6ef2bf","readStatus":"read","notificationStatus":"notified","subject":"NCBI Submission PROCESSING","body":"Submission ID: 08572838599049541\nStatus: PROCESSING\n\nThe submission is being processed","creationDate":"2018-01-25T15:12:51-0800","from":{"id":"https://repo.staging.metadatacenter.org/process-types/6896969d-3344-4724-aee7-bf51d53ebc65","senderType":"process","processId":"submission.AIRR","screenName":null}},{"id":"https://repo.staging.metadatacenter.org/user-messages/9456fe90-a7d6-4475-9e1e-bcc5cf5a1670","readStatus":"read","notificationStatus":"notified","subject":"NCBI Submission SUBMITTED","body":"Submission ID: 08572838599049541\nStatus: SUBMITTED\n","creationDate":"2018-01-25T15:12:45-0800","from":{"id":"https://repo.staging.metadatacenter.org/process-types/6896969d-3344-4724-aee7-bf51d53ebc65","senderType":"process","processId":"submission.AIRR","screenName":null}}]};
    var dummySummary = {"total":75,"unread":10,"notnotified":10};

    var service = {
      serviceId: "MessagingService"
    };

    service.init = function () {
      delay = config.delay;
      this.messagingBeat();
      $interval(this.messagingBeat, delay);
    };

    service.messagingBeat = function () {

      var url = UrlService.messagingSummary();
      AuthorizedBackendService.doCall(
          HttpBuilderService.get(url),
          function (response) {
            service.unreadCount = dummySummary.unread;
            service.notNotifiedCount = dummySummary.notnotified;
            if (service.notNotifiedCount > 0) {
              service.readAndNotify();
            }

            // service.unreadCount = response.data.unread;
            // service.notNotifiedCount = response.data.notnotified;
            // if (service.notNotifiedCount > 0) {
            //   //console.log("notNotifiedCount > 0");
            //   service.readAndNotify();
            // }
          },
          function (error) {
            console.log("The messaging server is not responding!");
          }
      );
    };

    service.loadMessages = function (callback) {
      var url = UrlService.messagingMessages();
      AuthorizedBackendService.doCall(
          HttpBuilderService.get(url),
          function (response) {
            callback(response.data);
          },
          function (error) {
            UIMessageService.showBackendError('SERVER.MESSAGING.load.error', error);
          }
      );
    };

    service.markAllMessagesAsRead = function() {
      var url = UrlService.messagingMarkAllMessagesAsRead();
      AuthorizedBackendService.doCall(
          HttpBuilderService.post(url),
          function (response) {
            // do nothing
          },
          function (error) {
            UIMessageService.showBackendError('SERVER.MESSAGING.load.error', error);
          }
      );
    };

    service.readAndNotify = function (callback) {
      console.log('readAndNotify');
      var url = UrlService.messagingNotNotifiedMessages();
      AuthorizedBackendService.doCall(
          HttpBuilderService.get(url),
          function (response) {
            //console.log("readAndNotify response:");
            //console.log(response.data);

            showNotifications(dummyData);
            //service.showNotifications(response.data);
          },
          function (error) {
            console.log("The messaging server is not responding!");
          }
      );
    };

    service.showNotifications = function (data) {
      //console.log('showNotifications');
      var messages = data.messages;
      messages.forEach(function (msg) {
        //console.log("flush");
        UIMessageService.flashMessageNotification(msg);
        //console.log("markMessageAsNotified:");
        //console.log(msg)
        service.markMessageAsNotified(msg);
      });
    };

    service.markMessageAsNotified = function (msg) {
      //console.log('markMessageAsNotified');
      var url = UrlService.messagingPatchMessage(msg['id']);
      var patch = {
        'notificationStatus': 'notified'
      };
      //console.log("url to patch:" + url);
      AuthorizedBackendService.doCall(
          HttpBuilderService.patchMerge(url, patch),
          function (response) {
            // do nothing
            //console.log("PATCHED");
          },
          function (error) {
            console.log("The messaging server is not responding!");
          }
      );

    };

    return service;
  }

});
