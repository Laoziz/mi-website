'use strict';
const svgCapcha = require('svg-captcha');
const md5 = require('md5');
const Service = require('egg').Service;

class ToolsService extends Service {
  // 生成验证码
  async captcha() {
    const captcha = svgCapcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 40,
      background: '#cc9966',
    });
    this.ctx.session.code = captcha.text; /** 验证码上的信息 */
    console.log('code:', captcha.text);
    return captcha;
  }
  async md5(code) {
    return md5(code);
  }
}

module.exports = ToolsService;
