'use strict';
const BaseController = require('./base.js');
const fs = require('fs');
const pump = require('mz-modules/pump');
class GoodsCateController extends BaseController {
  async index() {
    const result = await this.ctx.model.GoodsCate.aggregate([
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
    await this.ctx.render('admin/goodsCate/index', { list: result });
  }
  async add() {
    const result = await this.ctx.model.GoodsCate.find({ pid: '0' });
    await this.ctx.render('admin/goodsCate/add', {
      cateList: result,
    });
  }
  async edit() {
    const id = this.ctx.request.query.id;
    const list = await this.ctx.model.GoodsCate.find({ pid: '0' });
    const result = await this.ctx.model.GoodsCate.find({ _id: id });
    await this.ctx.render('admin/goodsCate/edit', {
      goods_cate: result[0],
      list,
    });
  }
  async toAdd() {
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

      this.service.tools.jimpImg(target);
    }
    console.log(parts.field.pid);
    if (parts.field.pid !== '0') {
      parts.field.pid = this.app.mongoose.Types.ObjectId(parts.field.pid);
      // 调用mongoose里面的方法把字符串转换成ObjectId
    }
    const updateResult = Object.assign(files, parts.field);
    updateResult.description = updateResult.description.trim();
    console.log('add:', updateResult);
    const goodsCate = new this.ctx.model.GoodsCate(updateResult);
    await goodsCate.save();

    await this.success('/admin/goodsCate', '增加分类成功');
  }
  async toEdit() {
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

      this.service.tools.jimpImg(target);
    }
    console.log(parts.field.pid);

    if (parts.field.pid !== '0') {
      parts.field.pid = this.app.mongoose.Types.ObjectId(parts.field.pid);
      // 调用mongoose里面的方法把字符串转换成ObjectId
    }

    const id = parts.field.id;
    const updateResult = Object.assign(files, parts.field);
    updateResult.description = updateResult.description.trim();
    console.log('toEdit:', updateResult);
    await this.ctx.model.GoodsCate.updateOne({ _id: id }, updateResult);

    await this.success('/admin/goodsCate', '增加分类成功');
  }
}

module.exports = GoodsCateController;
