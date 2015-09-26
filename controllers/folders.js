'use strict';

var models = require('../models');

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
  },
  createChildren: function(req, res) {
    var userId = req.decoded.id,
      folders = req.body.folders,
      rooms = req.body.rooms,
      from = req.body.from,
      to = req.params.folder_id;

    if(Number.isFinite(from)) {
      if(Array.isArray(folders)) {
        models.folder.moveRelations(userId, from, to, folders);
      }
      if(Array.isArray(rooms)) {
        models.room.moveRelations(userId, from, to, rooms);
      }
      return res.status(201);
    } else {
      if(Array.isArray(folders)) {
        models.folder.createRelations(userId, to, folders);
      }
      if(Array.isArray(rooms)) {
        models.room.createRelations(userId, to, rooms);
      }
      return res.status(201);
    }
  },
  readables: (req, res) => {
    var userId = req.decoded.id,
      folderId = req.params.folder_id,
      targetUserId = req.body.userId;

    models.folder.createReadable(userId, folderId, targetUserId);
    return res.status(201);
  }
};

module.export = folders;
