'use strict';
const sd = require('silly-datetime');
module.exports = {
  formateTime(datetime) {
    return sd.format(new Date(datetime), 'YYYY-MM-DD HH:mm');
  },
};
