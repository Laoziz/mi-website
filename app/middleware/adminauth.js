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
      await next();
    } else {
      if (pathname === '/admin/verify' || pathname === '/admin/login' || pathname === '/admin/dologin') {
        await next();
      } else {
        ctx.redirect('/admin/login');
      }
    }

  };
};
