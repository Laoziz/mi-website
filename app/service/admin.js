'use strict';

const Service = require('egg').Service;
const url = require('url');

class AdminService extends Service {
  async checkAuth() {
    const { role_id, is_supper } = this.ctx.session.userinfo;
    const pathname = url.parse(this.ctx.request.url).pathname;
    //超级管理员
    if (is_supper === 1) {
      return true;
    }
    // 可通过网站
    const agreeUrl = [ '/admin/login', '/admin/loginout', '/admin/verify', '/admin/dologin' ];
    if (agreeUrl.indexOf(pathname) !== -1) {
      return true;
    }
    const accessResult = await this.ctx.model.RoleAccess.find({ role_id });
    const haveAccess = [];
    accessResult.forEach(async access => {
      haveAccess.push(access.access_id.toString());
    });

    const urlResult = await this.ctx.model.Access.find({ url: pathname });
    if (urlResult.length > 0) {
      if (haveAccess.indexOf(urlResult[0]._id.toString()) !== -1) {
        return true;
      }
    }
    return false;
  }
  async getAuthList(role_id, is_supper) {
    const result = await this.ctx.model.Access.aggregate([
      {
        $lookup: {
          from: 'access',
          localField: '_id',
          foreignField: 'module_id',
          as: 'items',
        },
      },
      {
        $match: {
          module_id: '0',
        },
      },
    ]);
    const roleAccessResult = await this.ctx.model.RoleAccess.find({ role_id });
    const roleAccessList = roleAccessResult.map(item => item.access_id.toString());
    result.forEach(item => {
      if (is_supper === 1 || roleAccessList.indexOf((item._id.toString())) !== -1) {
        item.checked = true;
      }
      item.items.forEach(item2 => {
        if (is_supper === 1 || roleAccessList.indexOf(item2._id.toString()) !== -1) {
          item2.checked = true;
        }
      });
    });
    return result;
  }
}

module.exports = AdminService;
