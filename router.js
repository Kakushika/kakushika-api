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

// require authentication area
router.use(authorization);

router.get('/me', controllers.users.me);
router.get('/users', controllers.users.read);

router.get('/connect/slack', controllers.connect.slack.oauth);
router.post('/connect/slack', controllers.connect.slack.callback);
router.post('/connect/hipchat', controllers.connect.hipchat);

router.post('/folders', controllers.folders.create);
router.get('/folders/:folder_id', controllers.folders.read);
router.post('/folders/:folder_id/children', controllers.folders.createChildren);
router.delete('/folders/:folder_id/children', controllers.folders.deleteChildren);
router.post('/folders/:folder_id/reader', controllers.folders.createReader);
router.delete('/folders/:folder_id/reader', controllers.folders.deteleteReader);
router.get('/folders/resolve', controllers.folders.resolve);

router.get('/rooms/:room_id/messages', controllers.rooms.reader);
router.post('/rooms/:room_id/reader', controllers.rooms.createReader);
router.delete('/rooms/:room_id/reader', controllers.rooms.deleteReader);

router.get('/messages', controllers.search.messages);
router.get('/assets', controllers.search.assets);

module.exports = router;
