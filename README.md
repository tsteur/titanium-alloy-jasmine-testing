# Titanium Mobile Unit-Testing with Jasmine

## Description

This package allows you to execute Unit-Tests for Titanium Mobile and Alloy based Apps using [Jasmine 2](http://pivotal.github.io/jasmine/). The tests will be executed in a headless web browser ([PhantomJS](http://phantomjs.org/)).

## Features

* Works on Windows, Linux and MacOSX
* Takes only seconds to execute the tests
* Auto detection of specification files
* Works with Alloy (possible to test Models, Controllers, ...)
* Access to all MobileWeb Titanium APIs, you do not have to mock anything
* Creates XML files for each test suite
* Tests won't be packaged within the app
* You do not need an iOS Simulator or Android Emulator
* Execute Cross-Domain requests
* You can extend it for instance to capture screen if any error occurs
* Works with Travis-CI see https://github.com/piwik/piwik-mobile-2/blob/master/.travis.yml

## Install

In order to get this work you need to build your application for MobileWeb. Why? Build time is faster, it is platform independent and you don't need to install an iOS/Android-SDK.

1. Copy the `specs` folder into your Titanium project
2. Install [PhantomJS](http://phantomjs.org/). 
3. Done.

## Usage

Just place your specification files within the `/specs` folder or any subfolder like `models` or `controller`. They must end with `_spec.js`.

To run the tests simply execute the following command:

`./runtests.sh`

If you want to build your application before running the tests, you can do this either using Titanium Studio or using Titanium CLI:

`titanium build -p mobileweb`

## Examples
https://github.com/piwik/piwik-mobile-2/tree/master/specs/models

## Issues 
It currently requires that your MobileWeb application runs on a server. The current implementation uses this URL: `http://127.0.0.1:8020/index.html`. If you build your app using Titanium Studio this will work out of the box.

## 3rd-party libraries/components

Name: specs/jasmine/jasmine.js<br />
Name: specs/jasmine/jasmine-html.js<br />
Name: specs/jasmine/boot.js<br />
Name: specs/jasmine/console.js<br />
License: See specs/jasmine/JASMINE.MIT.LICENSE.txt<br />
Link: https://github.com/pivotal/jasmine<br />
