'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const date = new Date().getTime();
  const NavSchema = new Schema({
    title: { type: String }, // 标题
    link: { type: String }, // 链接地址
    position: {
      type: Number,
      default: 2, // 1最顶部 2中间 3底部
    },
    is_opennew: {
      type: Number,
      default: 1, // 1、本窗口 2、新窗口
    },
    sort: {
      type: Number,
      default: 100,
    },
    relation: { //  1,2,3
      type: String,
      default: '',
    },
    status: { type: Number, default: 1 },
    add_time: {
      type: Number,
      default: date,
    },
  });
  return mongoose.model('Nav', NavSchema, 'nav');
};
