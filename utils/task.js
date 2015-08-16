'use strict';

var fs = require('fs'),
  config = require('config').azure.scheduler,
  schedulerManagement = require('azure-scheduler'),
  date = require('./date');

module.exports = function(user_id, room_id) {
  fs.readFile(config.subscriptionId + '.pem', 'utf8', function(err, pem) {
    if (err) {
      console.error(err);
      return;
    }
    var credentials = schedulerManagement.createCertificateCloudCredentials({
      subscriptionId: config.subscriptionId,
      pem: pem
    });
    var client = schedulerManagement.createSchedulerClient(config.cloudService, config.taskname, credentials, config.url);

    client.jobs.createOrUpdate(room_id, {
      startTime: date.getTimeStamp(),
      action: {
        type: 'storageQueue',
        queueMessage: {
          storageAccountName: 'kksk',
          queueName: 'task',
          sasToken: config.sasToken,
          message: '{ "user": ' + user_id + ', "room": ' + room_id + ', "external": "slack" }'
        }
      },
      recurrence: {
        frequency: 'minute',
        interval: '1',
      }
    }, function(err, result) {
      if (err) {
        console.error(err);
      }
      console.log(result);
    });
  });
};
