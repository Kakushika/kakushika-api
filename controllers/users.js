'use strict';

const models = require('../models');

const user = {
  me: (req, res, next) => {
    const userId = req.decoded.id;

    models.user.single(userId)
      .then((user) => {
        if (!user) {
          return res.status(401).json({
            ok: false
          });
        }
        return res.json({
          name: user.name,
          home: user.home
        });
      }).catch((err) => {
        return next(err);
      });
  },
  read: (req, res, next) => {
    const startWith = req.query.start_with;
    const limit = req.query.limit;

    models.user.readsByName(startWith, limit)
      .then((users) => {
        if (!users) {
          return res.status(404);
        }
        return res.json(users);
      }).catch((err) => {
        return next(err);
      });
  }
};

module.exports = user;
