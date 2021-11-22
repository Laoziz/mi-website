'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // const adminauth = app.middleware.adminauth;

  router.get('/admin/verify', controller.admin.base.code);
  router.get('/admin/delete', controller.admin.base.delete);
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

  // 权限管理
  router.get('/admin/access', controller.admin.access.index);
  router.get('/admin/access/add', controller.admin.access.add);
  router.get('/admin/access/edit', controller.admin.access.edit);
  router.post('/admin/access/toAdd', controller.admin.access.toAdd);
  router.post('/admin/access/toEdit', controller.admin.access.toEdit);
};
