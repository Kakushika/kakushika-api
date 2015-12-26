'use strict';

const models = require('../models');

const rooms = {
  readMessages: (req, res, next) => {
    const roomId = req.params.room_id;

    models.message.read(roomId, req.query.offset, req.query.limit)
      .then((messages) => {
        return res.json(messages);
      }).catch((err) => {
        return next(err);
      });
  },
  createReader: (req, res, next) => {
    const userId = req.body.userId;
    const roomId = req.params.roomId;

    models.roomReadable.create(userId, roomId)
      .then(() => {
        return res.status(201);
      }).catch((err) => {
        return next(err);
      });
  },
  deleteReader: () => {}
};

module.exports = rooms;
