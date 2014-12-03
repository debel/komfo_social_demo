module.exports = function (config, mongo) {
    var  returnPath = '/',
    fb = require('fbgraph'),
        rsvp = require('rsvp'),
        authorize = function (code) {
            return new rsvp.Promise(function (fulfil, reject) {
                console.log('getting token from facebook...');
                console.log('gat: ' + fb.getAccessToken());
                fb.authorize({
                    client_id: config.client_id,
                    client_secret: config.client_secret,
                    redirect_uri: config.redirect_uri,
                    code: code
                }, function (err, fbRes) {
                    if (err) {
                        reject(err);
                    }
                    console.log(fbRes);
                    fulfil(fbRes);
                });
            });
        },
        request = function (endpoint) {
            console.log('querying facebook for data...')
            return new rsvp.Promise(function (fulfil, reject) {
                fb.get(endpoint, function (err, fbData) {
                    if (err) {
                        reject(err);
                    }

                    fulfil(fbData);
                });
            });
        },

        loginToFb = function (req, res) {
            if (!req.query.code) {
                if (req.query.error) {
                    res.send('access denied');
                }
                else {

                    console.log('logging into fb...');
                    res.redirect(fb.getOauthUrl({
                        client_id: config.client_id,
                        redirect_uri: config.redirect_uri,
                        scope: config.scope
                    }));
                }
            } else {
                authorize(req.query.code)
                    .then(function () {
                        console.log('redirecting back...');
                        res.redirect(returnPath);
                    });
            }
        },

    scrapePage = function (req, res) {
        if (!fb.getAccessToken()) {
            console.log('no token. redirecting to login...');
            returnPath = '/get/' + req.param('number');
            res.redirect(config.redirect_uri);
            return;
        }

        return request(req.param('number') + '/feed?include_hidden=true&limit=250')
            .then(function(feed){
                res.send(feed);
                if (feed.data !== undefined && Array.isArray(feed.data)){
                    feed.data.forEach(function(e){
                        console.log('retrieving post for page ' + req.param('number'));
                        mongo.upsert(
                            'posts',
                            {id: e.id},
                            {$set: {
                                message: e.message, 
                                application: e.application, 
                                from: e.from, 
                                type: e.type,
                                created_time: e.created_time,
                                updated_time: e.updated_time
                            }
                            });
                    });
                }
            })
            .catch(function (res) {
                res.send.bind(res);
                console.log('error!');
            });
    };

    // TODO: get aggregate stats, e.g. db.posts.aggregate([{$group: {_id: '$application.name' , count: {$sum : 1}}}, {$sort: {count: 1}}])

    return {
        fbLogin: loginToFb,
        fbPage: scrapePage,
    };
};
