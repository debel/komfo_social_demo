module.exports = function (config) {
    var fb = require('fbgraph'),
        rsvp = require('rsvp'),
        authorize = function (access_token) {
            return new rsvp.Promise(function (fulfil, reject) {
                fb.authorize({
                    client_id: config.client_id,
                    client_secret: config.client_secret,
                    redirect_uri: config.redirect_uri,
                    code: access_token
                }, function (err, fbRes) {
                    if (err) {
                        reject(err);
                    }
                    fulfil(fbRes);
                });
            });
        },
        request = function (endpoint) {
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

                    res.redirect(fb.getOauthUrl({
                        client_id: config.client_id,
                        redirect_uri: config.redirect_uri,
                        scope: config.scope
                    }));
                }
            } else {
                res.redirect('me_and_my_likes');
            }
        },

        getFbData = function (req, res) {
            if (!req.query.code) {
                res.redirect('auth/facebook');
                return;
            }

            authorize(req.query.code)
                .then(function () {
                    return rsvp.all([
                        request('/me'),
                        request('/me/likes')])
                })
                .then(res.send.bind(res))
                .catch(res.send.bind(res));
        };

    return {
        fbLogin: loginToFb,
        fbData: getFbData
    };
};