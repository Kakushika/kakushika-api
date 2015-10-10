'use strict';

let models = require('../models');

let user = {
  me: (req, res, next) => {
    var userId = req.decoded.id;

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
