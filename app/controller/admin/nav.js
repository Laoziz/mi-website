'use strict';

const BaseController = require('./base');

class NavController extends BaseController {
  async index() {
    const page = this.ctx.request.query.page || 1;
    const pageSize = 5;
    const totalNum = await this.ctx.model.Nav.find({}).count();
    const Result = await this.ctx.model.Nav.find({}).skip((page - 1) * pageSize).limit(pageSize);
    await this.ctx.render('/admin/nav/index', {
      list: Result,
      totalPages: Math.ceil(totalNum / pageSize),
      page,
    });
  }
  async add() {
    await this.ctx.render('/admin/nav/add');
  }
  async edit() {
    const { id } = this.ctx.query;
    const result = await this.ctx.model.Nav.find({ _id: id });
    await this.ctx.render('admin/nav/edit', {
      list: result[0],
      prevPage: this.ctx.state.prevPage,
    });
  }
  async toAdd() {
    const nav = new this.ctx.model.Nav(this.ctx.request.body);
    await nav.save(); // 注意
    await this.success('/admin/nav', '增加导航成功');
  }
  async toEdit() {
    const { id, prevPage } = this.ctx.request.body;
    await this.ctx.model.Nav.updateOne({ _id: id }, this.ctx.request.body);
    await this.success(prevPage || '/admin/nav', '编辑导航成功');
  }
}

module.exports = NavController;
