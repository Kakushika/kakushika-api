'use strict';

const models = require('../models');

const folders = {
  create: (req, res, next) => {
    const userId = req.decoded.id;

    models.folder.create(req.query.parent, userId, req.query.name)
      .then((folder) => {
        return res.json({
          folder
        });
      }).catch((err) => {
        return next(err);
      });
  },
  rename: (req, res, next) => {
    const userId = req.decoded.id;
    const folderId = req.params.folder_id;
    const folderName = req.query.name;

    models.folder.rename(userId, folderId, folderName)
      .then(() => {
        res.status(200);
      }).catch((err) => {
        return next(err);
      });
  },
  createChildren: (req, res) => {
    const userId = req.decoded.id;
    const folders = req.body.folders;
    const rooms = req.body.rooms;
    const from = req.body.from;
    const to = req.params.folder_id;

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
  deleteChildren: () => {},
  read: (req, res, next) => {
    const userId = req.decoded.id;
    const folderId = req.params.folder_id;

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
    const userId = req.decoded.id;
    const folderId = req.params.folder_id;
    const targetUserId = req.body.userId;

    models.folder.createReadable(userId, folderId, targetUserId);
    return res.status(201);
  },
  deteleteReader: () => {}
};

module.exports = folders;
