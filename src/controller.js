module.exports = function (config, model) {
    var fb = require('fbgraph'),
        addition = function (number) {
            var n = parseInt(number, 10);
            return model.latest()
                .then(function doAddition(latest) {
                    latest = latest || {result: 0};
                    return {result: latest.result + n};
                })
                .then(model.insert);
        },
        connectToFb = function (req, res){
            // we don't have a code yet
            // so we'll redirect to the oauth dialog
            if (!req.query.code) {
                var authUrl = fb.getOauthUrl({
                    client_id: config.client_id,
                    redirect_uri: config.redirect_uri,
                    scope: config.scope
                });

                if (!req.query.error) {
                    //checks whether a user denied the app facebook login/permissions
                    res.redirect(authUrl);
                } else {
                    //req.query.error == 'access_denied'
                    res.send('access denied');
                }
                return;
            }
            // code is set
            // we'll send that and get the access token
            fb.authorize({
                client_id: config.client_id,
                client_secret: config.client_secret,
                redirect_uri: config.redirect_uri,
                code: req.query.code
            }, function (error, fbRes) {
                fb.get('/me/likes', function (err, fbData) {
                    res.send(JSON.stringify(err || fbData));
                });
            });
        };

    return {
        addition: addition,
        connectToFb: connectToFb
    };
};