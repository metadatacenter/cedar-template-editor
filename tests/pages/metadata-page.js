'use strict';

require ('../pages/dashboard-page.js');

var MetadataPage = function () {
  var url = 'https://cedar.metadatacenter.orgx/dashboard';


  this.get = function () {
    browser.get(url);
// wait until loaded 
// TODO: should use EC for this 
    browser.sleep(1000);
  };


  this.test = function() {
    console.log('metadata  page test');
  };

};
module.exports = new MetadataPage(); 
