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
  }
});