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

## Running the tests

Tests are written in Jasmine and run with the karma test runner.

To run the tests once:

    $ gulp unit
    
To have karma watch for changes:

    $ karma start
