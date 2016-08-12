'use strict';

require ('../pages/dashboard-page.js');

var ProfilePage = function () {
  //var url = 'https://cedar.metadatacenter.orgx/dashboard';
  var testConfig = require('../config/test-env.js');
  var url = testConfig.baseUrl + '/dashboard';


  this.get = function () {
    browser.get(url);
// wait until loaded 
// TODO: should use EC for this 
    browser.sleep(1000);
  };

  this.test = function() {
    console.log('profile page test');
  };

};
module.exports = new ProfilePage(); 