module.exports = function (config) {
    var rsvp = require('rsvp'),
        mongoClient = require('mongodb').MongoClient,
        connectToDB = new rsvp.Promise(
            function promiseConnectToDB(fulfile, reject) {
            mongoClient.connect(config.connectionString, function dbReady(err, db) {
                if (err != null || db == null) {
                    reject(err || 'cannot connect to db');
                }

                fulfile(db);
            });
        }),

        latest = function () {
            return new rsvp.Promise(
                function promiseGetLatest(fulfil, reject) {
                connectToDB.then(function dbReady(db) {
                    var coll = db.collection('addition');
                    coll.find().sort({_id: -1}).limit(1)
                        .nextObject(function gotLatest(err, item) {
                        if (err) reject(err);

                        fulfil(item);
                    });
                });
            });
        },
        insert = function (data) {
            return new rsvp.Promise(
                function promiseInsert(fulfil, reject) {
                connectToDB.then(function dbReady(db) {
                    var coll = db.collection('addition');
                    coll.insert(data, function (err, item) {
                        if (err) {
                            reject(err);
                        }

                        fulfil(item);
                    });
                });
            });
        };

    return {
        latest: latest,
        insert: insert
    };
};
