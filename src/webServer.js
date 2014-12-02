module.exports = function (config, controllers) {
    var express = require('express')();

    express.get('/', function (req, res) {
        res.sendFile(config.staticFilesPath + 'index.html');
    });

    express.get('/add/:number', function (req, res) {
        controllers.calculator.addition(req.param('number'))
            .then(res.send.bind(res))
            .catch(res.send.bind(res));
    });

    express.get('/multi/:number', function (req, res) {
        controllers.calculator.multiplication(req.param('number'))
            .then(res.send.bind(res))
            .catch(res.send.bind(res));
    });

    express.get('/auth/facebook', controllers.facebook.fbLogin);

    express.get('/me_and_my_likes', controllers.facebook.fbData);

    return {
        start: express.listen.bind(express, config.port)
    };
};