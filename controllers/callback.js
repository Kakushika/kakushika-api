'use strict';

var express = require('express'),
  router = express.Router(),
  config = require('config'),
  Slack = require('slack-api');

router.get('/slack', function(req, res) {
  if (!req.query.code) {
    res.redirect(config.host + config.slack.redirect_path.error);
  } else {
    Slack.oauth.access({
      'client_id': config.slack.client_id,
      'client_secret': config.slack.client_secret,
      'code': req.query.code
    }, function (error, data) {
      if (error || !data.ok) {
        res.redirect(config.host + config.slack.redirect_path.error);
      } else {
        // save
        // data.access_token
        res.redirect(config.host + config.slack.redirect_path.success);
      }
    });
  }
});

module.exports = router;
