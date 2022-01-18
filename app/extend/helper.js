'use strict';
const sd = require('silly-datetime');
const path = require('path');
module.exports = {
  formatTime(datetime) {
    return sd.format(new Date(datetime), 'YYYY-MM-DD HH:mm');
  },
  formatImg(dir, width, height) {
    height = height || width;
    return dir + '_' + width + 'x' + height + path.extname(dir);
  },
};
