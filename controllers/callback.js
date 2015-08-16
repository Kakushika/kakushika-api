'use strict';

var express = require('express'),
  router = express.Router(),
  config = require('config'),
  request = require('superagent'),
  Slack = require('slack-api'),
  auth = require('../middleware/auth'),
  models = require('../models');

router.get('/slack', auth, function(req, res, next) {
  if (!req.query.code) {
    res.json({
      ok: false
    });
  } else {
    Slack.oauth.access({
      client_id: config.slack.client_id,
      client_secret: config.slack.client_secret,
      code: req.query.code
    }, function(error, data) {
      if (error || !data.ok) {
        res.json({
          ok: false
        });
      } else {
        request
          .get(config.slack.api_url + '/team.info?token=' + data.access_token)
          .end(function(err, res) {
            if (err) {
              next(err);
            }
            models.Claim.create({
              userId: req.decoded.id,
              key: 'slack:' + res.body.team.id + ':token',
              token: data.access_token
            });
            res.json({
              ok: true
            });
          });
      }
    });
  }
});

module.exports = router;
