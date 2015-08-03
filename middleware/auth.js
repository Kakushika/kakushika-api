'use strict';

module.exports = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  var err = new Error('Forbidden');
  err.status = 403;
  next(err);
};
