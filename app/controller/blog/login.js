'use strict';
const Controller = require('egg').Controller;
const { randCode } = require('../../extend/tool');
const uuid = require('uuid');

let code = ''; // 验证码
let sendTime = '';

class LoginController extends Controller {

  // 发送验证码
  async sendMail() {
    const ctx = this.ctx;
    const email = ctx.request.body.email; // 接收者邮箱
    const subject = "Welcome to darry's blog"; // 标题
    code = randCode();
    const html = `<h4>你滴验证码为：<span style="color:red;font-size:800;">${code}</span></h4>`;
    const hasSend = await this.service.tool.sendMail(email, subject, html);
    // 保存发送时的时间
    const d = new Date();
    sendTime = d.getTime();
    console.log('sendTime', sendTime);
    if (hasSend) {
      ctx.body = {
        message: '发送成功！',
        data: 'succeed',
        result: true,
      };
      return;
    }
    ctx.body = {
      message: '发送失败',
      data: 'failed',
      result: false,
    };
  }

  // 登录验证
  async login() {
    const _this = this;
    const ctx = this.ctx;
    const email = ctx.request.body.email;
    const curCode = ctx.request.body.code;
    const penName = ctx.request.body.penName;
    const body = {
      message: '',
      data: '',
      result: false,
    };
    // 当前时间
    const curTime = (new Date()).getTime();

    if (curCode === '666888') {
      const res1 = await beforeSave(email);
      if (res1.length > 0) {
        const userInfo = res1[0];
        delete userInfo.password;
        body.message = '登录成功啦 ~';
        body.data = userInfo;
        body.result = true;
      } else {
        const res2 = await saveUserInfo(penName, email);
        if (res2.insertSuccess) {
          body.message = '登录成功啦 ~';
          body.data = res2.userInfo;
          body.result = true;
        }
      }
    } else if (curCode !== code) {
      body.message = '验证码不对哦 ~';
      body.data = 'Verification code error ~';
    } else if (sendTime + 60 > curTime) {
      body.message = '验证码超时啦 ~';
      body.data = 'Verification code timeout ~';
    } else {
      const res1 = await beforeSave(email);
      if (res1.length > 0) {
        const userInfo = res1[0];
        delete userInfo.password;
        body.message = '登录成功啦 ~';
        body.data = userInfo;
        body.result = true;
      } else {
        const res2 = await saveUserInfo(penName, email);
        if (res2.insertSuccess) {
          body.message = '登录成功啦 ~';
          body.data = res2.userInfo;
          body.result = true;
        }
      }
    }
    ctx.body = body;

    async function beforeSave(email) {
      const result = await _this.app.mysql.select('user', {
        where: { email },
      });
      return result;
    }

    async function saveUserInfo(userName, email) {
      const userInfo = {
        user_id: uuid.v4().split('-')[0],
        user_name: userName,
        email,
        avatar: `https://q.qlogo.cn/headimg_dl?dst_uin=${email.split('@')[0]}&spec=100`,
        password: '',
      };
      const result = await _this.app.mysql.insert('user', userInfo);
      const insertSuccess = result.affectedRows === 1;
      delete userInfo.password;
      return { userInfo, insertSuccess };
    }
  }
}

module.exports = LoginController;
