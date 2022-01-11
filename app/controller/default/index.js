'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
  async index() {
    // 获取顶部导航的数据
    const topNavResult = await this.ctx.model.Nav.find({ position: '1' });
    const focusResult = await this.ctx.model.Focus.find({});
    const goodsCateResult = await this.ctx.model.GoodsCate.aggregate([
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
    // console.log('topNav:', topNavResult);
    // console.log('focus:', focusResult);
    // console.log('goodsCate:', goodsCateResult);
    await this.ctx.render('default/index', {
      topNav: topNavResult,
      focus: focusResult,
      goodsCate: goodsCateResult,
    });
  }
}

module.exports = IndexController;
