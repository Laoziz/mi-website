'use strict';

const Service = require('egg').Service;

class GoodsService extends Service {
  async get_category_recommend_goods(cate_id, type, limit) {
    try {
      let cateIdsResult = await this.ctx.model.GoodsCate.find({
        pid: this.app.mongoose.Types.ObjectId(cate_id),
      }, '_id');
      if (cateIdsResult.length === 0) {
        cateIdsResult = [{ _id: cate_id }];
      }
      const cateIdsArr = [];
      cateIdsResult.forEach(value => {
        cateIdsArr.push({ cate_id: value._id });
      });
      let findJson = {
        $or: cateIdsArr,
      };

      // 判断类型，合并对象
      switch (type) {
        case 'hot':
          findJson = Object.assign(findJson, { is_hot: 1 });
          break;
        case 'best':
          findJson = Object.assign(findJson, { is_best: 1 });
          break;
        case 'new':
          findJson = Object.assign(findJson, { is_new: 1 });
          break;
        default:
          findJson = Object.assign(findJson, { is_hot: 1 });
          break;
      }
      const limitsize = limit || 10;
      return await this.ctx.model.Goods.find(findJson, 'title shop_price goods_img sub_title').limit(limitsize);
    } catch (err) {
      console.log(err);
      return [];
    }
  }
}

module.exports = GoodsService;
