'use strict';
const url = require('url');
module.exports = options => {
  return async function adminauth(ctx, next) {
    console.log('adminauth');
    ctx.state.csrf = ctx.csrf;
    ctx.state.prevPage = ctx.request.header['referer'];
    const pathname = url.parse(ctx.request.url).pathname;
    console.log('url:', pathname);
    if (ctx.session.userinfo) {
      ctx.state.userinfo = ctx.session.userinfo;
      const hasAuth = await ctx.service.admin.checkAuth();
      if (hasAuth) {
        const { is_supper, role_id } = ctx.session.userinfo;
        const module_list = await ctx.service.admin.getAuthList(role_id, is_supper);
        ctx.state.module_list = module_list;
        await next();
      } else {
        ctx.body = '您没有访问权限';
      }
    } else {
      if (pathname === '/admin/verify' || pathname === '/admin/login' || pathname === '/admin/dologin') {
        await next();
      } else {
        ctx.redirect('/admin/login');
      }
    }

  };
};
