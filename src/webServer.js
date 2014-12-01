module.exports = function (config, controller) {
    var express = require('express')();

    express.get('/', function (req, res) {
        res.sendFile(config.staticFilesPath + 'index.html');
    });

    express.get('/add/:number', function (req, res) {
        controller.addition(req.param('number'))
            .then(res.send.bind(res));
    });

    express.get('/auth/facebook', function(req, res) {
        controller.fbLogin(req, res);
    });

    express.get('/me_and_my_likes', function(req, res) {
        controller.fbData(req, res);
    });

    return {
        start: express.listen.bind(express, config.port)
    };
};