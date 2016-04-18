'use strict';

let express = require('express');
let jsforce = require('jsforce');
let app = express();
let APP_PORT = 9010;

let oauth2 = new jsforce.OAuth2({
    loginUrl: 'https://salesforce.login.something',
    clientId: 'cllientID',
    clientSecret: 'secret',
    redirectUrl: `http://127.0.0.1:${APP_PORT}/oauth2/callback`,
});

//Forward the authorization token to the server to get the access token
app.get('/oauth2/auth', function(req, res) {
    console.log('Inside the Auth Url');
    res.redirect(oauth2.getAuthorizationUrl({
        scope: 'api id web',
    }));
});

//Access token callback from Saleforce should hit here
app.get('/oauth2/callback', function (req, res) {
    console.log('Inside the Callback Url');
    let conn = new jsforce.Connection({oauth2: oauth2});
    let code = req.param('code');

    conn.authorize(code, function (err, userInfo) {
        if (err) { throw err;}

        console.log('Connection Authorized:');
        console.log(`Access Token: ${conn.accessToken}`);
        console.log(`Refresh Token: ${conn.refreshToken}`);
        console.log(`InstanceUrl: ${conn.instanceUrl}`);
        console.log(`User ID: ${userInfo.id}`);
        console.log(`Org Id: ${userInfo.organizationId}`);

    });
});

app.listen(APP_PORT, function() {
    console.log(`Listening on ${APP_PORT}`)
})