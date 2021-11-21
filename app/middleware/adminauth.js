'use strict';
const url = require('url');
module.exports = options => {
  return async function adminauth(ctx, next) {
    console.log('adminauth');
    ctx.state.csrf = ctx.csrf;

    const pathname = url.parse(ctx.request.url).pathname;
    console.log('url:', pathname);
    if (ctx.session.userInfo) {
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
