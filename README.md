# cedar-template-editor

This is an AngularJS web application to create and fill in Metadata Templates. 

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

## Generating Ontology and Value Set caches

    $ gulp cache-ontologies
    $ gulp cache-value-sets

## Running the tests

### Unit Tests

Tests are written in Jasmine and run with the karma test runner.

To run the tests once:

    $ npm test
    
To have karma watch for changes:

    $ karma start

### End-to-end (e2e) Tests

e2e tests use Protractor.  To run them, first install selenium:

    $ npm install
    $ ./node_modules/selenium-standalone/bin/selenium-standalone install

Then you can run the e2e tests from gulp:

    $ gulp e2e

This will start the selenium server, run the tests, then stop the selenium server.

TODO: protractor.config.js currently is referencing specific install locations for linux.  Needs to be updated to support multiple developer environments / installs.
