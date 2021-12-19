'use strict';
// 轮播图
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const date = new Date().getTime();

  const FocusSchema = new Schema({
    title: { type: String },
    type: { type: Number },
    focus_img: { type: String },
    link: { type: String },
    sort: { type: Number },
    status: { type: Number, default: 1 },
    add_time: {
      type: Number,
      default: date,
    },
  });
  return mongoose.model('Focus', FocusSchema, 'focus');
};
