'use strict';

var date = {};

date.ISODateString = function(d) {
  function pad(n) {
    return n < 10 ? '0' + n : n;
  }
  return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds()) + 'Z';
};

date.getTimeStamp = function() {
  var d = new Date();
  return this.ISODateString(d);
};

module.exports = date;
