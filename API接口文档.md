# API接口文档

### 1.普通用户(顾客)

##### 1.1. 获取openid

- 请求路径：/customer/getopenid

- 请求方法：get

- 请求参数：
  
  | 参数    | 数据类型   | 说明         |
  | ----- | ------ | ---------- |
  | code  | string | 临时登录凭证code |
  | appid | string | 微信小程序开发者id |

- 响应数据

{
成功返回：
{
  "openid": 'xxxxxxxxxxx',
  "result": { 
    "code": 200, 
    "msg": '授权成功' 
  }
}
失败返回：
{
    "result": {
        "code": -1,
        "msg": "授权失败"
    }
}
}

##### 1.2. 登录

- 请求路径：/customer/login

- 请求方法：post

- 请求参数：
  
  | 参数名      | 数据类型   | 说明                   |
  | -------- | ------ | -------------------- |
  | nickname | string | 用户昵称                 |
  | openid   | string | 用于用户身份验证(作用类似于传统的密码) |

- 响应数据
  
  ```
  用户已经注册：
  {
   "result": {
     "code": 200,
     "msg": '已注冊',
     "isAdmin": true,
     "cusid": 'cac05da3-0a64-49d5-9aa8-d3260e12bee0'
   }
  }
  用户没注册：
  { 
    "result": { 
    "code": 200, 
    "msg": '成功注册', 
    "isAdmin": false
   } 
  }
  登录失败：
  {
      err:'xxxx'
  }
  ```

##### 1.3.获取所有商品信息

- 请求路径：/menu

- 请求方法：get

- 请求参数：无

- 响应数据

```
{
    "gtlist": [
        {
            "gt": {
                "gtid": "1",
                "gtname": "主食"
            },
            "goodslist": [
                {
                    "gid": "89e8ec77-8820-48c1-9d4e-f001f093ff93",
                    "gtid": "1",
                    "gname": "饭团",
                    "gprice": 5,
                    "gimg": "food6.png",
                    "gtime": 4,
                    "ginfo": "精选大米",
                    "gcount": 0
                }
            ]
        },
        {
            "gt": {
                "gtid": "2",
                "gtname": "水果"
            },
            "goodslist": [
                {
                    "gid": "82cb2db1-fd7e-48ed-89f5-24813da9dca6",
                    "gtid": "2",
                    "gname": "梨",
                    "gprice": 20,
                    "gimg": "food1.png",
                    "gtime": 5,
                    "ginfo": "润滑爽口",
                    "gcount": 0
                }
            ]
        },
        {
            "gt": {
                "gtid": "3",
                "gtname": "甜点"
            },
            "goodslist": [
                {
                    "gid": "4b9363b7-a4f8-4329-8024-b53386cf4ddc",
                    "gtid": "3",
                    "gname": "咖啡\r\n",
                    "gprice": 50,
                    "gimg": "food3.png",
                    "gtime": 4,
                    "ginfo": "现磨咖啡豆",
                    "gcount": 0
                },
                {
                    "gid": "d5646197-83c5-459e-85f9-f69e4207e52a",
                    "gtid": "3",
                    "gname": "布丁",
                    "gprice": 38,
                    "gimg": "food2.png",
                    "gtime": 5,
                    "ginfo": "非常Q弹",
                    "gcount": 0
                }
            ]
        }
    ]
}
```

##### 1.4.下单

- 请求路径：/order/addOrder

- 请求方法：post

- 请求参数：
  
  ```
  {
    foodlist: [
       {
          "gid":"58d9a28f-8746-492b-9f25-bcbe440ed636",
          "gtid":"2",
          "gname":"山竹",
          "gprice":20,
          "gimg":"food9.png",
          "gtime":10,
          "ginfo":"好吃不贵",
          "gcount":1
      },
      {
          "gid":"4b9363b7-a4f8-4329-8024-b53386cf4ddc",
          "gtid":"3",
          "gname":"咖啡",
          "gprice":50,
          "gimg":"food3.png",
          "gtime":4,
          "ginfo":"现磨咖啡豆",
          "gcount":2
      }
    ],
    cusid: 'b5e079e5-2cd4-4b11-a437-9df3c94ceccb'
  }
  ```

- 响应数据
  
  ```
  请求成功：
   {
      "result": {
          "code": 200,
          "msg": "订单添加成功"
      }
  }
  请求失败：
    {
      "result": {
          "code": -1,
          "msg": "订单添加失败"
      }
  }
  ```

##### 1.5.普通用户获取所有订单

- 请求路径：/order/getOrders

- 请求方法：get

- 请求参数：
  
  | 参数名  | 数据类型   | 说明   |
  | ---- | ------ | ---- |
  | cuid | string | 用户id |

- 响应数据: 
  
  ```
  {
      "unfinishedOrders": [
          {
              "ORDERID": "4f4e3b30-2ace-11ed-b1d1-c1799e283168",
              "CUSID": "b5e079e5-2cd4-4b11-a437-9df3c94ceccb",
              "ORDERTIME": 20,
              "ORDERSTATE": 1,
              "ORDERTOTALPRICE": 50,
              "ORDERNUM": "0000000005",
              "ORDERDATE": "2022-09-02T14:48:30.000Z",
              "orderSort": 1
          }
      ],
      "unfinishedOrderDetails": [
          [
              {
                  "GID": "48849d17-38eb-4f4b-9dcb-a9b864296c73",
                  "ORDERID": "4f4e3b30-2ace-11ed-b1d1-c1799e283168",
                  "GNAME": "面条",
                  "GCOUNT": 1,
                  "GPRICE": 10,
                  "GTIME": 10
              },
              {
                  "GID": "82cb2db1-fd7e-48ed-89f5-24813da9dca6",
                  "ORDERID": "4f4e3b30-2ace-11ed-b1d1-c1799e283168",
                  "GNAME": "梨",
                  "GCOUNT": 2,
                  "GPRICE": 20,
                  "GTIME": 5
              }
          ]
      ],
      "overOrder": []
  }
  ```

### 2.管理员

##### 2.1. 获取所有商品信息

- 请求路径：/admin/menu

- 请求方法：get

- 请求参数：无

- 响应数据

```
[
    {
        "gt": {
            "GTID": "1",
            "GTNAME": "主食"
        },
        "goodslist": [
            {
                "GID": "89e8ec77-8820-48c1-9d4e-f001f093ff93",
                "GTID": "1",
                "GNAME": "饭团",
                "GPRICE": 5,
                "GIMG": "food6.png",
                "GTIME": 4,
                "GINFO": "精选大米，非常非常非常非常非常非常好吃",
                "GCOUNT": 0
            }
        ]
    },
    {
        "gt": {
            "GTID": "2",
            "GTNAME": "水果"
        },
        "goodslist": [
            {
                "GID": "82cb2db1-fd7e-48ed-89f5-24813da9dca6",
                "GTID": "2",
                "GNAME": "梨",
                "GPRICE": 20,
                "GIMG": "food1.png",
                "GTIME": 5,
                "GINFO": "润滑爽口",
                "GCOUNT": 0
            }
        ]
    },
    {
        "gt": {
            "GTID": "3",
            "GTNAME": "甜点"
        },
        "goodslist": [
            {
                "GID": "4b9363b7-a4f8-4329-8024-b53386cf4ddc",
                "GTID": "3",
                "GNAME": "咖啡\r\n",
                "GPRICE": 50,
                "GIMG": "food3.png",
                "GTIME": 4,
                "GINFO": "现磨咖啡豆",
                "GCOUNT": 0
            },
            {
                "GID": "d5646197-83c5-459e-85f9-f69e4207e52a",
                "GTID": "3",
                "GNAME": "布丁",
                "GPRICE": 38,
                "GIMG": "food2.png",
                "GTIME": 5,
                "GINFO": "非常Q弹",
                "GCOUNT": 0
            }
        ]
    }
]
```

##### 2.2. 获取所有商品种类

- 请求路径：/admin/getGoodsType

- 请求方法：get

- 请求参数：无

- 响应数据

```
{
    "goodstypes": [
        {
            "GTID": "1",
            "GTNAME": "主食"
        },
        {
            "GTID": "2",
            "GTNAME": "水果"
        },
        {
            "GTID": "3",
            "GTNAME": "甜点"
        }
    ]
}
```

##### 2.3. 添加商品种类

- 请求路径：/admin/addGoodsType

- 请求方法：get

- 请求参数：
  
  | 参数名         | 数据类型   | 说明     |
  | ----------- | ------ | ------ |
  | newtypename | string | 商品种类   |
  | gid         | int    | 商品种类ID |

- 响应数据

```
请求成功：
 {
    "result": {
        "code": 200,
        "msg": "添加成功"
    }
}
 请求失败：
  {
    "result": {
        "code": -1,
        "msg": "'添加失败"
    }
}
```

##### 2.4.增加商品

- 请求路径：/admin/addgoods

- 请求方法：get

- 请求参数：foodinfo对象
  
  ```
  {
    foodinfo: {
      "gname":"红烧排骨",
      "gprice":"50",
      "gtime":"30",
      "ginfo":"好吃不腻",
      "gimg":"http://tmp/EYM73MDQCdbJf387c8f65bbff540bbe5234d1c5df277.jpeg",
      "gtid":1
    }
  }
  ```

- 响应数据
  
  ```
  请求成功：
  {
      "result": {
          "code": 200,
          "msg": "添加成功"
      }
  }
  请求失败：
  {
      "result": {
          "code": -1,
          "msg": "'添加失败"
      }
  }
  ```

##### 2.5.修改商品信息

- 请求路径：/admin/altergoods

- 请求方法：get

- 请求参数：
  
  | 字段名     | 数据类型   | 说明         |
  | ------- | ------ | ---------- |
  | GID(主键) | string | 商品ID       |
  | GTID    | string | 商品种类ID     |
  | GNAME   | string | 商品名称       |
  | GPRICE  | string | 商品价格       |
  | GIMG    | string | 商品图片       |
  | GINFO   | string | 商品信息       |
  | GTIME   | int    | 商品制作时间     |
  | GCOUNT  | int    | 商品在购物车中的数量 |

- 响应数据
  
  ```
  请求成功：
   {
      "result": {
          "code": 200,
          "msg": "修改成功"
      }
  }
  请求失败：
  {
      "result": {
          "code": -1,
          "msg": "修改失败"
      }
  }
  ```

##### 2.6.删除商品

- 请求路径：/admin/deletegoods

- 请求方法：get

- 请求参数：

| 字段名 | 数据类型   | 说明   |
| --- | ------ | ---- |
| gid | string | 商品ID |

- 响应数据
  
  ```
  请求成功：
   {
      "result": {
          "code": 200,
          "msg": "下架成功"
      }
  }
  请求失败：
   {
      "result": {
          "code": -1,
          "msg": "下架失败"
      }
  }
  ```

##### 2.7.上传商品图片并修改图片名称

- 请求路径：/admin/addGoodsImg

- 请求方法：post

- 请求参数：wx.upload()方法携带的参数(可以拿到上传后的图片路径、名称)。商品的gid在/admin/addgoods请求中生成，可以拿过来用。

- 响应数据：无

##### 2.8.管理员获取所有订单

- 请求路径：/order/getOrdersAdmin

- 请求方法：get

- 请求参数：无

- 响应数据：
  
  ```
  {
    "cusOrderArr": [
      {
        "orderid": "43123980-2ad2-11ed-8800-6bb24cfee2d4",
        "cusid": "b5e079e5-2cd4-4b11-a437-9df3c94ceccb",
        "orderTotalPrice": "50"
      }
    ]
  }
  ```

##### 2.9.管理员取消订单

- 请求路径：/order/orderAdminCancel

- 请求方法：get

- 请求参数：
  
  | 参数名     | 数据类型   | 说明   |
  | ------- | ------ | ---- |
  | orderid | string | 订单编号 |

- 响应数据：
  
  ```
  请求成功：
   {
      "result": {
          "code": 200,
          "msg": "订单取消成功"
      }
  }
  请求失败：
   {
      "result": {
          "code": -1,
          "msg": "订单取消错误"
      }
  }
  ```

##### 2.10.管理员完成订单

- 请求路径：/order/orderAdminOver

- 请求方法：get

- 请求参数：
  
  | 参数名     | 数据类型   | 说明   |
  | ------- | ------ | ---- |
  | orderid | string | 订单编号 |

- 响应数据：

```
请求成功：
 {
    "result": {
        "code": 200,
        "msg": "订单完成"
    }
}
请求失败：
 {
    "result": {
        "code": -1,
        "msg": "订单完成错误"
    }
}
```

##### 2.11.根据日期查询就餐人数和营业额

- 请求路径：/admin/search

- 请求方法：get

- 请求参数：
  
  | 参数名  | 数据类型   | 说明  |
  | ---- | ------ | --- |
  | date | string | 日期  |

- 响应数据：

```
{
    "customer_num": 1,
    "turnover": 50
}
```
