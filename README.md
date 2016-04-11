# cedar-template-editor

This is an AngularJS web application to create and fill in Metadata Templates. 

## Travis CI Status

[![Build Status](https://travis-ci.org/metadatacenter/cedar-template-editor.svg?branch=feature/karma-protractor)](https://travis-ci.org/metadatacenter/cedar-template-editor)

## Requirements
* NodeJS
* npm (included in NodeJS)
* Bower
* gulp

## Getting started

Install NodeJS (using Homebrew):

`$ brew install node`

Install bower:

`$ npm install -g bower`

Install gulp:

1) Install gulp globally: `$ npm install --global gulp@3.8.11`

2) Install gulp in your project devDependencies: `$ npm install --save-dev gulp`

Install all the project dependencies:

`$ npm install`

## Running the web application

Go to the project's root folder and execute `$ gulp`

To run individual tasks, use `$ gulp <task> <othertask>`

## Running the tests

### Unit Tests

Tests are written in Jasmine and run with the karma test runner.

To avoid Google Analytics errors while running karma tests the value of 'analyticsKey' in the tracking-service.conf.json file should be the string 'false'.

To run the tests:

    $ npm test

### End-to-end (e2e) Tests

e2e tests use Protractor.  To run them, first install selenium:

    $ npm install
    $ ./node_modules/selenium-standalone/bin/selenium-standalone install

Take note of the versions install for the selenium jar and chrome driver.  Update ```tests/env.js``` with the filename information as shown in ```tests/env.sample.js```.

Then you can run the e2e tests from gulp:

    $ gulp e2e

This will start the selenium server, run the tests, then stop the selenium server.
