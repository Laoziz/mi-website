'use strict';
// 商品表
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const date = new Date().getTime();

  const GoodsSchema = new Schema({
    title: { type: String, default: '' }, // 标题
    sub_title: { type: String, default: '' }, // 附属标题
    goods_sn: { type: String, default: '' }, // 商品版本
    cate_id: { type: Schema.Types.ObjectId }, //  分类id
    click_count: { type: Number, default: 100 }, //  点击次数
    goods_number: { type: Number, default: 1000 }, // 商品数量
    shop_price: { type: Number, default: 0 }, // 展示价格
    market_price: { type: Number, default: 0 }, // 原价
    relation_goods: { type: String, default: '' }, // 相关商品
    goods_attrs: { type: String, default: '' }, // 商品属性
    goods_version: { type: String, default: '' }, // 商品版本号
    goods_img: { type: String, default: '' }, // 商品图片
    goods_gift: { type: String, default: '' }, // 关联赠品
    goods_fitting: { type: String, default: '' }, // 关联配件
    goods_color: { type: String, default: '' }, // 商品颜色
    goods_keywords: { type: String, default: '' }, // 关键字
    goods_desc: { type: String, default: '' }, // 商品描述
    goods_content: { type: String, default: '' }, // 商品内容
    sort: { type: Number, default: 100 }, // 排序
    is_delete: { type: Number }, // 是否删除
    is_hot: { type: Number, default: 0 }, // 热销
    is_best: { type: Number, default: 0 }, // 精品
    is_new: { type: Number, default: 0 }, // 最新
    goods_type_id: { type: Schema.Types.Mixed }, // 商品类型id
    status: { type: Number, default: 1 }, // 商品状态
    add_time: { type: Number, default: date }, // 添加时间
  });

  return new mongoose.model('Goods', GoodsSchema, 'goods');
};
