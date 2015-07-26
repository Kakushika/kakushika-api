'use strict';

var express = require('express'),
  router = express.Router(),
  config = require('../config'),
  Slack = require('slack-api');

router.get('/slack', function(req, res) {
  Slack.oauth.getUrl({
    'client_id': config.slack.client_id,
    'redirect_uri': config.slack.callback_uri
  }, function(error, url) {
    if (error) {
      res.redirect(config.server.host + config.slack.redirect_path.error);
    } else {
      res.redirect(url);
    }
  });
});

module.exports = router;
