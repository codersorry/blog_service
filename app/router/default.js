'use strict';
module.exports = app => {
  const { router, controller } = app;
  router.get('/default/index', controller.default.home.index);
  router.get('/default/getArticleList', controller.default.home.getArticleList);
  router.get('/default/getArticleById/:id', controller.default.home.getArticleById);
  router.get('/default/getArticleTypeList', controller.default.home.getArticleTypeList);
  router.get('/default/getArticleListByTypeId/:id', controller.default.home.getArticleListByTypeId);
};
