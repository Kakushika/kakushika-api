'use strict';

const express = require('express'),
  router = express.Router();

router.get('/', (req, res) => {
  res.json({
    ok: true
  });
});

router.use(require('./public'));
router.use(require('./private'));

module.exports = router;
