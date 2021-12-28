'use strict';
const fs = require('fs');
const pump = require('mz-modules/pump');
const BaseController = require('./base');

class ArticleController extends BaseController {
  async index() {
    const page = this.ctx.request.query.page || 1;
    const pageSize = 3;
    const totalNum = await this.ctx.model.Article.find({}).countDocuments();
    console.log('totalNum', totalNum);
    const result = await this.ctx.model.Article.aggregate([
      {
        $lookup: {
          from: 'article_cate',
          localField: 'cate_id',
          foreignField: '_id',
          as: 'catelist',
        },
      },
      {
        $skip: (page - 1) * pageSize,
      },
      {
        $limit: pageSize,
      },
    ]);
    console.log('article:', result);
    await this.ctx.render('/admin/article/index', {
      list: result,
      totalPages: Math.ceil(totalNum / pageSize),
      page,
    });
  }
  async add() {
    const articleList = await this.ctx.model.ArticleCate.aggregate([
      {
        $lookup: {
          from: 'article_cate',
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
    console.log('article:', articleList);
    await this.ctx.render('/admin/article/add', { cateList: articleList });
  }
  async edit() {
    const { id } = this.ctx.request.query;
    const result = await this.ctx.model.Article.find({ _id: id });
    const cateListResult = await this.ctx.model.ArticleCate.aggregate([
      {
        $lookup: {
          from: 'article_cate',
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

    await this.ctx.render('admin/article/edit', {
      cateList: cateListResult,
      list: result[0],
      prevPage: this.ctx.state.prevPage,
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
    console.log('toAdd:', parts.field);
    const articleFields = Object.assign(files, parts.field);
    const article = new this.ctx.model.Article(articleFields);
    article.save();
    await this.success('/admin/article', '增加文章成功');
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
    console.log('toEdit:', parts.field);
    const { id, prevPage } = parts.field;
    const editResult = Object.assign(files, parts.field);
    editResult.cate_id = this.app.mongoose.Types.ObjectId(editResult.cate_id);
    console.log('editResult:', editResult);
    const result = await this.ctx.model.Article.updateOne({ _id: id }, editResult);
    console.log('result:', result, prevPage);
    await this.success(prevPage, '修改数据成功');
  }
}

module.exports = ArticleController;
