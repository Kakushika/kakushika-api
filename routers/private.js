'use strict';

const express = require('express'),
  router = express.Router(),
  authorization = require('../middleware/authorization'),
  users = require('../controllers').users,
  connect = require('../controllers').connect,
  folders = require('../controllers').folders,
  rooms = require('../controllers').rooms,
  search = require('../controllers').search;

router.use(authorization);

router.get('/me', users.me);
router.get('/users', users.read);

router.get('/connect/slack', connect.slack.oauth);
router.post('/connect/slack', connect.slack.callback);
router.post('/connect/hipchat', connect.hipchat);

router.post('/folders', folders.create);
router.get('/folders/:folder_id', folders.read);
router.post('/folders/:folder_id/children', folders.createChildren);
router.delete('/folders/:folder_id/children', folders.deleteChildren);
router.post('/folders/:folder_id/reader', folders.createReader);
router.delete('/folders/:folder_id/reader', folders.deteleteReader);
router.get('/folders/resolve', folders.resolve);

router.get('/rooms/:room_id/messages', rooms.readMessages);
router.post('/rooms/:room_id/reader', rooms.createReader);
router.delete('/rooms/:room_id/reader', rooms.deleteReader);

router.get('/messages', search.messages);
router.get('/assets', search.assets);

module.exports = router;
