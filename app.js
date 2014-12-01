var config = require('./config/misho.json'); //change to your own secret config. do not commit it!
config.express.staticFilesPath = __dirname + '/static/';

var model = require('./src/model')(config.mongo),
    controller = require('./src/controller')(config.facebook, model),
    app = require('./src/webServer')(config.express, controller);

app.start(function () {
    console.log('app is running');
});