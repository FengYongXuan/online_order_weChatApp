// client/pages/menu/menu.js
var app = getApp();
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var foodList = [];

Page({
  data: {
    tabs: [],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    foodNum: 0,
    sumprice: 0, // 订单总价
    mydata: [],
    myfoodList: [], // 选购的商品
    serveraddr: app.globalData.serveraddr
  },
  onLoad: function() {
    var that = this;
    // 请求所有商品信息
    wx.request({
      url: app.globalData.serveraddr + '/menu',
      success: res => {
        var gtList = []
        // 取数据
        for (var i = 0; i < res.data.gtlist.length; i++) {
          gtList.push(res.data.gtlist[i].gt);  // 商品种类列表
        }
        this.setData({
          tabs: gtList,
          mydata: res.data.gtlist // 商品信息列表(包括种类)
        })
        // 计算导航栏底部滑块的偏移量
        wx.getSystemInfo({
          success: function (res) {
            that.setData({
              sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
              sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
            });
          }
        });

      }
    })
  },

  // 点击tab导航栏事件
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  // 跳转到我的订单页面
  listMyOrders: function() {
    wx.redirectTo({
      url: '/pages/order/order'
    })
  },

  // 购物车中商品的入
  add: function(e) {
    var list = this.data.mydata;
    for (var i = 0; i < list.length; i++) {
      if (list[i].gt.gtid == e.currentTarget.dataset.gtid) {
        var glist = list[i].goodslist; // 商品列表
        for (var j = 0; j < glist.length; j++) {
          if (glist[j].gid == e.currentTarget.dataset.gid) {
            glist[j].gcount += 1;
            var sumnum = this.data.foodNum + 1;
            var sum = this.data.sumprice + e.currentTarget.dataset.gprice;
            this.setData({
              mydata: list,
              foodNum: sumnum,
              sumprice: sum
            })
          }
        }
      }
    }
  },

  // 购物车中商品的出
  subtract: function(e) {
    var list = this.data.mydata;
    for (var i = 0; i < list.length; i++) {
      if (list[i].gt.gtid == e.currentTarget.dataset.gtid) {
        var glist = list[i].goodslist
        for (var j = 0; j < glist.length; j++) {
          if (glist[j].gid == e.currentTarget.dataset.gid) {
            if (glist[j].gcount > 0) {
              glist[j].gcount -= 1;
              var sumnum = this.data.foodNum - 1;
              var sum = this.data.sumprice - e.currentTarget.dataset.gprice;
              this.setData({
                mydata: list,
                foodNum: sumnum,
                sumprice: sum
              })
            }
          }
        }
      }
    }
  },

  // 触发支付事件
  pay: function() {
    // 统计放在购物车里的商品
    var foodlist = new Array();
    for (var i = 0; i < this.data.mydata.length; i++) {
      for (var j = 0; j < this.data.mydata[i].goodslist.length; j++) {
        if (this.data.mydata[i].goodslist[j].gcount > 0) {
          foodlist.push(this.data.mydata[i].goodslist[j])
        }
      }
    }
    this.setData({
      myfoodList: foodlist
    })
    // 跳转到用户菜单(用户订单)页面
    wx.navigateTo({
      url: '/pages/usermenu/usermenu?foodslist=' + JSON.stringify(this.data.myfoodList)
    })
  }
})