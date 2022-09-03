// pages/order/order.js
var app = getApp()
Page({

  data: {
    foodlist: [], // 未完成订单
    overlist: []  // 已完成的订单
  },

  // 生命周期函数--监听页面加载
  onLoad: function() {
    wx.request({
      url: app.globalData.serveraddr + '/order/getOrders',
      data: {
        cusid: app.globalData.cusid
      },
      success: res => {
        this.setData({
          overlist: res.data.overOrder.reverse() // 未完成订单
        })
        var foodlist = [];
        var orderlist = [];
        for (let i = 0; i < res.data.unfinishedOrders.length; i++) {
          var order = {
            orderid: '',
            orderPrice: 0,
            foods: []
          }
          order.orderid = res.data.unfinishedOrders [i].ORDERID
          order.orderPrice = res.data.unfinishedOrders [i].ORDERTOTALPRICE
          order.orderTime = res.data.unfinishedOrders [i].ORDERTIME
          order.orderNum = res.data.unfinishedOrders [i].ORDERNUM
          order.orderState = res.data.unfinishedOrders [i].ORDERSTATE
          order.orderSort = res.data.unfinishedOrders [i].orderSort
          for (let k = 0; k < res.data.unfinishedOrderDetails.length; k++) {
            for (let j = 0; j < res.data.unfinishedOrderDetails[k].length; j++) {
              if (order.orderid == res.data.unfinishedOrderDetails[k][j].ORDERID) {
                order.foods.push(res.data.unfinishedOrderDetails[k][j].GNAME + '*' + res.data.unfinishedOrderDetails[k][j].GCOUNT)
              }
            }
          }
          foodlist.push(order);
        }
        for (let i = 0; i < foodlist.length; i++) {
          if (foodlist[i].orderState == 1) {
            orderlist.push(foodlist[i]);
          }
        }
        this.setData({
          foodlist: orderlist.reverse()
        })
      }
    })
  }
})