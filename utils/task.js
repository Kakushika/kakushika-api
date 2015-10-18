'use strict';

const fs = require('fs'),
  config = require('config').azure.scheduler,
  schedulerManagement = require('azure-scheduler'),
  moment = require('moment');

const connect = (callback) => {
  fs.readFile(`${__dirname}/${config.subscriptionId}.pem`, 'utf8', (err, pem) => {
    if (err) {
      console.error(err);
      return;
    }
    let credentials = schedulerManagement.createCertificateCloudCredentials({
      subscriptionId: config.subscriptionId,
      pem: pem
    });
    let client = schedulerManagement.createSchedulerClient(config.cloudService, config.taskname, credentials, config.url);
    return callback(client);
  });
};

const task = {
  create: (user_id, room_id) => {
    connect((client) => {
      client.jobs.createOrUpdate(room_id, {
        startTime: new Date().toISOString(),
        action: {
          type: 'storageQueue',
          queueMessage: {
            storageAccountName: 'kksk',
            queueName: config.queuename,
            sasToken: config.sasToken,
            message: `{ "user": ${user_id}, "room": ${room_id}, "external": "slack" }`
          }
        },
        recurrence: config.recurrence
      }, (err, result) => {
        if (err) {
          console.error(err);
        }
        console.log(result);
      });
    });
  },
  list: (callback) => {
    connect((client) => {
      client.jobs.list({}, (err, result) => {
        callback(err, result);
      });
    });
  },
  deleteAll: (callback) => {
    connect((client) => {
      client.jobs.list({}, (err, result) => {
        if (err) {
          console.error(err);
        }
        if (!result.jobs.length) {
          return callback();
        }
        result.jobs.forEach((job, idx) => {
          client.jobs.deleteMethod(job.id, () => {
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
