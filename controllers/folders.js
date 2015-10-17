'use strict';

const models = require('../models');

const folders = {
  create: (req, res, next) => {
    let userId = req.decoded.id;

    models.folder.create(req.query.parent, userId, req.query.name)
      .then((folder) => {
        return res.json({
          folder: folder
        });
      }).catch((err) => {
        return next(err);
      });
  },
  createChildren: (req, res) => {
    let userId = req.decoded.id,
      folders = req.body.folders,
      rooms = req.body.rooms,
      from = req.body.from,
      to = req.params.folder_id;

    if (Number.isFinite(from)) {
      if (Array.isArray(folders)) {
        models.folder.moveRelations(userId, from, to, folders);
      }
      if (Array.isArray(rooms)) {
        models.room.moveRelations(userId, from, to, rooms);
      }
      return res.status(201);
    } else {
      if (Array.isArray(folders)) {
        models.folder.createRelations(userId, to, folders);
      }
      if (Array.isArray(rooms)) {
        models.room.createRelations(userId, to, rooms);
      }
      return res.status(201);
    }
  },
  deleteChildren: (req, res, next) => {},
  read: (req, res, next) => {
    let userId = req.decoded.id,
      folderId = req.params.folder_id;

    Promise.all([models.folder.getInFolder(userId, folderId), models.room.getInFolder(userId, folderId), models.folder.getReadablesUserInFolder(userId, folderId)])
      .then((result) => {
        res.json({
          children: {
            folders: result[0],
            rooms: result[1]
          },
          readers: result[2]
        });
      })
      .catch((err) => {
        return next(err);
      });
  },
  createReader: (req, res) => {
    let userId = req.decoded.id,
      folderId = req.params.folder_id,
      targetUserId = req.body.userId;

    models.folder.createReadable(userId, folderId, targetUserId);
    return res.status(201);
  },
  deteleteReader: (req, res, next) => {},
};

module.exports = folders;