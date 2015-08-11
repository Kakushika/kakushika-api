'use strict';

var express = require('express'),
  router = express.Router(),
  config = require('config'),
  Slack = require('slack-api'),
  auth = require('../middleware/auth');

router.get('/slack', auth, function(req, res) {
  Slack.oauth.getUrl({
    'client_id': config.slack.client_id,
    'redirect_uri': config.api.host + config.slack.callback_path
  }, function(error, url) {
    if (error) {
      res.redirect(config.host + config.slack.redirect_path.error);
    } else {
      res.redirect(url);
    }
  });
});

module.exports = router;
