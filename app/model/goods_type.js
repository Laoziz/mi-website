'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const data = new Date().getTime();
  const GoodsTypesSchema = new Schema({
    title: { type: String },
    description: { type: String },
    status: { type: String, default: 1 },
    add_time: {
      type: Number,
      default: data,
    },
  });
  return mongoose.model('GoodsType', GoodsTypesSchema, 'goods_type');
};
