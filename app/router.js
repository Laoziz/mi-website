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

  // 商店管理
  router.get('/admin/setting', controller.admin.setting.index);
  router.post('/admin/setting/toEdit', controller.admin.setting.toEdit);

  // 商品类型管理
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

  // 商品分类
  router.get('/admin/goodsCate', controller.admin.goodsCate.index);
  router.get('/admin/goodsCate/add', controller.admin.goodsCate.add);
  router.get('/admin/goodsCate/edit', controller.admin.goodsCate.edit);
  router.post('/admin/goodsCate/toAdd', controller.admin.goodsCate.toAdd);
  router.post('/admin/goodsCate/toEdit', controller.admin.goodsCate.toEdit);

  // 商品管理
  router.get('/admin/goods', controller.admin.goods.index);
  router.get('/admin/goods/add', controller.admin.goods.add);
  router.get('/admin/goods/edit', controller.admin.goods.edit);
  router.post('/admin/goods/toAdd', controller.admin.goods.toAdd);
  router.post('/admin/goods/toEdit', controller.admin.goods.toEdit);
  router.get('/admin/goods/goodsTypeAttribute', controller.admin.goods.goodsTypeAttribute);
  router.post('/admin/goods/goodsUploadImage', controller.admin.goods.goodsUploadImage);
  router.post('/admin/goods/goodsUploadPhoto', controller.admin.goods.goodsUploadPhoto);
  router.post('/admin/goods/changeGoodsImageColor', controller.admin.goods.changeGoodsImageColor);
  router.post('/admin/goods/goodsImageRemove', controller.admin.goods.goodsImageRemove);

  // 导航管理
  router.get('/admin/nav', controller.admin.nav.index);
  router.get('/admin/nav/add', controller.admin.nav.add);
  router.get('/admin/nav/edit', controller.admin.nav.edit);
  router.post('/admin/nav/toAdd', controller.admin.nav.toAdd);
  router.post('/admin/nav/toEdit', controller.admin.nav.toEdit);

  // 文章管理
  router.get('/admin/article', controller.admin.article.index);
  router.get('/admin/article/add', controller.admin.article.add);
  router.get('/admin/article/edit', controller.admin.article.edit);
  router.post('/admin/article/toAdd', controller.admin.article.toAdd);
  router.post('/admin/article/toEdit', controller.admin.article.toEdit);

  // 文章分类模块
  router.get('/admin/articleCate', controller.admin.articleCate.index);
  router.get('/admin/articleCate/add', controller.admin.articleCate.add);
  router.get('/admin/articleCate/edit', controller.admin.articleCate.edit);
  router.post('/admin/articleCate/toEdit', controller.admin.articleCate.toEdit);
  router.post('/admin/articleCate/toAdd', controller.admin.articleCate.toAdd);
};
