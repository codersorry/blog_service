'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi api';
  }

  // 获取文章列表
  async getArticleList() {
    const sql = 'SELECT article.article_id as article_id,article.article_title as article_title,article.article_introduce as article_introduce,article.publish_time as publish_time,article.view_count as view_count,type_name as type_name FROM article LEFT JOIN type ON article.type_id = type.type_id';
    const getTotalSql = 'SELECT COUNT(*) as total FROM article LEFT JOIN type ON article.type_id = type.type_id';
    const results = await this.app.mysql.query(sql);
    const total = await this.app.mysql.query(getTotalSql);
    this.ctx.body = { data: { articles: results, total: total[0].total }, message: '获取文章列表成功', result: true };
  }

  // 通过id获取文章详情内容
  async getArticleById() {
    const id = this.ctx.params.id;
    const sql = `SELECT article.article_id as article_id,article.article_title as article_title,article.article_introduce as article_introduce,article.article_content as article_content,article.publish_time as publish_time,article.view_count as view_count,type_name as type_name,type.type_id as type_id FROM article LEFT JOIN type ON article.type_id = type.type_id WHERE article.article_id=${id}`;
    const results = await this.app.mysql.query(sql);
    this.ctx.body = { data: results, message: '获取文章详情成功', result: true };
  }

  // 获取文章类型列表
  async getArticleTypeList() {
    const results = await this.app.mysql.select('type');
    this.ctx.body = { data: results, message: '获取文章类型列表成功', result: true };
  }

  // 根据类别id获取文章列表
  async getArticleListByTypeId() {
    const { page, pageSize } = this.ctx.query;
    const id = this.ctx.params.id;
    const sql = `SELECT article.article_id as article_id,article.article_title as article_title,article.article_introduce as article_introduce,article.publish_time as publish_time,article.view_count as view_count,type_name as type_name FROM article LEFT JOIN type ON article.type_id = type.type_id WHERE article.type_id=${id} LIMIT ${(page - 1) * pageSize},${pageSize}`;
    const getTotalSql = `SELECT COUNT(*) as total FROM article LEFT JOIN type ON article.type_id = type.type_id WHERE article.type_id=${id}`;
    const results = await this.app.mysql.query(sql);
    const total = await this.app.mysql.query(getTotalSql);
    this.ctx.body = { data: { articles: results, total: total[0].total }, message: '根据类别获取文章列表成功', result: true };
  }


}

module.exports = HomeController;
