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
    const { title } = this.ctx.request.body;
    const description = this.ctx.request.body.description.trim();
    const role = new this.ctx.model.Role({ title, description });
    await role.save();
    await this.success('/admin/role', '增加角色成功');
  }
  async toEdit() {
    console.log('toEdit:', this.ctx.request.body);
    const { title, id } = this.ctx.request.body;
    const description = this.ctx.request.body.description.trim();
    await this.ctx.model.Role.updateOne({ _id: id }, { title, description });
    await this.success('/admin/role', '角色修改成功');
  }
  async auth() {
    const { id } = this.ctx.request.query;
    const result = await this.ctx.model.Access.aggregate([
      {
        $lookup: {
          from: 'access',
          localField: '_id',
          foreignField: 'module_id',
          as: 'items',
        },
      },
      {
        $match: {
          module_id: '0',
        },
      },
    ]);
    // console.log('result:', result);
    const roleAccessResult = await this.ctx.model.RoleAccess.find({ role_id: id });
    const roleAccessList = roleAccessResult.map(item => item.access_id.toString());
    console.log('RoleAccess', roleAccessList);
    result.forEach(item => {
      if (roleAccessList.indexOf((item._id.toString())) !== -1) {
        console.log('item._id:', item._id, true);
        item.checked = true;
      }
      item.items.forEach(item2 => {
        if (roleAccessList.indexOf(item2._id.toString()) !== -1) {
          console.log('item2._id:', item2._id, true);
          item2.checked = true;
        }
      });
    });
    // console.log('result2:', result);
    await this.ctx.render('/admin/role/auth', {
      list: result,
      role_id: id,
    });
  }
  async toAuth() {
    console.log('toAuth:', this.ctx.request.body);
    const { access_node, role_id } = await this.ctx.request.body;
    await this.ctx.model.RoleAccess.deleteMany({ role_id });
    if (access_node) {
      access_node.forEach(item => {
        const model = new this.ctx.model.RoleAccess({
          role_id,
          access_id: item,
        });
        model.save();
      });
    }

    await this.success('/admin/role', '角色授权成功');
  }
}

module.exports = RoleController;
