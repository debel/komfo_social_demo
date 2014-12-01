module.exports = function (config, model) {
    var express = require('express')();

    express.get('/', function (req, res) {
        res.sendFile(config.staticFilesPath + 'index.html');
    });

    express.get('/add/:number', function (req, res) {
        var n = parseInt(req.param('number'), 10);
        model.latest()
            .then(function doAddition(latest) {
                latest = latest || {result: 0};
                return {result: latest.result + n};
            })
            .then(model.insert)
            .then(res.send.bind(res));
    });

    return {
        start: express.listen.bind(express, config.port)
    };
};