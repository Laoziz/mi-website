'use strict';

const BaseController = require('./base');

class ArticleController extends BaseController {
  async index() {
    this.ctx.body = '文章列表';
  }
  async add() {
    this.ctx.body = '文章增加';
  }
  async edit() {
    this.ctx.body = '文章修改';
  }
  async toAdd() {
    this.ctx.body = '增加文章';
  }
  async toEdit() {
    this.ctx.body = '修改文章';
  }
}

module.exports = ArticleController;
