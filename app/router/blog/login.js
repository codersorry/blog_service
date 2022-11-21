'use strict';
module.exports = app => {
  const { router, controller } = app;
  router.post('/blog/sendMail', controller.blog.login.sendMail);
  router.post('/blog/login', controller.blog.login.login);
};
