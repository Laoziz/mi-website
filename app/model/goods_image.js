'use strict';
// 商品图片
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const date = new Date().getTime();

  const GoodsImageSchema = new Schema({
    goods_id: { type: Schema.Types.ObjectId }, // 商品id
    img_url: { type: String }, // 图片地址
    color_id: { type: Schema.Types.Mixed }, // 颜色id
    status: { type: Number, default: 1 }, // 状态，默认1
    add_time: { type: Number, default: date },
  });

  return mongoose.model('GoodsImage', GoodsImageSchema, 'goods_image');
};
