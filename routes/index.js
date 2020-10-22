var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    clientId: '',
    clientSecret: '',
    wellKnown: 'https://signin.johndeere.com/oauth2/aus78tnlaysMraFhC1t7/.well-known/oauth-authorization-server',
    callbackUrl: 'http://localhost:9090/callback',
    scopes: 'openid profile offline_access ag1 eq1',
    state: 'test'
  });
});

module.exports = router;
