'use strict';
const BaseController = require('./base.js');

class GoodsTypeAttributeController extends BaseController {
  async index() {
    const cate_id = this.ctx.request.query.id;

    const goodsType = await this.ctx.model.GoodsType.find({ _id: cate_id });
    const result = await this.ctx.model.GoodsTypeAttribute.aggregate([
      {
        $lookup: {
          from: 'goods_type',
          localField: 'cate_id',
          foreignField: '_id',
          as: 'goods_type',
        },
      },
      {
        $match: { // cate_id字符串
          cate_id: this.app.mongoose.Types.ObjectId(cate_id),// 注意
        },
      },
    ]);
    await this.ctx.render('/admin/goodsTypeAttribute/index', {
      list: result,
      cate_id,
      goodsType: goodsType[0],
    });
  }
  async add() {
    // 获取类型数据
    const cate_id = this.ctx.request.query.id;
    const goodsTypes = await this.ctx.model.GoodsType.find({});
    await this.ctx.render('admin/goodsTypeAttribute/add', {
      cate_id,
      goodsTypes,
    });
  }
  async edit() {
    const id = this.ctx.query.id;
    const result = await this.ctx.model.GoodsTypeAttribute.find({ _id: id });
    const goodsTypes = await this.ctx.model.GoodsType.find({});
    await this.ctx.render('admin/goodsTypeAttribute/edit', {
      list: result[0],
      goodsTypes,
    });
  }
  async toAdd() {
    console.log('toAdd:', this.ctx.request.body);
    const result = new this.ctx.model.GoodsTypeAttribute(this.ctx.request.body);
    await result.save();// 注意
    await this.success('/admin/goodsTypeAttribute?id=' + this.ctx.request.body.cate_id, '增加商品类型属性成功');
  }
  async toEdit() {
    console.log('toEdit:', this.ctx.request.body);
    const id = this.ctx.request.body.id;
    await this.ctx.model.GoodsTypeAttribute.updateOne({ _id: id }, this.ctx.request.body);
    await this.success('/admin/goodsTypeAttribute?id=' + this.ctx.request.body.cate_id, '修改商品类型属性成功');
  }
}

module.exports = GoodsTypeAttributeController;
