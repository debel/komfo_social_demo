module.exports = function (config, model) {
    var fb = require('fbgraph'),
        rsvp = require('rsvp'),
        addition = function (number) {
            var n = parseInt(number, 10);
            return model.latest()
                .then(function doAddition(latest) {
                    latest = latest || {result: 0};
                    return {result: latest.result + n};
                })
                .then(model.insert);
        },
        authorizeFbRequest = function (access_token, cb) {
            fb.authorize({
                client_id: config.client_id,
                client_secret: config.client_secret,
                redirect_uri: config.redirect_uri,
                code: access_token
            }, cb.bind(null, fb));
        },
        makeFbRequest = function (endpoint) {
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

            authorizeFbRequest(req.query.code, function (error, fbRes) {
                rsvp.all([
                        makeFbRequest('/me'),
                        makeFbRequest('/me/likes')])
                    .then(res.send.bind(res))
                    .catch(res.send.bind(res));
            });
        };

    return {
        addition: addition,
        fbLogin: loginToFb,
        fbData: getFbData
    };
};