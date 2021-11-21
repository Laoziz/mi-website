'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
  async success(redirectUrl, message) {
    redirectUrl = redirectUrl || '/';
    await this.ctx.render('admin/public/success', {
      redirectUrl,
      message,
    });
  }
  async error(redirectUrl, message) {
    redirectUrl = redirectUrl || '/';
    await this.ctx.render('admin/public/error', {
      redirectUrl,
      message,
    });
  }
  async code() {
    console.log('verify');
    const captcha = await this.service.tools.captcha();
    this.ctx.response.type = 'image/svg+xml';
    this.ctx.body = captcha.data;/** 给页面返回一张图片*/
  }
  async delete() {
    console.log('delete', this.ctx.query);
    const { id, model } = this.ctx.query;
    await this.ctx.model[model].deleteOne({ _id: id });
    await this.success(this.ctx.state.prevPage, '删除成功');
  }
}

module.exports = BaseController;
