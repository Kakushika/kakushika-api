'use strict';

var config = {},
  server = require('./server');

config.client_id = '2535714809.8192930512';
config.client_secret = 'adc1deb59f3f0dc109658223208990d5';
config.callback_uri = server.api.host + '/callback/slack';
config.redirect_path = {};
config.redirect_path.success = '#/callback/slack/success';
config.redirect_path.error = '#/callback/slack/error';

module.exports = config;
