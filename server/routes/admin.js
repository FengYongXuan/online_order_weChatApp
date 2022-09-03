var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var uuid = require('uuid');
var path = require("path");
var fs = require("fs");
var formidable = require("formidable")
var menuSql = require("../db/menuSql");
var orderSql = require('../db/orderSql')
var dbConfig = require('../db/dbConfig');

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
        res.json(ret);
    }
}

// 根据日期查询就餐人数和营业额
router.get('/search', function (req, res, next) {
    var params = req.query || req.params;
    var date = params.date;
    var data = {
        customer_num: 0,
        turnover: 0.0
    };
    var turnover = 0.0;
    var customer_num = 0;
    var _res = res;
    // 查询所有完成的订单
    pool.getConnection((err, connection) => {
        connection.query(orderSql.queryOverOrders, function (err, res) {
            if (res) {
                // 根据日期计算就餐人数和营业额
                for (let i = 0; i < res.length; i++) {
                    orderDate = res[i].ORDERDATE;
                    var year = orderDate.getFullYear();
                    var month = (orderDate.getMonth() + 1 < 10 ? '0' + (orderDate.getMonth() + 1) : orderDate.getMonth() + 1);
                    var day= orderDate.getDate() < 10 ? '0' + orderDate.getDate() : orderDate.getDate();
                    if (date == (year+"-"+month+"-"+day)) {
                        customer_num++;
                        turnover += res[i].ORDERTOTALPRICE;
                    }
                }
                data.customer_num = customer_num;
                data.turnover = turnover;
            }
        })
        setTimeout(() => {
            responseJSON(_res, data);
        }, 300)
        connection.release();
    })
})

// 请求所有商品信息
router.get('/menu', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var datalist = [];
        var data = {};
        var goodslist = [];
        var typelist;
        var foodslist;
        // 获取所有商品种类
        connection.query(menuSql.queryGoodsTypeAll, function (err, e) {
            if (e) {
                typelist = e;
            }
        })
        // 获取所有商品信息
        connection.query(menuSql.queryGoodsAll, function (err, e) {
            if (e) {
                foodslist = e;
            }
            for (var i = 0; i < typelist.length; i++) {
                data.gt = typelist[i];
                for (var j = 0; j < foodslist.length; j++) {
                    if (typelist[i].GTID == foodslist[j].GTID) {
                        goodslist.push(foodslist[j]);
                    }
                }
                data.goodslist = goodslist;
                goodslist = [];
                datalist.push(data);
                data = {};
            }
            responseJSON(res, datalist); // 发送数据
        })
        connection.release(); // 断开数据库
    })
});

// 添加商品
var imgGid = '' // 全局变量，记录添加商品时的gid，在/admin/addGoodsImg请求中要用到
router.get('/addGoods', function (req, res, next) {
    var params = req.query || req.params;
    var foodinfo = JSON.parse(params.foodinfo);
    var data = {};
    var _res = res;
    var gid = uuid.v4();
    imgGid = gid;
    pool.getConnection(function (err, connection) {
        connection.query(menuSql.insertGoods, [gid, foodinfo.gtid, foodinfo.gname, parseFloat(foodinfo.gprice), 'food1.png', foodinfo.gtime, foodinfo.ginfo], function (err, result) {
            if (result) {
                data.result = {
                    code: 200,
                    msg: '添加成功'
                }
            } else {
                data.result = {
                    code: -1,
                    msg: '添加失败'
                }
            }
            responseJSON(_res, data);
        });
        connection.release();
    })
});

// 修改商品信息
router.get('/altergoods', function (req, res, next) {
    var params = req.query || req.params;
    var foodinfo = JSON.parse(params.foodinfo);
    var data = {};
    var _res = res;
    pool.getConnection(function (err, connection) {
        var modSql = `UPDATE goods SET GTID='${foodinfo.GTID}',GNAME='${foodinfo.GNAME}',GPRICE=${foodinfo.GPRICE},GINFO='${foodinfo.GINFO}' WHERE GID='${foodinfo.GID}'`;
        connection.query(modSql, function (err, result) {
            if (result) {
                data.result = {
                    code: 200,
                    msg: '修改成功'
                }
            } else {
                data.result = {
                    code: -1,
                    msg: '修改失败'
                }
            }
            responseJSON(_res, data);
        });
        connection.release();
    })
});

// 删除商品
router.get('/deletegoods', function (req, res, next) {
    var params = req.query || req.params;
    var data = {};
    var _res = res;
    pool.getConnection(function (err, connection) {
        connection.query(`DELETE FROM goods where GID='${params.gid}'`, function (err, e) {
            if (e) {
                data.result = {
                    code: 200,
                    msg: '下架成功'
                }
            } else {
                data.result = {
                    code: -1,
                    msg: '下架失败'
                }
            }
            responseJSON(_res, data);
            connection.release();// 断开数据库
        })
    })
});

// 上传商品图片并修改图片名称
router.post('/addGoodsImg', function (req, res, next) {
    var imgName = ''
    var form = new formidable.IncomingForm()//既处理表单，又处理文件上传  
    //设置文件上传文件夹/路径，__dirname是一个常量，为当前路径
    let uploadDir = path.join(__dirname, "../public/images")
    form.uploadDir = uploadDir;//本地文件夹目录路径
    form.parse(req, (err, fields, files) => {
        let oldPath = files.fileImg.filepath;  //这里的路径是图片上传到后台的本地路径 
        let newPath = path.join(path.dirname(oldPath), files.fileImg.originalFilename);
        imgName = files.fileImg.originalFilename;
        //重命名图片名称
        fs.rename(oldPath, newPath, () => {
            console.log('重命名图片成功')
        })
        pool.getConnection(function (err, connection) {
            var modSql = `UPDATE goods SET GIMG='${imgName}' WHERE GID='${imgGid}'`
            connection.query(modSql, function (err, result) {
                if (result) {
                    imgName = '';
                    console.log('修改图片名称成功')
                }
            });
            connection.release();
        })
    })
    
});

// 获取食品种类
router.get('/getGoodsType', function (req, res, next) {
    var data = {}
    var _res = res
    pool.getConnection(function (err, connection) {
        connection.query(menuSql.queryGoodsTypeAll, function (err, res) {
            if (res) {
                data.goodstypes = res
            }
            responseJSON(_res, data)
        });
        connection.release()
    })
});

// 添加商品种类
router.get('/addGoodsType', function (req, res, next) {
    var params = req.query || req.params;
    var gtname = params.newtypename;
    var gtid = params.gtid;
    var data = {};
    var _res = res;
    pool.getConnection(function (err, connection) {
        connection.query(menuSql.insertGoodsType, [gtid, gtname, 1], function (err, result) {
            if (result) {
                data.result = {
                    code: 200,
                    msg: '添加成功'
                }
            } else {
                data.result = {
                    code: -1,
                    msg: '添加失败'
                }
            }
            responseJSON(_res, data);
        });
        connection.release();
    })
});

module.exports = router;