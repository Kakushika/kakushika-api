'use strict';

const models = require('../models');

const user = {
  me: (req, res, next) => {
    let userId = req.decoded.id;

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
  }
};

module.exports = user;
