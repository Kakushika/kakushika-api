'use strict';

const models = require('../models');

const rooms = {
  read: (req, res, next) => {
    let roomId = req.params.room_id;

    models.message.read(roomId, req.query.offset, req.query.limit)
      .then((messages) => {
        return res.json(messages);
      }).catch((err) => {
        return next(err);
      });
  }
};

module.export = rooms;
