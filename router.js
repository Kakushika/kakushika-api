'use strict';

let controllers = require('./controllers'),
  authorization = require('./middleware/authorization'),
  express = require('express'),
  router = express.Router();

router.get('/', function(req, res) {
  res.json({
    ok: true
  });
});

router.post('/signup', controllers.authentication.signup);
router.post('/login', controllers.authentication.login);

router.get('/users', authorization, controllers.users.read);
router.get('/me', authorization, controllers.users.me);

router.get('/auth/slack', authorization, controllers.auth.slack.oauth);
router.post('/auth/slack', authorization, controllers.auth.slack.callback);

router.post('/folders', authorization, controllers.folders.create);
router.get('/folders/:folder_id', authorization, controllers.folders.read);
router.post('/folders/:folder_id/children', authorization, controllers.folders.createChildren);
router.post('/folders/:folder_id/readables', authorization, controllers.folders.readables);
router.get('/resolve', authorization, controllers.folders.resolve);

router.post('/rooms/:room_id/readables', authorization, controllers.rooms.readables);

router.get('/messages', authorization, controllers.messages.search);

router.get('/assets', authorization, controllers.assets.search);
router.get('/assets/types', authorization, controllers.assets.type);

module.exports = router;
