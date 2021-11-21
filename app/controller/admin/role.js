'use strict';

const BaseController = require('./base.js');

class RoleController extends BaseController {
  async index() {
    const result = await this.ctx.model.Role.find({});
    await this.ctx.render('admin/role/index', { list: result });
  }
  async add() {
    await this.ctx.render('admin/role/add');
  }
  async edit() {
    const { id } = this.ctx.query;
    console.log('query:', this.ctx.query);
    const result = await this.ctx.model.Role.find({ _id: id });
    console.log('result:', result);
    await this.ctx.render('admin/role/edit', { role: result[0] });
  }
  async toAdd() {
    console.log('toAdd:', this.ctx.request.body);
    const { title, description } = this.ctx.request.body;
    const role = new this.ctx.model.Role({ title, description });
    await role.save();
    await this.success('/admin/role', '增加角色成功');
  }
  async toEdit() {
    console.log('toEdit:', this.ctx.request.body);
    const { title, description, id } = this.ctx.request.body;
    await this.ctx.model.Role.updateOne({ _id: id }, { title, description });
    await this.success('/admin/role', '角色修改成功');
  }
}

module.exports = RoleController;
