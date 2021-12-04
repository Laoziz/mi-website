'use strict';

const BaseController = require('./base');

class GoodsController extends BaseController {
  async index() {
    await this.ctx.render('admin/goods/index');
  }
  async add() {
    const colorResult = await this.ctx.model.GoodsColor.find({});
    const goodsType = await this.ctx.model.GoodsType.find({});

    await this.ctx.render('admin/goods/add', {
      colorResult,
      goodsType,
    });
  }
  async edit() {
    await this.ctx.render('admin/goods/index');
  }
  async toAdd() {
    console.log('toAdd:', this.ctx.request.body);
    await this.ctx.render('admin/goods/index');
  }
  async toEdit() {
    await this.ctx.render('admin/goods/index');
  }
  // 获取商品类型的属性 api接口
  async goodsTypeAttribute() {
    const cate_id = this.ctx.request.query.cate_id;
    // 注意 await
    const goodsTypeAttribute = await this.ctx.model.GoodsTypeAttribute.find({ cate_id });
    console.log(goodsTypeAttribute);
    this.ctx.body = {
      result: goodsTypeAttribute,
    };
  }
}

module.exports = GoodsController;
