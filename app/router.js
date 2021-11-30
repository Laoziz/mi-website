'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // const adminauth = app.middleware.adminauth;

  router.get('/admin', controller.admin.main.index);
  router.get('/admin/welcome', controller.admin.main.welcome);

  router.get('/admin/verify', controller.admin.base.code);
  router.get('/admin/delete', controller.admin.base.delete);
  router.get('/admin/changeStatus', controller.admin.base.changeStatus);
  router.get('/admin/editNum', controller.admin.base.editNum);
  // 登陆
  router.get('/admin/login', controller.admin.login.index);
  router.post('/admin/dologin', controller.admin.login.doLogin);
  router.get('/admin/loginout', controller.admin.login.loginOut);
  // 用户管理
  router.get('/admin/manager', controller.admin.manager.index);
  router.get('/admin/manager/add', controller.admin.manager.add);
  router.get('/admin/manager/edit', controller.admin.manager.edit);
  router.post('/admin/manager/toAdd', controller.admin.manager.toAdd);
  router.post('/admin/manager/toEdit', controller.admin.manager.toEdit);

  // 角色管理
  router.get('/admin/role', controller.admin.role.index);
  router.get('/admin/role/add', controller.admin.role.add);
  router.get('/admin/role/edit', controller.admin.role.edit);
  router.post('/admin/role/toAdd', controller.admin.role.toAdd);
  router.post('/admin/role/toEdit', controller.admin.role.toEdit);
  router.get('/admin/role/auth', controller.admin.role.auth);
  router.post('/admin/role/toAuth', controller.admin.role.toAuth);

  // 权限管理
  router.get('/admin/access', controller.admin.access.index);
  router.get('/admin/access/add', controller.admin.access.add);
  router.get('/admin/access/edit', controller.admin.access.edit);
  router.post('/admin/access/toAdd', controller.admin.access.toAdd);
  router.post('/admin/access/toEdit', controller.admin.access.toEdit);

  // 轮播图管理
  router.get('/admin/focus', controller.admin.focus.index);
  router.get('/admin/focus/add', controller.admin.focus.add);
  router.get('/admin/focus/edit', controller.admin.focus.edit);
  router.post('/admin/focus/toAdd', controller.admin.focus.toAdd);
  router.post('/admin/focus/toEdit', controller.admin.focus.toEdit);

  // 商品管理
  router.get('/admin/goodsType', controller.admin.goodsType.index);
  router.get('/admin/goodsType/add', controller.admin.goodsType.add);
  router.get('/admin/goodsType/edit', controller.admin.goodsType.edit);
  router.post('/admin/goodsType/toAdd', controller.admin.goodsType.toAdd);
  router.post('/admin/goodsType/toEdit', controller.admin.goodsType.toEdit);

  // 商品属性管理
  router.get('/admin/goodsTypeAttribute', controller.admin.goodsTypeAttribute.index);
  router.get('/admin/goodsTypeAttribute/add', controller.admin.goodsTypeAttribute.add);
  router.get('/admin/goodsTypeAttribute/edit', controller.admin.goodsTypeAttribute.edit);
  router.post('/admin/goodsTypeAttribute/toAdd', controller.admin.goodsTypeAttribute.toAdd);
  router.post('/admin/goodsTypeAttribute/toEdit', controller.admin.goodsTypeAttribute.toEdit);
};
