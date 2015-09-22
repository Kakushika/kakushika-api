'use strict';

var config = require('config'),
  models = require('../models');

var folders = {
  create: function(req, res, next) {
    var userId = req.decoded.id;

    models.folder.create(req.query.parent, userId, req.query.name).then((folder) => {
      return res.json({
        folder: folder
      });
    }).catch((err) => {
      return next(err);
    });
  }
};

module.export = folders;
