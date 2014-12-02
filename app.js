var config = require('./config/misho.json'); //change to your own secret config. do not commit it!
config.express.staticFilesPath = __dirname + '/static/';

var model = require('./src/model')(config.mongo),
    calculator = require('./src/calculator.controller')(model),
    facebook = require('./src/facebook.controller')(config.facebook),
    app = require('./src/webServer')(config.express, {
        calculator: calculator,
        facebook: facebook
    });

app.start(function () {
    console.log('app is running');
});