'use strict';
const fs = require('fs');
const pump = require('mz-modules/pump');

const BaseController = require('../admin/base');

class FocusController extends BaseController {
  async index() {
    // 获取轮播图的数据
    const result = await this.ctx.model.Focus.find({});
    await this.ctx.render('admin/focus/index', {
      list: result,
    });
  }
  async add() {
    await this.ctx.render('admin/focus/add');
  }
  async edit() {
    const id = this.ctx.request.query.id;

    const result = await this.ctx.model.Focus.find({ _id: id });

    console.log(result);

    await this.ctx.render('admin/focus/edit', {
      list: result[0],
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
      const fieldname = stream.fieldname; // file表单的名字

      // 上传图片的目录
      const dir = await this.service.tools.getUploadFile(stream.filename);
      const target = dir.uploadDir;
      const writeStream = fs.createWriteStream(target);

      await pump(stream, writeStream);

      files = Object.assign(files, {
        [fieldname]: dir.saveDir,
      });
    }
    const focus = new this.ctx.model.Focus(Object.assign(files, parts.field));

    await focus.save();

    await this.success('/admin/focus', '增加轮播图成功');
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
    }
    // 修改操作
    const id = parts.field.id;
    const updateResult = Object.assign(files, parts.field);
    await this.ctx.model.Focus.updateOne({ _id: id }, updateResult);
    await this.success('/admin/focus', '修改轮播图成功');
  }
}

module.exports = FocusController;
