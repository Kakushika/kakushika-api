'use strict';

const config = require('config');
const request = require('superagent');
const Slack = require('slack-api');
const models = require('../models');

const connect = {};

connect.slack = {
  oauth: (req, res) => {
    const type = req.query.type;

    Slack.oauth.getUrl({
      client_id: config.slack.client_id,
      redirect_uri: config.slack.callback_path[type] | config.slack.callback_path.web
    }, (err, url) => {
      if (err) {
        res.status(500).json({
          redirect_url: config.slack.redirect_uri[type] | config.slack.callback_path.web
        });
      } else {
        res.json({
          redirect_url: url
        });
      }
    });
  },
  callback: (req, res) => {
    const userId = req.decoded.id;
    const code = req.body.code;

    if (!code) {
      res.status(400).json({
      });
    } else {
      Slack.oauth.access({
        client_id: config.slack.client_id,
        client_secret: config.slack.client_secret,
        code
      }, (error, data) => {
        if (error || !data.ok) {
          res.status(400).json({
          });
        } else {
          request
            .get(`${config.slack.api_url}/team.info?token=${data.access_token}`)
            .end((err, result) => {
              if (err) {
                return res.status(500).json({
                });
              }
              models.claim.create(userId, `slack:${result.body.team.id}:token`, data.access_token);
              models.roomGroup.create(userId, result.body.team.id, 'slack', result.body.team.name).then((roomGroup) => {
                Slack.channel.list({
                  token: data.access_token
                }, (err, data) => {
                  if (err) {
                    return;
                  }
                  data.channels.forEach((channel) => {
                    models.room.create(userId, channel.id, 'slack:channel', channel.name, roomGroup.id);
                  });
                });
                Slack.groups.list({
                  token: data.access_token
                }, (err, data) => {
                  if (err) {
                    return;
                  }
                  data.groups.forEach((group) => {
                    models.room.create(userId, group.id, 'slack:group', group.name, roomGroup.id);
                  });
                });
              });
              res.status(200).json({
              });
            });
        }
      });
    }
  }
};

module.exports = connect;
