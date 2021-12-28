'use strict';

const BaseController = require('./base');
const fs = require('fs');
const pump = require('mz-modules/pump');
class GoodsController extends BaseController {
  async index() {
    const page = this.ctx.request.query.page || 1;
    const keyword = this.ctx.request.query.keyword;
    let json = {};
    if (keyword) {
      json = Object.assign({ title: { $regex: new RegExp(keyword) } });
    }
    console.log('page:', this.ctx.request.query);
    const pageSize = 3;
    const totalNum = await this.ctx.model.Goods.find(json).count();
    const goodsResult = await this.ctx.model.Goods.find(json).skip((page - 1) * pageSize).limit(pageSize);
    await this.ctx.render('admin/goods/index', {
      list: goodsResult,
      totalPages: Math.ceil(totalNum / pageSize),
      page,
      keyword,
    });
  }
  async add() {
    const colorResult = await this.ctx.model.GoodsColor.find({});
    const goodsType = await this.ctx.model.GoodsType.find({});
    const goodsCate = await this.ctx.model.GoodsCate.aggregate([
      {
        $lookup: {
          from: 'good_cate',
          localField: '_id',
          foreignField: 'pid',
          as: 'items',
        },
      },
      {
        $match: {
          pid: '0',
        },
      },
    ]);

    await this.ctx.render('admin/goods/add', {
      colorResult,
      goodsType,
      goodsCate,
    });
  }
  async edit() {
    const { id } = this.ctx.request.query;
    const goodsResult = await this.ctx.model.Goods.find({ _id: id });
    console.log('goods edit:', goodsResult);
    const colorResult = await this.ctx.model.GoodsColor.find({});
    const goodsType = await this.ctx.model.GoodsType.find({});
    const goodsCate = await this.ctx.model.GoodsCate.aggregate([
      {
        $lookup: {
          from: 'good_cate',
          localField: '_id',
          foreignField: 'pid',
          as: 'items',
        },
      },
      {
        $match: {
          pid: '0',
        },
      },
    ]);
    const goodsAttrResult = await this.ctx.model.GoodsAttr.find({ goods_id: goodsResult[0]._id });
    console.log('goodsAttrResult', goodsAttrResult);
    let goodsAttrStr = '';
    goodsAttrResult.forEach(async val => {
      if (val.attribute_type == 1) {
        goodsAttrStr += `<li><span>${val.attribute_title}: </span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />  <input type="text" name="attr_value_list"  value="${val.attribute_value}" /></li>`;
      } else if (val.attribute_type == 2) {
        goodsAttrStr += `<li><span>${val.attribute_title}: </span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />  <textarea cols="50" rows="3" name="attr_value_list">${val.attribute_value}</textarea></li>`;
      } else {
        // 获取 attr_value  获取可选值列表
        const oneGoodsTypeAttributeResult = await this.ctx.model.GoodsTypeAttribute.find({
          _id: val.attribute_id,
        });
        console.log('oneGoodsTypeAttributeResult', oneGoodsTypeAttributeResult);
        if (oneGoodsTypeAttributeResult) {
          const arr = oneGoodsTypeAttributeResult[0].attr_value.split('\r\n');
          console.log('arr', arr, val.attribute_value, val.attribute_title);
          goodsAttrStr += `<li><span>${val.attribute_title}: </span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />`;
  
          goodsAttrStr += '<select name="attr_value_list">';
          for (let j = 0; j < arr.length; j++) {
            if (arr[j].trim() == val.attribute_value.trim()) {
              goodsAttrStr += `<option value="${arr[j]}" selected >${arr[j]}</option>`;
            } else {
              goodsAttrStr += `<option value="${arr[j]}" >${arr[j]}</option>`;
            }
          }
          goodsAttrStr += '</select>';
          goodsAttrStr += '</li>';
        }
      }
    });
    const goodsImageResult = await this.ctx.model.GoodsImage.find({ goods_id: goodsResult[0]._id });
    console.log('goodsImageResult', goodsImageResult);
    let colorTempArr = [];
    if (goodsResult[0].goods_color) {
      colorTempArr = goodsResult[0].goods_color.split(',');
    }

    const goodsColorArr = [];
    colorTempArr.forEach(item => {
      goodsColorArr.push({ _id: item });
    });
    const goodsColorResult = goodsColorArr.length > 0 ? await this.ctx.model.GoodsColor.find({ $or: goodsColorArr }) : [];
    await this.ctx.render('admin/goods/edit', {
      colorResult,
      goodsType,
      goodsCate,
      goods: goodsResult[0],
      goodsAttr: goodsAttrStr,
      goodsImage: goodsImageResult,
      goodsColor: goodsColorResult,
      prevPage: this.ctx.state.prevPage,
    });
  }
  async toAdd() {
    console.log('toAdd:');
    // 实现图片上传
    const parts = this.ctx.multipart({ autoFields: true });
    let files = {};
    let stream;
    while ((stream = await parts()) != null) {
      if (!stream.filename) {
        break;
      }
      const fieldname = stream.fieldname;// file表单的名字

      // 上传图片的目录
      const dir = await this.service.tools.getUploadFile(stream.filename);
      const target = dir.uploadDir;
      const writeStream = fs.createWriteStream(target);

      await pump(stream, writeStream);

      files = Object.assign(files, {
        [fieldname]: dir.saveDir,
      });
    }
    const fieldGoods = Object.assign(files, parts.field);
    console.log('toAdd:', fieldGoods);
    fieldGoods.goods_color = fieldGoods.goods_color ? fieldGoods.goods_color.toString() : '';
    const goods = new this.ctx.model.Goods(fieldGoods);
    const goodsResult = await goods.save();
    console.log('add goods result:', goodsResult);
    // 图片的地址转化成 {link: 'path/to/image.jpg'}
    if (goodsResult._id) {
      console.log('add goods success:', goodsResult._id);
      let goods_image_list = fieldGoods.goods_image_list;
      console.log('goods_image_list:', goods_image_list);
      if (goods_image_list) {
        if (typeof goods_image_list === 'string') {
          goods_image_list = new Array(goods_image_list);
        }
        for (let i = 0; i < goods_image_list.length; i++) {
          const image = goods_image_list[i];
          const goodsImage = new this.ctx.model.GoodsImage({
            goods_id: goodsResult._id,
            img_url: image,
          });
          const result = await goodsImage.save();
          console.log('result image', result);
        }
      }
      let attr_value_list = fieldGoods.attr_value_list;
      let attr_id_list = fieldGoods.attr_id_list;
      if (attr_id_list && attr_value_list) {
        // 解决只有一个属性的时候存在的bug
        if (typeof attr_id_list === 'string') {
          attr_id_list = new Array(attr_id_list);
          attr_value_list = new Array(attr_value_list);
        }
        for (let i = 0; i < attr_value_list.length; i++) {
          const goodsTypeAttributeResult = await this.ctx.model.GoodsTypeAttribute.find({ _id: attr_id_list[i] });
          const goodsAttrResult = this.ctx.model.GoodsAttr({
            goods_id: goodsResult._id,
            cate_id: fieldGoods.cate_id,
            attribute_id: attr_id_list[i],
            attribute_type: goodsTypeAttributeResult[0].attr_type,
            attribute_title: goodsTypeAttributeResult[0].title,
            attribute_value: attr_value_list[i],
          });
          const result = await goodsAttrResult.save();
          console.log('result attr', result);
        }
      }
    }
    await this.success('/admin/goods', '增加商品数据成功');
  }
  async toEdit() {
    // 实现图片上传
    const parts = this.ctx.multipart({ autoFields: true });
    let files = {};
    let stream;
    while ((stream = await parts()) != null) {
      if (!stream.filename) {
        break;
      }
      const fieldname = stream.fieldname;// file表单的名字

      // 上传图片的目录
      const dir = await this.service.tools.getUploadFile(stream.filename);
      const target = dir.uploadDir;
      const writeStream = fs.createWriteStream(target);

      await pump(stream, writeStream);

      files = Object.assign(files, {
        [fieldname]: dir.saveDir,
      });
    }
    const fieldGoods = Object.assign(files, parts.field);
    const { id, prevPage } = fieldGoods;
    console.log('toEdit:', fieldGoods);
    fieldGoods.goods_color = fieldGoods.goods_color.toString();
    const result = await this.ctx.model.Goods.updateOne({ _id: id }, fieldGoods);
    console.log('result', result);
    // 图片的地址转化成 {link: 'path/to/image.jpg'}
    let goods_image_list = fieldGoods.goods_image_list;
    console.log('goods_image_list:', goods_image_list);
    if (goods_image_list) {
      if (typeof goods_image_list === 'string') {
        goods_image_list = new Array(goods_image_list);
      }
      for (let i = 0; i < goods_image_list.length; i++) {
        const image = goods_image_list[i];
        const goodsImage = new this.ctx.model.GoodsImage({
          goods_id: id,
          img_url: image,
        });
        const result = await goodsImage.save();
        console.log('result image', result);
      }
    }
    // 1、删除以前的类型数据
    await this.ctx.model.GoodsAttr.deleteMany({ goods_id: id });
    let attr_value_list = fieldGoods.attr_value_list;
    let attr_id_list = fieldGoods.attr_id_list;
    if (attr_id_list && attr_value_list) {
      // 解决只有一个属性的时候存在的bug
      if (typeof attr_id_list === 'string') {
        attr_id_list = new Array(attr_id_list);
        attr_value_list = new Array(attr_value_list);
      }
      for (let i = 0; i < attr_value_list.length; i++) {
        const goodsTypeAttributeResult = await this.ctx.model.GoodsTypeAttribute.find({ _id: attr_id_list[i] });
        const goodsAttrResult = this.ctx.model.GoodsAttr({
          goods_id: id,
          cate_id: fieldGoods.cate_id,
          attribute_id: attr_id_list[i],
          attribute_type: goodsTypeAttributeResult[0].attr_type,
          attribute_title: goodsTypeAttributeResult[0].title,
          attribute_value: attr_value_list[i],
        });
        const result = await goodsAttrResult.save();
        console.log('result attr', result);
      }
    }
    await this.success(prevPage || '/admin/goods', '修改商品数据成功');
  }
  // 获取商品类型的属性 api接口
  async goodsTypeAttribute() {
    const cate_id = this.ctx.request.query.cate_id;
    // 注意 await
    const goodsTypeAttribute = await this.ctx.model.GoodsTypeAttribute.find({ cate_id });
    console.log(goodsTypeAttribute);
    this.ctx.body = {
      result: goodsTypeAttribute,
    };
  }
  async goodsUploadImage() {
    console.log('goodsUploadImage');
    // 实现图片上传
    const parts = this.ctx.multipart({ autoFields: true });
    let files = {};
    let stream;
    while ((stream = await parts()) != null) {
      if (!stream.filename) {
        break;
      }
      const fieldname = stream.fieldname;// file表单的名字

      // 上传图片的目录
      const dir = await this.service.tools.getUploadFile(stream.filename);
      const target = dir.uploadDir;
      const writeStream = fs.createWriteStream(target);

      await pump(stream, writeStream);

      files = Object.assign(files, {
        [fieldname]: dir.saveDir,
      });
    }
    console.log(files);
    // 图片的地址转化成 {link: 'path/to/image.jpg'}

    this.ctx.body = { link: files.file };
  }
  async goodsUploadPhoto() {
    console.log('goodsUploadPhoto');
    // 实现图片上传
    const parts = this.ctx.multipart({ autoFields: true });
    console.log('parts:', parts);
    let files = {};
    let stream;
    while ((stream = await parts()) != null) {
      if (!stream.filename) {
        break;
      }
      const fieldname = stream.fieldname;// file表单的名字

      // 上传图片的目录
      const dir = await this.service.tools.getUploadFile(stream.filename);
      const target = dir.uploadDir;
      const writeStream = fs.createWriteStream(target);

      await pump(stream, writeStream);

      files = Object.assign(files, {
        [fieldname]: dir.saveDir,
      });
      // 生成缩略图
      this.service.tools.jimpImg(target);
    }
    console.log(files);
    // 图片的地址转化成 {link: 'path/to/image.jpg'}

    this.ctx.body = { link: files.file };
  }
  // 图片颜色更新
  async changeGoodsImageColor() {
    let { color_id, goods_image_id } = this.ctx.request.body;
    console.log('changeGoodsImageColor:', this.ctx.request.body);
    if (color_id) {
      color_id = this.app.mongoose.Types.ObjectId(color_id);
    }
    const result = await this.ctx.model.GoodsImage.updateOne({ _id: goods_image_id }, {
      color_id,
    });
    if (result) {
      this.ctx.body = { success: 'true', message: '更新数据成功' };
    } else {
      this.ctx.body = { success: 'false', message: '更新数据失败' };
    }
  }
  // 图片删除
  async goodsImageRemove() {
    const { goods_image_id } = this.ctx.request.body;
    const result = await this.ctx.model.GoodsImage.deleteOne({ _id: goods_image_id });
    if (result) {
      this.ctx.body = { success: true, message: '删除数据成功' };
    } else {
      this.ctx.body = { success: false, message: '删除数据失败' };
    }
  }
}

module.exports = GoodsController;
