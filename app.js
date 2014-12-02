#!/usr/bin/env js

// import configuration
var config = require('./config/config.json'); 

// path to static content
config.express.staticFilesPath = __dirname + '/static/';

// initialize application components
var model = require('./src/model')(config.mongo),
    calculator = require('./src/calculator.controller')(model),
    facebook = require('./src/facebook.controller')(config.facebook),
    app = require('./src/webServer')(config.express, {
        calculator: calculator,
        facebook: facebook
    });

app.start(function () {
    console.log('app is running on ' + config.express.port);
});
