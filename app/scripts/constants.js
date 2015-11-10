/*jslint node: true */
'use strict';

/*global angularApp */

angularApp.constant('HEADER_MINI', {
  "stickyThreshold": 0,
  "ROLESELECTOR": {
    "enabled": false
  },
  "DASHBOARD": {
    "enabled": false
  },
  "DASHBOARDLIST": {
    "enabled": false
  },
  "ELEMENT": {
    "enabled": true,
    "scrollLimit": 180
  },
  "TEMPLATE": {
    "enabled": true,
    "scrollLimit": 140
  },
  "RUNTIME": {
    "enabled": true,
    "scrollLimit": 140
  }
});

angularApp.constant('LS', {
  "dashboard": {
    "delete": {
      "confirm": {
        "template": "Are you sure you want to remove the selected template?",
        "element": "Are you sure you want to remove the selected element?",
        "instance": "Are you sure you want to remove the selected populated template?"
      }
    }
  },
  "elementEditor": {
    "clear": {
      "confirm": "Are you sure you want to clear the element? All included elements and fields will be deleted!"
    },
    "save": {
      "nonEmptyStagingConfirm": "The staging area is not empty. If you save the element now, you will loose the content of the staging area! Are you sure you want to save the element this way?"
    }
  },
  "templateEditor": {
    "clear": {
      "confirm": "Are you sure you want to clear the template? All included elements and fields will be deleted!"
    },
    "save": {
      "nonEmptyStagingConfirm": "The staging area is not empty. If you save the template now, you will loose the content of the staging area! Are you sure you want to save the template this way?"
    }
  }
});

angularApp.constant('CONST', {
  "pageId": {
    "TEMPLATE": "TEMPLATE",
    "ELEMENT": "ELEMENT",
    "RUNTIME": "RUNTIME",
    "ROLESELECTOR": "ROLESELECTOR",
    "DASHBOARD": "DASHBOARD",
    "DASHBOARDLIST": "DASHBOARDLIST"
  },
  "stagingObject": {
    "NONE": null,
    "ELEMENT": "ELEMENT",
    "FIELD": "FIELD"
  }
});