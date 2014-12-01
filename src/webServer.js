module.exports = function (config) {
    var express = require('express')();

    express.get('/', function (req, res) {
        res.sendFile(config.staticFilesPath + 'index.html');
    });

    return {
        start: express.listen.bind(express, config.port)
    };
};