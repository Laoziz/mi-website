/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1636273229252_8008';
  // 默认上传路径
  config.uploadDir = 'app/public/admin/upload';
  // add your middleware config here
  config.middleware = [ 'adminauth' ];
  config.adminauth = {
    match: '/admin',
  };

  config.view = {
    mapping: {
      '.html': 'ejs',
    },
  };

  config.session = {
    key: 'SESSION_ID',
    maxAge: 864000,
    httpOnly: true,
    encrypt: true,
    renew: true, //  延长会话有效期
  };
  exports.mongoose = {
    url: 'mongodb://127.0.0.1/miproject',
    options: {},
  };
  // 配置表单数量
  exports.multipart = {
    fields: '50',
  };
  return config;
};
