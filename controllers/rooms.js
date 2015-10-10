'use strict';

var models = require('../models');

var rooms = {
  read: (req, res, next) => {
    var userId = req.decoded.id,
      roomId = req.params.room_id;

    models.message.read(roomId, req.query.offset, req.query.limit)
      .then((messages) => {
        return res.json(messages);
      }).catch((err) => {
        return next(err);
      });
  }
};

module.export = rooms;
