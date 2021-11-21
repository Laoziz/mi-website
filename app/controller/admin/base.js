'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
  async success(redirectUrl) {
    redirectUrl = redirectUrl || '/';
    await this.ctx.render('admin/public/success', {
      redirectUrl,
    });
  }
  async error(redirectUrl) {
    redirectUrl = redirectUrl || '/';
    await this.ctx.render('admin/public/error', {
      redirectUrl,
    });
  }
  async code() {
    console.log('verify');
    const captcha = await this.service.tools.captcha();
    this.ctx.response.type = 'image/svg+xml';
    this.ctx.body = captcha.data;/** 给页面返回一张图片*/
  }
}

module.exports = BaseController;
