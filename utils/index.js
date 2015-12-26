'use strict';

if (!global.hasOwnProperty('utils')) {
  const config = require('config'),
    appInsights = require('applicationinsights'),
    logentries = require('node-logentries');

  global.utils = {
    appInsights: appInsights.setup(config.applicationinsights.instrumentation_key),
    logger: new logentries.logger({
      token: config.logentries.token
    })
  };
}

module.exports = global.utils;
