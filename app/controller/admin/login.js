'use strict';

const BaseController = require('./base.js');

class LoginController extends BaseController {
  async index() {
    await this.ctx.render('admin/login');
  }
  async doLogin() {
    console.log(this.ctx.request.body);
    const { username, password, code } = this.ctx.request.body;
    if (!username || !password || !code) {
      await this.error('/admin/login', '用户名,密码,验证码为空');
      return;
    }
    const passWord = await this.ctx.service.tools.md5(password);
    // 检测验证码
    if (this.ctx.session.code.toUpperCase() === code.toUpperCase()) {
      const result = await this.ctx.model.Admin.find({ username, password: passWord });
      if (result.length > 0) {
        this.ctx.session.userinfo = result[0];
        console.log('this.ctx.session.userinfo:', this.ctx.session.userinfo);
        await this.ctx.redirect('/admin/manager');
      } else {
        await this.error('/admin/login', '用户名或者密码不对');
      }
    } else {
      await this.error('/admin/login', '验证码不对');
    }
    await this.ctx.redirect('/admin');
  }

  async loginOut() {
    console.log('loginOut');
    this.ctx.session.userinfo = null;
    this.ctx.redirect('/admin/login');
  }
}

module.exports = LoginController;
