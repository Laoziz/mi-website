'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
  async index() {
    console.time('start');
    await this.service.cache.set('username', 'tony');
    const username = await this.service.cache.get('username');
    console.log('username:', username);
    // 获取顶部导航的数据
    let topNavResult = await this.service.cache.get('index_topNav');
    if (!topNavResult) {
      topNavResult = await this.ctx.model.Nav.find({ position: '1' });
      this.service.cache.set('index_topNav', JSON.stringify(topNavResult));
    }
    topNavResult = JSON.parse(topNavResult);
    let focusResult = await this.service.cache.get('index_focus');
    if (!focusResult) {
      focusResult = await this.ctx.model.Focus.find({});
      this.service.cache.set('index_focus', JSON.stringify(focusResult));
    }
    focusResult = JSON.parse(focusResult);
    let goodsCateResult = await this.service.cache.get('index_goodsCate');
    if (!goodsCateResult) {
      goodsCateResult = await this.ctx.model.GoodsCate.aggregate([
        {
          $lookup: {
            from: 'goods_cate',
            localField: '_id',
            foreignField: 'pid',
            as: 'items',
          },
        },
        {
          $match: { pid: '0' },
        },
      ]);
      this.service.cache.set('index_goodsCate', JSON.stringify(goodsCateResult));
    }
    goodsCateResult = JSON.parse(goodsCateResult);
    let middleNavResult = await this.service.cache.get('index_middleNav');
    if (!middleNavResult) {
      middleNavResult = await this.ctx.model.Nav.find({ position: 2 });
      middleNavResult = JSON.parse(JSON.stringify(middleNavResult));

      for (let i = 0; i < middleNavResult.length; i++) {
        // 数据库查找relation对应的商品
        if (middleNavResult[i].relation) {
          try {
            const tempArr = middleNavResult[i].relation.replace(/，/g, ',').split(',');
            const tempRelationIds = [];
            tempArr.forEach(value => {
              tempRelationIds.push({
                _id: this.app.mongoose.Types.ObjectId(value),
              });
            });
            const relationGoods = await this.ctx.model.Goods.find({
              $or: tempRelationIds,
            }, 'title goods_img');
            middleNavResult[i].subGoods = relationGoods;
          } catch (err) {
            middleNavResult[i].subGoods = [];
          }
        } else {
          middleNavResult[i].subGoods = [];
        }
      }

      this.service.cache.set('index_middleNav', JSON.stringify(middleNavResult));
    }
    middleNavResult = JSON.parse(middleNavResult);
    // console.log('middleNavResult:', middleNavResult[0]);
    // return;
    // 手机
    let phoneResult = await this.service.cache.get('index_phone');
    if (!phoneResult) {
      phoneResult = await this.service.goods.get_category_recommend_goods('61ddc2447a2a710d58e67fb7', 'best', 8);
      this.service.cache.set('index_phone', JSON.stringify(phoneResult));
    }
    phoneResult = JSON.parse(phoneResult);
    // console.log('phoneResult:', phoneResult);
    let TVResult = await this.service.cache.get('index_TV');
    if (!TVResult) {
      TVResult = await this.service.goods.get_category_recommend_goods('61ddc2a37a2a710d58e67fc1', 'best', 8);
      this.service.cache.set('index_TV', JSON.stringify(TVResult));
    }
    TVResult = JSON.parse(TVResult);
    console.timeEnd('start');
    await this.ctx.render('default/index', {
      topNav: topNavResult,
      focus: focusResult,
      goodsCate: goodsCateResult,
      middleNav: middleNavResult,
      phone: phoneResult,
      TV: TVResult,
    });
  }
}

module.exports = IndexController;
