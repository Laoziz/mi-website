'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // 首页
  router.get('/', controller.default.index.index);

  router.get('/plist', controller.default.product.list);
  router.get('/pinfo', controller.default.product.info);

  router.get('/cart', controller.default.flow.cart);

  router.get('/login', controller.default.user.login);
  router.get('/register', controller.default.user.register);
  router.get('/user', controller.default.user.welcome);
  router.get('/user/order', controller.default.user.order);

  router.get('/help', controller.default.help.index);
  router.get('/help/info', controller.default.help.info);
};
