'use strict';

var fs = require('fs'),
  config = require('config').azure.scheduler,
  schedulerManagement = require('azure-scheduler'),
  date = require('./date');

var connect = function(callback) {
  fs.readFile(__dirname + '/' + config.subscriptionId + '.pem', 'utf8', function(err, pem) {
    if (err) {
      console.error(err);
      return;
    }
    var credentials = schedulerManagement.createCertificateCloudCredentials({
      subscriptionId: config.subscriptionId,
      pem: pem
    });
    var client = schedulerManagement.createSchedulerClient(config.cloudService, config.taskname, credentials, config.url);
    return callback(client);
  });
};

var task = {
  create: function(user_id, room_id) {
    connect(function(client) {
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
        recurrence: config.recurrence
      }, function(err, result) {
        if (err) {
          console.error(err);
        }
        console.log(result);
      });
    });
  },
  list: function(callback) {
    connect(function(client) {
      client.jobs.list({}, function(err, result) {
        callback(err, result);
      });
    });
  },
  deleteAll: function(callback) {
    connect(function(client) {
      client.jobs.list({}, function(err, result) {
        if (err) {
          console.error(err);
        }
        result.jobs.forEach(function(job, idx) {
          client.jobs.deleteMethod(job.id, function() {
            if (idx === result.length) {
              callback();
            }
          });
        });
      });
    });
  }
};

module.exports = task;
