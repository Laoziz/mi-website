'use strict';
const svgCapcha = require('svg-captcha');
const md5 = require('md5');
const sd = require('silly-datetime');
const path = require('path');
const mkdirp = require('mz-modules/mkdirp');
const Service = require('egg').Service;
const Jimp = require('jimp');// 生成缩略图的模块

class ToolsService extends Service {
  // 生成验证码
  async captcha() {
    const captcha = svgCapcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 40,
      background: '#cc9966',
    });
    this.ctx.session.code = captcha.text; /** 验证码上的信息 */
    console.log('code:', captcha.text);
    return captcha;
  }
  async getTime() {
    const d = new Date();
    return d.getTime();
  }
  async md5(code) {
    return md5(code);
  }
  async getUploadFile(filename) {
    // 1、获取当前日期     20180920
    const day = sd.format(new Date(), 'YYYYMMDD');
    // 2、创建图片保存的路径
    const dir = path.join(this.config.uploadDir, day);
    await mkdirp(dir);
    const d = await this.getTime();// 毫秒数
    // 返回图片保存的路径
    const uploadDir = path.join(dir, d + path.extname(filename));
    // app\public\admin\upload\20180914\1536895331444.png
    return {
      uploadDir,
      saveDir: uploadDir.slice(3).replace(/\\/g, '/'),
    };
  }
  async jimpImg(target) {
    // 上传图片成功以后生成缩略图
    Jimp.read(target, (err, lenna) => {
      if (err) throw err;
      lenna.resize(200, 200) // resize
        .quality(90) // set JPEG quality
        .write(target + '_200x200' + path.extname(target));// save

      lenna.resize(400, 400) // resize
        .quality(90) // set JPEG quality
        .write(target + '_400x400' + path.extname(target)); // save
    });
  }
}

module.exports = ToolsService;
