'use strict';
const BaseController = require('./base.js');

class AccessController extends BaseController {
  async index() {
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

    console.log('result:', result);
    await this.ctx.render('admin/access/index', {
      list: result,
    });
  }
  async add() {
    const result = await this.ctx.model.Access.find({ module_id: '0' });
    console.log('add:', result);
    await this.ctx.render('admin/access/add', { moduleList: result });
  }
  async toAdd() {
    console.log('toAdd:', this.ctx.request.body);
    const { module_id } = this.ctx.request.body;
    this.ctx.request.body.description = this.ctx.request.body.description.trim();
    console.log('toAdd1:', this.ctx.request.body);
    if (module_id !== '0') {
      this.ctx.request.body.module_id = this.app.mongoose.Types.ObjectId(module_id);
    }
    const access = new this.ctx.model.Access(this.ctx.request.body);
    await access.save();
    await this.success('/admin/access', '添加模块成功');
  }
  async edit() {
    console.log('edit:', this.ctx.query);
    const result = await this.ctx.model.Access.find({ _id: this.ctx.query.id });
    const moduleList = await this.ctx.model.Access.find({ module_id: '0' });
    await this.ctx.render('admin/access/edit', { module: result[0], moduleList });
  }
  async toEdit() {
    console.log('toEdit:', this.ctx.request.body);
    const { module_id, id } = this.ctx.request.body;
    this.ctx.request.body.description = this.ctx.request.body.description.trim();
    if (module_id !== '0') {
      this.ctx.request.body.module_id = this.app.mongoose.Types.ObjectId(module_id);
    }
    await this.ctx.model.Access.updateOne({ _id: id }, this.ctx.request.body);
    await this.success('/admin/access', '修改角色成功');
  }
}

module.exports = AccessController;
