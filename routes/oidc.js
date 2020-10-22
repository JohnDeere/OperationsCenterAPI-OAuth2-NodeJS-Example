const axios = require('axios').default;
const express = require('express');
const router = express.Router();
const qs = require('qs');

let settings,
    metaData = {};

const populateSettings = (reqBody) => {
  settings = {
    clientId: reqBody.clientId,
    clientSecret: reqBody.clientSecret,
    wellKnown: reqBody.wellKnown,
    callbackUrl: reqBody.callbackUrl,
    scopes: reqBody.scopes,
    state: reqBody.state
  };
};
const updateTokenInfo = (token) => {
  settings = {
    ...settings,
    idToken: token.id_token,
    accessToken: token.access_token,
    refreshToken: token.refresh_token,
    exp: token.expires_in
  };
}

/* Initializes OIDC login */
router.post('/', async function ({ body }, res, next) {
  console.log('Beginning OIDC...');

  populateSettings(body);

  metaData = (await axios.get(body.wellKnown)).data;
  const params = new URLSearchParams({
    client_id: body.clientId,
    response_type: 'code',
    scope: body.scopes,
    redirect_uri: body.callbackUrl,
    state: body.state
  });

  res.redirect(`${metaData.authorization_endpoint}?${params.toString()}`)
});

/* OIDC callback */
router.get('/callback', async function ({ body, query }, res, next) {
  const code = query.code;
  const basicAuthHeader = Buffer.from(`${settings.clientId}:${settings.clientSecret}`).toString('base64');

  const token = (await axios.post(metaData.token_endpoint, qs.stringify({
    grant_type: 'authorization_code',
    redirect_uri: settings.callbackUrl,
    code,
    scope: settings.scopes
  }), {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Basic ${basicAuthHeader}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })).data;

  updateTokenInfo(token);
  res.render('index', settings);
});

module.exports = router;
