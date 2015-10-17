'use strict';

/**
 * !ATTENTION!
 * This is the PUBLIC area.
 * When you write route settings in this area, it will be published without authentication.
 */

const authentication = require('../controllers').authentication,
  express = require('express'),
  router = express.Router();

router.post('/signup', authentication.signup);
router.post('/login', authentication.login);
router.post('/reflesh', authentication.reflesh);

module.exports = router;
