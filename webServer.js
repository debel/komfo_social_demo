var fs = require('fs'),
    express = require('express')(),
    config = Object.freeze(
        JSON.parse(fs.readFileSync('config/misho.json')));


express.get('/', function (req, res) {
    res.sendFile(__dirname + '/static/index.html');
});


express.listen(config.express.port);