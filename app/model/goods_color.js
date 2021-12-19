'use strict';
// 商品颜色
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const GoodsColorSchema = new Schema({
    color_name: { type: String }, // 颜色名称
    color_value: { type: String }, // 颜色值
    status: { type: Number, default: 1 }, // 状态，默认1
  });

  return mongoose.model('GoodsColor', GoodsColorSchema, 'goods_color');
};
