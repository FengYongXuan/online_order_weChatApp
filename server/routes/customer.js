var express = require('express');
var router = express.Router();
var request = require('request');
var mysql = require('mysql');
var uuid = require('uuid');
var dbConfig = require('../db/dbConfig');
var customerSql = require('../db/customerSql');

// 创建连接池
var pool = mysql.createPool(dbConfig.mysql);
// 封装一个JSON格式化数据并发送出去的方法
var responseJSON = function (res, ret) {
  if (typeof ret === 'undefined') {
    res.json({
      code: '-200',
      msg: '操作失败'
    })
  } else {
    res.json(ret)
  }
}

// 获取openid,携带参数：临时登录凭证code和appid
router.get('/getopenid', function(req, res, next) {
  var param = req.query || req.params;
  var code = param.code;
  var appid = param.appid;
  var secret = '5bab9408bd1870e1628b074fb3d3886e'; //设置自己微信小程序的AppSecret
  var wx_url = 'https://api.weixin.qq.com/sns/jscode2session?appid='+ appid +'&secret=' + secret + '&js_code='
  + code + '&grant_type=authorization_code';
  request(wx_url, function (error, response, body) {
    var data = {};
    if (!error && response.statusCode === 200) {
      var reqData = JSON.parse(body);
      data.openid = reqData.openid;
      data.result = {
        code: 200,
        msg: '授权成功'
      }
    } else {
      data.result = {
        code: -1,
        msg: '授权失败'
      }
    }
    responseJSON(res, data);
  })
});

// 用户登录,携带参数：昵称和openid
router.post('/login', function (req, res) {
  pool.getConnection(function (err, connection) {
    var param = req.body;
    var nickname = param.nickname;
    var openid = param.openid;
    var _res = res;
    var myCusid = '';
    connection.query(customerSql.queryAll, function (err, res) {
      var data = {};
      var isAdmin = false;
      if (res) {
        var isHave = false;
        // 如果该用户已经注册
        for (let i = 0; i < res.length; i++) {
          if (res[i].OPENID == openid) {
            isHave = true;
            myCusid = res[i].CUSID;
            isAdmin = (res[i].ISADMIN == 1);
          }
        }
        // 如果该用户没有注册，则注册
        if (!isHave) {
          var cusid = uuid.v4(); // 为用户生成一个唯一识别码
          myCusid = cusid;
          connection.query(customerSql.insert, [cusid, openid, nickname], function (err, result) {
            if (result) {
              data.result = {
                code: 200,
                msg: '成功注册',
                isAdmin: isAdmin
              }
            } else {
              data.result = {
                code: -1,
                msg: '数据库注册失败'
              }
            }
          })
        } else {
          data.result = {
            code: 200,
            msg: '已注冊',
            isAdmin: isAdmin,
            cusid: myCusid
          }
        }
      }
      if (err) {
        data.err = err
      }
      // 以JSON格式返回操作结果给前台
      setTimeout(() => {
        responseJSON(_res, data);
      }, 500)
      connection.release(); // 释放数据库连接
    })
  })
})

module.exports = router;