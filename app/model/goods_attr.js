'use strict';
// 商品属性
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const date = new Date().getTime();

  const GoodsAttrSchema = new Schema({
    goods_id: { type: Schema.Types.ObjectId },
    cate_id: { type: Schema.Types.ObjectId },
    attribute_id: { type: Schema.Types.ObjectId },
    attribute_type: { type: String },
    attribute_title: { type: String },
    attribute_value: { type: String },
    status: { type: Number, default: 1 },
    add_time: { type: Number, default: date },
  });

  return mongoose.model('GoodsAttr', GoodsAttrSchema, 'goods_attr');
};
