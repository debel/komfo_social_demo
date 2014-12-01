var config = require('./config/misho.json'); //change to your own secret config. do not commit it!
config.express.staticFilesPath = __dirname + '/static/';

var app = require('./src/webServer.js')(config.express);

app.start(function () {
    console.log('app is running');
});