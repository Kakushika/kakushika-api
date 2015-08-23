'use strict';

var db = require('./models'),
  task = require('./utils/task');

db.sequelize.sync({
  force: true
}).then(function() {
  console.log('success');
  task.deleteAll(function() {
    process.exit();
  });
}).catch(function(err) {
  console.error(err);
});
