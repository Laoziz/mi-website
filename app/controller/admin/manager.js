'use strict';

const BaseController = require('./base.js');

class ManagerController extends BaseController {
  async index() {
    const result = await this.ctx.model.Admin.aggregate([
      {
        $lookup: {
          from: 'role',
          localField: 'role_id',
          foreignField: '_id',
          as: 'role',
        },
      },
    ]);

    console.log('index:', result);
    await this.ctx.render('admin/manager/index', {
      list: result,
    });
  }
  async add() {
    const roleResult = await this.ctx.model.Role.find({});
    await this.ctx.render('admin/manager/add', { roleList: roleResult });
  }
  async toAdd() {
    const { username, password } = this.ctx.request.body;
    if (!username || !password) {
      await this.error('/admin/manager/add', '用户名密码为空');
      return;
    }
    console.log('toAdd:', this.ctx.request.body);
    this.ctx.request.body.password = await this.ctx.service.tools.md5(password);
    const result = await this.ctx.model.Admin.find({ username });
    if (result.length > 0) {
      await this.error('/admin/manager/add', '管理员已存在');
    } else {
      console.log('toAdd:', { ...this.ctx.request.body });
      const admin = new this.ctx.model.Admin({ ...this.ctx.request.body });
      await admin.save();
      await this.ctx.redirect('/admin/manager/');
    }
  }
  async edit() {
    console.log('edit:', this.ctx.query);
    const { id } = this.ctx.query;
    const roleResult = await this.ctx.model.Role.find({});
    const userResult = await this.ctx.model.Admin.find({ _id: id });
    console.log('user:', userResult);
    await this.ctx.render('admin/manager/edit', {
      roleList: roleResult,
      user: userResult[0],
    });
  }
  async toEdit() {
    console.log('toEdit:', this.ctx.request.body);
    const { id, password, mobile, email, role_id } = this.ctx.request.body;
    const adminResult = await this.ctx.model.Admin.find({ _id: id });
    
    if (password) {
      this.ctx.request.body.password = await this.ctx.service.tools.md5(password);
      await this.ctx.model.Admin.updateOne({ _id: id }, {
        password: this.ctx.request.body.password,
        mobile,
        email,
        role_id,
      });
    } else {
      await this.ctx.model.Admin.updateOne({ _id: id }, {
        mobile,
        email,
        role_id,
      });
    }

    await this.success('/admin/manager', '管理员修改成功');
  }
}

module.exports = ManagerController;
