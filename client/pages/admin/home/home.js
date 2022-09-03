// client/pages/admin/home/home.js
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var app = getApp();

Page({
  data: {
    tabs: ["订单管理", "菜品管理", "查询管理"], // 导航栏
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,
    orderlist: [], // 卡片一订单
    datalist: [],  // 卡片二菜单
    date: '',      // 当前日期
    customer_num: 0, // 就餐人数
    turnover: 0.0,   // 营业额
    serveraddr: ''
  },

  // 生命周期函数--监听页面加载
  onLoad: function () {
    var that = this;
    
    // 拿到当前的日期
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    var Y =date.getFullYear(); //获取年份
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1); //获取月份
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    that.setData({
        date: Y + "-" + M + "-" + D
    })
    // 根据当天日期查询就餐人数和营业额
    wx.request({
        url: app.globalData.serveraddr + '/admin/search',
        data: {
          date: this.data.date,
        },
        success: res => {
          if (res) {
            this.setData({
              customer_num: res.data.customer_num,
              turnover: res.data.turnover
            })
          }
        }
    })

    // 请求所有商品信息
    wx.request({
      url: app.globalData.serveraddr + '/admin/menu',
      data: {},
      success: res => {
        this.setData({
          datalist: res.data
        })
      }
    })
    this.setData({
      serveraddr: app.globalData.serveraddr
    });

    // 导航栏底部滑块位置
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });

    // 管理员获取订单信息
    wx.request({
      url: app.globalData.serveraddr + '/order/getOrdersAdmin',
      success: res => {
        this.setData({
          orderlist: res.data.cusOrderArr
        })
      }
    })
  },

  // 导航栏点击事件
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  // 跳转到添加商品页面
  open: function () {
    wx.navigateTo({
      url: '/pages/admin/addgoods/addgoods',
    })
  },

  // 根据日期获取就餐人数和营业额
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
    wx.request({
        url: app.globalData.serveraddr + '/admin/search',
        data: {
          date: this.data.date,
        },
        success: res => {
            if (res) {
              this.setData({
                customer_num: res.data.customer_num,
                turnover: res.data.turnover
              })
            }
        }
    })
  },

  // 修改商品参数
  altergoods: function (e) {
    var list = this.data.datalist;
    for (var i = 0; i < list.length; i++) {
      if (list[i].gt.GTID == e.currentTarget.dataset.gtid) {
        var glist = list[i].goodslist
        for (var j = 0; j < glist.length; j++) {
          if (glist[j].GID == e.currentTarget.dataset.gid) {
            wx.navigateTo({
              url: '/pages/admin/altergoods/altergoods?foodinfo=' + JSON.stringify(glist[j])
            })
          }
        }
      }
    }
  },
  
  // 删除商品
  deletegoods: function(e) {
    wx.request({
      url: app.globalData.serveraddr + '/admin/deletegoods',
      data: {
        gid:e.currentTarget.dataset.gid // 拿到商品的gid
      },
      success(res) {
        if (res.data.result.code == 200) {
          wx.redirectTo({
            url: '/pages/admin/home/home',
          })
        } else {
          wx.showToast({
            title: '下架失败',
            icon: 'success',
            duration: 3000
          });
        }
      }
    })
  },

  // 取消订单
  cancel: function (e) {
    wx.request({
      url: app.globalData.serveraddr + '/order/orderAdminCancel',
      data: {
        orderid: e.target.dataset.id,
      },
      success: res => {
        if (res.data.result.code == 200) {
          wx.showToast({
            title: '订单已取消',
            icon: 'success',
            duration: 2000
          })
          wx.request({
            url: app.globalData.serveraddr + '/order/getOrdersAdmin',
            success: res => {
              this.setData({
                orderlist: res.data.cusOrderArr
              })
            }
          })
        } else {
          wx.showToast({
            title: '订单取消错误',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  // 完成订单
  over: function (e) {
    wx.request({
      url: app.globalData.serveraddr + '/order/orderAdminOver',
      data: {
        orderid: e.target.dataset.id
      },
      success: res => {
        if (res.data.result.code == 200) {
          wx.showToast({
            title: '订单已完成',
            icon: 'success',
            duration: 2000
          })
          wx.request({
            url: app.globalData.serveraddr + '/order/getOrdersAdmin',
            success: res => {
              this.setData({
                orderlist: res.data.cusOrderArr
              })
            }
          })
        } else {
          wx.showToast({
            title: '订单完成错误',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  }
})