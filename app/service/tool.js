'use strict';
const Service = require('egg').Service;
const nodemailer = require('nodemailer');

class ToolService extends Service {
  async sendMail(email, subject, html) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.163.com',
      port: 465,
      secure: true, // 如果是 true 则port填写465, 如果 false 则可以填写其它端口号
      auth: {
        user: 'darry5877@163.com', // 发件人邮箱地址
        pass: 'IJZTKGJCTVENCFMO', // 授权码
      },
    });

    const mailOptions = {
      from: 'darry5877@163.com', // 发送者
      to: email, // 接收者邮箱
      subject, // 标题
      html,
    };

    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (err) {
      return false;
    }
  }
}

module.exports = ToolService;
