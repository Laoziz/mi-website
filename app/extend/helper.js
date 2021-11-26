'use strict';
const sd = require('silly-datetime');
module.exports = {
  formatTime(datetime) {
    return sd.format(new Date(datetime), 'YYYY-MM-DD HH:mm');
  },
};
