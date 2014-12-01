var config = require('./config/misho.json'); //change to your own secret config. do not commit it!
config.express.staticFilesPath = __dirname + '/static/';

var model = model = require('./src/model')(config.mongo),
    app = require('./src/webServer.js')(config.express, model);

app.start(function () {
    console.log('app is running');
});