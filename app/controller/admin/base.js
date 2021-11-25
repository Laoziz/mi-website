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
  async changeStatus() {
    console.log('changeStatus', this.ctx.request.query);
    const { attr, id, model } = this.ctx.request.query;
    const result = await this.ctx.model[model].find({ _id: id });
    if (result.length > 0) {
      const json = {};
      if (result[0][attr] === 1) {
        json[attr] = 0;
      } else {
        json[attr] = 1;
      }
      await this.ctx.model[model].updateOne({ _id: id }, json);
      this.ctx.body = { message: '更新成功', success: true };
    } else {
      this.ctx.body = { message: '更新失败,参数错误', success: false };
    }
  }
  async editNum() {
    console.log('editNum:', this.ctx.query);
    const { attr, id, model, num } = this.ctx.request.query;
    const result = await this.ctx.model[model].find({ _id: id });
    if (result.length > 0) {
      const json = {
        [attr]: num,
      };
      // 更新成功
      await this.ctx.model[model].updateOne({ _id: id }, json);
      this.ctx.body = { message: '更新成功', success: true };
    } else {
      // 更新失败
      this.ctx.body = { message: '更新失败', success: false };
    }
  }
}

module.exports = BaseController;
