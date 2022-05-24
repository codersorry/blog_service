'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi api';
  }

  // 获取文章列表
  async getArticleList() {
    const sql = 'SELECT article.id as id,article.title as title,article.introduce as introduce,article.addTime as addTime,article.view_count as view_count,typeName as typeName FROM article LEFT JOIN type ON article.type_id = type.id';
    const results = await this.app.mysql.query(sql);
    this.ctx.body = { data: results };
  }

  // 通过id获取文章详情内容
  async getArticleById() {
    const id = this.ctx.params.id;
    const sql = `SELECT article.id as id,article.title as title,article.introduce as introduce,article.article_content as article_content,article.addTime as addTime,article.view_count as view_count,typeName as typeName,type.id as typeId FROM article LEFT JOIN type ON article.type_id = type.id WHERE article.id=${id}`;
    const results = await this.app.mysql.query(sql);
    this.ctx.body = { data: results };
  }

}

module.exports = HomeController;
