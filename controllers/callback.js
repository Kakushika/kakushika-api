'use strict';

var express = require('express'),
  router = express.Router(),
  config = require('config'),
  Slack = require('slack-api'),
  auth = require('../middleware/auth');

router.get('/slack', auth, function(req, res) {
  if (!req.query.code) {
    res.json({
      ok: false
    });
  } else {
    Slack.oauth.access({
      'client_id': config.slack.client_id,
      'client_secret': config.slack.client_secret,
      'code': req.query.code
    }, function (error, data) {
      if (error || !data.ok) {
        res.json({
          ok: false
        });
      } else {
        // save
        // data.access_token
        res.json({
          ok: true
        });
      }
    });
  }
});

module.exports = router;
