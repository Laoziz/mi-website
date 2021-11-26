'use strict';
const BaseController = require('./base');

class GoodsTypeController extends BaseController {
  async index() {
    const result = await this.ctx.model.GoodsType.find({});
    await this.ctx.render('/admin/goodsType/index', {
      list: result,
    });
  }
  async add() {
    await this.ctx.render('/admin/goodsType/add');
  }
  async toAdd() {
    console.log('toAdd:', this.ctx.request.body);
    this.ctx.request.body.description = this.ctx.request.body.description.trim();
    const goodsTypes = new this.ctx.model.GoodsType(this.ctx.request.body);
    await goodsTypes.save();
    await this.success('/admin/goodsType/', '添加商品成功');
  }
  async edit() {
    console.log('edit:', this.ctx.request.query);
    const { id } = this.ctx.request.query;
    const result = await this.ctx.model.GoodsType.find({ _id: id });
    console.log('result:', result);
    await this.ctx.render('/admin/goodsType/edit', { list: result[0] });
  }
  async toEdit() {
    console.log('toEdit:', this.ctx.request.body);
    const { id, title } = this.ctx.request.body;
    const description = this.ctx.request.body.description.trim();
    await this.ctx.model.GoodsType.updateOne({ _id: id }, {
      title,
      description,
    });
    await this.success('/admin/goodsType/', '商品更新成功');
  }
}

module.exports = GoodsTypeController;
