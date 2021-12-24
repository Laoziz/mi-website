'use strict';
// 文章分类
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const date = new Date();
  const ArticleCateSchema = new Schema({
    title: { type: String },
    cate_img: { type: String },
    link: { type: String },
    pid: { type: Schema.Types.Mixed }, // 混合类型
    sub_title: { type: String }, // seo相关的标题,关键词,描述
    keywords: { type: String },
    description: { type: String },
    status: { type: Number, default: 1 },
    sort: { type: Number, default: 100 },
    add_time: { type: Number, default: date },
  });

  return mongoose.model('ArticleCate', ArticleCateSchema, 'article_cate');
};
