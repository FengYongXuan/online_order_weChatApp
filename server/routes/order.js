var express = require('express');
var router = express.Router();
var dbConfig = require('../db/dbConfig')
var orderSql = require('../db/orderSql')
var uuid = require('uuid')
var mysql = require('mysql')
var sd = require('silly-datetime');

var pool = mysql.createPool(dbConfig.mysql)
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

// 插入一条订单详情(订单中关于某个商品的数据)
var insertOrderDetail = function (i, connection, orderid, foodlist) {
  connection.query(orderSql.insertOrderDetail, [foodlist[i].gid, orderid, foodlist[i].gname, foodlist[i].gcount, foodlist[i].gprice, foodlist[i].gtime], function (err, result) {
    if (result) {
      console.log("成功插入一条订单详情")
    } else {
      console.log("插入一条订单详情失败")
    }
    if (err) {
      console.log(err)
    }
  })
}

// 根据订单id查询订单详情
var allGoods = []
var queryOrderDetail = function (connection, orderid) {
  var orderDetail = []
  connection.query(orderSql.selectOrderDetails + `'${orderid}'`, function (err, res) {
    if (res) {
      for (let i = 0; i < res.length; i++) {
        orderDetail.push(JSON.parse(JSON.stringify(res[i])));
      }
    }
    allGoods.push(orderDetail)
  })
}

// 添加订单
router.post('/addOrder', function(req, res) {
  pool.getConnection((err, connection) => {
    var params = req.body;
    var foodlist = JSON.parse(params.foodlist); // 订单中的商品信息列表
    var mycusid = params.cusid;
    var orderid = uuid.v1(); // 生成订单编号
    var totalPrice = 0;
    var orderTotalTime = 0;
    const orderDate = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
    var data = {};
    var _res = res;
    // 计算订单总价和订单完成一共要花的时间
    for (let i = 0; i < foodlist.length; i++) {
      totalPrice += foodlist[i].gprice*foodlist[i].gcount;
      orderTotalTime += foodlist[i].gtime*foodlist[i].gcount;
      insertOrderDetail(i, connection, orderid, foodlist)
    }
    //订单状态为1,表示已下单
    connection.query(orderSql.insertOrder, [orderid, mycusid, orderTotalTime, 1, totalPrice, orderDate], function (err, result) {
      if (result) {
        data.result = {
          code: 200,
          msg: '订单添加成功'
        }
      } else {
        data.result = {
          code: -1,
          msg: '订单添加失败'
        }
      }
      responseJSON(_res, data);
      connection.release();
    })
  })
});

// 普通用户获取所有订单(包括已完成和未完成的订单)
router.get('/getOrders', function(req, res) {
  pool.getConnection((err, connection) => {
    var params = req.query || req.params;
    var cusid = params.cusid;  // 拿到用户的cuid
    var timeTotal = 0;
    var order = [];
    var overOrder = [];
    var _res = res;
    var data = {
      unfinishedOrders: [],
      unfinishedOrderDetails: [],
      overOrder: []
    };
    // 查询所有完成的订单
    connection.query(orderSql.queryOverOrders, function (err, res) {
      if (res) {
        for (let i = 0; i < res.length; i++) {
          if (cusid = res[i].CUSID) {
            overOrder.push(res[i])
          }
        }
        data.overOrder = overOrder;
      }
    })
    // 查询所有未完成订单
    connection.query(orderSql.queryUnfinishedOrders, function (err, res) {
      if (res) {
        for (let i = 0; i < res.length; i++) {
          timeTotal += res[i].ORDERTIME;
          res[i].ORDERTIME = timeTotal;  // 更新完成订单要花费的时间,因为如果有多个订单需要排队
        }
        for (let i = 0; i < res.length; i++) {
          if (cusid = res[i].CUSID) {
            res[i].orderSort = i + 1;    // 订单排队序号
            order.push(JSON.parse(JSON.stringify(res[i]))); // 汇总所有订单
            queryOrderDetail(connection, res[i].ORDERID); // 根据订单id查询订单详情(可能不止一个订单)
          }
        }
        data.unfinishedOrders = order;
        setTimeout(() => {
          data.unfinishedOrderDetails = allGoods;
          allGoods = [];
        }, 300);
      }
      setTimeout(() => {
        responseJSON(_res, data);
      }, 300)
      connection.release();
    })
  })
});

// 管理员获取所有顾客的订单信息
router.get('/getOrdersAdmin', function(req, res) {
  pool.getConnection(function (err, connection) {
    var cusOrderArr = [];
    var data = {};
    var _res = res;
    connection.query(orderSql.queryUnfinishedOrders, function (err, res) {
      if (res) {
        for (let i = 0; i < res.length; i++) {
          var cusOrder = {};
          cusOrder.orderid = res[i].ORDERID;
          cusOrder.cusid = res[i].CUSID;
          cusOrder.orderTotalPrice = res[i].ORDERTOTALPRICE;
          cusOrderArr.push(cusOrder);
        }
        data.cusOrderArr = cusOrderArr
      }
      responseJSON(_res, data)
    })
  })
});

// 管理员取消订单
router.get('/orderAdminCancel', function(req, res) {
  var params = req.query || req.params;
  var orderid = params.orderid; // 拿到订单id
  var data = {};
  var _res = res;
  pool.getConnection(function (err, connection) {
    connection.query(orderSql.deleteOrder + `'${orderid}'`, function (err, results) {
      if (results) {
        data.result = {
          code: 200,
          msg: '订单取消成功'
        }
      }else {
        data.result = {
          code: -1,
          msg: '订单取消错误'
        }
      }
      responseJSON(_res, data)
      connection.release()
    })
  })
});

// 管理员完成订单
router.get('/orderAdminOver', function(req, res) {
  var params = req.query || req.params;
  var orderid = params.orderid;  // 拿到订单id
  var data = {};
  var _res = res;
  pool.getConnection(function (err, connection) {
    connection.query(orderSql.updateOrderStateById + `'${orderid}'`, function (err, res) {
      if (res) {
        data.result = {
          code: 200,
          msg: '订单完成'
        }
      }else {
        data.result = {
          code: -1,
          msg: '订单完成错误'
        }
      }
      responseJSON(_res, data);
      connection.release();
    })
  })
});

module.exports = router;
