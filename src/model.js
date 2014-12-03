module.exports = function (config) {
    var rsvp = require('rsvp'),
        mongoClient = require('mongodb').MongoClient,
        dbConnection = null,
        connectToDB = function () {
            // if we already have an open connection, return it
            if (dbConnection && dbConnection.state === 'connected') {
                return rsvp.resolve(dbConnection);
            }

            // else create a new connection
            return new rsvp.Promise(
                function promiseConnectToDB(fulfile, reject) {
                    mongoClient.connect(config.connectionString, function dbReady(err, db) {
                        if (err != null || db == null) {
                            dbConnection = null;
                            reject(err || 'Cannot connect to db');
                            return;
                        }

                        dbConnection = db;
                        fulfile(db);
                    });
                });
        },

        latest = function (collection) {
            return new rsvp.Promise(
                function promiseGetLatest(fulfil, reject) {
                    connectToDB().then(function dbReady(db) {
                        var coll = db.collection(collection);
                        coll.find().sort({_id: -1}).limit(1)
                            .nextObject(function gotLatest(err, item) {
                                if (err) reject(err);

                                fulfil(item);
                            });
                    }).catch(reject);
                });
        },
        insert = function (collection, data) {
            return new rsvp.Promise(
                function promiseInsert(fulfil, reject) {
                    connectToDB().then(function dbReady(db) {
                        var coll = db.collection(collection);
                        coll.insert(data, function (err, item) {
                            if (err) {
                                reject(err);
                            }

                            fulfil(item);
                        });
                    }).catch(reject);
                });
        },
        upsert = function (collection, criteria, data) {
            return new rsvp.Promise(
                function do_upsert(fulfil, reject) {
                    connectToDB().then(function dbReady(db) {
                        var coll = db.collection(collection);
                        coll.update(criteria, data, {upsert: true}, function (err, item) {
                            if (err) {
                                reject(err);
                            }

                            fulfil(item);
                        });
                    }).catch(reject);
                });
        };

    return {
        latest: latest,
        insert: insert,
        upsert: upsert
    };
};
