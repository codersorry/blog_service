'use strict';

const Controller = require('egg').Controller;

class MainController extends Controller {
  async index() {
    this.ctx.body = 'hi api';
  }

  async checkLogin() {
    const userName = this.ctx.request.body.userName;
    const password = this.ctx.request.body.password;
    const sql = `SELECT userName FROM admin_user WHERE userName='${userName}' AND password='${password}'`;
    const res = await this.app.mysql.query(sql);
    if (res.length > 0) {
      const openId = new Date().getTime();
      this.ctx.session.openId = { openId };
      this.ctx.body = { data: { openId }, message: '登录成功', result: true };
    } else {
      this.ctx.body = { data: {}, message: '登录失败', result: false };
    }
  }

  async getTypeInfo() {
    const resType = await this.app.mysql.select('type');
    this.ctx.body = { data: resType, message: '获取文章类型成功', result: true };

  }

  // 添加文章
  async addArticle() {
    const tmpArticle = this.ctx.request.body;
    // tmpArticle.
    const result = await this.app.mysql.insert('article', tmpArticle);
    const insertSuccess = result.affectedRows === 1;
    const insertId = result.insertId;
    console.log(insertSuccess, '----');
    if (insertSuccess) {
      this.ctx.body = {
        result: insertSuccess,
        insertId,
      };
    } else {
      this.ctx.body = {
        result: insertSuccess,
        data: { insertId },
        message: '添加文章成功'
        ,
      };
    }
  }

  // 修改文章
  async updateArticle() {
    const tmpArticle = this.ctx.request.body;
    const result = await this.app.mysql.update('article', tmpArticle);
    const updateSuccess = result.affectedRows === 1;
    if (updateSuccess) {
      this.ctx.body = {
        data: {},
        message: '修改文章成功',
        result: updateSuccess,
      };
    } else {
      this.ctx.body = {
        data: {},
        message: '修改文章失败',
        result: updateSuccess,
      };
    }

  }

  // 获得文章列表
  async getArticleList() {
    const sql = 'SELECT article.id as id,article.title as title,article.introduce as introduce,article.addTime as addTime,type.typeName as typeName,article.view_count as view_count FROM article LEFT JOIN type ON article.type_id = type.Id ORDER BY article.id DESC';
    const resList = await this.app.mysql.query(sql);
    this.ctx.body = { data: { list: resList }, result: true, message: '获取文章列表成功' };

  }

  // 删除文章
  async delArticle() {
    const id = this.ctx.params.id;
    const res = await this.app.mysql.delete('article', { id });
    if (res.affectedRows === 1) {
      this.ctx.body = { data: res, result: true, message: '删除文章成功' };
    } else {
      this.ctx.body = { data: res, result: false, message: '删除文章失败' };

    }
  }

  // 通过id获取文章详情内容
  async getArticleById() {
    const id = this.ctx.params.id;
    const sql = `SELECT article.id as id,article.title as title,article.introduce as introduce,article.article_content as article_content,article.addTime as addTime,article.view_count as view_count,typeName as typeName,type.id as typeId FROM article LEFT JOIN type ON article.type_id = type.id WHERE article.id=${id}`;
    const res = await this.app.mysql.query(sql);
    if (res.length >= 1) {
      this.ctx.body = { data: res, result: true, message: '获取文章详情成功' };
    } else {
      this.ctx.body = { data: res, result: false, message: '获取文章详情失败' };
    }
  }

}

module.exports = MainController;
